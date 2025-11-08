import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CreateDrawer from "../CommonUi/CreateDrawer";
import { Card, Segmented, Input, Button, Drawer } from "antd";
import UserPrivateComponent from "../PrivacyComponent/UserPrivateComponent";
import TableComponent from "../CommonUi/TableComponent";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  deleteDriver,
  loadAllDriver,
} from "../../redux/rtk/features/driver/driverSlice";
import AddDriver from "./addDriver";
import UpdateDriver from "./updateDriver";
import moment from "moment";
import { Tooltip } from "antd";

const GetAllDriver = () => {
  const dispatch = useDispatch();
  const { list, total, loading } = useSelector((state) => state.drivers);
  const [open, setOpen] = useState(false);
  const [driverId, setDriverId] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDrivers, setFilteredDrivers] = useState([]);

  useEffect(() => {
    dispatch(
      loadAllDriver({ status: true, page: 1, count: 1000, query: searchTerm })
    );
  }, [dispatch, searchTerm]);

  const onClose = () => {
    setOpen(false);
    setDriverId(null);
    setSelectedDriver(null);
  };

  const onDelete = async (id) => {
    const res = await dispatch(deleteDriver(id));
    if (res) {
      dispatch(loadAllDriver({ status: true, page: 1, count: 1000 }));
    }
  };
  useEffect(() => {
    if (list) {
      const seen = new Set();
      const filteredUniqueDrivers = list.filter((driver) => {
        const name = driver?.name?.toLowerCase();
        if (!name || seen.has(name)) return false;
        seen.add(name);
        return name.includes(searchTerm?.toLowerCase());
      });

      setFilteredDrivers(filteredUniqueDrivers);
    }
  }, [list, searchTerm]);

  const columns = useMemo(
    () => [
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
        title: "Driver Name",
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
        dataIndex: "driverAddr",
        key: "driverAddr",
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
        id: 6,
        title: "Driver licenseNo",
        dataIndex: "drvLicenseNo",
        key: "drvLicenseNo",
        render: (text) => (
          <Tooltip title={text}>
            <div className="truncate" style={{ maxWidth: 200 }}>
              {text}
            </div>
          </Tooltip>
        ),
      },
      {
        id: 7,
        title: "License Expiry Date",
        dataIndex: "drvLicenseExpDate",
        key: "drvLicenseExpDate",
        render: (date) => moment(date).format("ll"),
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
        title: "Driver Active",
        dataIndex: "driverActive",
        key: "driverActive",
        render: (status) => (status === "1" ? "Yes" : "No"),
      },
      {
        id: 15,
        title: "Referred By",
        dataIndex: "referredBy",
        key: "referredBy",
        render: (text) => (
          <Tooltip title={text}>
            <div className="truncate" style={{ maxWidth: 200 }}>
              {text}
            </div>
          </Tooltip>
        ),
      },
      {
        id: 16,
        title: "License Path",
        dataIndex: "licensePath",
        key: "licensePath",
        render: (text) => (
          <Tooltip title={text}>
            <div className="truncate" style={{ maxWidth: 200 }}>
              {text}
            </div>
          </Tooltip>
        ),
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
        title: "EmployeeNo",
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
            <UserPrivateComponent permission="update-driver">
              <Tooltip title="Edit">
                <EditOutlined
                  className="p-2 text-white bg-blue-500 rounded-md"
                  onClick={() => {
                    setSelectedDriver(restData);
                    setOpen(true);
                    setDriverId(id);
                  }}
                />
              </Tooltip>
            </UserPrivateComponent>
            <UserPrivateComponent permission={"delete-driver"}>
              <DeleteOutlined
                onClick={() => onDelete(id)}
                className="p-2 text-white bg-red-600 rounded-md"
              />
            </UserPrivateComponent>
          </div>
        ),
      },
    ],
    [onClose, onDelete]
  );

  return (
    <Card
      className="border-0 md:border md:p-6 bg-transparent md:bg-[#fafafa]"
      bodyStyle={{ padding: 0 }}
    >
      <div className="items-center justify-between pb-3 lg:flex">
        <h1 className="text-lg font-bold">Driver List</h1>
        <div className="flex items-center justify-between gap-0 md:gap-5 md:justify-start">
          <Input
            placeholder="Search Driver Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between gap-0 md:gap-5 md:justify-start">
          <CreateDrawer
            width={50}
            permission={"create-driver"}
            title={"Add driver"}
          >
            <AddDriver />
          </CreateDrawer>
        </div>
      </div>

      {selectedDriver && (
        <UpdateDriver
          width={50}
          data={selectedDriver}
          id={driverId}
          open={open}
          onClose={onClose}
        />
      )}
      <UserPrivateComponent permission={"readAll-driver"}>
        <TableComponent
          list={filteredDrivers}
          total={total}
          loading={loading}
          columns={columns}
          csvFileName="driver"
          paginatedThunk={loadAllDriver}
          scrollX={3000}
          query={searchTerm}
        />
      </UserPrivateComponent>
    </Card>
  );
};

export default GetAllDriver;
