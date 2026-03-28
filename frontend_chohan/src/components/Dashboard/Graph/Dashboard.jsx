import {
  Col,
  Row,
  Select,
  Button,
  Table,
  message,
  Spin,
  Input,
  Card,
  Typography,
  Tag,
  DatePicker,
  Space,
  Statistic,
  ConfigProvider,
} from "antd";
import enUS from "antd/locale/en_US";
import React, { useEffect, useState, useMemo } from "react";
import { Navigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/en";
import customParseFormat from "dayjs/plugin/customParseFormat";
import advancedFormat from "dayjs/plugin/advancedFormat";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import weekOfYear from "dayjs/plugin/weekOfYear";
import weekYear from "dayjs/plugin/weekYear";

// Set dayjs locale
dayjs.locale("en");

// Extend dayjs with required plugins for Ant Design RangePicker
dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);
import { motion } from "framer-motion";
import {
  SearchOutlined,
  CalendarOutlined,
  CarOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  EyeOutlined,
  WarningOutlined,
} from "@ant-design/icons";

import checkTokenExp from "../../../utils/checkTokenExp";
import { loadAllBusCategory } from "../../../redux/rtk/features/busCategory/busCategorySlice";
import UserPrivateComponent from "../../PrivacyComponent/UserPrivateComponent";

const { Option } = Select;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 10 },
  },
};

