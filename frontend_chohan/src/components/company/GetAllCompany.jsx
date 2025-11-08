import { Card, Table } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreateDrawer from "../CommonUi/CreateDrawer";
import TableComponent from "../CommonUi/TableComponent";
import UserPrivateComponent from "../PrivacyComponent/UserPrivateComponent";
import { DeleteOutlined } from "@ant-design/icons";

import AddCompany from "./addCompany";
// import UpdateCompany from "./updateCompany";
import {
  deleteCompany,
  loadAllCompany,
} from "../../redux/rtk/features/company/comapnySlice";
import UpdateCompany from "./updateCompany";

const GetAllCompany = (props) => {
  const dispatch = useDispatch();
  const { list, total, loading } = useSelector((state) => state.companies);

  const columns = [
    {
      id: 2,
      title: "Company Name",
      dataIndex: "Name",
      key: "Name",
    },
    {
      id: 2,
      title: "Address",
      dataIndex: "Address",
      key: "Address",
    },
    {
      id: 3,
      title: "City",
      dataIndex: "City",
      key: "City",
    },
    {
      id: 3,
      title: "Phone",
      dataIndex: "Phone",
      key: "Phone",
    },
    {
      id: 4,
      title: "Email",
      dataIndex: "Email",
      key: "Email",
    },
    {
      id: 5,
      title: "Fax",
      dataIndex: "Fax",
      key: "Fax",
    },
    {
      id: 6,
      title: "Website",
      dataIndex: "Website",
      key: "Website",
    },
    {
      id: 7,
      title: "Created Date",
      dataIndex: "CreatedDate",
      key: "CreatedDate",
    },
    {
      id: 8,
      title: "GST No",
      dataIndex: "GSTNo",
      key: "GSTNo",
    },
    {
      id: 9,
      title: "PAN No",
      dataIndex: "PANNo",
      key: "PANNo",
    },
    {
      id: 10,
      title: "HSN Code",
      dataIndex: "HSNCode",
      key: "HSNCode",
    },
    {
      id: 11,
      title: "CIN No",
      dataIndex: "CINNo",
      key: "CINNo",
    },
    {
      id: 12,
      title: "CGST",
      dataIndex: "CGST",
      key: "CGST",
    },
    {
      id: 13,
      title: "SGST",
      dataIndex: "SGST",
      key: "SGST",
    },
    {
      id: 14,
      title: "IGST",
      dataIndex: "IGST",
      key: "IGST",
    },
    {
      id: 15,
      title: "Short Name",
      dataIndex: "ShortName",
      key: "ShortName",
    },
    {
      id: 3,
      title: "Action",
      dataIndex: "",
      key: "action",
      fixed: "right",
      render: ({ Id, ...restData }) => (
        <div className="flex items-center gap-2">
          <UserPrivateComponent permission="update-company">
            <CreateDrawer
              update={1}
              permission={"update-company"}
              title={"Edit company Details"}
              minimalEdit
              width={50}
            >
              <UpdateCompany data={restData} id={Id} />
            </CreateDrawer>
          </UserPrivateComponent>
          <UserPrivateComponent permission={"delete-company"}>
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
    dispatch(loadAllCompany({ page: 1, count: 1000, status: true }));
  }, [dispatch]);
  const onDelete = async (id) => {
    const res = await dispatch(deleteCompany(id));
    if (res) {
      dispatch(loadAllCompany({ status: true, page: 1, count: 1000 }));
    }
  };
  return (
    <Card
      className="border-0 md:border md:p-6 bg-transparent md:bg-[#fafafa]"
      bodyStyle={{ padding: 0 }}
    >
      <div className="md:flex items-center justify-between pb-3">
        <h1 className="text-lg font-bold">Company</h1>
        <div className="flex justify-between md:justify-start md:gap-3 gap-1 items-center">
          <CreateDrawer
            permission={"create-company"}
            title={"Add Company"}
            width={50}
          >
            <AddCompany />
          </CreateDrawer>
        </div>
      </div>
      <UserPrivateComponent permission={"readAll-company"}>
        <TableComponent
          columns={columns}
          paginatedThunk={loadAllCompany}
          list={list}
          total={total}
          csvFileName={"Companies"}
          loading={loading}
          scrollX={2000}
        />
      </UserPrivateComponent>
    </Card>
  );
};

export default GetAllCompany;
