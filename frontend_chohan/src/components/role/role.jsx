import { Card } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { loadRolePaginated } from "../../redux/rtk/features/hr/role/roleSlice";
import ViewBtn from "../Buttons/ViewBtn";
import StatusSelection from "../CommonUi/StatusSelection";
import CreateDrawer from "../CommonUi/CreateDrawer";
import TableComponent from "../CommonUi/TableComponent";
import UserPrivateComponent from "../PrivacyComponent/UserPrivateComponent";
import AddRole from "./AddRole";

const RoleList = (props) => {
  const dispatch = useDispatch();
  const isLogged = Boolean(localStorage.getItem("isLogged"));

  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      id: 1,
      title: "Sl No",
      key: "slno",
      render: (text, record, index) => index + 1,
    },
    {
      id: 2,
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      id: 3,
      title: "Created at",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => moment(createdAt).format("YYYY-MM-DD"),
    },
    {
      id: 4,
      title: "Action",
      dataIndex: "id",
      key: "action",
      render: (id) => <ViewBtn path={`/admin/role/permit/${id}/`} />,
    },
  ];

  // ✅ Move fetchData outside of useEffect
  const fetchData = async () => {
    setLoading(true);
    const result = await dispatch(
      loadRolePaginated({ status: true, page: 1, count: 1000 })
    );
    setList(result.payload.data || []);
    setTotal(result.payload.total || 0);
    setLoading(false);
  };

  // Call fetchData on component mount
  useEffect(() => {
    fetchData();
  }, [dispatch]);

  if (!isLogged) {
    return <Navigate to={"/admin/auth/login"} replace={true} />;
  }

  return (
    <Card
      className="border-0 md:border md:p-6 bg-transparent md:bg-[#fafafa]"
      bodyStyle={{ padding: 0 }}
    >
      <div className="items-center justify-between pb-3 md:flex">
        <h1 className="text-lg font-bold">Role</h1>
        <div className="flex items-center justify-between gap-3 md:justify-start">
          <StatusSelection paginatedThunk={loadRolePaginated} />
          <CreateDrawer
            permission={"create-role"}
            title={"Create Role"}
            width={35}
          >
            <AddRole fetchData={fetchData} />
          </CreateDrawer>
        </div>
      </div>

      <UserPrivateComponent permission={"readAll-role"}>
        <TableComponent
          columns={columns}
          list={list}
          total={total}
          paginatedThunk={loadRolePaginated}
          loading={loading}
          csvFileName={"Role"}
        />
      </UserPrivateComponent>
    </Card>
  );
};

export default RoleList;
