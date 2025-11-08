import { Link } from "react-router-dom";
import { Card, Input, Modal } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreateDrawer from "../CommonUi/CreateDrawer";
import TableComponent from "../CommonUi/TableComponent";
import UserPrivateComponent from "../PrivacyComponent/UserPrivateComponent";
import { DeleteOutlined } from "@ant-design/icons";
import { deleteBus, loadAllBus } from "../../redux/rtk/features/bus/busSlice";
import AddBus from "./addBus";
import UpdateBus from "./updateBus";
import { Tooltip } from "antd";

const GetAllBus = (props) => {
  const dispatch = useDispatch();
  const { list, total, loading } = useSelector((state) => state.buses);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredList, setFilteredList] = useState([]);

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
      title: "Bus Name",
      dataIndex: "busName",
      key: "busName",
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
      title: "Bus Owner",
      dataIndex: "BusOwner",
      key: "BusOwner",
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
      title: "Bus Number",
      dataIndex: "busNo",
      key: "busNo",
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
      title: "Bus Description",
      dataIndex: "busType",
      key: "busType",
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
      title: "Bus Category",
      dataIndex: "busCategory",
      key: "busCategory",
      render: (text) => (
        <Tooltip title={text}>
          <div className="truncate" style={{ maxWidth: 200 }}>
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      id: 5,
      title: "Sitting Capacity",
      dataIndex: "sittingCapacity",
      key: "sittingCapacity",
      render: (text) => (
        <Tooltip title={text}>
          <div className="truncate" style={{ maxWidth: 200 }}>
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      id: 6,
      title: "Driver Name",
      dataIndex: "driverName",
      key: "driverName",
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
      title: "Helper Name",
      dataIndex: "helperName",
      key: "helperName",
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
      title: "Make",
      dataIndex: "make",
      key: "make",
    },
    {
      id: 9,
      title: "Model",
      dataIndex: "model",
      key: "model",
    },
    {
      id: 10,
      title: "Engine No",
      dataIndex: "engineNo",
      key: "engineNo",
    },
    {
      id: 11,
      title: "Chasis No",
      dataIndex: "chasisNo",
      key: "chasisNo",
    },
    {
      id: 12,
      title: "Branch Name",
      dataIndex: "branchName",
      key: "branchName",
    },
    {
      id: 13,
      title: "Action",
      dataIndex: "",
      fixed: "right",
      key: "action",
      render: ({ id, ...restData }) => (
        <div className="flex items-center gap-2">
          <UserPrivateComponent permission="update-bus">
            <CreateDrawer
              update={1}
              permission={"update-bus"}
              title={"Edit Bus Details"}
              minimalEdit
              width={45}
            >
              <UpdateBus data={restData} id={id} />
            </CreateDrawer>
          </UserPrivateComponent>
          <UserPrivateComponent permission={"delete-bus"}>
            <DeleteOutlined
              onClick={() => showDeleteConfirm(id)}
              className="p-2 text-white bg-red-600 rounded-md"
            />
          </UserPrivateComponent>
        </div>
      ),
    },
  ];

  useEffect(() => {
    dispatch(loadAllBus({ page: 1, count: 1000, status: true }));
  }, [dispatch]);

  useEffect(() => {
    setFilteredList(
      list?.filter((bus) =>
        bus?.busNo.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [list, searchTerm]);

  const onDelete = async (id) => {
    const res = await dispatch(deleteBus(id));
    if (res) {
      dispatch(loadAllBus({ status: true, page: 1, count: 1000 }));
    }
  };

  const showDeleteConfirm = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this ?",

      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        onDelete(id);
      },
    });
  };

  return (
    <Card
      className="border-0 md:border md:p-6 bg-transparent md:bg-[#fafafa]"
      bodyStyle={{ padding: 0 }}
    >
      <div className="items-center justify-between pb-3 md:flex">
        <h1 className="text-lg font-bold">Bus</h1>
        <div className="flex items-center justify-between gap-1 md:justify-start md:gap-3">
          <Input
            placeholder="Search by Bus Number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 200, marginLeft: 10 }}
          />
          <CreateDrawer permission={"create-bus"} title={"Add Bus"} width={45}>
            <AddBus />
          </CreateDrawer>
        </div>
      </div>
      <UserPrivateComponent permission={"readAll-bus"}>
        <TableComponent
          columns={columns}
          csvFileName={"bus"}
          paginatedThunk={loadAllBus}
          list={filteredList}
          total={0}
          loading={loading}
          scrollX={2000}
        />
      </UserPrivateComponent>
    </Card>
  );
};

export default GetAllBus;
