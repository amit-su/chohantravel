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
  deleteBusCategory,
  loadAllBusCategory,
} from "../../redux/rtk/features/busCategory/busCategorySlice";
import AddBusCategory from "./addBusCategory";
import UpdateBusCategory from "./updateBusCategory";

const GetAllBusCategory = (props) => {
  const dispatch = useDispatch();
  const { list, total, loading } = useSelector((state) => state.busCategories);

  const columns = [
    {
      id: 2,
      title: "CATEGORY NAME",
      dataIndex: "buscategory",
      key: "buscategory",
    },
    {
      id: 3,
      title: "ENTRY DATE",
      dataIndex: "entrydate",
      key: "entrydate",
      render: (createdAt) =>
        createdAt ? moment(createdAt).format("YYYY-MM-DD") : "---",
    },
    {
      id: 3,
      title: "ACTION",
      dataIndex: "",
      key: "action",
      render: ({ id, ...restData }) => (
        <div className="flex items-center gap-2">
          <UserPrivateComponent permission="update-busCategory">
            <CreateDrawer
              update={1}
              permission={"update-busCategory"}
              title={"Edit Bus Category"}
              minimalEdit
            >
              <UpdateBusCategory data={restData} id={id} />
            </CreateDrawer>
          </UserPrivateComponent>
          <UserPrivateComponent permission={"delete-busCategory"}>
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
    dispatch(loadAllBusCategory({ page: 1, count: 1000, status: true }));
  }, [dispatch]);
  const onDelete = async (id) => {
    const res = await dispatch(deleteBusCategory(id));
    if (res) {
      dispatch(loadAllBusCategory({ status: true, page: 1, count: 1000 }));
    }
  };
  return (
    <Card
      className="border-0 md:border md:p-6 bg-transparent md:bg-[#fafafa]"
      bodyStyle={{ padding: 0 }}
    >
      <div className="md:flex items-center justify-between pb-3">
        <h1 className="text-lg font-bold">Bus Categories</h1>
        <div className="flex justify-between md:justify-start md:gap-3 gap-1 items-center">
          <CreateDrawer
            permission={"create-busCategory"}
            title={"Add Bus Category"}
            width={35}
          >
            <AddBusCategory />
          </CreateDrawer>
        </div>
      </div>
      <UserPrivateComponent permission={"readAll-busCategory"}>
        <TableComponent
          columns={columns}
          csvFileName={"busCategory"}
          paginatedThunk={loadAllBusCategory}
          list={list}
          total={total}
          loading={loading}
        />
      </UserPrivateComponent>
    </Card>
  );
};

export default GetAllBusCategory;
