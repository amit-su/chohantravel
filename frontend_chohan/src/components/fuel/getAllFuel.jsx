import { Link } from "react-router-dom";
import { Card, Table } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreateDrawer from "../CommonUi/CreateDrawer";
import TableComponent from "../CommonUi/TableComponent";
import UserPrivateComponent from "../PrivacyComponent/UserPrivateComponent";
import { DeleteOutlined } from "@ant-design/icons";
import {
  deleteFuel,
  loadAllFuel,
} from "../../redux/rtk/features/fuel/fuelSlice";
import AddFuel from "./addFuel";
import UpdateFuel from "./updateFuel";
import moment from "moment";

const GetAllFuel = (props) => {
  const dispatch = useDispatch();
  const { list, total, loading } = useSelector((state) => state.fuels);

  const columns = [
    {
      id: 2,
      title: "Bus Name",
      dataIndex: "busName",
      key: "busName",
      width: 200,
    },
    {
      id: 2,
      title: "Bus No",
      dataIndex: "busNo",
      key: "busNo",
      width: 200,
    },
    {
      id: 2,
      title: "Fuel Type",
      dataIndex: "FuelType",
      key: "FuelType",
      width: 100,
    },

    {
      id: 4,
      title: "Diver Name",
      dataIndex: "driverName",
      key: "driverName",
      width: 120,
    },

    {
      id: 5,
      title: "CreatedOn",
      dataIndex: "CreatedOn",
      key: "CreatedOn",
      render: (date) => moment(date).format("DD-MM-YYYY"),
      width: 140,
    },
    {
      id: 6,
      title: "Kilometer",
      dataIndex: "Kilometer",
      key: "Kilometer",
    },

    {
      id: 8,
      title: "Fuel",
      dataIndex: "Fuel",
      key: "Fuel",
    },
    {
      id: 8,
      title: "Rate",
      dataIndex: "Rate",
      key: "Rate",
    },
    {
      id: 8,
      title: "Amount",
      dataIndex: "Amount",
      key: "Amount",
    },

    {
      id: 8,
      title: "Remarks",
      dataIndex: "Remarks",
      key: "Remarks",
      width: 100,
    },
    {
      id: 8,
      title: "City",
      dataIndex: "City",
      key: "City",
      width: 100,
    },

    {
      id: 3,
      title: "Action",
      dataIndex: "",
      key: "action",
      fixed: "right",
      render: ({ id, ...restData }) => (
        <div className="flex items-center gap-2">
          <UserPrivateComponent permission="update-fuel">
            <CreateDrawer
              update={1}
              permission={"update-fuel"}
              title={"Edit Fuel Details"}
              minimalEdit
              width={50}
            >
              <UpdateFuel data={restData} id={id} />
            </CreateDrawer>
          </UserPrivateComponent>
          <UserPrivateComponent permission={"delete-fuel"}>
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
    dispatch(loadAllFuel({ page: 1, count: 1000, status: true }));
  }, [dispatch]);
  const onDelete = async (id) => {
    const res = await dispatch(deleteFuel(id));
    if (res) {
      dispatch(loadAllFuel({ status: true, page: 1, count: 1000 }));
    }
  };
  return (
    <Card
      className="border-0 md:border md:p-6 bg-transparent md:bg-[#fafafa]"
      bodyStyle={{ padding: 0 }}
    >
      <div className="md:flex items-center justify-between pb-3">
        <h1 className="text-lg font-bold">Fuel</h1>
        <div className="flex justify-between md:justify-start md:gap-3 gap-1 items-center">
          <CreateDrawer
            permission={"create-fuel"}
            title={"Add Fuel"}
            width={50}
          >
            <AddFuel />
          </CreateDrawer>
        </div>
      </div>
      <UserPrivateComponent permission={"readAll-fuel"}>
        <TableComponent
          columns={columns}
          csvFileName={"Fuel"}
          paginatedThunk={loadAllFuel}
          list={list}
          total={total}
          loading={loading}
          scrollX={1900}
        />
      </UserPrivateComponent>
    </Card>
  );
};

export default GetAllFuel;
