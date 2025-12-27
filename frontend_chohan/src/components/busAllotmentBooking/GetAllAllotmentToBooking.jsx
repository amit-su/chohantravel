import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, Table, Input, Select, DatePicker, Tooltip } from "antd";

import { DeleteOutlined, SearchOutlined, TeamOutlined, CalendarOutlined, CarOutlined } from "@ant-design/icons";
import moment from "moment";
import CreateDrawer from "../CommonUi/CreateDrawer";
import UserPrivateComponent from "../PrivacyComponent/UserPrivateComponent";
import { deleteBookingBusAllotment } from "../../redux/rtk/features/bookingBusAllotment/bookingBusAllotmentSlice";
import { loadPartyPaginated } from "../../redux/rtk/features/party/partySlice";
import axios from "axios";
import dayjs from "dayjs";

const GetAllBusAllotmentToBooking = () => {
  const dispatch = useDispatch();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const apiUrl = import.meta.env.VITE_APP_API;

  // Filter State
  const [partyFilter, setPartyFilter] = useState(null);
  const [dateFilter, setDateFilter] = useState(null);
  const [searchFilter, setSearchFilter] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { list: partyList } = useSelector((state) => state.party);

  const fetchData = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page,
        count: limit,
        status: true,
        ...(partyFilter && { partyId: partyFilter }),
        ...(dateFilter && { bookingDate: dayjs(dateFilter).format("YYYY-MM-DD") }),
        ...(searchFilter && { search: searchFilter }),
      });

      const response = await axios.get(`${apiUrl}/bookingbusallotment?${queryParams.toString()}`);
      if (response.data) {
        setList(response.data.data);
        setTotal(response.data.count);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(loadPartyPaginated({ status: true, page: 1, count: 1000 }));
  }, [dispatch]);

  useEffect(() => {
    fetchData(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage, partyFilter, dateFilter, searchFilter]);

  const onDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete?")) {
      const res = await dispatch(deleteBookingBusAllotment(id));
      if (res) {
        fetchData(currentPage, itemsPerPage);
      }
    }
  };

  const columns = [
    {
      title: "Sl No",
      key: "slno",
      width: 70,
      fixed: "left",
      render: (text, record, index) => (currentPage - 1) * itemsPerPage + index + 1,
    },
    {
      id: 1,
      title: "Booking NO",
      dataIndex: "BookingNo",
      key: "BookingNo",
      width: 140,
      render: (text) => (
        <Tooltip title={text}>
          <div className="truncate font-semibold text-gray-700" style={{ maxWidth: 200 }}>
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      id: 6,
      title: "Allotment Date",
      dataIndex: "created_at",
      key: "created_at",
      responsive: ["md"],
      render: (date) => moment(date).format("DD-MM-YYYY"),
      width: 120,
    },
    {
      id: 1,
      title: "Party Name",
      dataIndex: "PartyName",
      key: "PartyName",
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
      title: "Contact Person",
      dataIndex: "ContactPersonName",
      key: "ContactPersonName",
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
      title: "Contact No",
      dataIndex: "ContactPersonNo",
      key: "ContactPersonNo",
      width: 150,
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
      title: "Reporting Address",
      dataIndex: "ReportAddr",
      key: "ReportAddr",
      responsive: ["md"],
      width: 200,
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
      title: "Vehicle No",
      dataIndex: "reg_no",
      key: "reg_no",
      width: 140,
      render: (text) => <span className="font-medium text-blue-600">{text}</span>
    },
    {
      id: 3,
      title: "Action",
      dataIndex: "",
      key: "action",
      fixed: "right",
      width: 100,
      render: ({ BookingNo, ...restData }) => (
        <div className="flex items-center gap-2">
          <UserPrivateComponent permission="update-bookingBusAllotment">
            {restData.UsedInInvoice === "" && (
              <CreateDrawer
                update={1}
                permission={"update-bookingBusAllotment"}
                title={"Edit details"}
                Allot
                width={50}
                id={BookingNo}
              />
            )}
          </UserPrivateComponent>
          <UserPrivateComponent permission="delete-bookingBusAllotment">
            <Button
              icon={<DeleteOutlined />}
              className="bg-red-50 text-red-500 border-red-100 hover:bg-red-100 hover:border-red-200"
              size="small"
              onClick={() => onDelete(restData.id)}
            />
          </UserPrivateComponent>
        </div>
      ),
    },
  ];

  return (
    <Card
      className="border-0 md:border md:p-6 bg-transparent md:bg-[#fafafa]"
      bodyStyle={{ padding: 0 }}
    >
      <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
            <CarOutlined style={{ fontSize: '24px' }} />
          </div>
          <h1 className="text-xl font-bold text-gray-800">Bus Allotment</h1>
        </div>
      </div>

      <Card className="mb-6 shadow-md border-0 border-t-4 border-purple-500 rounded-xl bg-white/80 backdrop-blur-sm" bordered={false}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="flex-1">
            <Input
              prefix={<SearchOutlined className="text-purple-500" />}
              placeholder="Search by Booking No, Person, or Contact..."
              onChange={(e) => setSearchFilter(e.target.value)}
              size="large"
              className="w-full rounded-lg border-purple-100 focus:border-purple-400 hover:border-purple-300 bg-purple-50/30 font-medium"
              allowClear
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Select
              allowClear
              showSearch
              placeholder="Filter by Party"
              style={{ width: '220px' }}
              size="large"
              onChange={setPartyFilter}
              loading={!partyList}
              className="rounded-lg"
              suffixIcon={<TeamOutlined className="text-purple-500" />}
              filterOption={(input, option) =>
                (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
              }
            >
              {partyList?.map(party => (
                <Select.Option key={party.id} value={party.id}>{party.partyName}</Select.Option>
              ))}
            </Select>

            <DatePicker
              style={{ width: '220px' }}
              onChange={setDateFilter}
              placeholder="Filter by Date"
              format="DD-MM-YYYY"
              size="large"
              className="rounded-lg"
              suffixIcon={<CalendarOutlined className="text-purple-500" />}
            />
          </div>
        </div>
      </Card>

      <UserPrivateComponent permission={"readAll-bookingBusAllotment"}>
        <Card className="shadow-lg border-0 border-t-4 border-purple-500 rounded-xl overflow-hidden bg-white/90 backdrop-blur-sm" bordered={false} bodyStyle={{ padding: 0 }}>
          <Table
            dataSource={list}
            total={total}
            loading={loading}
            columns={columns}
            rowKey="id"
            scroll={{ x: 1300 }}
            pagination={{
              current: currentPage,
              pageSize: itemsPerPage,
              total: total,
              onChange: (page, size) => {
                setCurrentPage(page);
                setItemsPerPage(size);
              },
              showSizeChanger: true,
              className: "p-6",
              position: ["bottomRight"]
            }}
            size="middle"
            rowClassName="hover:bg-purple-50/50 transition-colors duration-200"
          />
        </Card>
      </UserPrivateComponent>
    </Card>
  );
};

export default GetAllBusAllotmentToBooking;
