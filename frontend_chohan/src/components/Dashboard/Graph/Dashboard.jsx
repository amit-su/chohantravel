// import {
//   Col,
//   Row,
//   Select,
//   DatePicker,
//   Button,
//   Table,
//   message,
//   Spin,
//   Input,
// } from "antd";
// import React, { useEffect, useState, useMemo } from "react";
// import { Navigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import checkTokenExp from "../../../utils/checkTokenExp";
// import { loadAllBusCategory } from "../../../redux/rtk/features/busCategory/busCategorySlice";
// import axios from "axios";
// import dayjs from "dayjs";
// import "antd/dist/reset.css";

// const { Option } = Select;

// const Dashboard = () => {
//   const isLogged = Boolean(localStorage.getItem("isLogged"));
//   if (!isLogged) {
//     return <Navigate to={"/admin/auth/login"} replace={true} />;
//   }

//   const accessToken = localStorage.getItem("access-token");
//   checkTokenExp(accessToken);

//   const dispatch = useDispatch();
//   const { list: busCategoryList, loading: busCategoryLoading } = useSelector(
//     (state) => state.busCategories || {}
//   );

//   // Initialize dates with proper time handling
//   const [fromDate, setFromDate] = useState(() =>
//     dayjs().startOf("month").set("hour", 0).set("minute", 0).set("second", 0)
//   );
//   const [toDate, setToDate] = useState(() =>
//     dayjs().endOf("month").set("hour", 23).set("minute", 59).set("second", 59)
//   );

//   const [busType, setBusType] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState([]);
//   const [apiError, setApiError] = useState(null);
//   const [searchText, setSearchText] = useState("");

//   useEffect(() => {
//     dispatch(loadAllBusCategory({ page: 1, count: 10000, status: true }));
//   }, [dispatch]);

//   const handleSubmit = async () => {
//     if (!busType) {
//       message.warning("Please select Bus Type");
//       return;
//     }

//     if (!fromDate || !toDate) {
//       message.warning("Please select From and To dates");
//       return;
//     }

//     if (fromDate.isAfter(toDate)) {
//       message.warning("From date cannot be after To date");
//       return;
//     }

//     setLoading(true);
//     setApiError(null);

//     try {
//       const response = await axios.post(
//         "http://localhost:5000/v1/dashboard/stock",
//         {
//           InputBusTypeID: busType,
//           InputStartDateTime: fromDate.format("YYYY-MM-DD HH:mm:ss"),
//           InputEndDateTime: toDate.format("YYYY-MM-DD HH:mm:ss"),
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         }
//       );

//       if (response.data?.data) {
//         setResult(Array.isArray(response.data.data) ? response.data.data : []);
//       } else {
//         setResult([]);
//         message.info("No data available for the selected criteria");
//       }
//     } catch (error) {
//       console.error("API Error:", error);
//       const errorMessage =
//         error.response?.data?.message ||
//         error.message ||
//         "Unknown error occurred";
//       setApiError(errorMessage);
//       message.error(`Failed to fetch data: ${errorMessage}`);
//       setResult([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredResult = useMemo(() => {
//     if (!searchText) return result;
//     const searchLower = searchText.toLowerCase();
//     return result.filter(
//       (item) =>
//         item.BusNo?.toLowerCase().includes(searchLower) ||
//         item.AvailabilityStatus?.toLowerCase().includes(searchLower)
//     );
//   }, [searchText, result]);

//   const columns = [
//     {
//       title: "Sl. No",
//       key: "index",
//       render: (_, __, index) => index + 1,
//       width: 80,
//     },
//     {
//       title: "Bus No",
//       dataIndex: "BusNo",
//       key: "BusNo",
//       sorter: (a, b) => (a.BusNo || "").localeCompare(b.BusNo || ""),
//     },
//     {
//       title: "Seating Capacity",
//       dataIndex: "sittingCapacity",
//       key: "SeatingCapacity",
//     },
//     {
//       title: "Availability",
//       dataIndex: "AvailabilityStatus",
//       key: "AvailabilityStatus",
//       render: (status) => (
//         <span
//           className={`font-semibold ${
//             status === "Available" ? "text-green-600" : "text-red-600"
//           }`}
//         >
//           {status || "N/A"}
//         </span>
//       ),
//     },
//   ];

//   return (
//     <div className="container px-4 mx-auto">
//       <div className="p-4 mb-5 bg-white rounded shadow-sm">
//         <h2 className="mb-4 text-lg font-semibold">Bus Inquiry</h2>
//         <Row gutter={[16, 16]} align="middle">
//           <Col xs={24} sm={12} md={8} lg={6}>
//             <Select
//               showSearch
//               placeholder="Select Bus Category"
//               onChange={setBusType}
//               value={busType}
//               optionFilterProp="children"
//               className="w-full"
//               allowClear
//               loading={busCategoryLoading}
//               filterOption={(input, option) =>
//                 (option.children || "")
//                   .toLowerCase()
//                   .includes(input.toLowerCase())
//               }
//             >
//               {busCategoryList?.map((category) => (
//                 <Option key={category.id} value={category.id}>
//                   {category.buscategory}
//                 </Option>
//               ))}
//             </Select>
//           </Col>

