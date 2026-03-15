import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CreateDrawer from "../CommonUi/CreateDrawer";

import { Card, Input, Select, Tooltip, Dropdown, Menu, Button, Drawer } from "antd";
import UserPrivateComponent from "../PrivacyComponent/UserPrivateComponent";
import TableComponent from "../CommonUi/TableComponent";
import { DeleteOutlined, MoreOutlined, EditOutlined } from "@ant-design/icons";
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
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const handleEdit = (record) => {
    setEditingRecord(record);
    setIsEditDrawerOpen(true);
  };

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
      width: 80,
      render: (record) => {
        const items = [
          {
            key: "edit",
            label: (
              <UserPrivateComponent permission="update-vendor">
                <div
                  onClick={() => handleEdit(record)}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <EditOutlined />
                  <span>Edit Vendor</span>
                </div>
              </UserPrivateComponent>
            ),
          },
          {
            type: 'divider',
          },
          {
            key: "delete",
            label: (
              <UserPrivateComponent permission={"delete-vendor"}>
                <div
                  onClick={() => onDelete(record.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <DeleteOutlined />
                  <span>Delete Vendor</span>
                </div>
              </UserPrivateComponent>
            ),
            danger: true,
          },
        ];

        return (
          <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
            <Button
              type="text"
              icon={<MoreOutlined style={{ fontSize: '20px' }} />}
              className="flex items-center justify-center hover:bg-gray-100 rounded-full w-10 h-10"
            />
          </Dropdown>
        );
      },
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
      <Drawer
        title="Edit Vendor Details"
        width={window.innerWidth <= 768 ? "100%" : "60%"}
        onClose={() => setIsEditDrawerOpen(false)}
        open={isEditDrawerOpen}
        destroyOnClose={true}
      >
        <div className="px-5 pt-5">
          <UpdateVendor
            data={editingRecord}
            id={editingRecord?.id}
            drawerClose={() => setIsEditDrawerOpen(false)}
          />
        </div>
      </Drawer>
    </Card>
  );
};

export default GetAllVendor;

