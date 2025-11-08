import { Link } from "react-router-dom";
import { Form, Select, Button, DatePicker, Modal } from "antd";

import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Card, Table } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TableComponent from "../../CommonUi/TableComponent";
import UserPrivateComponent from "../../PrivacyComponent/UserPrivateComponent";
import SimpleButton from "../../Buttons/SimpleButton";
import axios from "axios";
import dayjs from "dayjs";
import { loadAllBus } from "../../../redux/rtk/features/bus/busSlice";
import { loadAllDriver } from "../../../redux/rtk/features/driver/driverSlice";
import { loadAllHelper } from "../../../redux/rtk/features/helper/helperSlice";
import {
  deletebookingEntry,
  loadAllBookingEntry,
} from "../../../redux/rtk/features/bookingEntry/bookingsEntrySlice";
import DetailBookingEntry from "./detailBookingEntry";
import AllotBus from "../../busAllotmentBooking/AllotBus";
import GetAllBusAllotmentToBooking from "./../../busAllotmentBooking/GetAllAllotmentToBooking";
import { loadSingleBookingBusAllotment } from "../../../redux/rtk/features/bookingBusAllotment/bookingBusAllotmentSlice";
import { Tooltip } from "antd";
const GetAllBookingEntry = (data) => {
  //API CALL//
  const [list2, setList] = useState([]);

  const [loading2, setLoading2] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmpType, setSelectedEmpType] = useState("HELPER");
  const apiUrl = import.meta.env.VITE_APP_API;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [partyFilter, setPartyFilter] = useState(null);
  const [dateFilter, setDateFilter] = useState(null);

  const showModal = (record) => {
    setSelectedBooking(record);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    setSelectedBooking(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedBooking(null);
    form.resetFields(); // <-- Reset all form fields to initial values
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/bookingHead`);
      setList(response.data.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading2(false);
    }
  };

  useEffect(() => {
    dispatch(loadAllBus({ page: 1, count: 10000, status: true }));
    // Call the function
    fetchData();
  }, []);
  //END//
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const handleExpand = (expanded, record) => {
    console.log("record", record);
    if (expanded) {
      setExpandedRowKeys([record.BookingNo]);
    } else {
      setExpandedRowKeys([]);
    }
  };
  const [maxId, setMaxId] = useState(0);

  const onDelete = async (id) => {
    const res = await dispatch(deletebookingEntry(id));
    if (res) {
      dispatch(loadAllBookingEntry({ status: true, page: 1, count: 1000 }));
      window.location.reload();
    }
  };

  const showDeleteConfirm = (booking) => {
    Modal.confirm({
      title: "Are you sure you want to delete this booking?",

      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        onDelete(booking);
      },
    });
  };

  const dispatch = useDispatch();
  const { list, total, loading } = useSelector((state) => state.bookingEntry);
  console.log(list);
  const columns = [
    {
      title: "Sl No",
      dataIndex: "slno",
      key: "slno",
      width: 70,
      render: (text, record, index) => index + 1,
      fixed: "left", // Optional: if you want to keep it fixed
    },
    {
      id: 1,
      title: "Booking Number",
      dataIndex: "BookingNo",
      key: "BookingNo",
      width: 120,
      render: (text) => (
        <Tooltip title={text}>
          <div className="truncate" style={{ maxWidth: 200 }}>
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      id: 1,
      title: "Invoice Number",
      dataIndex: "UsedInInvoice",
      key: "UsedInInvoice",
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
      id: 6,
      title: " Booking Date ",
      dataIndex: "BookingDate",
      key: "TripStartBookingDateDate",
      responsive: ["md"],
      render: (date) => moment(date).format("DD-MM-YYYY"),
      width: 120,
    },
    {
      id: 1,
      title: "Party Name",
      dataIndex: "PartyName",
      key: "PartyName",
      width: 220,
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
      title: "Contact Person Name",
      dataIndex: "ContactPersonName",
      key: "ContactPersonName",
      width: 220,
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
      title: "Contact Person Number",
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
      width: 210,
      responsive: ["md"],
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
      title: "Payment Terms",
      dataIndex: "PaymentTerms",
      key: "PaymentTerms",
      width: 120,
    },
    {
      id: 3,
      title: "GST Included",
      dataIndex: "GSTInclude",
      key: "GSTInclude",
      width: 90,
      render: (status) => (status === 1 ? "YES" : "NO"),
    },
    {
      title: "Action",
      dataIndex: "",
      key: "action",
      fixed: "right",
      align: "right", // Optional
      width: 200, // Adjust based on button size
      render: ({ BookingNo, ...restData }) => (
        <div className="flex items-center justify-end gap-2">
          <UserPrivateComponent permission="update-driver">
            {restData.UsedInInvoice === "" ? (
              <Link
                to={`/admin/update-bookingEntry/${encodeURIComponent(
                  BookingNo
                )}`}
              >
                <EditOutlined
                  className="p-2 text-white bg-gray-600 rounded-md hover:bg-gray-700"
                  style={{ fontSize: "15px", cursor: "pointer" }}
                />
              </Link>
            ) : (
              <span
                className="px-2 pb-2 text-white bg-gray-400 rounded-md opacity-50 cursor-not-allowed"
                style={{ fontSize: "15px" }}
                title="Cannot edit (invoice exists)"
              >
                <EditOutlined />
              </span>
            )}
          </UserPrivateComponent>

          <UserPrivateComponent permission="delete-driver">
            <Tooltip
              title={
                restData.UsedInInvoice !== ""
                  ? "Cannot delete (invoice exists)"
                  : "Delete"
              }
            >
              <button
                onClick={() => showDeleteConfirm(BookingNo)}
                disabled={restData.UsedInInvoice !== ""}
                className={`px-2 pb-2 rounded-md transition duration-300 ${
                  restData.UsedInInvoice !== ""
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
                style={{ fontSize: "15px" }}
              >
                <DeleteOutlined />
              </button>
            </Tooltip>
          </UserPrivateComponent>

          <button
            disabled={restData.UsedInInvoice !== ""}
            onClick={() => showModal({ BookingNo, ...restData })}
            className="p-1 font-bold text-white transition duration-300 bg-green-600 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ width: "100px" }}
          >
            Allotment
          </button>
        </div>
      ),
    },
  ];

  const filteredData = list2?.filter((item) => {
    const matchesParty = partyFilter
      ? item.PartyName?.toLowerCase() === partyFilter.toLowerCase()
      : true;

    const matchesDate = dateFilter
      ? dayjs(item.BookingDate)
          .startOf("day")
          .isSame(dayjs(dateFilter).startOf("day"))
      : true;

    // Return TRUE if any filter is applied and matches
    if (partyFilter && dateFilter) {
      return matchesParty && matchesDate;
    } else if (partyFilter) {
      return matchesParty;
    } else if (dateFilter) {
      return matchesDate;
    } else {
      return true; // If no filters, show all
    }
  });
  console.log("filter data", filteredData);

  const partyNames = [...new Set(list2?.map((item) => item.PartyName))];

  useEffect(() => {
    dispatch(loadAllBookingEntry({ status: true, page: 1, count: 1000 }));
    dispatch(loadAllDriver({ page: 1, count: 10000, status: true }));
    dispatch(loadAllHelper({ page: 1, count: 10000, status: true }));
  }, [dispatch]);

  useEffect(() => {
    // const lastDigits = list?.map((item) => parseInt(item.BookingNo.slice(-1)));
    // const maxLastDigit = lastDigits && Math.max(...lastDigits);
    //setMaxId(maxLastDigit);
  }, [list]);

  return (
    <>
      <div className="mt-2 card card-custom">
        <div className="card-body">
          <Card
            className="border-0 md:border md:p-6 bg-transparent md:bg-[#fafafa]"
            bodyStyle={{ padding: 0 }}
          >
            <div className="items-center justify-between pb-3 md:flex">
              <h1 className="text-lg font-bold">Booking list</h1>
              <div className="flex items-center justify-between gap-1 md:justify-start md:gap-3">
                <div className="flex xxs:w-1/2 md:w-full xxs:flex-col md:flex-row xxs:gap-1 md:gap-5">
                  <UserPrivateComponent permission={"create-bookingEntry"}>
                    <Link to={`/admin/add-bookingEntry/${maxId + 1 || 1}`}>
                      <SimpleButton title={"Add Entry"} />
                    </Link>
                  </UserPrivateComponent>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 mb-4 ml-16 md:flex-row">
              <Select
                allowClear
                showSearch
                placeholder="Filter by Party"
                onChange={(value) => setPartyFilter(value)}
                style={{ width: 400 }}
                value={partyFilter}
                optionFilterProp="children" // ensures it filters by displayed text
                filterOption={(input, option) =>
                  option?.children?.toLowerCase().includes(input.toLowerCase())
                }
              >
                {partyNames.map((party) => (
                  <Select.Option key={party} value={party}>
                    {party}
                  </Select.Option>
                ))}
              </Select>

              <DatePicker
                allowClear
                placeholder="Filter by Date"
                onChange={(date) => setDateFilter(date)}
                style={{ width: 200 }}
                value={dateFilter}
                format="DD-MM-YYYY"
              />
            </div>

            <Table
              dataSource={filteredData}
              columns={columns}
              loading={loading}
              pagination={false}
              scroll={{ x: 1700 }}
              rowKey="BookingNo"
              rowClassName={(record) => {
                if (record?.UsedInInvoice != 0) return "row-green";
                if (record?.AllotBusQty === 0) return "row-red";
                if (record?.AllotBusQty !== record?.BusQty) return "row-orange";
                return "";
              }}
              expandedRowKeys={expandedRowKeys}
              onExpand={handleExpand}
              expandable={{
                expandedRowRender: (record) => (
                  <div className="expanded-content">
                    <DetailBookingEntry bookingNo={record?.BookingNo} />
                  </div>
                ),
                rowExpandable: (record) => !!record?.BookingNo,
              }}
            />
          </Card>
        </div>
      </div>
      <Modal
        width={900}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <button
            key="cancel"
            onClick={handleCancel}
            className="px-4 py-1 mr-2 text-white bg-gray-600 rounded"
          >
            Cancel
          </button>,
        ]}
      >
        <AllotBus ID={selectedBooking} onSuccess={fetchData} />
      </Modal>
    </>
  );
};

export default GetAllBookingEntry;