const Dashboard = () => {
  const isLogged = Boolean(localStorage.getItem("isLogged"));
  const apiUrl = import.meta.env.VITE_APP_API;
  const accessToken = localStorage.getItem("access-token");

  if (!isLogged) {
    return <Navigate to={"/admin/auth/login"} replace={true} />;
  }
  checkTokenExp(accessToken);

  const dispatch = useDispatch();
  const { list: busCategoryList, loading: busCategoryLoading } = useSelector(
    (state) => state.busCategories || {}
  );

  // --- State ---
  const [dateRange, setDateRange] = useState([
    dayjs().startOf("month").set("hour", 0).set("minute", 0),
    dayjs().endOf("month").set("hour", 23).set("minute", 59),
  ]);
  const [busType, setBusType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState([]);
  const [apiError, setApiError] = useState(null);
  const [searchText, setSearchText] = useState("");

  const [summary, setSummary] = useState({});
  const [expiredDocs, setExpiredDocs] = useState([]);
  const [showExpiredDetails, setShowExpiredDetails] = useState(false);
  const [expiredDocsLoading, setExpiredDocsLoading] = useState(false);
  
  // Expiry Document Filters
  const [expiredSearchBusNo, setExpiredSearchBusNo] = useState("");
  const [expiredSearchDocType, setExpiredSearchDocType] = useState(null);
  const [expiredSearchMonth, setExpiredSearchMonth] = useState(null);

  // --- Effects ---
  useEffect(() => {
    const fetchInitialData = async () => {
      dispatch(loadAllBusCategory({ page: 1, count: 10000, status: true }));
      await fetchDashboardData();
    };
    fetchInitialData();
  }, [dispatch]);

  const fetchDashboardData = async () => {
    try {
      // Fetch dashboard summary
      const summaryResponse = await axios.get(`${apiUrl}/dashboard`);
      if (summaryResponse?.data?.data) {
        setSummary(summaryResponse.data.data);
      }

      // Fetch expired documents
      setExpiredDocsLoading(true);
      const expiredResponse = await axios.get(
        `${apiUrl}/dashboard/expired-documents`
      );
      if (expiredResponse?.data?.data) {
        setExpiredDocs(expiredResponse.data.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      message.error("Failed to load dashboard data");
    } finally {
      setExpiredDocsLoading(false);
    }
  };

  // --- Handlers ---

  const handleSubmit = async () => {
    if (!busType) {
      message.warning("Please select Bus Category");
      return;
    }
    if (!dateRange || dateRange.length !== 2) {
      message.warning("Please select a date range");
      return;
    }

    const [fromDate, toDate] = dateRange;

    setLoading(true);
    setApiError(null);

    try {
      const response = await axios.post(
        `${apiUrl}/dashboard/stock`,
        {
          InputBusTypeID: busType,
          InputStartDateTime: fromDate.format("YYYY-MM-DD HH:mm:ss"),
          InputEndDateTime: toDate.format("YYYY-MM-DD HH:mm:ss"),
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          timeout: 10000,
        }
      );

      if (response.data?.data) {
        setResult(Array.isArray(response.data.data) ? response.data.data : []);
      } else {
        setResult([]);
        message.info("No data available for the selected criteria");
      }
    } catch (error) {
      console.error("API Error:", error);
      setApiError(
        error.response?.data?.message ||
        error.message ||
        "Unknown error occurred"
      );
      message.error(`Failed to fetch data: ${error.message}`);
      setResult([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredResult = useMemo(() => {
    if (!searchText) return result;
    const searchLower = searchText.toLowerCase();
    return result.filter(
      (item) =>
        item.BusNo?.toLowerCase().includes(searchLower) ||
        item.AvailabilityStatus?.toLowerCase().includes(searchLower)
    );
  }, [searchText, result]);

  // --- Derived Data for Expired Docs ---
  const uniqueDocTypes = useMemo(() => {
    const types = new Set(expiredDocs.map(doc => doc.DocumentType));
    return Array.from(types).filter(Boolean).sort();
  }, [expiredDocs]);

  const filteredExpiredDocs = useMemo(() => {
    let filtered = expiredDocs;

    if (expiredSearchBusNo) {
      filtered = filtered.filter((doc) =>
        doc.BusNumber?.toLowerCase().includes(expiredSearchBusNo.toLowerCase())
      );
    }

    if (expiredSearchDocType) {
      filtered = filtered.filter((doc) =>
        doc.DocumentType === expiredSearchDocType
      );
    }

    if (expiredSearchMonth) {
      const targetMonth = dayjs(expiredSearchMonth).month(); // 0-11
      const targetYear = dayjs(expiredSearchMonth).year();
      filtered = filtered.filter((doc) => {
        if (!doc.ExpiryDate) return false;
        const docMonth = dayjs(doc.ExpiryDate).month();
        const docYear = dayjs(doc.ExpiryDate).year();
        return docMonth === targetMonth && docYear === targetYear;
      });
    }

    return filtered;
  }, [expiredDocs, expiredSearchBusNo, expiredSearchDocType, expiredSearchMonth]);

  // --- Columns ---
  const busAvailabilityColumns = [
    {
      title: "Sl. No",
      key: "index",
      render: (_, __, index) => <Text className="text-gray-500">{index + 1}</Text>,
      width: 70,
      align: 'center',
    },
    {
      title: "Bus No",
      dataIndex: "BusNo",
      key: "BusNo",
      sorter: (a, b) => (a.BusNo || "").localeCompare(b.BusNo || ""),
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Capacity",
      dataIndex: "sittingCapacity",
      key: "SeatingCapacity",
      align: 'center',
      render: (text) => <Tag color="blue">{text} Seats</Tag>,
    },
    {
      title: "Availability",
      dataIndex: "AvailabilityStatus",
      key: "AvailabilityStatus",
      align: 'center',
      render: (status) => (
        <Tag
          icon={status === "Available" ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
          color={status === "Available" ? "success" : "error"}
          className="px-3 py-1 text-sm rounded-full"
        >
          {status || "N/A"}
        </Tag>
      ),
    },
  ];

  const expiredDocsColumns = [
    { title: "Bus Number", dataIndex: "BusNumber", key: "BusNumber", render: (text) => <Text strong>{text}</Text> },
    { title: "Bus Owner", dataIndex: "BusOwner", key: "BusOwner" },
    { title: "Document Type", dataIndex: "DocumentType", key: "DocumentType", render: (text) => <Tag>{text}</Tag> },
    {
      title: "Expiry Date",
      dataIndex: "ExpiryDate",
      key: "ExpiryDate",
      render: (date) => <Text>{dayjs(date).format("DD MMM YYYY")}</Text>,
    },
    {
      title: "Status",
      key: "status",
      render: (record) => (
        <Tag color={record.DaysLeft < 0 ? "error" : "warning"}>
          {record.DaysLeft < 0 ? "Expired" : "Expiring Soon"}
        </Tag>
      ),
    },
    {
      title: "Days Left",
      dataIndex: "DaysLeft",
      key: "DaysLeft",
      render: (days) => (
        <span
          className={
            days < 0 ? "text-red-600 font-bold" : "text-amber-600 font-bold"
          }
        >
          {days}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 100,
      render: ({ id, ...record }) => (
        <UserPrivateComponent permission="delete-party">
          <Button
            type="link"
            disabled={record.DocumentPath === null}
            onClick={() =>
              window.open(apiUrl + "/busdocuments/file/" + record.ID)
            }
            icon={<EyeOutlined />}
            size="small"
          >
            View
          </Button>
        </UserPrivateComponent>
      ),
    },
  ];

  return (
    <ConfigProvider locale={enUS}>
      <div className="min-h-screen bg-slate-50 p-6">
        <style>
          {`
            .ant-picker-dropdown .ant-picker-panel-container .ant-picker-panels {
              display: flex !important;
            }
            .ant-picker-dropdown .ant-picker-panel {
              display: block !important;
            }
          `}
        </style>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-[1600px] mx-auto space-y-8"
        >
          {/* --- Header --- */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Title level={2} style={{ margin: 0, fontWeight: 700, color: '#1e293b' }}>
                Admin Dashboard
              </Title>
              <Text className="text-slate-500">
                Welcome back! Here's what's happening today.
              </Text>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100 flex items-center gap-2">
                <CalendarOutlined className="text-blue-500" />
                <Text strong className="text-slate-700">{dayjs().format("DD MMMM, YYYY")}</Text>
              </div>
            </div>
          </div>

          {/* --- Stats Cards --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Bookings */}
            <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} className="h-full">
              <Link to="/admin/booking-entry">
                <Card
                  bordered={false}
                  className="h-full overflow-hidden relative border-0 shadow-lg shadow-blue-500/10 cursor-pointer group"
                  style={{
                    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                  }}
                >
                  <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                    <CarOutlined style={{ fontSize: '120px', color: '#fff' }} />
                  </div>
                  <div className="relative z-10 flex flex-col justify-between h-full text-white">
                    <div className="mb-4 bg-white/20 w-12 h-12 rounded-lg flex items-center justify-center backdrop-blur-sm">
                      <CarOutlined style={{ fontSize: '24px' }} />
                    </div>
                    <div>
                      <Text className="text-blue-100 text-sm font-medium uppercase tracking-wider block mb-1">Total Bookings</Text>
                      <Title level={1} style={{ color: "white", margin: 0, fontWeight: 700 }}>
                        <Statistic value={summary[0]?.TotalBookings || 0} valueStyle={{ color: '#fff', fontWeight: 700 }} />
                      </Title>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>

            {/* Pending Allotment */}
            <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} className="h-full">
              <Link to="/admin/booking-entry?allotmentStatus=Pending">
                <Card
                  bordered={false}
                  className="h-full overflow-hidden relative border-0 shadow-lg shadow-orange-500/10 cursor-pointer group"
                  style={{
                    background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                  }}
                >
                  <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                    <ClockCircleOutlined style={{ fontSize: '120px', color: '#fff' }} />
                  </div>
                  <div className="relative z-10 flex flex-col justify-between h-full text-white">
                    <div className="mb-4 bg-white/20 w-12 h-12 rounded-lg flex items-center justify-center backdrop-blur-sm">
                      <ClockCircleOutlined style={{ fontSize: '24px' }} />
                    </div>
                    <div>
                      <Text className="text-orange-100 text-sm font-medium uppercase tracking-wider block mb-1">Pending Allotment</Text>
                      <div className="flex items-baseline gap-2">
                        <Title level={1} style={{ color: "white", margin: 0, fontWeight: 700 }}>
                          {summary[0]?.PendingBusQty || 0}
                        </Title>
                        {summary[0]?.PartBooking && (
                          <span className="bg-white/20 px-2 py-1 rounded text-xs font-medium backdrop-blur-sm">
                            {summary[0]?.PartBooking} Part
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>

            {/* Pending Invoices */}
            <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} className="h-full">
              <Link to="/admin/invoiceentry">
                <Card
                  bordered={false}
                  className="h-full overflow-hidden relative border-0 shadow-lg shadow-purple-500/10 cursor-pointer group"
                  style={{
                    background: "linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)",
                  }}
                >
                  <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                    <FileTextOutlined style={{ fontSize: '120px', color: '#fff' }} />
                  </div>
                  <div className="relative z-10 flex flex-col justify-between h-full text-white">
                    <div className="mb-4 bg-white/20 w-12 h-12 rounded-lg flex items-center justify-center backdrop-blur-sm">
                      <FileTextOutlined style={{ fontSize: '24px' }} />
                    </div>
                    <div>
                      <Text className="text-purple-100 text-sm font-medium uppercase tracking-wider block mb-1">Bill Not Generated</Text>
                      <Title level={1} style={{ color: "white", margin: 0, fontWeight: 700 }}>
                        <Statistic value={summary[0]?.UninvoicedBookings || 0} valueStyle={{ color: '#fff', fontWeight: 700 }} />
                      </Title>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>

            {/* Expired Documents */}
            <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} className="h-full">
              <Card
                bordered={false}
                onClick={() => setShowExpiredDetails(!showExpiredDetails)}
                className="h-full overflow-hidden relative border-0 shadow-lg shadow-red-500/10 cursor-pointer group"
                style={{
                  background: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)",
                }}
              >
                <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                  <WarningOutlined style={{ fontSize: '120px', color: '#fff' }} />
                </div>
                <div className="relative z-10 flex flex-col justify-between h-full text-white">
                  <div className="mb-4 bg-white/20 w-12 h-12 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <WarningOutlined style={{ fontSize: '24px' }} />
                  </div>
                  <div>
                    <Text className="text-red-100 text-sm font-medium uppercase tracking-wider block mb-1">Expired Documents</Text>
                    <Title level={1} style={{ color: "white", margin: 0, fontWeight: 700 }}>
                      {expiredDocs[0]?.TotalExpiringDocuments || 0}
                    </Title>
                    <Text className="text-red-100 text-xs">
                      Across {expiredDocs[0]?.TotalBusesWithExpiringDocuments || 0} Buses
                    </Text>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* --- Expired Documents Table Section --- */}
          <motion.div
            initial={false}
            animate={{ height: showExpiredDetails ? "auto" : 0, opacity: showExpiredDetails ? 1 : 0 }}
            className="overflow-hidden"
          >
            <Card
              title={<span className="text-red-600 font-bold flex items-center gap-2"><WarningOutlined /> Expired / Expiring Documents</span>}
              extra={
                <Button type="text" onClick={() => setShowExpiredDetails(false)}>Close</Button>
              }
              className="shadow-md border-t-4 border-red-500 rounded-xl"
            >
              <Row gutter={[16, 16]} className="mb-4">
                <Col xs={24} sm={8} md={6}>
                  <Text strong className="mb-1 block text-slate-600">Bus Number</Text>
                  <Input 
                    placeholder="Search Bus No." 
                    value={expiredSearchBusNo}
                    onChange={e => setExpiredSearchBusNo(e.target.value)}
                    prefix={<SearchOutlined className="text-slate-400" />}
                    allowClear
                  />
                </Col>
                <Col xs={24} sm={8} md={6}>
                  <Text strong className="mb-1 block text-slate-600">Document Type</Text>
                  <Select
                    placeholder="Select Document Type"
                    style={{ width: '100%' }}
                    value={expiredSearchDocType}
                    onChange={setExpiredSearchDocType}
                    allowClear
                    showSearch
                  >
                    {uniqueDocTypes.map(type => (
                      <Option key={type} value={type}>{type}</Option>
                    ))}
                  </Select>
                </Col>
                <Col xs={24} sm={8} md={6}>
                  <Text strong className="mb-1 block text-slate-600">Expiry Month</Text>
                  <DatePicker 
                    picker="month" 
                    placeholder="Select Expiry Month"
                    style={{ width: '100%' }}
                    value={expiredSearchMonth}
                    onChange={setExpiredSearchMonth}
                    allowClear
                  />
                </Col>
              </Row>
              <Table
                columns={expiredDocsColumns}
                dataSource={filteredExpiredDocs}
                rowKey={(record) => `${record.BusNumber}-${record.DocumentType}`}
                loading={expiredDocsLoading}
                pagination={{ pageSize: 5 }}
                scroll={{ x: true }}
              />
            </Card>
          </motion.div>


          {/* --- Bus Availability Section --- */}
          <motion.div variants={itemVariants}>
            <Card
              bordered={false}
              className="rounded-2xl shadow-sm border border-slate-100"
              styles={{ body: { padding: '24px' } }}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <Title level={4} style={{ margin: 0, fontWeight: 700 }}>Bus Availability Check</Title>
                  <Text className="text-slate-500">Check fleet availability for a specific time range.</Text>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-6">
                <Row gutter={[24, 24]} align="bottom">
                  <Col xs={24} md={8} lg={6}>
                    <Text strong className="mb-2 block text-slate-600">Bus Category</Text>
                    <Select
                      className="w-full"
                      size="large"
                      placeholder="Select Category"
                      loading={busCategoryLoading}
                      onChange={setBusType}
                      value={busType}
                      allowClear
                      showSearch
                      optionFilterProp="children"
                    >
                      {busCategoryList?.map((item) => (
                        <Option key={item.id} value={item.id}>
                          {item.buscategory}
                        </Option>
                      ))}
                    </Select>
                  </Col>

                  <Col xs={24} md={10} lg={8}>
                    <Text strong className="mb-2 block text-slate-600">Date & Time Range</Text>
                    <RangePicker
                      showTime={{ format: "HH:mm" }}
                      format="YYYY-MM-DD HH:mm"
                      size="large"
                      className="w-full"
                      value={dateRange}
                      onChange={(dates) => setDateRange(dates)}
                      allowClear={false}
                    />
                  </Col>

                  <Col xs={24} md={6} lg={4}>
                    <Button
                      type="primary"
                      size="large"
                      icon={<SearchOutlined />}
                      onClick={handleSubmit}
                      loading={loading}
                      block
                      style={{ background: '#0f172a', borderColor: '#0f172a' }}
                      className="hover:bg-slate-800 transition-colors"
                    >
                      Check Availability
                    </Button>
                  </Col>
                </Row>
              </div>

              {/* --- Results --- */}
              {loading ? (
                <div className="py-20 text-center">
                  <Spin size="large" />
                  <Text type="secondary" className="block mt-4">Checking fleet status...</Text>
                </div>
              ) : apiError ? (
                <div className="py-10 text-center text-red-500 bg-red-50 rounded-lg border border-red-100">
                  <ExclamationCircleOutlined className="text-3xl mb-2" />
                  <div className="font-medium">{apiError}</div>
                </div>
              ) : result.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <Tag color="blue" className="px-3 py-1 text-sm">{filteredResult.length} Buses Found</Tag>
                    <Input
                      placeholder="Search results..."
                      prefix={<SearchOutlined className="text-slate-400" />}
                      className="max-w-xs rounded-lg"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      allowClear
                    />
                  </div>
                  <Table
                    columns={busAvailabilityColumns}
                    dataSource={filteredResult}
                    rowKey="BusNo"
                    pagination={{ pageSize: 10, showSizeChanger: true }}
                    scroll={{ x: true }}
                    className="border border-slate-200 rounded-lg overflow-hidden"
                    rowClassName="hover:bg-slate-50 transition-colors"
                  />
                </motion.div>
              ) : (
                <div className="py-12 text-center text-slate-400">
                  <CarOutlined style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }} />
                  <p>No availability data found. Try adjusting your filters.</p>
                </div>
              )}
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </ConfigProvider>
  );
};

export default Dashboard;
