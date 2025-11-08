import React, { useState, useEffect } from "react";
import { Card, Form } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import SimpleButton from "../Buttons/SimpleButton";
import axios from "axios";
import CreateDrawer from "../CommonUi/CreateDrawer";
// import UpdateAdvanceToStaffEntryDrawer from "./updateAdvanceToStaffEntryDrawer";
import { Button, Select } from "antd";
import { loadAllBus } from "../../redux/rtk/features/bus/busSlice";

import TableComponent from "../CommonUi/TableComponent";
import UserPrivateComponent from "../PrivacyComponent/UserPrivateComponent";
import { loadAdvanceToStaffEntryPaginated } from "../../redux/rtk/features/advanceToStaffEntry/advanceToStaffEntrySlice";
let bid = 0;
const Partsmaster = (props) => {
  const dispatch = useDispatch();
  const [form1] = Form.useForm();

  const { list: busList } = useSelector((state) => state.buses);
  useEffect(() => {
    dispatch(loadAllBus({ page: 1, count: 10000, status: true }));

    console.log("useEffect");
  }, [dispatch]);
  const [bus, selectbus] = useState();

  const handleBusSelect = (busId) => {
    // Find the selected bus object from busList

    const selectedBus = busList?.find((bus) => bus.id === busId);
    bid = busId;
    selectbus(busId);
    console.log(bid, "5656545");

    // Set default ""values"" for driver and helper based on the selected bus
    // setInitValues({
    //   allotedDriver: parseInt(selectedBus?.driverID),
    //   allotedHelper: parseInt(selectedBus?.helperID),
    // });
    // form.setFieldsValue(initValues);
  };
  //API CALL//
  const [list2, setList] = useState([]);

  const [loading2, setLoading2] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_APP_API;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/busparts`);
        setList(response.data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading2(false);
      }
    };

    // Call the function
    fetchData();
  }, [bid, setLoading2, selectbus]);
  //END//
  console.log(list2, "787878");

  //Total amount calculation//
  //   const totalAdvanceAmount = data.reduce((total, item) => {
  //     if (item.transactions && item.transactions.length > 0) {
  //       return total + item.transactions.reduce((sum, transaction) => {
  //         const advanceAmount = parseFloat(transaction.advanceAmount);
  //         return sum + (isNaN(advanceAmount) ? 0 : advanceAmount);
  //       }, 0);
  //     }
  //     return total;
  //   }, 0);
  //End//
  const navigate = useNavigate();

  const handleNavigate = (AdvanceNo, restData) => {
    // console.log("AdvanceNo",restData)
    // navigate(`/admin/UpdateAdvanceToStaffEntryDrawer?AdvanceNo=${AdvanceNo}`);
  };

  let totamt = 0;

  const columns = [
    {
      id: 1,
      title: "Group Name",
      dataIndex: "GroupName",
      key: "GroupName",
      width: 90,
      // render: (text, record) => {
      //   const children = JSON.parse(record.Children);
      //   return (
      //     <span>
      //       {children?.length > 0 ? children[0].PartName : record.PartName}
      //     </span>
      //   );
      // }
    },
    {
      id: 2,
      title: "Part name",
      dataIndex: "PartName",
      key: "PartName",
      width: 80,
    },

    // {
    //   id: 5,
    //   title: "Action",
    //   dataIndex: "",
    //   key: "action",
    //   fixed: "right",
    //   width: 100,
    //   render: ({ AdvanceNo, ...restData }) => (
    //     <div >

    //     <Button onClick={() => handleNavigate(AdvanceNo,restData)}>Edit</Button>

    // </div>
    //   ),
    // },
  ];

  return (
    <div className="card card-custom mt-2">
      <div className="card-body">
        <Card
          className="border-0 md:border md:p-6 bg-transparent md:bg-[#fafafa]"
          bodyStyle={{ padding: 0 }}
        >
          <div className="md:flex items-center justify-between pb-3">
            <h1 className="text-lg font-bold">Parts Master</h1>
            {/* <div className="flex justify-between md:justify-start gap-1 md:gap-2 items-center">
            <Form.Item
          style={{ marginBottom: "10px",width:"300px" }}
          label="Bus No:"
          name="AllotedBusNo"
          rules={[
            {
              required: false,
              message: "Please fill input !",
            },
          ]}
        >
          <Select onChange={handleBusSelect} placeholder="Select bus type">
            {busList?.map((bus) => (
                <Select.Option key={bus.busName} value={bus.id}>
                  {bus.busNo}
                </Select.Option>
              ))}
          </Select>
        </Form.Item></div>
             */}

            <div className="flex justify-between md:justify-start gap-1 md:gap-3 items-center">
              <div className="xxs:w-1/2 md:w-full xxs:flex-col md:flex-row flex xxs:gap-1 md:gap-5 justify-center items-center">
                <UserPrivateComponent permission={"create-proformaInvoice"}>
                  <Link to={`/admin/partsentry/`}>
                    <SimpleButton title={"Add Parts"} />
                  </Link>
                </UserPrivateComponent>
              </div>
            </div>
          </div>

          <UserPrivateComponent permission={"readAll-bookingTransaction"}>
            <TableComponent
              list={list2}
              columns={columns}
              paginatedThunk={loadAdvanceToStaffEntryPaginated}
              csvFileName={"Booking List"}
            />
          </UserPrivateComponent>
        </Card>
      </div>
    </div>
  );
};

export default Partsmaster;
