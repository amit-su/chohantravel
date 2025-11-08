import { Link } from "react-router-dom";

import { Card } from "antd";
import moment from "moment";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCity,
  loadAllCity,
} from "../../redux/rtk/features/city/citySlice";
import CreateDrawer from "../CommonUi/CreateDrawer";
import TableComponent from "../CommonUi/TableComponent";
import UserPrivateComponent from "../PrivacyComponent/UserPrivateComponent";
import AddCity from "./addCity";
import { DeleteOutlined } from "@ant-design/icons";
import UpdateCity from "./updateCity";

const GetAllCity = (props) => {
  const dispatch = useDispatch();
  const { list, total, loading } = useSelector((state) => state.city);

  const columns = [
    {
      id: 2,
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name, { id }) => <Link to={`/admin/city/${id}`}>{name}</Link>,
    },
    {
      id: 2,
      title: "state",
      dataIndex: "state",
      key: "state",
      render: (name, { id }) => <Link to={`/admin/city/${id}`}>{name}</Link>,
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
          <UserPrivateComponent permission="update-city">
            <CreateDrawer
              update={1}
              permission={"update-city"}
              title={"Edit City"}
              minimalEdit
            >
              <UpdateCity data={restData} id={id} />
            </CreateDrawer>
          </UserPrivateComponent>
          <UserPrivateComponent permission={"delete-city"}>
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
    dispatch(loadAllCity({ page: 1, count: 1000, status: true }));
  }, [dispatch]);
  const onDelete = async (id) => {
    const res = await dispatch(deleteCity(id));
    if (res) {
      dispatch(loadAllCity({ status: true, page: 1, count: 1000 }));
    }
  };
  return (
    <Card
      className="border-0 md:border md:p-6 bg-transparent md:bg-[#fafafa]"
      bodyStyle={{ padding: 0 }}
    >
      <div className="md:flex items-center justify-between pb-3">
        <h1 className="text-lg font-bold">City</h1>
        <div className="flex justify-between md:justify-start md:gap-3 gap-1 items-center">
          <CreateDrawer
            permission={"create-city"}
            title={"Add City"}
            width={35}
          >
            <AddCity />
          </CreateDrawer>
        </div>
      </div>
      <UserPrivateComponent permission={"readAll-city"}>
        <TableComponent
          columns={columns}
          csvFileName={"city"}
          paginatedThunk={loadAllCity}
          list={list}
          total={total}
          loading={loading}
        />
      </UserPrivateComponent>
    </Card>
  );
};

export default GetAllCity;
