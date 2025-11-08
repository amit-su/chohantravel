import { Link } from "react-router-dom";
import { Card, Input } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreateDrawer from "../CommonUi/CreateDrawer";
import TableComponent from "../CommonUi/TableComponent";
import UserPrivateComponent from "../PrivacyComponent/UserPrivateComponent";
import { DeleteOutlined } from "@ant-design/icons";
import {
  deleteSite,
  loadAllSite,
} from "../../redux/rtk/features/site/siteSlice";
import AddSite from "./addSite";
import UpdateSite from "./updateSite";

const GetAllSite = (props) => {
  const dispatch = useDispatch();
  const { list, total, loading } = useSelector((state) => state.sites);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredList, setFilteredList] = useState([]);

  const columns = [
    {
      id: 1,
      title: "Name",
      dataIndex: "siteName",
      key: "siteName",
    },
    {
      id: 2,
      title: "Short Name",
      dataIndex: "siteShortName",
      key: "siteShortName",
    },
    {
      id: 3,
      title: "Active status",
      dataIndex: "siteActive",
      key: "siteActive",
      render: (status) => (status === "1" ? "Yes" : "No"),
    },
    {
      id: 4,
      title: "Site address",
      dataIndex: "siteAddress",
      key: "siteAddress",
    },
    {
      id: 5,
      title: "Party",
      dataIndex: "partyName",
      key: "partyName",
    },
    {
      id: 6,
      title: "Pin code",
      dataIndex: "pinCode",
      key: "pinCode",
    },
    {
      id: 7,
      title: "City",
      dataIndex: "cityName",
      key: "cityName",
    },
    {
      id: 8,
      title: "Driver Khuraki",
      dataIndex: "DriverKhurakiAmt",
      key: "DriverKhurakiAmt",
    },
    {
      id: 9,
      title: "Helper Khuraki",
      dataIndex: "HelperKhurakiAmt",
      key: "HelperKhurakiAmt",
    },
    {
      id: 10,
      title: "User",
      dataIndex: "createdBy",
      key: "createdBy",
    },
    {
      id: 11,
      title: "Action",
      dataIndex: "",
      key: "action",
      render: ({ siteID, ...restData }) => (
        <div className="flex items-center gap-2">
          <UserPrivateComponent permission="update-site">
            <CreateDrawer
              update={1}
              permission={"update-site"}
              title={"Edit Site"}
              minimalEdit
            >
              <UpdateSite data={restData} id={siteID} />
            </CreateDrawer>
          </UserPrivateComponent>
          <UserPrivateComponent permission={"delete-site"}>
            <DeleteOutlined
              onClick={() => onDelete(siteID)}
              className="bg-red-600 p-2 text-white rounded-md"
            />
          </UserPrivateComponent>
        </div>
      ),
    },
  ];

  useEffect(() => {
    dispatch(loadAllSite({ page: 1, count: 1000, status: true }));
  }, [dispatch]);

  useEffect(() => {
    setFilteredList(
      list?.filter((site) =>
        site?.siteName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [list, searchTerm]);

  const onDelete = async (id) => {
    const res = await dispatch(deleteSite(id));
    if (res) {
      dispatch(loadAllSite({ status: true, page: 1, count: 1000 }));
    }
  };

  return (
    <Card
      className="border-0 md:border md:p-6 bg-transparent md:bg-[#fafafa]"
      bodyStyle={{ padding: 0 }}
    >
      <div className="md:flex items-center justify-between pb-3">
        <h1 className="text-lg font-bold">Site</h1>
        <div className="flex justify-between md:justify-start md:gap-3 gap-1 items-center">
          <Input
            placeholder="Search by Site Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 200, marginLeft: 10 }}
          />
          <CreateDrawer
            permission={"create-site"}
            title={"Add Site"}
            width={35}
          >
            <AddSite />
          </CreateDrawer>
        </div>
      </div>
      <UserPrivateComponent permission={"readAll-site"}>
        <TableComponent
          columns={columns}
          csvFileName={"site"}
          paginatedThunk={loadAllSite}
          paginationStatus={false}
          list={filteredList}
          total={0}
          loading={loading}
        />
      </UserPrivateComponent>
    </Card>
  );
};

export default GetAllSite;