//           <Col xs={24} sm={12} md={8} lg={6}>
//             <DatePicker
//               showTime={{
//                 format: "HH:mm",
//                 defaultValue: dayjs().set("hour", 0).set("minute", 0),
//               }}
//               format="YYYY-MM-DD HH:mm"
//               value={fromDate}
//               onSelect={(date) => {
//                 if (date) {
//                   const newDate = date.set("second", 0); // optional for precision
//                   setFromDate(newDate);
//                 } else {
//                   setFromDate(null);
//                 }
//               }}
//               onOk={(value) => {
//                 setFromDate(value);
//               }}
//               placeholder="From Date"
//               className="w-full"
//               disabledDate={(current) =>
//                 current && toDate && current.isAfter(toDate)
//               }
//             />
//           </Col>

//           <Col xs={24} sm={12} md={8} lg={6}>
//             <DatePicker
//               showTime={{
//                 format: "HH:mm",
//                 defaultValue: dayjs().set("hour", 23).set("minute", 59),
//               }}
//               format="YYYY-MM-DD HH:mm"
//               value={toDate}
//               onSelect={(date) => {
//                 if (date) {
//                   const newDate = date
//                     .set("hour", toDate ? toDate.hour() : 23)
//                     .set("minute", toDate ? toDate.minute() : 59);
//                   setToDate(newDate);
//                 } else {
//                   setToDate(null);
//                 }
//               }}
//               onOk={(value) => {
//                 setToDate(value);
//               }}
//               placeholder="To Date"
//               className="w-full"
//               disabledDate={(current) =>
//                 current && fromDate && current.isBefore(fromDate)
//               }
//             />
//           </Col>

//           <Col xs={24} sm={12} md={6} lg={4}>
//             <Button
//               type="primary"
//               onClick={handleSubmit}
//               loading={loading}
//               disabled={!busType || !fromDate || !toDate}
//               block
//             >
//               Check Availability
//             </Button>
//           </Col>
//         </Row>

//         {loading && (
//           <div className="mt-4 text-center">
//             <Spin size="large" tip="Loading bus availability data..." />
//           </div>
//         )}

//         {apiError && (
//           <div className="p-3 mt-4 text-red-700 bg-red-100 border border-red-400 rounded">
//             Error: {apiError}
//           </div>
//         )}

//         {!loading && result.length > 0 && (
//           <>
//             <div className="my-4">
//               <Input
//                 placeholder="Search by Bus No or Status"
//                 onChange={(e) => setSearchText(e.target.value)}
//                 value={searchText}
//                 allowClear
//                 style={{ maxWidth: 300 }}
//               />
//             </div>

//             <Table
//               className="mt-4"
//               columns={columns}
//               dataSource={filteredResult}
//               rowKey="BusNo"
//               pagination={{
//                 pageSize: 10,
//                 showSizeChanger: true,
//                 pageSizeOptions: ["10", "20", "50", "100"],
//               }}
//               bordered
//               scroll={{ x: true }}
//             />
//           </>
//         )}

//         {!loading && result.length === 0 && !apiError && (
//           <div className="p-3 mt-4 text-blue-700 bg-blue-100 border border-blue-400 rounded">
//             No bus availability data found for the selected criteria.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

// import { Col, Row, Select, Button, Table, message, Spin, Input } from "antd";
// import React, { useEffect, useState, useMemo } from "react";
// import { Navigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import checkTokenExp from "../../../utils/checkTokenExp";
// import { loadAllBusCategory } from "../../../redux/rtk/features/busCategory/busCategorySlice";
// import axios from "axios";
// import dayjs from "dayjs";
// import DateTimePicker from "react-datetime-picker";

// import "react-datetime-picker/dist/DateTimePicker.css";
// import "react-calendar/dist/Calendar.css";
// import "react-clock/dist/Clock.css";

// const { Option } = Select;

// const Dashboard = () => {
//   const isLogged = Boolean(localStorage.getItem("isLogged"));
//   if (!isLogged) {
//     return <Navigate to={"/admin/auth/login"} replace={true} />;
//   }
//   const apiUrl = import.meta.env.VITE_APP_API;

//   const accessToken = localStorage.getItem("access-token");
//   checkTokenExp(accessToken);

//   const dispatch = useDispatch();
//   const { list: busCategoryList, loading: busCategoryLoading } = useSelector(
//     (state) => state.busCategories || {}
//   );

//   const [fromDate, setFromDate] = useState(
//     dayjs().startOf("month").set("hour", 0).set("minute", 0).toDate()
//   );
//   const [toDate, setToDate] = useState(
//     dayjs().endOf("month").set("hour", 23).set("minute", 59).toDate()
//   );
//   const [busType, setBusType] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState([]);
//   const [apiError, setApiError] = useState(null);
//   const [searchText, setSearchText] = useState("");
//   const [summary, setSummary] = useState({});

