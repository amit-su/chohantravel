import { Link } from "react-router-dom";
import { Card } from "antd";
import moment from "moment";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import CreateDrawer from "../CommonUi/CreateDrawer";
import TableComponent from "../CommonUi/TableComponent";
import UserPrivateComponent from "../PrivacyComponent/UserPrivateComponent";

import { DeleteOutlined } from "@ant-design/icons";
import {
  deleteState,
  loadAllState,
} from "../../redux/rtk/features/state/stateSlice";
import AddState from "./addState";
import UpdateState from "./updateState";

const GetAllState = (props) => {
  const dispatch = useDispatch();
  const { list, total, loading } = useSelector((state) => state.StateNames);

  const columns = [
    {
      id: 2,
      title: "Name",
      dataIndex: "state",
      key: "state",
      render: (name, { id }) => <Link to={`/admin/state/${id}`}>{name}</Link>,
    },
    {
      id: 3,
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => moment(createdAt).format("YYYY-MM-DD"),
    },
    {
      id: 3,
      title: "Action",
      dataIndex: "",
      key: "action",
      render: ({ id, ...restData }) => (
        <div className="flex items-center gap-2">
          <UserPrivateComponent permission="update-state">
            <CreateDrawer
              update={1}
              permission={"update-state"}
              title={"Edit State"}
              minimalEdit
            >
              <UpdateState data={restData} id={id} />
            </CreateDrawer>
          </UserPrivateComponent>
          <UserPrivateComponent permission={"delete-state"}>
            <DeleteOutlined
              onClick={() => onDelete(id)}
              className="bg-red-600 p-2 text-white rounded-md"
            />
          </UserPrivateComponent>
        </div>
      ),
    },
  ];
  useEffect(() => {
    dispatch(loadAllState({ page: 1, count: 1000, status: true }));
  }, [dispatch]);
  const onDelete = async (id) => {
    const res = await dispatch(deleteState(id));
    if (res) {
      dispatch(loadAllState({ status: true, page: 1, count: 1000 }));
    }
  };
  return (
    <Card
      className="border-0 md:border md:p-6 bg-transparent md:bg-[#fafafa]"
      bodyStyle={{ padding: 0 }}
    >
      <div className="md:flex items-center justify-between pb-3">
        <h1 className="text-lg font-bold">State</h1>
        <div className="flex justify-between md:justify-start md:gap-3 gap-1 items-center">
          <CreateDrawer
            permission={"create-state"}
            title={"Add state"}
            width={35}
          >
            <AddState />
          </CreateDrawer>
        </div>
      </div>
      <UserPrivateComponent permission={"readAll-state"}>
        <TableComponent
          columns={columns}
          csvFileName={"state"}
          paginatedThunk={loadAllState}
          list={list}
          total={total}
          loading={loading}
        />
      </UserPrivateComponent>
    </Card>
  );
};

export default GetAllState;
