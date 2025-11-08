import { Link } from "react-router-dom";
import { Card, Table } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreateDrawer from "../CommonUi/CreateDrawer";
import TableComponent from "../CommonUi/TableComponent";
import UserPrivateComponent from "../PrivacyComponent/UserPrivateComponent";
import { DeleteOutlined } from "@ant-design/icons";
import {
  deleteBranch,
  loadAllBranch,
} from "../../redux/rtk/features/branch/branchSlice";
import AddBranch from "./addBranch";
import UpdateBranch from "./updateBranch";

const GetAllBranch = (props) => {
  const dispatch = useDispatch();
  const { list, total, loading } = useSelector((state) => state.branches);

  const columns = [
    {
      id: 2,
      title: "Branch Name",
      dataIndex: "branch_name",
      key: "branch_name",
    },
    {
      id: 2,
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      id: 3,
      title: "City",
      dataIndex: "city",
      key: "city",
    },
    {
      id: 3,
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      id: 4,
      title: "State",
      dataIndex: "state",
      key: "state",
    },
    {
      id: 5,
      title: "Pin Code",
      dataIndex: "pincode",
      key: "pincode",
    },
    {
      id: 6,
      title: "GST",
      dataIndex: "gst",
      key: "gst",
    },
    {
      id: 7,
      title: "Pan No",
      dataIndex: "pan",
      key: "pan",
    },
    {
      id: 8,
      title: "Short Name",
      dataIndex: "ShortName",
      key: "ShortName",
    },
    {
      id: 9,
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      id: 10,
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (status === 1 ? "Yes" : "No"),
    },

    {
      id: 3,
      title: "Action",
      dataIndex: "",
      key: "action",
      fixed: "right",
      render: ({ Id, ...restData }) => (
        <div className="flex items-center gap-2">
          <UserPrivateComponent permission="update-branch">
            <CreateDrawer
              update={1}
              permission={"update-branch"}
              title={"Edit branch Details"}
              minimalEdit
              width={50}
            >
              <UpdateBranch data={restData} id={Id} />
            </CreateDrawer>
          </UserPrivateComponent>
          <UserPrivateComponent permission={"delete-branch"}>
            <DeleteOutlined
              onClick={() => onDelete(Id)}
              className="bg-red-600 p-2 text-white rounded-md"
            />
          </UserPrivateComponent>
        </div>
      ),
    },
  ];
  useEffect(() => {
    dispatch(loadAllBranch({ page: 1, count: 1000, status: true }));
  }, [dispatch]);
  const onDelete = async (id) => {
    const res = await dispatch(deleteBranch(id));
    if (res) {
      dispatch(loadAllBranch({ status: true, page: 1, count: 1000 }));
    }
  };
  return (
    <Card
      className="border-0 md:border md:p-6 bg-transparent md:bg-[#fafafa]"
      bodyStyle={{ padding: 0 }}
    >
      <div className="md:flex items-center justify-between pb-3">
        <h1 className="text-lg font-bold">Branch</h1>
        <div className="flex justify-between md:justify-start md:gap-3 gap-1 items-center">
          <CreateDrawer
            permission={"create-branch"}
            title={"Add Branch"}
            width={35}
          >
            <AddBranch />
          </CreateDrawer>
        </div>
      </div>
      <UserPrivateComponent permission={"readAll-branch"}>
        <TableComponent
          columns={columns}
          paginatedThunk={loadAllBranch}
          list={list}
          total={total}
          csvFileName={"Branches"}
          loading={loading}
          scrollX={2000}
        />
      </UserPrivateComponent>
    </Card>
  );
};

export default GetAllBranch;