//   useEffect(() => {
//     const fetchInitialData = async () => {
//       dispatch(loadAllBusCategory({ page: 1, count: 10000, status: true }));
//       await fetchBookingSummary();
//     };

//     fetchInitialData();
//   }, [dispatch]);

//   const fetchBookingSummary = async () => {
//     try {
//       const response = await axios.get(`${apiUrl}/dashboard`);
//       const data = await axios.get(`${apiUrl}/dashboard/expired-documents`);

//       if (response?.data?.data) {
//         setSummary(response.data.data);
//       } else {
//         console.warn("Empty or invalid summary:", response?.data);
//       }
//     } catch (error) {
//       console.error("Error fetching summary:", error.message);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!busType) {
//       message.warning("Please select Bus Type");
//       return;
//     }

//     if (!fromDate || !toDate) {
//       message.warning("Please select From and To dates");
//       return;
//     }

//     if (dayjs(fromDate).isAfter(dayjs(toDate))) {
//       message.warning("From date cannot be after To date");
//       return;
//     }

//     setLoading(true);
//     setApiError(null);

//     try {
//       const response = await axios.post(
//         `${apiUrl}dashboard/stock`,
//         {
//           InputBusTypeID: busType,
//           InputStartDateTime: dayjs(fromDate).format("YYYY-MM-DD HH:mm:ss"),
//           InputEndDateTime: dayjs(toDate).format("YYYY-MM-DD HH:mm:ss"),
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//           timeout: 10000,
//         }
//       );

//       if (!response.data) {
//         throw new Error("Empty response from server");
//       }

//       if (response.data?.data) {
//         setResult(Array.isArray(response.data.data) ? response.data.data : []);
//       } else {
//         setResult([]);
//         message.info("No data available for the selected criteria");
//       }
//     } catch (error) {
//       console.error("API Error:", error);
//       const errorMessage =
//         error.response?.data?.message ||
//         error.message ||
//         "Unknown error occurred";
//       setApiError(errorMessage);
//       message.error(`Failed to fetch data: ${errorMessage}`);
//       setResult([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredResult = useMemo(() => {
//     if (!searchText) return result;
//     const searchLower = searchText.toLowerCase();
//     return result.filter(
//       (item) =>
//         item.BusNo?.toLowerCase().includes(searchLower) ||
//         item.AvailabilityStatus?.toLowerCase().includes(searchLower)
//     );
//   }, [searchText, result]);

//   const columns = [
//     {
//       title: "Sl. No",
//       key: "index",
//       render: (_, __, index) => index + 1,
//       width: 80,
//     },
//     {
//       title: "Bus No",
//       dataIndex: "BusNo",
//       key: "BusNo",
//       sorter: (a, b) => (a.BusNo || "").localeCompare(b.BusNo || ""),
//     },
//     {
//       title: "Seating Capacity",
//       dataIndex: "sittingCapacity",
//       key: "SeatingCapacity",
//     },
//     {
//       title: "Availability",
//       dataIndex: "AvailabilityStatus",
//       key: "AvailabilityStatus",
//       render: (status) => (
//         <span
//           className={`font-semibold ${
//             status === "Available" ? "text-green-600" : "text-red-600"
//           }`}
//         >
//           {status || "N/A"}
//         </span>
//       ),
//     },
//   ];

//   // return (
//   //   <div className="container px-4 mx-auto">
//   //     <div className="p-4 mb-5 bg-white rounded shadow-sm">
//   //       <h2 className="mb-4 text-lg font-semibold">Bus Inquiry</h2>
//   //       <Row gutter={[16, 16]} align="middle">
//   //         <Col xs={24} sm={12} md={8} lg={6}>
//   //           <Select
//   //             showSearch
//   //             placeholder="Select Bus Category"
//   //             onChange={setBusType}
//   //             value={busType}
//   //             optionFilterProp="children"
//   //             className="w-full"
//   //             allowClear
//   //             loading={busCategoryLoading}
//   //             disabled={loading}
//   //             filterOption={(input, option) =>
//   //               (option.children || "")
//   //                 .toLowerCase()
//   //                 .includes(input.toLowerCase())
//   //             }
//   //           >
//   //             {busCategoryList?.map((category) => (
//   //               <Option key={category.id} value={category.id}>
//   //                 {category.buscategory}
//   //               </Option>
//   //             ))}
//   //           </Select>
//   //         </Col>

//   //         <Col xs={24} sm={12} md={8} lg={6}>
//   //           <label className="block mb-1 text-sm font-medium">From Date</label>
//   //           <DateTimePicker
//   //             onChange={setFromDate}
//   //             value={fromDate}
//   //             format="y-MM-dd HH:mm"
//   //             disableClock={true}
//   //             className="w-full"
//   //             disabled={loading}
//   //           />
//   //         </Col>

//   //         <Col xs={24} sm={12} md={8} lg={6}>
//   //           <label className="block mb-1 text-sm font-medium">To Date</label>
//   //           <DateTimePicker
//   //             onChange={setToDate}
//   //             value={toDate}
//   //             format="y-MM-dd HH:mm"
//   //             disableClock={true}
//   //             className="w-full"
//   //             minDate={fromDate}
//   //             disabled={loading}
//   //           />
//   //         </Col>

