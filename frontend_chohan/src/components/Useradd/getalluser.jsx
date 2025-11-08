import { Link } from "react-router-dom";
import { useState } from "react";

import { Card } from "antd";
import moment from "moment";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  deleteCity,
  loadAllCity,
} from "../../redux/rtk/features/city/citySlice";
import CreateDrawer from "../CommonUi/CreateDrawer";
import TableComponent from "../CommonUi/TableComponent";
import UserPrivateComponent from "../PrivacyComponent/UserPrivateComponent";
import { DeleteOutlined, ImportOutlined } from "@ant-design/icons";
import AddUser from "./addusers";
import UpdateUser from "./updateuser";
import axios from "axios";

const GetAllUser = (props) => {
  const dispatch = useDispatch();
  // const { list, total, loading } = useSelector((state) => state.city);
  const apiUrl = import.meta.env.VITE_APP_API;
  const [list2, setList] = useState([]);
  const [data, setList1] = useState([]);
  const [empID1, setempID] = useState(0);

  const [loading2, setLoading2] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/users`);
        setList(response.data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading2(false);
      }
    };

    fetchData();
  }, []);

  const columns = [
    {
      id: 2,
      title: "user Name",
      dataIndex: "username",
      key: "username",
    },
    {
      id: 2,
      title: "Password",
      dataIndex: "password",
      key: "password",
    },
    {
      id: 3,
      title: "Email",
      dataIndex: "email",
      key: "email",
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
              <UpdateUser data={restData} id={id} />
            </CreateDrawer>
          </UserPrivateComponent>
          <UserPrivateComponent permission={"delete-city"}>
            <DeleteOutlined
              onClick={() => onDelete(id)}
              className="p-2 text-white bg-red-600 rounded-md"
            />
          </UserPrivateComponent>
        </div>
      ),
    },
  ];
  const onDelete = async (id) => {
    const response = await axios.delete(`${apiUrl}/users/${id}`);
    if (response.status === 200) {
      console.log("User deleted successfully", response.data);
      toast.error(" Delete successful!");

      window.location.reload(); // Refresh the page after successful deletion
    }
  };
  return (
    <Card
      className="border-0 md:border md:p-6 bg-transparent md:bg-[#fafafa]"
      bodyStyle={{ padding: 0 }}
    >
      <div className="items-center justify-between pb-3 md:flex">
        <h1 className="text-lg font-bold">User</h1>
        <div className="flex items-center justify-between gap-1 md:justify-start md:gap-3">
          <CreateDrawer
            permission={"create-city"}
            title={"Add User"}
            width={35}
          >
            <AddUser />
          </CreateDrawer>
        </div>
      </div>
      <UserPrivateComponent permission={"readAll-city"}>
        <TableComponent
          columns={columns}
          csvFileName={"User"}
          paginatedThunk={loadAllCity}
          list={list2}
          // total={total}
          // loading={loading}
        />
      </UserPrivateComponent>
    </Card>
  );
};

export default GetAllUser;
