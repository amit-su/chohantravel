import { Card, Select } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreateDrawer from "../CommonUi/CreateDrawer";
import TableComponent from "../CommonUi/TableComponent";
import UserPrivateComponent from "../PrivacyComponent/UserPrivateComponent";

import { DeleteOutlined } from "@ant-design/icons";

import {
  deleteSetup,
  loadAllSetup,
} from "../../redux/rtk/features/setup/setupSlice";
import AddSetup from "./addSetup";
import UpdateSetup from "./updateSetup";
import { FaFilterCircleXmark } from "react-icons/fa6";
const GetAllSetup = (props) => {
  const dispatch = useDispatch();
  const { list, total, loading } = useSelector((state) => state.setups);
  const [selectedParty, setSelectedParty] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");

  const handlePartyChange = (value) => {
    setSelectedParty(value);
  };
  const filteredList = list?.filter((item) => {
    const matchesParty = selectedParty
      ? item.partyName === selectedParty
      : true;
    const matchesSearch = searchKeyword
      ? Object.values(item).some((val) =>
          String(val).toLowerCase().includes(searchKeyword.toLowerCase())
        )
      : true;
    return matchesParty && matchesSearch;
  });

  const columns = [
    {
      id: 2,
      title: "Party Name",
      dataIndex: "partyName",
      key: "partyName",
    },
    {
      id: 3,
      title: "Site Name",
      dataIndex: "siteName",
      key: "siteName",
    },
    {
      id: 3,
      title: "Bus Name",
      dataIndex: "busName",
      key: "busName",
    },
    {
      id: 3,
      title: "Bus Number",
      dataIndex: "busNo",
      key: "busNo",
    },
    {
      id: 3,
      title: "Driver Name",
      dataIndex: "driverName",
      key: "driverName",
    },
    {
      id: 3,
      title: "Helper Name",
      dataIndex: "helperName",
      key: "helperName",
    },
    {
      id: 3,
      title: "Created on",
      dataIndex: "CreatedOn",
      key: "CreatedOn",
      render: (createdAt) => moment(createdAt).format("YYYY-MM-DD"),
    },
    {
      id: 3,
      title: "Duty Type",
      dataIndex: "duty_type",
      key: "duty_type",
    },
    {
      title: "Site Closed",
      dataIndex: "SiteClosed",
      key: "siteClosed",
      render: (siteClosed) => (siteClosed == "1" ? "Yes" : "No"),
    },
    {
      id: 3,
      title: "Action",
      dataIndex: "",
      key: "action",
      render: ({ key, ...restData }) => (
        <div className="flex items-center gap-2">
          <UserPrivateComponent permission="update-setup">
            <CreateDrawer
              update={1}
              permission={"update-setup"}
              title={"Edit setup"}
              minimalEdit
            >
              <UpdateSetup data={restData} id={key} />
            </CreateDrawer>
          </UserPrivateComponent>
          <UserPrivateComponent permission={"delete-setup"}>
            <DeleteOutlined
              onClick={() => onDelete(key)}
              className="p-2 text-white bg-red-600 rounded-md"
            />
          </UserPrivateComponent>
        </div>
      ),
    },
  ];
  useEffect(() => {
    dispatch(loadAllSetup({ page: 1, count: 1000, status: true }));
  }, [dispatch]);
  const onDelete = async (id) => {
    const res = await dispatch(deleteSetup(id));
    if (res) {
      dispatch(loadAllSetup({ status: true, page: 1, count: 1000 }));
    }
  };
  return (
    <Card
      className="border-0 md:border md:p-6 bg-transparent md:bg-[#fafafa]"
      bodyStyle={{ padding: 0 }}
    >
      <div className="items-center justify-between pb-3 md:flex">
        <h1 className="text-lg font-bold">Setup</h1>
        <div className="flex items-center justify-between gap-1 md:justify-start md:gap-3">
          <span>Filter By Party:</span>
          <Select
            placeholder="Filter By Party"
            style={{ width: 200 }}
            onChange={handlePartyChange}
            value={selectedParty}
            allowClear
          >
            {Array.from(new Set(list?.map((item) => item.partyName))).map(
              (partyName) => (
                <Select.Option key={partyName} value={partyName}>
                  {partyName}
                </Select.Option>
              )
            )}
          </Select>
          <input
            type="text"
            placeholder="Search by any field..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-64 px-3 py-1 border border-gray-300 rounded"
          />
          <CreateDrawer
            permission={"create-setup"}
            title={"Add Setup"}
            width={35}
          >
            <AddSetup />
          </CreateDrawer>
        </div>
      </div>
      <UserPrivateComponent permission={"readAll-setup"}>
        <TableComponent
          columns={columns}
          csvFileName={"Setup"}
          paginatedThunk={loadAllSetup}
          list={filteredList}
          total={total}
          loading={loading}
        />
      </UserPrivateComponent>
    </Card>
  );
};

export default GetAllSetup;