//   //         <Col xs={24} sm={12} md={6} lg={4}>
//   //           <Button
//   //             type="primary"
//   //             onClick={handleSubmit}
//   //             loading={loading}
//   //             disabled={!busType || !fromDate || !toDate}
//   //             block
//   //           >
//   //             Check Availability
//   //           </Button>
//   //         </Col>
//   //       </Row>

//   //       {loading && (
//   //         <div className="mt-4 text-center">
//   //           <Spin size="large" tip="Loading bus availability data..." />
//   //         </div>
//   //       )}

//   //       {apiError && (
//   //         <div className="p-3 mt-4 text-red-700 bg-red-100 border border-red-400 rounded">
//   //           Error: {apiError}
//   //         </div>
//   //       )}

//   //       {!loading && result.length > 0 && (
//   //         <>
//   //           <div className="my-4">
//   //             <Input
//   //               placeholder="Search by Bus No or Status"
//   //               onChange={(e) => setSearchText(e.target.value)}
//   //               value={searchText}
//   //               allowClear
//   //               style={{ maxWidth: 300 }}
//   //               disabled={loading}
//   //             />
//   //           </div>

//   //           <Table
//   //             className="mt-4"
//   //             columns={columns}
//   //             dataSource={filteredResult}
//   //             rowKey="BusNo"
//   //             pagination={{
//   //               pageSize: 10,
//   //               showSizeChanger: true,
//   //               pageSizeOptions: ["10", "20", "50", "100"],
//   //             }}
//   //             bordered
//   //             scroll={{ x: true }}
//   //             loading={loading}
//   //           />
//   //         </>
//   //       )}

//   //       {!loading && result.length === 0 && !apiError && (
//   //         <div className="p-3 mt-4 text-blue-700 bg-blue-100 border border-blue-400 rounded">
//   //           No bus availability data found for the selected criteria.
//   //         </div>
//   //       )}
//   //     </div>
//   //   </div>
//   // );

//   return (
//     <div className="container px-4 mx-auto max-w-7xl">
//       <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
//         {/* Total Booking Card */}
//         <div className="p-6 overflow-hidden rounded-lg shadow-md bg-gradient-to-br from-blue-500 to-indigo-600">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-blue-100">Total Booking</p>
//               <p className="mt-1 text-3xl font-semibold text-white">
//                 {" "}
//                 {summary[0]?.TotalBookings || 0}
//                 {/* {response.TotalBookings} */}
//               </p>
//               {/* <p className="mt-1 text-sm text-blue-100">
//                 <span className="inline-flex items-center">
//                   <svg
//                     className="w-4 h-4 mr-1"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M5 10l7-7m0 0l7 7m-7-7v18"
//                     />
//                   </svg>
//                   12.5% from last month
//                 </span>
//               </p> */}
//             </div>
//             <div className="p-3 bg-white rounded-full bg-opacity-20">
//               <svg
//                 className="w-8 h-8 text-white"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
//                 />
//               </svg>
//             </div>
//           </div>
//         </div>

//         {/* Pending Allotment Card */}
//         <div className="p-6 overflow-hidden rounded-lg shadow-md bg-gradient-to-br from-amber-500 to-orange-600">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-amber-100">
//                 Pending Allotment
//               </p>
//               <p className="mt-1 text-3xl font-semibold text-white">
//                 {summary[0]?.PendingBusQty || 0}
//               </p>
//               {/* <p className="mt-1 text-sm text-amber-100">
//                 <span className="inline-flex items-center">
//                   <svg
//                     className="w-4 h-4 mr-1"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M19 14l-7 7m0 0l-7-7m7 7V3"
//                     />
//                   </svg>
//                   3.2% from last month
//                 </span>
//               </p> */}
//             </div>
//             <div className="p-3 bg-white rounded-full bg-opacity-20">
//               <svg
//                 className="w-8 h-8 text-white"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
//                 />
//               </svg>
//             </div>
//           </div>
//         </div>

//         {/* Bell Generate Card */}
//         <div className="p-6 overflow-hidden rounded-lg shadow-md bg-gradient-to-br from-purple-500 to-pink-600">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-purple-100">
//                 Bell Generate
//               </p>
//               <p className="mt-1 text-3xl font-semibold text-white">
//                 {" "}
//                 {summary[0]?.UninvoicedBookings || 0}
//               </p>
//               {/* <p className="mt-1 text-sm text-purple-100">
//                 <span className="inline-flex items-center">
//                   <svg
//                     className="w-4 h-4 mr-1"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M5 10l7-7m0 0l7 7m-7-7v18"
//                     />
//                   </svg>
//                   8.1% from last month
//                 </span>
//               </p> */}
//             </div>
//             <div className="p-3 bg-white rounded-full bg-opacity-20">
//               <svg
//                 className="w-8 h-8 text-white"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
//                 />
//               </svg>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="p-6 mb-8 bg-white rounded-lg shadow-md">
//         <h2 className="mb-6 text-2xl font-bold text-gray-800">
//           Bus Availability Inquiry
//         </h2>

