import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CreateDrawer from "../CommonUi/CreateDrawer";

import { Card, Input, Select, Tooltip } from "antd";
import UserPrivateComponent from "../PrivacyComponent/UserPrivateComponent";
import TableComponent from "../CommonUi/TableComponent";
import { DeleteOutlined } from "@ant-design/icons";
import {
  deleteVendor,
  loadVendorPaginated,
} from "../../redux/rtk/features/vendor/vendorSlice";
import { loadAllCompany } from "../../redux/rtk/features/company/comapnySlice";
import AddVendor from "./AddVendor";
import UpdateVendor from "./UpdateVendor";

const GetAllVendor = () => {
  const dispatch = useDispatch();
  const { list: vendorList, total, loading } = useSelector((state) => state.vendors);
  const { list: companyList } = useSelector((state) => state.companies);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(0);
  const [filteredList, setFilteredList] = useState([]);

  const onDelete = async (id) => {
    const res = await dispatch(deleteVendor(id));
    if (res) {
      dispatch(loadVendorPaginated({ status: true, page: 1, count: 1000, companyID: selectedCompany }));
    }
  };

  const columns = [
    {
      id: 1,
      title: "Company Name",
      dataIndex: "CompanyName",
      key: "CompanyName",
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
      title: "Vendor Name",
      dataIndex: "vendorName",
      key: "vendorName",
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
      dataIndex: "vendAddr",
      key: "vendAddr",
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
      dataIndex: "pinCode",
      key: "pinCode",
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
      title: "Email Id",
      dataIndex: "email",
      key: "email",
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
      title: "GST NO",
      dataIndex: "gstNo",
      key: "gstNo",
      render: (text) => (
        <Tooltip title={text}>
          <div className="truncate" style={{ maxWidth: 200 }}>
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      id: 8,
      title: "PAN NO",
      dataIndex: "panNo",
      key: "panNo",
      render: (text) => (
        <Tooltip title={text}>
          <div className="truncate" style={{ maxWidth: 200 }}>
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      id: 8,
      title: "Referred BY ",
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
      id: 8,
      title: "Vendor Active",
      dataIndex: "vendorActive",
      key: "vendorActive",
      render: (vendorActive) => (String(vendorActive) === "1" ? "Yes" : "No"),
    },
    {
      id: 11,
      title: "Vendor Type",
      dataIndex: "vendorType",
      key: "vendorType",
    },
    {
      id: 3,
      title: "Action",
      dataIndex: "",
      key: "action",
      fixed: "right",
      render: ({ id, ...restData }) => (
        <div className="flex items-center gap-2">
          <UserPrivateComponent permission="update-vendor">
            <CreateDrawer
              update={1}
              permission={"update-vendor"}
              title={"Edit Vendor Details"}
              minimalEdit
              width={60}
            >
              <UpdateVendor data={restData} id={id} />
            </CreateDrawer>
          </UserPrivateComponent>

          <UserPrivateComponent permission={"delete-vendor"}>
            <DeleteOutlined
              onClick={() => onDelete(id)}
              className="p-2 text-white bg-red-600 rounded-md"
            />
          </UserPrivateComponent>
        </div>
      ),
    },
  ];

  useEffect(() => {
    dispatch(loadAllCompany({ status: true, page: 1, count: 1000 }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      loadVendorPaginated({
        status: true,
        page: 1,
        count: 1000,
        companyID: selectedCompany,
        query: searchTerm,
      })
    );
  }, [dispatch, searchTerm, selectedCompany]);

  useEffect(() => {
    setFilteredList(
      vendorList?.filter((vendor) =>
        vendor?.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor?.mobileNo?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [vendorList, searchTerm]);

  return (
    <Card
      className="border-0 md:border md:p-6 bg-transparent md:bg-[#fafafa]"
      bodyStyle={{ padding: 0 }}
    >
      <div className="items-center justify-between pb-3 lg:flex">
        <h1 className="text-lg font-bold">Vendor List</h1>
        <div className="flex items-center justify-between gap-0 md:gap-5 md:justify-start">
          <Select
            allowClear
            className="w-full custom-select"
            placeholder="Select Company"
            onChange={(val) => setSelectedCompany(val)}
            showSearch
            optionFilterProp="children"
            size="middle"
          >
            {companyList?.map((company) => (
              <Select.Option key={company.Id} value={company.Id}>
                {company.Name}
              </Select.Option>
            ))}
          </Select>
          <Input
            placeholder="Search by Vendor Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 200, marginLeft: 10 }}
          />
          <CreateDrawer
            width={60}
            permission={"create-vendor"}
            title={"Create Vendor"}
          >
            <AddVendor />
          </CreateDrawer>
        </div>
      </div>
      <UserPrivateComponent permission={"readAll-vendor"}>
        <TableComponent
          list={filteredList}
          csvFileName={"Vendor"}
          total={total}
          loading={loading}
          columns={columns}
          paginatedThunk={loadVendorPaginated}
          scrollX={2000}
          query={searchTerm}
        />
      </UserPrivateComponent>
    </Card>
  );
};

export default GetAllVendor;

