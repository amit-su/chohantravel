import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CreateDrawer from "../CommonUi/CreateDrawer";

import { Card, Input } from "antd";
import UserPrivateComponent from "../PrivacyComponent/UserPrivateComponent";
import TableComponent from "../CommonUi/TableComponent";
import { DeleteOutlined } from "@ant-design/icons";
import {
  deleteParty,
  loadPartyPaginated,
} from "../../redux/rtk/features/party/partySlice";
import AddParty from "./addParty";
import UpdateParty from "./updateParty";
import { Tooltip } from "antd";

const GetAllParty = () => {
  const dispatch = useDispatch();
  const { list, total, loading } = useSelector((state) => state.party);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredList, setFilteredList] = useState([]);

  const onDelete = async (id) => {
    const res = await dispatch(deleteParty(id));
    if (res) {
      dispatch(loadPartyPaginated({ status: true, page: 1, count: 1000 }));
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
      title: "Party Name",
      dataIndex: "partyName",
      key: "partyName",
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
      dataIndex: "partyAddr",
      key: "partyAddr",
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
      title: "Party Active",
      dataIndex: "partyActive",
      key: "partyActive",
      render: (partyActive) => (partyActive === "1" ? "Yes" : "No"),
    },
    {
      id: 8,
      title: "cr Days",
      dataIndex: "crDays",
      key: "crDays",
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
      title: "cr Limit",
      dataIndex: "crLimit",
      key: "crLimit",
    },
    {
      id: 9,
      title: "Contact Person Name",
      dataIndex: "cpName",
      key: "cpName",
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
      title: "Contact Person Number",
      dataIndex: "cpNumber",
      key: "cpNumber",
    },
    {
      id: 11,
      title: "Party Type",
      dataIndex: "PartyType",
      key: "PartyType",
    },
    {
      id: 3,
      title: "Action",
      dataIndex: "",
      key: "action",
      fixed: "right",
      render: ({ id, ...restData }) => (
        <div className="flex items-center gap-2">
          <UserPrivateComponent permission="update-party">
            <CreateDrawer
              update={1}
              permission={"update-party"}
              title={"Edit Party Details"}
              minimalEdit
              width={60}
            >
              <UpdateParty data={restData} id={id} />
            </CreateDrawer>
          </UserPrivateComponent>

          <UserPrivateComponent permission={"delete-party"}>
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
    dispatch(
      loadPartyPaginated({
        status: true,
        page: 1,
        count: 1000,
        query: searchTerm,
      })
    );
  }, [dispatch, searchTerm]);

  useEffect(() => {
    setFilteredList(
      list?.filter((party) =>
        party?.partyName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [list, searchTerm]);

  return (
    <Card
      className="border-0 md:border md:p-6 bg-transparent md:bg-[#fafafa]"
      bodyStyle={{ padding: 0 }}
    >
      <div className="items-center justify-between pb-3 lg:flex">
        <h1 className="text-lg font-bold">Party List</h1>
        <div className="flex items-center justify-between gap-0 md:gap-5 md:justify-start">
          <Input
            placeholder="Search by Party Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 200, marginLeft: 10 }}
          />
          <CreateDrawer
            width={60}
            permission={"create-party"}
            title={"Create Party"}
          >
            <AddParty />
          </CreateDrawer>
        </div>
      </div>
      <UserPrivateComponent permission={"readAll-party"}>
        <TableComponent
          list={filteredList}
          csvFileName={"Party"}
          total={total}
          loading={loading}
          columns={columns}
          paginatedThunk={loadPartyPaginated}
          scrollX={2000}
          query={searchTerm}
        />
      </UserPrivateComponent>
    </Card>
  );
};

export default GetAllParty;