//         {/* Search Form */}
//         <div className="p-6 mb-8 rounded-lg bg-gray-50">
//           <Row gutter={[24, 16]} align="middle">
//             <Col xs={24} sm={12} md={8} lg={6}>
//               <div className="mb-1">
//                 <label className="block mb-1 text-sm font-medium text-gray-700">
//                   Bus Category
//                 </label>
//                 <Select
//                   showSearch
//                   placeholder="Select Bus Category"
//                   onChange={setBusType}
//                   value={busType}
//                   optionFilterProp="children"
//                   className="w-full custom-select"
//                   allowClear
//                   loading={busCategoryLoading}
//                   disabled={loading}
//                   filterOption={(input, option) =>
//                     (option.children || "")
//                       .toLowerCase()
//                       .includes(input.toLowerCase())
//                   }
//                   dropdownClassName="custom-dropdown"
//                 >
//                   {busCategoryList?.map((category) => (
//                     <Option key={category.id} value={category.id}>
//                       {category.buscategory}
//                     </Option>
//                   ))}
//                 </Select>
//               </div>
//             </Col>

//             <Col xs={24} sm={12} md={8} lg={6}>
//               <div className="mb-1">
//                 <label className="block mb-1 text-sm font-medium text-gray-700">
//                   From Date & Time
//                 </label>
//                 <div className="custom-datetimepicker">
//                   <DateTimePicker
//                     onChange={setFromDate}
//                     value={fromDate}
//                     format="y-MM-dd HH:mm"
//                     disableClock={true}
//                     className="w-full"
//                     disabled={loading}
//                     calendarClassName="custom-calendar"
//                   />
//                 </div>
//               </div>
//             </Col>

//             <Col xs={24} sm={12} md={8} lg={6}>
//               <div className="mb-1">
//                 <label className="block mb-1 text-sm font-medium text-gray-700">
//                   To Date & Time
//                 </label>
//                 <div className="custom-datetimepicker">
//                   <DateTimePicker
//                     onChange={setToDate}
//                     value={toDate}
//                     format="y-MM-dd HH:mm"
//                     disableClock={true}
//                     className="w-full"
//                     minDate={fromDate}
//                     disabled={loading}
//                     calendarClassName="custom-calendar"
//                   />
//                 </div>
//               </div>
//             </Col>

//             <Col xs={24} sm={12} md={6} lg={4} className="flex items-end">
//               <Button
//                 type="primary"
//                 onClick={handleSubmit}
//                 loading={loading}
//                 disabled={!busType || !fromDate || !toDate}
//                 block
//                 className="h-10 bg-blue-600 border-blue-600 hover:bg-blue-700 hover:border-blue-700"
//               >
//                 Check Availability
//               </Button>
//             </Col>
//           </Row>
//         </div>

//         {/* Loading State */}
//         {loading && (
//           <div className="flex flex-col items-center justify-center p-8 my-8 rounded-lg bg-gray-50">
//             <Spin size="large" className="mb-4" />
//             <p className="text-lg font-medium text-gray-700">
//               Loading bus availability data...
//             </p>
//           </div>
//         )}

//         {/* Error State */}
//         {apiError && (
//           <div className="p-4 my-6 text-red-800 bg-red-100 border-l-4 border-red-500 rounded">
//             <div className="flex">
//               <div className="flex-shrink-0">
//                 <svg
//                   className="w-5 h-5 text-red-500"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               </div>
//               <div className="ml-3">
//                 <h3 className="text-sm font-medium text-red-800">Error</h3>
//                 <div className="mt-2 text-sm text-red-700">
//                   <p>{apiError}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Results */}
//         {!loading && result.length > 0 && (
//           <>
//             <div className="flex flex-col mb-6 space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
//               <h3 className="text-lg font-medium text-gray-900">
//                 Available Buses
//               </h3>
//               <div className="w-full sm:w-64">
//                 <Input
//                   placeholder="Search by Bus No or Status"
//                   onChange={(e) => setSearchText(e.target.value)}
//                   value={searchText}
//                   allowClear
//                   disabled={loading}
//                   prefix={<i className="mr-2 text-gray-400 fas fa-search" />}
//                   className="custom-search-input"
//                 />
//               </div>
//             </div>

//             <div className="overflow-hidden border border-gray-200 rounded-lg">
//               <Table
//                 columns={columns}
//                 dataSource={filteredResult}
//                 rowKey="BusNo"
//                 pagination={{
//                   pageSize: 1000,
//                   showSizeChanger: true,
//                   pageSizeOptions: ["10", "20", "50", "100"],
//                   className: "px-4 py-2",
//                 }}
//                 bordered
//                 scroll={{ x: true }}
//                 loading={loading}
//                 className="custom-table"
//               />
//             </div>
//           </>
//         )}

