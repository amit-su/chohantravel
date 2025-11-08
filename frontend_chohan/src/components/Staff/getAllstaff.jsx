import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreateDrawer from "../CommonUi/CreateDrawer";
import { Card, Input } from "antd";
import UserPrivateComponent from "../PrivacyComponent/UserPrivateComponent";
import TableComponent from "../CommonUi/TableComponent";
import { DeleteOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";

import moment from "moment";
import {
  deleteHelper,
  loadAllHelper,
} from "../../redux/rtk/features/helper/helperSlice";
import {
  deleteStaff,
  loadAllStaff,
} from "../../redux/rtk/features/staff/staffslice";
import AddStaff from "./addstaff";
import UpdateStaff from "./updatestaff";

const GetAllStaff = () => {
  const dispatch = useDispatch();
  const { list, total, loading } = useSelector((state) => state.staff);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredHelpers, setFilteredHelpers] = useState([]);
  console.log(list, "767");

  useEffect(() => {
    dispatch(
      loadAllStaff({ status: true, page: 1, count: 1000, query: searchTerm })
    );
  }, [dispatch, searchTerm]);

  useEffect(() => {
    if (list) {
      setFilteredHelpers(
        list?.filter((helper) =>
          helper.name?.toLowerCase().includes(searchTerm?.toLowerCase() || "")
        )
      );
    }
  }, [list, searchTerm]);

  const onDelete = async (id) => {
    const res = await dispatch(deleteStaff(id));
    if (res) {
      dispatch(loadAllStaff({ status: true, page: 1, count: 1000 }));
    }
  };
  const handleCheckboxChange = (event, record) => {
    console.log(event.target.checked, "for record:", record);
  };

  const columns = [
    {
      id: 1,
      title: "Company Name",
      dataIndex: "companyName",
      key: "companyName",
      render: (text) => (
        <Tooltip title={text}>
          <div className="truncate" style={{ maxWidth: 200 }}>
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      id: 1,
      title: "Staff Name",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <Tooltip title={text}>
          <div className="truncate" style={{ maxWidth: 200 }}>
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      id: 2,
      title: "Address",
      dataIndex: "staffAddr",
      key: "staffAddr",
      render: (text) => (
        <Tooltip title={text}>
          <div className="truncate" style={{ maxWidth: 200 }}>
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      id: 3,
      title: "City",
      dataIndex: "cityName",
      key: "cityName",
      render: (text) => (
        <Tooltip title={text}>
          <div className="truncate" style={{ maxWidth: 200 }}>
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      id: 4,
      title: "Pin Code",
      dataIndex: "pincode",
      key: "pincode",
    },
    {
      id: 5,
      title: "Mobile NO",
      dataIndex: "mobileNo",
      key: "mobileNo",
    },
    {
      id: 6,
      title: "WhatsApp NO",
      dataIndex: "whatsAppNo",
      key: "whatsAppNo",
    },
    {
      id: 8,
      title: "Aadhar No",
      dataIndex: "aadharCardNo",
      key: "aadharCardNo",
      render: (text) => (
        <Tooltip title={text}>
          <div className="truncate" style={{ maxWidth: 200 }}>
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      id: 9,
      title: "Bank Name",
      dataIndex: "bankName",
      key: "bankName",
      render: (text) => (
        <Tooltip title={text}>
          <div className="truncate" style={{ maxWidth: 200 }}>
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      id: 10,
      title: "Bank Branch",
      dataIndex: "bankBranch",
      key: "bankBranch",
      render: (text) => (
        <Tooltip title={text}>
          <div className="truncate" style={{ maxWidth: 200 }}>
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      id: 11,
      title: "Bank Acc no",
      dataIndex: "bankAcNo",
      key: "bankAcNo",
      render: (text) => (
        <Tooltip title={text}>
          <div className="truncate" style={{ maxWidth: 200 }}>
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      id: 12,
      title: "Bank Acc Type",
      dataIndex: "bankAcType",
      key: "bankAcType",
      render: (text) => (
        <Tooltip title={text}>
          <div className="truncate" style={{ maxWidth: 200 }}>
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      id: 13,
      title: "Bank IFSC",
      dataIndex: "bankIFSC",
      key: "bankIFSC",
      render: (text) => (
        <Tooltip title={text}>
          <div className="truncate" style={{ maxWidth: 200 }}>
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      id: 14,
      title: "staff Active",
      dataIndex: "driverActive",
      key: "driverActive",
      render: (status) => (status === "1" ? "Yes" : "No"),
    },
    {
      id: 15,
      title: "Referred By",
      dataIndex: "referredBy",
      key: "referredBy",
    },
    {
      id: 17,
      title: "Aadhar Path",
      dataIndex: "adharPath",
      key: "adharPath",
    },
    {
      id: 18,
      title: "PF No",
      dataIndex: "pfNo",
      key: "pfNo",
    },
    {
      id: 19,
      title: "ESI No",
      dataIndex: "esiNo",
      key: "esiNo",
    },
    {
      id: 19,
      title: "Employee No",
      dataIndex: "EmployeeNo",
      key: "EmployeeNo",
    },
    {
      id: 20,
      title: "Date of join",
      dataIndex: "Dateofjoin",
      key: "Dateofjoin",
      render: (date) => moment(date).format("ll"),
    },

    {
      id: 3,
      title: "Action",
      dataIndex: "",
      key: "action",
      fixed: "right",
      render: ({ id, ...restData }) => (
        <div className="flex items-center gap-2">
          <UserPrivateComponent permission="update-helper">
            <CreateDrawer
              update={1}
              permission={"update-helper"}
              title={"Edit Staff details "}
              minimalEdit
              width={50}
            >
              <UpdateStaff data={restData} id={id} />
            </CreateDrawer>
          </UserPrivateComponent>
          <UserPrivateComponent permission={"delete-helper"}>
            <DeleteOutlined
              onClick={() => onDelete(id)}
              className="p-2 text-white bg-red-600 rounded-md"
            />
          </UserPrivateComponent>
        </div>
      ),
    },
  ];

  return (
    <Card
      className="border-0 md:border md:p-6 bg-transparent md:bg-[#fafafa]"
      bodyStyle={{ padding: 0 }}
    >
      <div className="items-center justify-between pb-3 lg:flex">
        <h1 className="text-lg font-bold">Staff List</h1>
        <div className="flex items-center justify-between gap-0 md:gap-5 md:justify-start">
          <Input
            placeholder="Search  Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between gap-0 md:gap-5 md:justify-start">
          <CreateDrawer
            width={50}
            permission={"create-helper"}
            title={"Add Staff"}
          >
            <AddStaff />
          </CreateDrawer>
        </div>
      </div>

      <UserPrivateComponent permission={"readAll-helper"}>
        <TableComponent
          list={filteredHelpers}
          total={total}
          loading={loading}
          columns={columns}
          csvFileName="helper"
          paginatedThunk={loadAllStaff}
          scrollX={3000}
        />
      </UserPrivateComponent>
    </Card>
  );
};

export default GetAllStaff;
