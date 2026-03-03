import { Link } from "react-router-dom";
import { Select, Button, DatePicker, Modal, Card, Table, Tooltip, Input, Space, Tag, Dropdown, Menu, message, Form, Progress } from "antd";
import {
  DeleteOutlined,
  FormOutlined,
  FileAddOutlined,
  SearchOutlined,
  CarOutlined,
  TeamOutlined,
  CalendarOutlined,
  RocketOutlined,
  MoreOutlined,
  MessageOutlined
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserPrivateComponent from "../../PrivacyComponent/UserPrivateComponent";
import axios from "axios";
import dayjs from "dayjs";
import { deletebookingEntry } from "../../../redux/rtk/features/bookingEntry/bookingsEntrySlice";
import { loadPartyPaginated } from "../../../redux/rtk/features/party/partySlice";
import DetailBookingEntry from "./detailBookingEntry";
import AllotBus from "../../busAllotmentBooking/AllotBus";

const GetAllBookingEntry = () => {
  const dispatch = useDispatch();
  const [bookingList, setBookingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_APP_API;

  // Modal State
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // SMS Progress State
  const [isProgressModalVisible, setIsProgressModalVisible] = useState(false);
  const [smsProgress, setSmsProgress] = useState({ current: 0, total: 0 });

  // Filter State
  const [partyFilter, setPartyFilter] = useState(null);
  const [dateFilter, setDateFilter] = useState(null);
  const [searchFilter, setSearchFilter] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const { list: partyList } = useSelector((state) => state.party);

  const fetchData = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page,
        limit,
        ...(partyFilter && { partyId: partyFilter }),
        ...(dateFilter && { bookingDate: dayjs(dateFilter).format("YYYY-MM-DD") }),
        ...(searchFilter && { search: searchFilter }),
      });

      const response = await axios.get(`${apiUrl}/bookingHead?${queryParams.toString()}`);
      setBookingList(response.data.data);
      setTotalItems(response.data.count);
    } catch (error) {
      // Handle error gracefully
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(loadPartyPaginated({ status: true, page: 1, count: 1000 }));
  }, [dispatch]);

  useEffect(() => {
    fetchData(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage, dateFilter, searchFilter, partyFilter]);

  const showModal = (record) => {
    setSelectedBooking(record);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedBooking(null);
  };

  const showSmsModal = async (record) => {
    try {
      // First fetch the detailed booking entry to ensure we have the full data including LocalBookingList
      const response = await axios.get(`${apiUrl}/bookingEntry/${record.BookingNo}`);

      if (!response.data || !response.data.data || response.data.data.length === 0) {
        message.error("Could not fetch detailed booking data.");
        return;
      }

      const detailedBooking = response.data.data[0];
      let localBookings = [];

      if (detailedBooking.LocalBookingList) {
        try {
          localBookings = typeof detailedBooking.LocalBookingList === 'string'
            ? JSON.parse(detailedBooking.LocalBookingList)
            : detailedBooking.LocalBookingList;
        } catch (e) {
          message.error("Failed to parse LocalBookingList");
        }
      }

      if (localBookings && localBookings.length > 0) {
        setSmsProgress({ current: 0, total: localBookings.length });
        setIsProgressModalVisible(true);

        try {
          const numbers = detailedBooking.ContactPersonNo ? detailedBooking.ContactPersonNo.toString().split(',')[0] : '';
          const customerName = detailedBooking.ContactPersonName || detailedBooking.PartyName || '';
          const CompanyPhone = detailedBooking.CompanyPhone ? detailedBooking.CompanyPhone.toString().split(',')[0] : '';

          let successCount = 0;
          for (let i = 0; i < localBookings.length; i++) {
            const trip = localBookings[i];
            const payload = {
              numbers: [numbers],
              customerName: customerName,
              pickup: trip.tripDescription || '',
              dateTime: trip.ReportDate ? `${trip.ReportDate} ${trip.reportTime || ''}`.trim() : (trip.reportTime || ''),
              goingTo: 'Local',
              CompanyPhone: CompanyPhone,
              bookingTranId: trip.ID
            };
            const res = await axios.post(`${apiUrl}/sms/booking-confirmation`, payload);
            if (res.status === 200) successCount++;

            setSmsProgress({ current: i + 1, total: localBookings.length });
          }
          message.success(`Sent ${successCount} out of ${localBookings.length} SMS successfully!`);
        } catch (error) {
          message.error("Failed to send some SMS.");
        } finally {
          setTimeout(() => setIsProgressModalVisible(false), 1500);
        }
        return;
      } else {
        message.warning('No local bookings found for this item to send SMS.');
      }
    } catch (error) {
      message.error("Failed to retrieve booking details for SMS.");
    }
  };

  const onDelete = async (id) => {
    Modal.confirm({
      title: 'Confirm Delete',
      content: 'Are you sure you want to delete this booking?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        const res = await dispatch(deletebookingEntry(id));
        if (res) {
          fetchData(currentPage, itemsPerPage);
        }
      }
    });
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
      title: "Booking No",
      dataIndex: "BookingNo",
      key: "BookingNo",
      width: 140,
      render: (text) => <span className="font-semibold text-gray-700">{text}</span>,
    },
    {
      title: "Invoice No",
      dataIndex: "UsedInInvoice",
      key: "UsedInInvoice",
      width: 140,
      render: (text) => text || <Tag color="default">Pending</Tag>,
    },
    {
      title: "Booking Date",
      dataIndex: "BookingDate",
      key: "BookingDate",
      width: 120,
      render: (date) => date ? dayjs(date).format("DD/MM/YYYY") : "-",
    },
    {
      title: "Party Name",
      dataIndex: "PartyName",
      key: "PartyName",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Contact Person",
      dataIndex: "ContactPersonName",
      key: "ContactPersonName",
      width: 180,
      ellipsis: true,
    },
    {
      title: "Contact No",
      dataIndex: "ContactPersonNo",
      key: "ContactPersonNo",
      width: 140,
    },
    {
      title: "Reporting Addr",
      dataIndex: "ReportAddr",
      key: "ReportAddr",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Payment Terms",
      dataIndex: "PaymentTerms",
      key: "PaymentTerms",
      width: 120,
    },
    {
      title: "GST",
      dataIndex: "GSTInclude",
      key: "GSTInclude",
      width: 80,
      render: (status) => <Tag color={status === 1 ? "green" : "red"}>{status === 1 ? "YES" : "NO"}</Tag>
    },
    {
      title: "Total SMS",
      dataIndex: "TotalSMSCount",
      key: "TotalSMSCount",
      width: 100,
      render: (count) => (
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${count > 0 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
            <MessageOutlined style={{ fontSize: '14px' }} />
          </div>
          <span className={`font-bold ${count > 0 ? 'text-blue-600' : 'text-gray-400'}`}>
            {count || 0}
          </span>
        </div>
      )
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 80,
      render: (_, record) => {
        const items = [
          {
            key: "edit",
            label: (
              <UserPrivateComponent permission="update-bookingEntry">
                <Link
                  to={record.UsedInInvoice ? "#" : `/admin/update-bookingEntry/${encodeURIComponent(record.BookingNo)}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', color: record.UsedInInvoice ? '#ccc' : 'inherit' }}
                >
                  <FormOutlined />
                  <span>Edit Booking</span>
                </Link>
              </UserPrivateComponent>
            ),
            disabled: !!record.UsedInInvoice,
          },
          {
            key: "allotment",
            label: (
              <div
                onClick={() => !record.UsedInInvoice && showModal(record)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <CarOutlined />
                <span>Bus Allotment</span>
              </div>
            ),
            disabled: !!record.UsedInInvoice,
          },
          {
            key: "sendSms",
            label: (
              <div
                onClick={() => showSmsModal(record)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <MessageOutlined />
                <span>Send SMS</span>
              </div>
            )
          },
          {
            type: 'divider',
          },
          {
            key: "delete",
            label: (
              <UserPrivateComponent permission="delete-bookingEntry">
                <div
                  onClick={() => !record.UsedInInvoice && onDelete(record.BookingNo)}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <DeleteOutlined />
                  <span>Delete Booking</span>
                </div>
              </UserPrivateComponent>
            ),
            disabled: !!record.UsedInInvoice,
            danger: true,
          },
        ];

        return (
          <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
            <Button
              type="text"
              icon={<MoreOutlined style={{ fontSize: '20px' }} />}
              className="flex items-center justify-center hover:bg-gray-100 rounded-full w-10 h-10"
            />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="w-full px-4">
        <div className="flex flex-col gap-4 mb-8 md:flex-row md:items-center md:justify-between p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-xl shadow-sm text-blue-600">
              <RocketOutlined style={{ fontSize: '28px' }} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Booking Management</h1>
              <p className="text-gray-500 mt-1 font-medium">Manage all your travel bookings in one place</p>
            </div>
          </div>
          <UserPrivateComponent permission="create-bookingEntry">
            <Link to="/admin/add-bookingEntry/1">
              <Button
                type="primary"
                size="large"
                icon={<FileAddOutlined />}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 border-0 hover:from-blue-700 hover:to-indigo-700 shadow-md font-medium px-6 h-12 rounded-lg text-base"
              >
                Create Booking
              </Button>
            </Link>
          </UserPrivateComponent>
        </div>

        <Card className="mb-6 shadow-md border-0 border-t-4 border-blue-500 rounded-xl bg-white/80 backdrop-blur-sm" bordered={false}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="flex-1">
              <Input
                prefix={<SearchOutlined className="text-blue-500" />}
                placeholder="Search by Booking No, Person, or Contact..."
                onChange={(e) => setSearchFilter(e.target.value)}
                size="large"
                className="w-full rounded-lg border-blue-100 focus:border-blue-400 hover:border-blue-300 bg-blue-50/30 font-medium"
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
                suffixIcon={<TeamOutlined className="text-blue-500" />}
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
                format="DD/MM/YYYY"
                size="large"
                className="rounded-lg"
                suffixIcon={<CalendarOutlined className="text-blue-500" />}
              />
            </div>
          </div>
        </Card>

        <Card className="shadow-lg border-0 border-t-4 border-purple-500 rounded-xl overflow-hidden bg-white/90 backdrop-blur-sm" bordered={false} bodyStyle={{ padding: 0 }}>
          <Table
            columns={columns}
            dataSource={bookingList}
            loading={loading}
            rowKey="BookingNo"
            scroll={{ x: 1300 }}
            pagination={{
              current: currentPage,
              pageSize: itemsPerPage,
              total: totalItems,
              onChange: (page, size) => {
                setCurrentPage(page);
                setItemsPerPage(size);
              },
              showSizeChanger: true,
              className: "p-6",
              position: ["bottomRight"]
            }}
            expandable={{
              expandedRowRender: (record) => (
                <div className="p-6 bg-indigo-50/50 border-t border-indigo-100">
                  <DetailBookingEntry bookingNo={record.BookingNo} />
                </div>
              ),
              rowExpandable: (record) => !!record.BookingNo,
            }}
            rowClassName={(record) => {
              let classes = "hover:bg-blue-50/50 transition-colors duration-200 text-gray-700 font-medium ";
              if (record.UsedInInvoice) classes += "bg-green-50/40 ";
              else if (record.AllotBusQty === 0) classes += "bg-red-100 ";
              else if (record.AllotBusQty !== record.BusQty) classes += "bg-orange-100 ";
              return classes;
            }}
            size="middle"
          />
        </Card>

        <Modal
          title={<span className="text-lg font-semibold text-gray-800">Bus Allotment</span>}
          visible={isModalVisible}
          onCancel={handleModalClose}
          footer={null}
          width={900}
          destroyOnClose
          className="top-10 rounded-xl overflow-hidden"
        >
          {selectedBooking && (
            <AllotBus
              ID={selectedBooking}
              onSuccess={() => {
                handleModalClose();
                fetchData(currentPage, itemsPerPage);
              }}
            />
          )}
        </Modal>


        <Modal
          title={<span className="text-lg font-semibold text-gray-800">Sending SMS Progress</span>}
          visible={isProgressModalVisible}
          footer={null}
          closable={false}
          maskClosable={false}
          width={400}
          centered
        >
          <div className="flex flex-col items-center justify-center p-4">
            <Progress
              type="circle"
              percent={Math.round((smsProgress.current / (smsProgress.total || 1)) * 100)}
              status={smsProgress.current === smsProgress.total ? "success" : "active"}
            />
            <p className="mt-4 text-gray-600 font-medium text-center">
              {smsProgress.current === smsProgress.total
                ? "All messages sent successfully!"
                : `Sending message ${smsProgress.current} of ${smsProgress.total}...`}
            </p>
          </div>
        </Modal>
      </div >
    </div >
  );
};

export default GetAllBookingEntry;
