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

import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import TableComponent from "../CommonUi/TableComponent";
import UserPrivateComponent from "../PrivacyComponent/UserPrivateComponent";
import { loadAdvanceToStaffEntryPaginated } from "../../redux/rtk/features/advanceToStaffEntry/advanceToStaffEntrySlice";
let bid = 0;
let busnumber = null;
const Selectbusrepair = (props) => {
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
    const busNo = selectedBus ? selectedBus.busNo : "";
    busnumber = busNo;

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
        const response = await axios.get(`${apiUrl}/busrepair/${bid}`);
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
  const onDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      const response = await axios.delete(`${apiUrl}/busrepair/${id}`);
      if (response.status == 200) {
        try {
          const response = await axios.get(`${apiUrl}/busrepair/${bid}`);
          setList(response.data.data);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading2(false);
        }
      }
    } else {
      console.log("Delete action canceled by user.");
    }
  };

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

  const handleNavigate = (id, restData) => {
    // console.log("AdvanceNo",restData)
    navigate(`/admin/repairEdit/${id}`);
  };

  let totamt = 0;

  const columns = [
    {
      id: 1,
      title: "Date",
      dataIndex: "RepDate",
      key: "RepDate",
      width: 90,
      render: (text) => {
        const formattedDate =
          text.substring(8, 10) +
          "/" +
          text.substring(5, 7) +
          "/" +
          text.substring(0, 4);
        return formattedDate.substring(0, 10);
      },
    },
    {
      id: 2,
      title: "Parts name",
      dataIndex: "partsname",
      key: "partsname",
      width: 80,
    },
    {
      id: 3,
      title: "Unit",
      dataIndex: "UnitName",
      key: "UnitName",
      width: 80,
    },
    {
      id: 4,
      title: "Qty",
      dataIndex: "Qty",
      key: "Qty",
      width: 80,
    },
    {
      id: 5,
      title: "Rate",
      dataIndex: "Rate",
      key: "Rate",
      width: 80,
    },
    {
      id: 6,
      title: "Amount",
      dataIndex: "Amt",
      key: "Amt",
      width: 80,
    },
    {
      id: 7,
      title: "Garge name",
      dataIndex: "GarageName",
      key: "GarageName",
      width: 80,
    },
    {
      id: 4,
      title: "Repair desc",
      dataIndex: "RepairDesc",
      key: "RepairDesc",
      width: 80,
    },
    {
      id: 5,
      title: "Action",
      dataIndex: "",
      key: "action",
      fixed: "right",
      width: 100,
      render: ({ id, ...restData }) => (
        <div>
          <div className="flex items-center gap-2">
            <Button onClick={() => handleNavigate(id, restData)}>Edit</Button>
            <UserPrivateComponent permission={"delete-proformaInvoice"}>
              <DeleteOutlined
                onClick={() => onDelete(id)}
                className="bg-red-600 p-2 text-white rounded-md"
              />
            </UserPrivateComponent>
            <div></div>
            <div></div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="card card-custom mt-2">
      <div className="card-body">
        <Card
          className="border-0 md:border md:p-6 bg-transparent md:bg-[#fafafa]"
          bodyStyle={{ padding: 0 }}
        >
          <div className="md:flex items-center justify-between pb-3">
            <h1 className="text-lg font-bold">Repair Entry</h1>
            <div className="flex justify-between md:justify-start gap-1 md:gap-2 items-center">
              <Form.Item
                style={{ marginBottom: "10px", width: "300px" }}
                label="Bus No:"
                name="AllotedBusNo"
                rules={[
                  {
                    required: false,
                    message: "Please fill input !",
                  },
                ]}
              >
                <Select
                  optionFilterProp="children" // Filters options based on the content of the children (party names)
                  showSearch
                  onChange={handleBusSelect}
                  placeholder="Select bus number"
                >
                  {busList?.map((bus) => (
                    <Select.Option key={bus.busName} value={bus.id}>
                      {bus.busNo}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div className="flex justify-between md:justify-start gap-1 md:gap-3 items-center">
              <div className="xxs:w-1/2 md:w-full xxs:flex-col md:flex-row flex xxs:gap-1 md:gap-5 justify-center items-center">
                <UserPrivateComponent permission={"create-proformaInvoice"}>
                  {bid !== 0 ? (
                    <Link to={`/admin/repairentry/${bid}`}>
                      <SimpleButton title={"Add Repair entry"} />
                    </Link>
                  ) : (
                    <div>
                      <SimpleButton title={"Add Repair entry"} disabled />
                      <p style={{ color: "red" }}>
                        You are not allowed to add a repair entry.
                      </p>
                    </div>
                  )}
                </UserPrivateComponent>
              </div>
            </div>
          </div>

          <UserPrivateComponent permission={"readAll-proformaInvoice"}>
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

export default Selectbusrepair;