//         {/* Empty State */}
//         {!loading && result.length === 0 && !apiError && (
//           <div className="p-8 my-8 text-center rounded-lg bg-blue-50">
//             <svg
//               className="w-12 h-12 mx-auto text-blue-400"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//               />
//             </svg>
//             <h3 className="mt-4 text-lg font-medium text-gray-900">
//               No buses found
//             </h3>
//             <p className="mt-2 text-sm text-gray-600">
//               No bus availability data found for the selected criteria. Try
//               adjusting your search filters.
//             </p>
//           </div>
//         )}
//       </div>

//       {/* Add this to your CSS file */}
//       <style jsx global>{`
//         .custom-select .ant-select-selector {
//           height: 40px !important;
//           border-radius: 6px !important;
//         }

//         .custom-select .ant-select-selection-placeholder,
//         .custom-select .ant-select-selection-item {
//           display: flex;
//           align-items: center;
//         }

//         .custom-dropdown {
//           border-radius: 6px !important;
//         }

//         .custom-datetimepicker {
//           border: 1px solid #d9d9d9;
//           border-radius: 6px;
//           padding: 4px 11px;
//           height: 40px;
//         }

//         .custom-datetimepicker:hover {
//           border-color: #40a9ff;
//         }

//         .custom-datetimepicker .react-datetime-picker__wrapper {
//           border: none;
//         }

//         .custom-calendar {
//           border-radius: 6px !important;
//         }

//         .custom-search-input .ant-input {
//           height: 40px;
//           border-radius: 6px;
//         }

//         .custom-table .ant-table-thead > tr > th {
//           background-color: #f8fafc;
//           font-weight: 600;
//         }

//         .custom-table .ant-table-tbody > tr:hover > td {
//           background-color: #f8fafc !important;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Dashboard;

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
} from "antd";
import React, { useEffect, useState, useMemo } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import checkTokenExp from "../../../utils/checkTokenExp";
import { loadAllBusCategory } from "../../../redux/rtk/features/busCategory/busCategorySlice";
import axios from "axios";
import dayjs from "dayjs";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import { motion, AnimatePresence } from "framer-motion";
import UserPrivateComponent from "../../PrivacyComponent/UserPrivateComponent";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
const { Option } = Select;

