import { Link } from "react-router-dom";

import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Card, Table, Form, Select } from "antd";
import moment from "moment";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import TableComponent from "../CommonUi/TableComponent";
import UserPrivateComponent from "../PrivacyComponent/UserPrivateComponent";
import SimpleButton from "../Buttons/SimpleButton";
import axios from "axios";
import { Segmented, Input, Button, Modal } from "antd";
import {
  deletebookingEntry,
  loadAllBookingEntry,
} from "../../redux/rtk/features/bookingEntry/bookingsEntrySlice";
let slartysetdeil = [];
import { deleteSalarySetup } from "../../redux/rtk/features/Salarysetupslice/salarysetslice";

const Salarysetuptable = () => {
  //API CALL//
  const [list2, setList] = useState([]);
  const [data, setList1] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading2, setLoading2] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmpType, setSelectedEmpType] = useState("HELPER");
  const apiUrl = import.meta.env.VITE_APP_API;

  useEffect(() => {
    // Call the function
    fetchData();
  }, [apiUrl, selectedEmpType]);
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/salarysetup/${selectedEmpType}`
      );
      if (selectedEmpType === "HELPER") {
        setHelperData(response.data.data);
        console.log(response.data.data, "data");
        setList(response.data.data);
        setList1(response.data.data);
      } else if (selectedEmpType === "DRIVER") {
        setDriverData(response.data.data);
        setList1(response.data.data);
        setList(response.data.data);
      } else if (selectedEmpType === "STAFF") {
        setDriverData(response.data.data);
        setList1(response.data.data);
        setList(response.data.data);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading2(false);
    }
  };
  console.log("hfg", data);
  const [helperData, setHelperData] = useState([]);
  const [driverData, setDriverData] = useState([]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (data) {
        setList(
          data?.filter((driver) =>
            driver.Name.toLowerCase().includes(searchTerm?.toLowerCase())
          )
        );
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [data, searchTerm]);
  //END//
  let newtype = "";
  const handleSelectChange = useCallback((value) => {
    newtype = value;
    console.log(value, "878");

    setSelectedEmpType(value);
    // useEffect(() => {
    //   dispatch(loadsalarysetupPaginated(selectedEmpType));
    // }, [dispatch, selectedEmpType]);
  }, []);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const handleExpand = (expanded, record) => {
    console.log("record", record);
    if (expanded) {
      setExpandedRowKeys([record.BookingNo]);
    } else {
      setExpandedRowKeys([]);
    }
  };

  const onDelete = async (booking) => {
    Modal.confirm({
      title: "Are you sure you want to delete this ?",

      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      async onOk() {
        const res = await dispatch(deleteSalarySetup(booking));
        if (res.payload.data.status == 1) {
          fetchData();
        }
      },
    });
  };

  const dispatch = useDispatch();
  const columns = [
    // {
    //   id: 9,
    //   title: "Details",
    //   dataIndex: "",
    //   width: 90,
    //   key: "expand",
    //   render: (record) => (
    //     <button onClick={() => handleRowExpand(record.ID)}>
    //       <MdExpandCircleDown fontSize={25} color="black" />
    //     </button>
    //   ),
    // },

    {
      id: 9,
      title: "Name",
      dataIndex: "Name",
      key: "Name",
      width: 120,
    },
    {
      id: 10,
      title: "Year",
      dataIndex: "Year",
      key: "Year",
      width: 120,
    },
    {
      id: 11,
      title: "Month",
      dataIndex: "Month",
      key: "Months",
      width: 120,
    },
    {
      id: 1,
      title: "Basic",
      dataIndex: "BASIC",
      key: "BASIC",
      width: 120,
    },
    {
      id: 6,
      title: " H.R.A. ",
      dataIndex: "HRA",
      key: "HRA",

      width: 120,
    },
    {
      id: 1,
      title: " T.A. ",
      dataIndex: "TA",
      key: "TA",
      width: 120,
    },
    {
      id: 5,
      title: "PF",
      dataIndex: "PF",
      key: "PF",
      width: 120,
    },
    {
      id: 4,
      title: "ESIC",
      dataIndex: "ESIC",
      key: "ESIC",
      width: 120,
    },

    {
      id: 7,
      title: "Medical Allowance",
      dataIndex: "MedicalAllowance",
      key: "MedicalAllowanc",
      width: 120,
    },
    {
      id: 2,
      title: "Washing Allowance",
      dataIndex: "WashingAllowance",
      key: "WashingAllowance",
      width: 120,
    },
    {
      id: 8,
      title: "P Tax",
      dataIndex: "PTAX",
      key: "PTAX",
      width: 120,
    },

    //Update Supplier Name here

    {
      id: 3,
      title: "Action",
      dataIndex: "",
      key: "action",
      fixed: "right",
      render: ({ BookingNo, ...restData }) => (
        <div className="flex items-center gap-2">
          <UserPrivateComponent permission="update-advanceToStaffEntry">
            <Link to={`/admin/updatesalarysetup/${restData.id2}`}>
              <EditOutlined
                className="p-2 text-white bg-gray-600 rounded-md"
                style={{ fontSize: "15px", cursor: "pointer" }}
              />
            </Link>
          </UserPrivateComponent>
          <UserPrivateComponent permission={"delete-driver"}>
            <DeleteOutlined
              onClick={() => onDelete(restData.id2)}
              className="p-2 text-white bg-red-600 rounded-md"
            />
          </UserPrivateComponent>
        </div>
      ),
    },
  ];
  useEffect(() => {
    dispatch(loadAllBookingEntry({ status: true, page: 1, count: 1000 }));
  }, [dispatch]);

  return (
    <>
      <div className="mt-2 card card-custom">
        <div className="flex items-center ">
          <Form.Item
            style={{ marginBottom: "10px", width: "80%" }}
            label="Driver / Helper / Staff"
            name="driverHelper"
            rules={[{ required: true, message: "Driver / Helper / Staff" }]}
          >
            <Select
              onChange={handleSelectChange}
              placeholder="Select Driver/Helper"
              defaultValue={"HELPER"}
            >
              <Select.Option value={"DRIVER"}>Driver</Select.Option>
              <Select.Option value={"HELPER"}>Helper</Select.Option>
              <Select.Option value={"STAFF"}>Staff</Select.Option>
            </Select>
          </Form.Item>
        </div>
        <div className="card-body">
          <Card
            className="border-0 md:border md:p-6 bg-transparent md:bg-[#fafafa]"
            bodyStyle={{ padding: 0 }}
          >
            <div className="items-center justify-between pb-3 md:flex">
              <h1 className="text-lg font-bold">Salary & OT Setup</h1>
              <div className="flex items-center justify-between gap-0 md:gap-5 md:justify-start">
                <Input
                  placeholder="Search Driver Name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between gap-1 md:justify-start md:gap-3">
                <div className="flex xxs:w-1/2 md:w-full xxs:flex-col md:flex-row xxs:gap-1 md:gap-5">
                  <UserPrivateComponent
                    permission={"create-advanceToStaffEntry"}
                  >
                    <Link to={`/admin/salarysetup`}>
                      <SimpleButton title={"Add Entry"} />
                    </Link>
                  </UserPrivateComponent>
                </div>
              </div>
            </div>
            <UserPrivateComponent permission={"readAll-advanceToStaffEntry"}>
              <Table
                dataSource={list2}
                columns={columns}
                loading={loading2}
                pagination={false}
                scroll={{ x: 1500 }}
                expandedRowKeys={expandedRowKeys}
                onExpand={handleExpand}
                rowKey="BookingNo"
                // expandable={{
                //   expandedRowRender: (record) => (
                //     <div className="expanded-content">
                //       <DetailBookingEntry bookingNo={record?.BookingNo} />
                //     </div>
                //   ),
                //   rowExpandable: (record) => !!record?.BookingNo,
                // }}
              />
            </UserPrivateComponent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Salarysetuptable;
