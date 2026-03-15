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

  // SMS Preview State
  const [isSmsPreviewModalOpen, setIsSmsPreviewModalOpen] = useState(false);
  const [smsPreviewForm] = Form.useForm();
  const [smsPreviews, setSmsPreviews] = useState([]);
  const [pendingLocalBookings, setPendingLocalBookings] = useState([]);
  const [currentBookingInfo, setCurrentBookingInfo] = useState(null);

  const generateSinglePreview = (values, trip) => {
    const { customerName, CompanyPhone } = values;
    const cleanedPickup = (trip.tripDescription || "")
      .replace(/\n+/g, " ")
      .replace(/[.,]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    let fromLoc = cleanedPickup;
    let toLoc = "Local";
    const match = cleanedPickup.match(/From (.*?) To (.*)/i);
    if (match) {
      fromLoc = match[1].trim();
      toLoc = match[2].trim();
    }
    const tripDateTime = trip.ReportDate ? `${trip.ReportDate} ${trip.reportTime || ''}`.trim() : (trip.reportTime || '');

    return `Dear ${customerName || ""}, your booking has been confirmed. Trip Details: ${fromLoc} ${toLoc}. Date:&Time ${tripDateTime} Driver details will be shared one day prior to journey day. Office number: ${CompanyPhone || ""} Thanks&Regards Chohan Tours and travels`;
  };

  const updateAllPreviews = (values, bookings) => {
    const newPreviews = bookings.map(trip => generateSinglePreview(values, trip));
    setSmsPreviews(newPreviews);
  };

  // Payment Reminder State
  const [isPaymentReminderModalOpen, setIsPaymentReminderModalOpen] = useState(false);
  const [paymentReminderForm] = Form.useForm();
  const [paymentReminderPreview, setPaymentReminderPreview] = useState("");

  const generatePaymentReminderPreview = (values) => {
    const { customerName, journeyDate } = values;
    return `Dear ${customerName || ""}, your journey with Chohan Tours & Travels is scheduled on ${journeyDate || ""}. We request you to kindly clear the pending payment. Thank you!`;
  };

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
        setPendingLocalBookings(localBookings);
        setCurrentBookingInfo(detailedBooking);

        const initialValues = {
          numbers: detailedBooking.ContactPersonNo ? detailedBooking.ContactPersonNo.toString().split(',')[0] : '',
          customerName: detailedBooking.ContactPersonName || detailedBooking.PartyName || '',
          CompanyPhone: detailedBooking.CompanyPhone ? detailedBooking.CompanyPhone.toString().split(',')[0] : '',
        };

        smsPreviewForm.setFieldsValue(initialValues);
        updateAllPreviews(initialValues, localBookings);
        setIsSmsPreviewModalOpen(true);
      } else {
        message.warning('No local bookings found for this item to send SMS.');
      }
    } catch (error) {
      console.error("Fetch detailed data error:", error);
      message.error("Failed to retrieve booking details for SMS.");
    }
  };

  const handleStartSmsSending = async () => {
    try {
      const values = await smsPreviewForm.validateFields();
      setIsSmsPreviewModalOpen(false);
      setSmsProgress({ current: 0, total: pendingLocalBookings.length });
      setIsProgressModalVisible(true);

      let successCount = 0;
      for (let i = 0; i < pendingLocalBookings.length; i++) {
        const trip = pendingLocalBookings[i];

        const cleanedPickup = (trip.tripDescription || "")
          .replace(/\n+/g, " ")
          .replace(/[.,]/g, "")
          .replace(/\s+/g, " ")
          .trim();

        let fromLoc = cleanedPickup;
        let toLoc = "Local";
        const match = cleanedPickup.match(/From (.*?) To (.*)/i);
        if (match) {
          fromLoc = match[1].trim();
          toLoc = match[2].trim();
        }

        const payload = {
          numbers: [values.numbers],
          customerName: values.customerName,
          pickup: `From ${fromLoc} To ${toLoc}`,
          dateTime: trip.ReportDate ? `${trip.ReportDate} ${trip.reportTime || ''}`.trim() : "",
          goingTo: toLoc,
          CompanyPhone: values.CompanyPhone,
          bookingTranId: trip.ID
        };

        const res = await axios.post(`${apiUrl}/sms/booking-confirmation`, payload);
        if (res.status === 200) successCount++;

        setSmsProgress({ current: i + 1, total: pendingLocalBookings.length });
      }
      message.success(`Sent ${successCount} out of ${pendingLocalBookings.length} SMS successfully!`);
      fetchData(currentPage, itemsPerPage);
    } catch (error) {
      console.error("SMS batch error:", error);
      message.error("Failed to send some SMS.");
    } finally {
      setTimeout(() => setIsProgressModalVisible(false), 1500);
    }
  };

  const showPaymentReminderModal = async (record) => {
    try {
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
        setPendingLocalBookings(localBookings);
        setCurrentBookingInfo(detailedBooking);
        const firstTrip = localBookings[0];
        let journeyDate = "";
        if (firstTrip.ReportDate) {
          if (typeof firstTrip.ReportDate === 'string' && /^\d{2}[-/]\d{2}[-/]\d{4}$/.test(firstTrip.ReportDate)) {
            journeyDate = firstTrip.ReportDate;
          } else {
            const dt = dayjs(firstTrip.ReportDate);
            journeyDate = dt.isValid() ? dt.format("DD-MM-YYYY") : firstTrip.ReportDate;
          }
        }

        const initialValues = {
          numbers: detailedBooking.ContactPersonNo ? detailedBooking.ContactPersonNo.toString().split(',')[0] : '',
          customerName: detailedBooking.ContactPersonName || detailedBooking.PartyName || '',
          journeyDate: journeyDate,
        };
        paymentReminderForm.setFieldsValue(initialValues);
        setPaymentReminderPreview(generatePaymentReminderPreview(initialValues));
        setIsPaymentReminderModalOpen(true);
      } else {
        message.warning('No local bookings found to send SMS.');
      }
    } catch (error) {
      message.error("Failed to retrieve booking details.");
    }
  };

  const handleSendPaymentReminder = async () => {
    try {
      const values = await paymentReminderForm.validateFields();
      setIsPaymentReminderModalOpen(false);

      const payload = {
        numbers: [values.numbers],
        customerName: values.customerName,
        journeyDate: values.journeyDate,
        bookingNo: currentBookingInfo?.BookingNo
      };

      const res = await axios.post(`${apiUrl}/sms/payment-reminder`, payload);
      if (res.status === 200) {
        message.success("Payment reminder SMS sent successfully!");
        fetchData(currentPage, itemsPerPage);
      } else {
        message.error("Failed to send SMS.");
      }
    } catch (error) {
      message.error("Failed to send Payment reminder SMS.");
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
      title: "Payment SMS",
      dataIndex: "payment_sms_count",
      key: "payment_sms_count",
      width: 110,
      render: (count) => (
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${count > 0 ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400'}`}>
            <MessageOutlined style={{ fontSize: '14px' }} />
          </div>
          <span className={`font-bold ${count > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
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
            key: "paymentReminder",
            label: (
              <div
                onClick={() => showPaymentReminderModal(record)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <MessageOutlined style={{ color: '#fa8c16' }} />
                <span>Payment Reminder</span>
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

        <Modal
          title={<span className="text-lg font-semibold text-gray-800">Booking Confirmation SMS Preview</span>}
          open={isSmsPreviewModalOpen}
          onOk={handleStartSmsSending}
          onCancel={() => setIsSmsPreviewModalOpen(false)}
          width={800}
          okText={`Send SMS to ${pendingLocalBookings.length} Trip(s)`}
          destroyOnClose
        >
          <Form
            form={smsPreviewForm}
            layout="vertical"
            onValuesChange={() => {
              updateAllPreviews(smsPreviewForm.getFieldsValue(), pendingLocalBookings);
            }}
          >
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="numbers"
                label="Phone Number"
                rules={[{ required: true, message: "Please enter phone number" }]}
              >
                <Input placeholder="Enter Phone Number" />
              </Form.Item>
              <Form.Item name="customerName" label="Customer Name" rules={[{ required: true }]}>
                <Input placeholder="Customer Name" />
              </Form.Item>
              <Form.Item name="CompanyPhone" label="Office Phone" rules={[{ required: true }]}>
                <Input placeholder="Office Phone" />
              </Form.Item>
            </div>
          </Form>
          <div className="mt-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            <h4 className="font-bold mb-3 text-blue-800 flex items-center gap-2 sticky top-0 bg-white py-2 z-10 border-b border-blue-50">
              <MessageOutlined /> Message Previews ({smsPreviews.length}):
            </h4>
            <div className="space-y-4 pb-2">
              {smsPreviews.map((preview, index) => (
                <div key={index} className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-400"></div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">SMS #{index + 1}</span>
                    <span className="text-[10px] text-gray-400 font-medium">Trip ID: {pendingLocalBookings[index]?.ID}</span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap font-medium leading-relaxed text-sm">
                    {preview}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Modal>

        <Modal
          title={<span className="text-lg font-semibold text-gray-800">Payment Reminder SMS Preview</span>}
          open={isPaymentReminderModalOpen}
          onOk={handleSendPaymentReminder}
          onCancel={() => setIsPaymentReminderModalOpen(false)}
          width={800}
          okText="Send SMS"
          destroyOnClose
        >
          <Form
            form={paymentReminderForm}
            layout="vertical"
            onValuesChange={() => {
              setPaymentReminderPreview(generatePaymentReminderPreview(paymentReminderForm.getFieldsValue()));
            }}
          >
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="numbers"
                label="Phone Number"
                rules={[{ required: true, message: "Please enter phone number" }]}
              >
                <Input placeholder="Enter Phone Number" />
              </Form.Item>
              <Form.Item name="customerName" label="Customer Name" rules={[{ required: true }]}>
                <Input placeholder="Customer Name" />
              </Form.Item>
              <Form.Item name="journeyDate" label="Journey Date" rules={[{ required: true }]}>
                <Input placeholder="Journey Date" />
              </Form.Item>
            </div>
          </Form>
          <div className="mt-4 p-4 bg-orange-50 rounded-xl border border-orange-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-orange-400"></div>
            <h4 className="font-bold mb-3 text-orange-600 flex items-center gap-2">
              <MessageOutlined /> Message Preview:
            </h4>
            <p className="text-gray-700 whitespace-pre-wrap font-medium leading-relaxed text-sm">
              {paymentReminderPreview}
            </p>
          </div>
        </Modal>
      </div >
    </div >
  );
};

export default GetAllBookingEntry;
