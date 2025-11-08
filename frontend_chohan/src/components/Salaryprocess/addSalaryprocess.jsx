import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Spin,
  Table,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { loadAllDriver } from "../../redux/rtk/features/driver/driverSlice";
import {
  loadAllDriverHelperAttendance,
  updateDriverHelperAttendance,
} from "../../redux/rtk/features/driverHelperAttendance/driverHelperAttendanceSlice";
import { loadAllHelper } from "../../redux/rtk/features/helper/helperSlice";
import axios from "axios";
//new miui//
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import { loadAllBooking } from "../../redux/rtk/features/booking/bookingSlice";
import SiteSalaryprocess from "./sitesalaryprocess";
import AdvanceSalaryprocess from "./advancesalaryprocess";
import FormItem from "antd/es/form/FormItem";
import { NavLink, useNavigate } from "react-router-dom";

let empdetailsarray = [];
let m = null;
let a = 0;
let duction = 0;
// let sitenewlist=[];

const Addsalaryprocess = () => {
  //value//
  const [advlist1, setAdvlist1] = useState([
    // Your initial data here
  ]);
  const [advlist2, setAdvlist2] = useState([]);
  const navigate = useNavigate();

  //

  const [receivedValue, setReceivedValue] = useState(null);
  const [commonId1, setcomminId] = useState();

  const handleBookingClose = (e) => {
    // Handle e here, e.g., update state or log it

    const updatedRecord = { ...e.record, advanceAdjusted: e.value };
    setReceivedValue(e.value);
    //setAdvlist2(e.record)
    setAdvlist2((prevRecords) => {
      // Check if the record exists and update or replace it
      const recordIndex = prevRecords.findIndex(
        (r) => r.AdvanceNo === e.record.AdvanceNo
      );
      if (recordIndex !== -1) {
        // Record exists, replace it
        const updatedRecords = [...prevRecords];
        updatedRecords[recordIndex] = updatedRecord;
        return updatedRecords;
      } else {
        // Record does not exist, add it to the list
        return [...prevRecords, updatedRecord];
      }
    });
    setSkipApiCall(true);
    console.log("Received e in parent:", e);
  };
  console.log(advlist1, "77766767676767");
  //iuiuiuui/
  const [DriverOrHelper, setDriverOrHelper] = useState("HELPER");
  const { Title } = Typography;
  const [selectedempname, setSelectedempname] = useState();
  const [selectedempname1, setSelectedempname1] = useState();

  const apiUrl = import.meta.env.VITE_APP_API;
  const [loading2, setLoading2] = useState(true);
  const [loading3, setLoading3] = useState(true);
  const [oldvalue, setoldvalue] = useState([]);
  const [advno, setadvno] = useState();
  const [form] = Form.useForm();
  const [error, setError] = useState(null);
  const [advlist, setadvlist] = useState([]);
  const [sitelist, setsitelist] = useState([]);
  const [sitenewlist, setsitenewlist] = useState([]);
  const [daycount, setDaycount] = useState(0);
  const [sumkhuraki, setsumkhuraliamt] = useState(0);
  const [skipApiCall, setSkipApiCall] = useState(false);
  const [months1, setMonth] = useState();
  const [daysInMonth, setDaysInMonth] = useState(dayjs().daysInMonth());

  const [form1] = Form.useForm(); // Use Form's useForm hook

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (DriverOrHelper === "HELPER") {
          const response = await axios.get(`${apiUrl}/helper`);
          setSelectedempname1(response.data.data);
          empdetailsarray = response.data.data;
        } else if (DriverOrHelper === "DRIVER") {
          const response = await axios.get(`${apiUrl}/driver`);
          setSelectedempname1(response.data.data);
          empdetailsarray = response.data.data;
        } else if (DriverOrHelper === "STAFF") {
          const response = await axios.get(`${apiUrl}/staff`);
          setSelectedempname1(response.data.data);
          empdetailsarray = response.data.data;
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading2(false);
      }
    };

    fetchData();
  }, [DriverOrHelper]);

  const handleSelectChangename = useCallback(
    (value) => {
      console.log("name change");
      setAdvlist2((prevRecords) => {
        return [];
      });
      setadvlist((prevRecords) => {
        return [];
      });

      setSelectedempname(value);
      // form.resetFields(); // Reset form fields when DriverOrHelper changes

      form.resetFields();
      setSkipApiCall(false);
    },
    [form, selectedempname, DriverOrHelper]
  );

  const handleSelectChange = useCallback(
    (value) => {
      setDriverOrHelper(value);
      form.resetFields();

      // Reset form fields when DriverOrHelper changes
    },
    [form]
  );
  useEffect(() => {
    const formattedDate = dayjs().format("MM/YYYY");
    setMonth(formattedDate);
  }, []);
  const currentDate = dayjs();

  // Initialize state with the current month and year
  const [month, setMonth1] = useState(currentDate.format("MM"));
  const [month2, setMonth2] = useState(currentDate.format("MMMM"));

  const [year, setYear] = useState(currentDate.format("YYYY"));
  console.log(month, "76676");
  const handleMonthChange = useCallback(
    (date) => {
      const formattedDate = dayjs(date).format("MM/YYYY");
      setMonth(formattedDate);
      console.log(formattedDate, "month");
      const daysInMonth = dayjs(date).daysInMonth();
      console.log(daysInMonth, "767");
      a = daysInMonth;
      setDaysInMonth(daysInMonth);
      const [formattedMonth, formattedYear] = formattedDate.split("/");

      // Storing month and year separately
      setMonth1(formattedMonth);
      setYear(formattedYear);
      const fullMonthName = dayjs(date).format("MMMM");
      const fullYear = dayjs(date).format("YYYY");
      setMonth2(fullMonthName);

      // Store full month name and year in variables
      const fullMonthYear = `${fullMonthName} ${fullYear}`;

      // Example of how you can use the fullMonthYear variable
      console.log(fullMonthYear, "Full Month and Year");

      m = formattedDate;
      form.resetFields();

      // Reset form fields when DriverOrHelper changes
      // setForm({});
    },
    [form]
  );
  useEffect(() => {
    const fetchData4 = async () => {
      try {
        if (DriverOrHelper) {
          const trimmedDate = months1.replace(/\//g, ""); // Removes all slashes globally

          const response = await axios.get(
            `${apiUrl}/driverHelperAttendance/${selectedempname}/${trimmedDate}/${DriverOrHelper}`
          );
          const data = response.data.data;
          const newList = response.data.data
            .filter((item) => item.status !== "") // Filter out items with null status
            .map((item) => {
              // Perform any transformation on item if needed
              return item;
            });

          if (newList && newList.length > 0) {
            // sitenewlist= newList;
            const sumKhurakiAmount = newList.reduce((total, item) => {
              return total + item.TotalKhurakiAmount;
            }, 0);

            const cou = newList.reduce((total, item) => {
              return total + item.StatusCount;
            }, 0);
            console.log(newList[0].daycount, "daycount");

            setDaycount(newList[0].daycount);
            a = cou;
            console.log("Sum of Khuraki Amount:", sumKhurakiAmount);
            setsumkhuraliamt(sumKhurakiAmount);
            setsitenewlist(newList);
            setsitelist(data);
          } else {
            setsumkhuraliamt(0);
            setsitenewlist([]);
            setsitelist([]);
          }
        } else {
          setsitelist([]);

          console.log("AdvanceNo is not defined", "sd");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading3(false);
      }
    };

    fetchData4();
  }, [
    DriverOrHelper,
    selectedempname,
    advno,
    oldvalue,
    months1,
    daycount,
    daysInMonth,
    apiUrl,
  ]);
  console.log(sitenewlist, "hello");
  const [earnedPtax, setEarnedPtax] = useState(0);
  const [Amountadjust, setAmountadjust] = useState(0);
  const [duc, setDuction] = useState(0);

  const handleEarnedPtaxChange = (e) => {
    // Assuming you want to update the earnedPtax state
    setEarnedPtax(e.target.value);
  };
  const handleAmountAdjust = (e) => {
    // Assuming you want to update the earnedPtax state
    setAmountadjust(e.target.value);
  };
  useEffect(() => {
    const fetchData1 = async () => {
      try {
        if (!skipApiCall) {
          // Your API call here
          let allFilteredData = [];
          let totalDuction = 0;
          const response = await axios.get(
            `${apiUrl}/AdvanceToStaffEntry/staff/${DriverOrHelper}/${selectedempname}`
          );
          allFilteredData = response.data.data;
          setAdvlist2((prevRecords) => {
            return allFilteredData;
          });
          setadvlist((prevRecords) => {
            return allFilteredData;
          });

          setDuction(totalDuction); // Set the sum of all advance amounts
        } else {
          //setSkipApiCall(false);  // Reset flag after skipping
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading3(false);
      }
    };

    fetchData1();
  }, [
    DriverOrHelper,
    selectedempname,
    advno,
    oldvalue,
    commonId1,
    DriverOrHelper,
    selectedempname,
    advno,
    daysInMonth,
    daycount,
    apiUrl,
    form,
    Amountadjust,
    receivedValue,
  ]);

  console.log(duction, "deduction", advlist);

  const fetchData3 = useCallback(async () => {
    try {
      if (selectedempname) {
        const response = await axios.get(
          `${apiUrl}/salarydetails/${DriverOrHelper}/${selectedempname}`
        );
        const dataObject = Array.from(
          new Map(response.data.data.map((item) => [item.id, item])).values()
        );
        const dataArray = Object.values(dataObject);
        const data =
          dataArray.length > 0 ? dataArray[dataArray.length - 1] : null;

        setoldvalue(dataArray);
        console.log(data, "7776666");

        const basic = data?.BASIC
          ? ((data.BASIC / daysInMonth) * daycount).toFixed(2)
          : "0";
        const hra = data?.HRA
          ? ((data.HRA / daysInMonth) * daycount).toFixed(2)
          : "0";
        const washingAllowance = data?.WashingAllowance
          ? ((data.WashingAllowance / daysInMonth) * daycount).toFixed(2)
          : "0";
        const ta = data?.TA
          ? ((data.TA / daysInMonth) * daycount).toFixed(2)
          : "0";
        const medicalAllowance = data?.MedicalAllowance
          ? ((data.MedicalAllowance / daysInMonth) * daycount).toFixed(2)
          : "0";
        const ptax = earnedPtax;
        const hpf = data?.PF
          ? ((data.PF / daysInMonth) * daycount).toFixed(2)
          : "0";
        const esic = data?.ESIC
          ? ((data.ESIC / daysInMonth) * daycount).toFixed(2)
          : "0";

        const earnedSum =
          parseFloat(basic) +
          parseFloat(hra) +
          parseFloat(washingAllowance) +
          parseFloat(ta) +
          parseFloat(medicalAllowance) +
          parseFloat(sumkhuraki);
        const ptaxValue = parseFloat(ptax) || 0;
        const hpfValue = parseFloat(hpf) || 0;
        const esicValue = parseFloat(esic) || 0;
        const advAmountValue = parseFloat(duc);
        const amountAdjustValue = parseFloat(Amountadjust) || 0;
        const earnedSumValue = parseFloat(earnedSum) || 0;
        const sum = advlist2.reduce(
          (acc, item) => acc + item.advanceAdjusted,
          0
        );
        const lessduc = ptaxValue + hpfValue + esicValue + sum;
        const totaldeduction = lessduc;
        const netsalary = (earnedSumValue - totaldeduction).toFixed(2);
        form.setFieldsValue({
          ...data,
          earnedbasic: basic,
          earnedhra: hra,
          earnedwashingAllowance: washingAllowance,
          earnedta: ta,
          earnedmedicalAllowance: medicalAllowance,
          earnedptax: ptax,
          earnedhpf: hpf,
          earnedesic: esic,
          work: daycount,
          Days: daysInMonth,
          earnedSums: earnedSum?.toFixed(2),
          lessduction: lessduc.toFixed(2) || 0,
          TotalDuduction: totaldeduction || 0,
          Netsalary: netsalary || 0,
          khoraki: sumkhuraki || 0,
        });
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading3(false);
    }
  }, [
    DriverOrHelper,
    selectedempname1,
    earnedPtax,
    loading3,
    loading2,
    selectedempname,
    daysInMonth,
    daycount,
    apiUrl,
    form,
    Amountadjust,
    receivedValue,
    advno,
    advlist1,
  ]);

  useEffect(() => {
    fetchData3();
  }, [
    fetchData3,
    DriverOrHelper,
    selectedempname,
    advno,
    daysInMonth,
    daycount,
    apiUrl,
    form,
    Amountadjust,
    receivedValue,
  ]);
  console.log(oldvalue?.AdvanceNo, "dddddd");

  // useEffect(() => {
  //   if (sitenewlist.length >= 0) {
  //     const uniqueDates = new Set();
  //     sitenewlist.forEach(item => {
  //       console.log(item.date, "siy");
  //       uniqueDates.add(item.date);
  //     });
  //     setDaycount(uniqueDates.size);
  //   }
  // }, [sitenewlist,DriverOrHelper,selectedempname]);
  console.log(advno, "76765");
  useEffect(() => {
    // Concatenate the values to create the comminId
    const id = month + year + selectedempname + DriverOrHelper;
    setcomminId(id); // Set the comminId state
  }, [month, year, selectedempname, DriverOrHelper]);
  console.log(commonId1, "iddel");
  const onFinish = async (value) => {
    console.log("Form values:", value);
    console.log("Form values:", advlist2);
    const response = await axios.post(`${apiUrl}/salarydetails/${value.id}`, {
      ID: value.id,
      empType: DriverOrHelper,
      empID: selectedempname,
      Year: year,
      Month: month,
      DaysWorked: daycount,
      DaysInMonth: daysInMonth,
      basicRate: value.BASIC,
      hraRate: value.HRA,
      medicalAllowanceRate: value.MedicalAllowance,
      washingAllowanceRate: value.WashingAllowance,
      taRate: value.TA,
      esicRate: value.ESIC,
      pfRate: value.PF,
      ptaxRate: value.PTAX,
      basic: value.earnedbasic,
      hra: value.earnedhra,
      medicalAllowance: value.earnedmedicalAllowance,
      washingAllowance: value.earnedwashingAllowance,
      ta: value.earnedta,
      ptax: value.earnedptax,
      pf: value.earnedhpf,
      esic: value.earnedesic,
      khurakiTotalAmt: sumkhuraki,
      grossSalary: value.earnedSums,
      netSalary: value.Netsalary,
      advanceAdjusted: receivedValue,
      AdvanceID: oldvalue?.AdvanceNo,
      AdvanceAmt: duction,
      AdjustAmt: receivedValue,
      iddel: month + year + selectedempname + DriverOrHelper,
      totaldeduction: value.TotalDuduction,

      Operation: 1,
      advanceList: JSON.stringify(advlist2),
    });
    if (response.data.message === "Duplicate record exists") {
      toast.error("Duplicate data!");
    } else {
      toast.success("Salary Deatils successful!");
      navigate("/admin/slarydetails");
    }

    // console.log(response, "878777787");

    // Handle form submission here
  };
  console.log(sitenewlist, "oiio");

  return (
    <div className="h-full">
      <Title level={4} className="py-3 m-3 text-center">
        Salary Process
      </Title>
      <div
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <Form.Item
          style={{
            marginBottom: "10px",
            width: "50%",
            marginRight: "10px",
            marginLeft: "60px",
          }}
          label="Driver / Helper / Staff"
          name="driverHelper1"
          rules={[{ required: true, message: "Driver / Helper is required" }]}
        >
          <Select
            onChange={handleSelectChange}
            placeholder="Select Driver/Helper"
            defaultValue={"Helper"}
          >
            <Select.Option value={"DRIVER"}>Driver</Select.Option>
            <Select.Option value={"HELPER"}>Helper</Select.Option>
            <Select.Option value={"STAFF"}>Staff</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          style={{ marginBottom: "10px", width: "50%", marginRight: "10px" }}
          label="Name"
          name=""
          rules={[{ required: true, message: "Name is required" }]}
          // form={form1} // Using useForm locally for this Form.Item
        >
          <Select
            optionFilterProp="children" // Filters options based on the content of the children (party names)
            showSearch
            onChange={handleSelectChangename}
            placeholder="Select Employee"
            defaultValue={"Select the Employee"}
          >
            {selectedempname1?.map((item, index) => (
              <Select.Option key={index} value={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          style={{ marginBottom: "10px", width: "50%", marginLeft: "10px" }}
          label="Month"
          name="month"
          rules={[{ required: true, message: "Please select a month" }]}
        >
          <DatePicker
            picker="month"
            defaultValue={dayjs()}
            format={" MM/YYYY - MMMM"}
            // suffixIcon={null}
            onChange={handleMonthChange}
            className="custom-date-picker"
          />
        </Form.Item>
      </div>

      <Form
        form={form} // Attach the form instance
        name="basic"
        layout="horizontal"
        style={{ marginLeft: "40px", marginRight: "40px" }}
        autoComplete="off"
        onFinish={onFinish}

        // initialValues={{ initValues }}
      >
        <div className="flex gap-20 ">
          <div className="w-1/2 ">
            <div className="flex">
              <style>
                {`
          // .dark-placeholder::placeholder {
            // color: #333; /* Change this to the dark color you prefer */
          // }
        // `}
              </style>
              <Form.Item
                style={{
                  marginBottom: "20px",
                  width: "35%",
                  marginLeft: "0px",
                }}
                label="Days of work"
                name="work"
              >
                <Input
                  className="ml-12 dark-placeholder"
                  readOnly
                  value={daycount}
                />
              </Form.Item>
              <Form.Item
                style={{
                  marginBottom: "20px",
                  width: "35%",
                  marginLeft: "80px",
                }}
                label="Total Days in Month"
                name="Days"
              >
                <Input
                  className="ml-12 dark-placeholder"
                  readOnly
                  value={daysInMonth}
                />
              </Form.Item>
            </div>

            <div className="flex">
              <h1 className="ml-24" style={{ width: "25%" }}>
                <strong>Rate</strong>
              </h1>
              <h1 className="">
                <strong>Earned</strong>
              </h1>
            </div>

            <div className="flex">
              <Form.Item
                style={{ marginBottom: "20px", width: "25%", marginLeft: "0" }}
                label="Basic"
                name="BASIC"
              >
                <Input className="ml-10" placeholder="" />
              </Form.Item>
              <Form.Item
                style={{
                  marginBottom: "20px",
                  width: "20%",
                  marginLeft: "50px",
                }}
                label=""
                name="earnedbasic"
              >
                <Input className="ml-12" />
              </Form.Item>
            </div>
            <div className="flex">
              <Form.Item
                style={{ marginBottom: "20px", width: "25%", marginLeft: "0" }}
                label="HRA"
                name="HRA"
              >
                <Input className="ml-10" placeholder="" />
              </Form.Item>
              <Form.Item
                style={{
                  marginBottom: "20px",
                  width: "20%",
                  marginLeft: "50px",
                }}
                label=""
                name="earnedhra"
              >
                <Input placeholder="" className="ml-12" />
              </Form.Item>
            </div>
            <div className="flex">
              <Form.Item
                style={{ marginBottom: "20px", width: "29%", marginLeft: "" }}
                label={
                  <span>
                    Washing <br /> Allowance
                  </span>
                }
                name="WashingAllowance"
              >
                <Input className="ml-2" placeholder="" />
              </Form.Item>
              <Form.Item
                style={{
                  marginBottom: "20px",
                  width: "20%",
                  marginLeft: "20px",
                }}
                label=""
                name="earnedwashingAllowance"
              >
                <Input placeholder="" className="ml-12" />
              </Form.Item>
            </div>
            <div className="flex">
              <Form.Item
                style={{ marginBottom: "20px", width: "24%", marginLeft: "0" }}
                label={<span style={{ padding: "0 3px" }}>TA</span>}
                name="TA"
              >
                <Input className="ml-12" placeholder="" />
              </Form.Item>
              <Form.Item
                style={{
                  marginBottom: "20px",
                  width: "20%",
                  marginLeft: "55px",
                }}
                label=""
                name="earnedta"
              >
                <Input placeholder="" className="ml-12" />
              </Form.Item>
            </div>
            <div className="flex">
              <Form.Item
                style={{ marginBottom: "20px", width: "29%", marginLeft: "0" }}
                label={
                  <span>
                    Medical <br /> Allowance
                  </span>
                }
                name="MedicalAllowance"
              >
                <Input className="ml-2" placeholder="" />
              </Form.Item>
              <Form.Item
                style={{
                  marginBottom: "20px",
                  width: "20%",
                  marginLeft: "20px",
                }}
                label=""
                name="earnedmedicalAllowance"
              >
                <Input placeholder="" className="ml-12" />
              </Form.Item>
            </div>
            <div className="flex">
              <Form.Item
                style={{ marginBottom: "20px", width: "29%", marginLeft: "0" }}
                label={<span>Khoraki Amt</span>}
                name="khoraki"
              >
                <Input className="ml-2" placeholder="" />
              </Form.Item>
            </div>
            <SiteSalaryprocess
              list={sitelist}
              loading={false}
              onBookingClose={""}
            />
            <div className="flex mt-5">
              <Form.Item
                style={{ marginBottom: "20px", width: "55%", marginLeft: "0" }}
                label="Total gross salary"
                name="earnedSums"
              >
                <Input className="ml-10" placeholder="" readOnly />
              </Form.Item>
            </div>
            <div className="flex mt-2">
              <Form.Item
                style={{ marginBottom: "20px", width: "55%", marginLeft: "0" }}
                label="Total Duduction"
                name="TotalDuduction"
              >
                <Input className="ml-10" placeholder="" />
              </Form.Item>
            </div>
            <div className="flex mt-2">
              <Form.Item
                style={{ marginBottom: "20px", width: "55%", marginLeft: "0" }}
                label={<span style={{ marginRight: "20px" }}>Net Salary</span>}
                name="Netsalary"
              >
                <Input className="ml-12" placeholder="" readOnlys />
              </Form.Item>
            </div>
          </div>
          <div className="w-1/2 ">
            <div className="flex">
              <style>
                {`
          // .dark-placeholder::placeholder {
            // color: #333; /* Change this to the dark color you prefer */
          // }
        // `}
              </style>
            </div>

            <div className="flex">
              {/* <Form.Item
            style={{ marginBottom: "20px", width: "25%", marginLeft: "0" }}
            label="Days of work"
            name="work"
            rules={[{ required: true, message: "Please select a month" }]}
          >
                               <Input className="ml-12" placeholder="" />           
          </Form.Item>
          <Form.Item
            style={{ marginBottom: "20px", width: "30%", marginLeft: "50px" }}
            label="Total Days in Month"
            name="Days"
            rules={[{ required: true, message: "Please select a month" }]}
          >
                               <Input placeholder="" className="ml-12" />           
          </Form.Item> */}
            </div>

            <div className="flex mt-10">
              <h1 className="ml-24" style={{ width: "25%" }}>
                <strong>Rate</strong>
              </h1>
              <h1 className="">
                <strong>Earned</strong>
              </h1>
            </div>

            <div className="flex">
              <Form.Item
                style={{ marginBottom: "20px", width: "25%", marginLeft: "0" }}
                label="P tax"
                name="PTAX"
              >
                <Input className="ml-10" placeholder="" />
              </Form.Item>
              <Form.Item
                style={{
                  marginBottom: "20px",
                  width: "20%",
                  marginLeft: "50px",
                }}
                label=""
                name="earnedptax"
              >
                <Input
                  placeholder=""
                  className="ml-12"
                  onChange={handleEarnedPtaxChange}
                />
              </Form.Item>
            </div>
            <div className="flex">
              <Form.Item
                style={{ marginBottom: "20px", width: "24%", marginLeft: "0" }}
                label={<span style={{ padding: "0 3px" }}>PF</span>}
                name="PF"
              >
                <Input className="ml-12 " placeholder="" />
              </Form.Item>
              <Form.Item
                style={{
                  marginBottom: "20px",
                  width: "20%",
                  marginLeft: "54px",
                }}
                label=""
                name="earnedhpf"
              >
                <Input placeholder="" className="ml-12" />
              </Form.Item>
            </div>

            <div className="flex">
              <Form.Item
                style={{ marginBottom: "20px", width: "25%", marginLeft: "0" }}
                label="ESIC"
                name="ESIC"
              >
                <Input className="ml-10" placeholder="" />
              </Form.Item>

              <Form.Item
                style={{
                  marginBottom: "20px",
                  width: "20%",
                  marginLeft: "50px",
                }}
                label=""
                name="earnedesic"
              >
                <Input placeholder="" className="ml-12" />
              </Form.Item>
            </div>
            <AdvanceSalaryprocess
              list={advlist2}
              loading={false}
              onBookingClose={handleBookingClose}
              commonId={commonId1}
            />

            <div className="flex mt-5">
              <Form.Item
                style={{ marginBottom: "20px", width: "55%", marginLeft: "0" }}
                label="Less Duduction"
                name="lessduction"
              >
                <Input className="ml-10" placeholder="" readOnly />
              </Form.Item>
            </div>
            {/* <Form.Item
            style={{ marginBottom: "20px", width: "55%", marginLeft: "0" }}
            label="advance Adjusted"
            name="advanceAdjusted"
          >
                               <Input className="ml-10" placeholder="" onChange={handleAmountAdjust} />           
          </Form.Item> */}

            <div className="flex gap-2">
              <Form.Item style={{ marginTop: "10px" }} className="w-full">
                <Button
                  block
                  type="primary"
                  htmlType="submit"
                  // loading={loader}
                  // onClick={() => setLoader(true)}
                >
                  Submit
                </Button>
              </Form.Item>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default Addsalaryprocess;