const Dashboard = () => {
  // Add these animation variants at the top of your component
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

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
    hover: {
      scale: 1.03,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.98,
    },
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const expandVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.3 },
    },
  };

  const isLogged = Boolean(localStorage.getItem("isLogged"));
  if (!isLogged) {
    return <Navigate to={"/admin/auth/login"} replace={true} />;
  }
  const apiUrl = import.meta.env.VITE_APP_API;
  const accessToken = localStorage.getItem("access-token");
  checkTokenExp(accessToken);

  const dispatch = useDispatch();
  const { list: busCategoryList, loading: busCategoryLoading } = useSelector(
    (state) => state.busCategories || {}
  );

  // State for bus availability
  const [fromDate, setFromDate] = useState(
    dayjs().startOf("month").set("hour", 0).set("minute", 0).toDate()
  );
  const [toDate, setToDate] = useState(
    dayjs().endOf("month").set("hour", 23).set("minute", 59).toDate()
  );
  const [busType, setBusType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState([]);
  const [apiError, setApiError] = useState(null);
  const [searchText, setSearchText] = useState("");

  // State for expired documents
  const [summary, setSummary] = useState({});
  const [expiredDocs, setExpiredDocs] = useState([]);
  const [showExpiredDetails, setShowExpiredDetails] = useState(false);
  const [expiredDocsLoading, setExpiredDocsLoading] = useState(false);

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

  const handleSubmit = async () => {
    if (!busType) {
      message.warning("Please select Bus Type");
      return;
    }
    if (!fromDate || !toDate) {
      message.warning("Please select From and To dates");
      return;
    }
    if (dayjs(fromDate).isAfter(dayjs(toDate))) {
      message.warning("From date cannot be after To date");
      return;
    }

    setLoading(true);
    setApiError(null);

    try {
      const response = await axios.post(
        `${apiUrl}dashboard/stock`,
        {
          InputBusTypeID: busType,
          InputStartDateTime: dayjs(fromDate).format("YYYY-MM-DD HH:mm:ss"),
          InputEndDateTime: dayjs(toDate).format("YYYY-MM-DD HH:mm:ss"),
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

  const busAvailabilityColumns = [
    {
      title: "Sl. No",
      key: "index",
      render: (_, __, index) => index + 1,
      width: 80,
    },
    {
      title: "Bus No",
      dataIndex: "BusNo",
      key: "BusNo",
      sorter: (a, b) => (a.BusNo || "").localeCompare(b.BusNo || ""),
    },
    {
      title: "Seating Capacity",
      dataIndex: "sittingCapacity",
      key: "SeatingCapacity",
    },
    {
      title: "Availability",
      dataIndex: "AvailabilityStatus",
      key: "AvailabilityStatus",
      render: (status) => (
        <span
          className={`font-semibold ${
            status === "Available" ? "text-green-600" : "text-red-600"
          }`}
        >
          {status || "N/A"}
        </span>
      ),
    },
  ];

  const expiredDocsColumns = [
    { title: "Bus Number", dataIndex: "BusNumber", key: "BusNumber" },
    { title: "Bus Owner", dataIndex: "BusOwner", key: "BusOwner" },
    { title: "Document Type", dataIndex: "DocumentType", key: "DocumentType" },
    {
      title: "Expiry Date",
      dataIndex: "ExpiryDate",
      key: "ExpiryDate",
      render: (date) => dayjs(date).format("DD MMM YYYY"),
    },
    {
      title: "Status",
      key: "status",
      render: (record) => (
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${
            record.DaysLeft < 0
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {record.DaysLeft < 0 ? "Expired" : "Expiring Soon"}
        </span>
      ),
    },
    {
      title: "Days Left",
      dataIndex: "DaysLeft",
      key: "DaysLeft",
      render: (days) => (
        <span
          className={
            days < 0 ? "text-red-600 font-medium" : "text-amber-600 font-medium"
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
      width: 160,
      render: ({ id, ...record }) => (
        <UserPrivateComponent permission="delete-party">
          <Button
            disabled={record.DocumentPath === null}
            onClick={() =>
              window.open(apiUrl + "/busdocuments/file/" + record.ID)
            }
            className="bg-blue-600 border-none hover:bg-blue-700"
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
    <div className="container px-4 mx-auto max-w-7xl">
      {/* Stats Cards Row */}
      {/* Stats Cards Row with Animation */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4"
      >
        {/* Total Booking Card */}
        <motion.div
          variants={cardVariants}
          whileHover="hover"
          whileTap="tap"
          className="p-6 overflow-hidden rounded-lg shadow-md bg-gradient-to-br from-blue-500 to-indigo-600"
        >
          <Link to="/admin/booking-entry" className="block">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-100">
                  Total Booking
                </p>
                <p className="mt-1 text-3xl font-semibold text-white">
                  {summary[0]?.TotalBookings || 0}
                </p>
              </div>
              <div className="p-3 bg-white rounded-full bg-opacity-20">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Pending Allotment Card */}
        <motion.div
          variants={cardVariants}
          whileHover="hover"
          whileTap="tap"
          className="p-6 overflow-hidden rounded-lg shadow-md bg-gradient-to-br from-amber-500 to-orange-600"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-100">
                Pending Allotment
              </p>
              <p className="mt-1 text-3xl font-semibold text-white">
                {summary[0]?.PendingBusQty || 0}
              </p>
              <p className="mt-1 text-lg text-red-100">
                {summary[0]?.PartBooking} Part Booking
              </p>
            </div>
            <div className="p-3 bg-white rounded-full bg-opacity-20">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Bell Generate Card */}
        <motion.div
          variants={cardVariants}
          whileHover="hover"
          whileTap="tap"
          className="p-6 overflow-hidden rounded-lg shadow-md bg-gradient-to-br from-purple-500 to-pink-600"
        >
          <Link to="/admin/invoiceentry" className="block">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-100">
                  Bill not generated
                </p>
                <p className="mt-1 text-3xl font-semibold text-white">
                  {summary[0]?.UninvoicedBookings || 0}
                </p>
              </div>
              <div className="p-3 bg-white rounded-full bg-opacity-20">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Expired Documents Card */}
        <motion.div
          variants={cardVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={() => setShowExpiredDetails(!showExpiredDetails)}
          className="p-6 overflow-hidden rounded-lg shadow-md cursor-pointer bg-gradient-to-br from-red-500 to-rose-600"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-100">
                Expired Documents
              </p>
              <p className="mt-1 text-3xl font-semibold text-white">
                {expiredDocs[0]?.TotalExpiringDocuments || 0}
              </p>
              <p className="mt-1 text-sm text-red-100">
                Affecting {expiredDocs[0]?.TotalBusesWithExpiringDocuments || 0}{" "}
                buses
              </p>
              <p className="mt-1 text-sm text-red-100">
                {expiredDocs.filter((doc) => doc.DaysLeft < 0).length} expired,{" "}
                {expiredDocs.filter((doc) => doc.DaysLeft >= 0).length} expiring
                soon
              </p>
            </div>
            <div className="p-3 bg-white rounded-full bg-opacity-20">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Expired Documents Section */}
      {showExpiredDetails && (
        <div className="p-6 mb-8 bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Expired/Expiring Documents
            </h2>
            <Button
              type="text"
              onClick={() => setShowExpiredDetails(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Button>
          </div>

          {expiredDocsLoading ? (
            <div className="flex flex-col items-center justify-center p-8 my-8 rounded-lg bg-gray-50">
              <Spin size="large" className="mb-4" />
              <p className="text-lg font-medium text-gray-700">
                Loading document details...
              </p>
            </div>
          ) : expiredDocs.length > 0 ? (
            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <Table
                columns={expiredDocsColumns}
                dataSource={expiredDocs}
                rowKey={(record) =>
                  `${record.BusNumber}-${record.DocumentType}`
                }
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  pageSizeOptions: ["10", "20", "50", "100"],
                }}
                bordered
                scroll={{ x: true }}
              />
            </div>
          ) : (
            <div className="p-8 my-8 text-center rounded-lg bg-blue-50">
              <svg
                className="w-12 h-12 mx-auto text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No expired documents found
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                All documents are currently valid.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Bus Availability Section */}
      <div className="p-6 mb-8 bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-gray-800">
          Bus Availability Inquiry
        </h2>

        {/* Search Form */}
        <div className="p-6 mb-8 rounded-lg bg-gray-50">
          <Row gutter={[24, 16]} align="middle">
            <Col xs={24} sm={12} md={8} lg={6}>
              <div className="mb-1">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Bus Category
                </label>
                <Select
                  showSearch
                  placeholder="Select Bus Category"
                  onChange={setBusType}
                  value={busType}
                  optionFilterProp="children"
                  className="w-full custom-select"
                  allowClear
                  loading={busCategoryLoading}
                  disabled={loading}
                  filterOption={(input, option) =>
                    (option.children || "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  dropdownClassName="custom-dropdown"
                >
                  {busCategoryList?.map((category) => (
                    <Option key={category.id} value={category.id}>
                      {category.buscategory}
                    </Option>
                  ))}
                </Select>
              </div>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6}>
              <div className="mb-1">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  From Date & Time
                </label>
                <div className="custom-datetimepicker">
                  <DateTimePicker
                    onChange={setFromDate}
                    value={fromDate}
                    format="y-MM-dd HH:mm"
                    disableClock={true}
                    className="w-full"
                    disabled={loading}
                    calendarClassName="custom-calendar"
                  />
                </div>
              </div>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6}>
              <div className="mb-1">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  To Date & Time
                </label>
                <div className="custom-datetimepicker">
                  <DateTimePicker
                    onChange={setToDate}
                    value={toDate}
                    format="y-MM-dd HH:mm"
                    disableClock={true}
                    className="w-full"
                    minDate={fromDate}
                    disabled={loading}
                    calendarClassName="custom-calendar"
                  />
                </div>
              </div>
            </Col>

            <Col xs={24} sm={12} md={6} lg={4} className="flex items-end">
              <Button
                type="primary"
                onClick={handleSubmit}
                loading={loading}
                disabled={!busType || !fromDate || !toDate}
                block
                className="h-10 bg-blue-600 border-blue-600 hover:bg-blue-700 hover:border-blue-700"
              >
                Check Availability
              </Button>
            </Col>
          </Row>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center p-8 my-8 rounded-lg bg-gray-50">
            <Spin size="large" className="mb-4" />
            <p className="text-lg font-medium text-gray-700">
              Loading bus availability data...
            </p>
          </div>
        )}

        {/* Error State */}
        {apiError && (
          <div className="p-4 my-6 text-red-800 bg-red-100 border-l-4 border-red-500 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="w-5 h-5 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{apiError}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && result.length > 0 && (
          <>
            <div className="flex flex-col mb-6 space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
              <h3 className="text-lg font-medium text-gray-900">
                Available Buses
              </h3>
              <div className="w-full sm:w-64">
                <Input
                  placeholder="Search by Bus No or Status"
                  onChange={(e) => setSearchText(e.target.value)}
                  value={searchText}
                  allowClear
                  disabled={loading}
                  prefix={<i className="mr-2 text-gray-400 fas fa-search" />}
                  className="custom-search-input"
                />
              </div>
            </div>

            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <Table
                columns={busAvailabilityColumns}
                dataSource={filteredResult}
                rowKey="BusNo"
                pagination={{
                  pageSize: 1000,
                  showSizeChanger: true,
                  pageSizeOptions: ["10", "20", "50", "100"],
                  className: "px-4 py-2",
                }}
                bordered
                scroll={{ x: true }}
                loading={loading}
                className="custom-table"
              />
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && result.length === 0 && !apiError && (
          <div className="p-8 my-8 text-center rounded-lg bg-blue-50">
            <svg
              className="w-12 h-12 mx-auto text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No buses found
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              No bus availability data found for the selected criteria. Try
              adjusting your search filters.
            </p>
          </div>
        )}
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        .custom-select .ant-select-selector {
          height: 40px !important;
          border-radius: 6px !important;
        }
        .custom-select .ant-select-selection-placeholder,
        .custom-select .ant-select-selection-item {
          display: flex;
          align-items: center;
        }
        .custom-dropdown {
          border-radius: 6px !important;
        }
        .custom-datetimepicker {
          border: 1px solid #d9d9d9;
          border-radius: 6px;
          padding: 4px 11px;
          height: 40px;
        }
        .custom-datetimepicker:hover {
          border-color: #40a9ff;
        }
        .custom-datetimepicker .react-datetime-picker__wrapper {
          border: none;
        }
        .custom-calendar {
          border-radius: 6px !important;
        }
        .custom-search-input .ant-input {
          height: 40px;
          border-radius: 6px;
        }
        .custom-table .ant-table-thead > tr > th {
          background-color: #f8fafc;
          font-weight: 600;
        }
        .custom-table .ant-table-tbody > tr:hover > td {
          background-color: #f8fafc !important;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
