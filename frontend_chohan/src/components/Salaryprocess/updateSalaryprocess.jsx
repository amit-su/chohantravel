import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NavLink, useNavigate } from "react-router-dom";

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

import axios from "axios";
//new miui//

import SiteSalaryprocess from "./sitesalaryprocess";
import AdvanceSalaryprocess from "./advancesalaryprocess";
import { useParams } from "react-router-dom";

let empdetailsarray = [];
let tempdata = [];
let m = null;
let a = 0;
// let sitenewlist=[];
let duction = 0;
let sumk = 0;

const Updatesalaryprocess = () => {
  //value//
  const [advlist1, setAdvlist1] = useState([
    // Your initial data here
  ]);
  //
  const { type, id2 } = useParams();

  const navigate = useNavigate();
  const [advlist2, setAdvlist2] = useState([]);
  //using Sal detals//
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/salarydetails/details/${type}/${id2}`
        );
        const uniqueDataById = new Set(
          response.data.data.map((item) => item.id)
        );
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading2(false);
      }
    };

    fetchData();
  }, []);

  //---------//

  const [receivedValue, setReceivedValue] = useState(0);

  const handleBookingClose = (e) => {
    // Handle e here, e.g., update state or log it
    const updatedRecord = { ...e.record, advanceAdjusted: e.value };

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
        const sumAdvanceAdjusted = updatedRecords.reduce((total, record) => {
          return total + (record.advanceAdjusted || 0);
        }, 0);
        setReceivedValue(sumAdvanceAdjusted);
        return updatedRecords;
      } else {
        const updatedRecords = [...prevRecords, updatedRecord];
        const sumAdvanceAdjusted = updatedRecords.reduce((total, record) => {
          return total + (record.advanceAdjusted || 0);
        }, 0);
        setReceivedValue(sumAdvanceAdjusted);
        // Record does not exist, add it to the list
        return [...prevRecords, updatedRecord];
      }
    });
  };

  //iuiuiuui/
  const [DriverOrHelper, setDriverOrHelper] = useState("HELPER");
  const { Title } = Typography;
  const [selectedempname1, setSelectedempname1] = useState();

  const apiUrl = import.meta.env.VITE_APP_API;
  const [loading2, setLoading2] = useState(true);
  const [loading3, setLoading3] = useState(true);
  const [oldvalue, setoldvalue] = useState([]);
  const [selectedempname, setSelectedempname] = useState(oldvalue?.empID);

  const [advno, setadvno] = useState();
  const [form] = Form.useForm();
  const [error, setError] = useState(null);
  const [advlist, setadvlist] = useState([]);
  const [sitelist, setsitelist] = useState([]);
  const [sitenewlist, setsitenewlist] = useState([]);
  const [daycount, setDaycount] = useState(0);
  const [sumkhuraki, setsumkhuraliamt] = useState(0);

  const [months1, setMonth] = useState();
  const [daysInMonth, setDaysInMonth] = useState(dayjs().daysInMonth());

  const [form1] = Form.useForm(); // Use Form's useForm hook

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (DriverOrHelper === "HELPER") {
          const response = await axios.get(`${apiUrl}/${type}`);
          setSelectedempname1(response.data.data);
          empdetailsarray = response.data.data;
        } else if (DriverOrHelper === "DRIVER") {
          const response = await axios.get(`${apiUrl}/${type}`);
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
      setSelectedempname(value);
      // form.resetFields(); // Reset form fields when DriverOrHelper changes
      form.resetFields();
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

  const handleMonthChange = useCallback(
    (date) => {
      const formattedDate = dayjs(date).format("MM/YYYY");
      setMonth(formattedDate);

      const daysInMonth = dayjs(date).daysInMonth();

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
          const trimmedDate = oldvalue.SalaryDate.replace(/\//g, ""); // Removes all slashes globally

          const response = await axios.get(
            `${apiUrl}/driverHelperAttendance/${selectedempname}/${trimmedDate}/${type}`
          );
          const data = response.data.data;

          const newList = response.data.data
            .filter((item) => item.status !== "") // Filter out items with null status
            .map((item) => {
              // Perform any transformation on item if needed
              return item;
            });
          // sitenewlist= newList;
          const sumKhurakiAmount = newList.reduce((total, item) => {
            return total + item.TotalKhurakiAmount;
          }, 0);

          const cou = newList.reduce((total, item) => {
            return total + item.StatusCount;
          }, 0);
          sumk = sumKhurakiAmount;

          setDaycount(newList[0].daycount);
          a = newList[0].daycount;

          setsumkhuraliamt(sumKhurakiAmount);
          setsitenewlist(newList);
          setsitelist(data);
        } else {
          setsitelist([]);
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

  const [earnedPtax, setEarnedPtax] = useState(0);
  const [Amountadjust, setAmountadjust] = useState(0);

  const handleEarnedPtaxChange = (e) => {
    // Assuming you want to update the earnedPtax state
    setEarnedPtax(e.target.value);
  };
  const handleAmountAdjust = (e) => {
    // Assuming you want to update the earnedPtax state
    setAmountadjust(e.target.value);
  };
  const [basic, setBasic] = useState();
  const [earnedBasic, setEarnedBasic] = useState();
  const [hra, setHra] = useState();
  const [earnedHra, setEarnedHra] = useState();
  const [washingAllowance, setWashingAllowance] = useState();
  const [ta, setTa] = useState();
  const [medicalAllowance, setMedicalAllowance] = useState();
  const [earnedWashingAllowance, setEarnedWashingAllowance] = useState();
  const [earnedTa, setEarnedTa] = useState();
  const [earnedMedicalAllowance, setEarnedMedicalAllowance] = useState();
  const [earnedEsic, setEarnedEsic] = useState();
  const [esic, setEsic] = useState();
  const [earnedPf, setEarnedPf] = useState();
  const [pf, setPf] = useState();
  m = tempdata[0]?.GrossSalary;
  const [totalGrossSalary, setTotalGrossSalary] = useState();
  const [totalDeduction, setTotalDeduction] = useState(0);
  const [lessDeduction, setTotallessDeduction] = useState(0);
  const [netSalary, setNetSalary] = useState(0);

  useEffect(() => {
    if (basic !== null && basic !== undefined && daysInMonth && daycount) {
      const calculatedEarnedBasic = (
        ((basic || 0) / daysInMonth) *
        daycount
      ).toFixed(2);
      setEarnedBasic(calculatedEarnedBasic);
      form.setFieldsValue({ earnedbasic: calculatedEarnedBasic });
    }
  }, [basic, daysInMonth, daycount, form]);
  useEffect(() => {
    if (hra !== null && hra !== undefined && daysInMonth && daycount) {
      const calculatedEarnedHra = ((hra / daysInMonth) * daycount).toFixed(2);
      setEarnedHra(calculatedEarnedHra);
      form.setFieldsValue({ earnedhra: calculatedEarnedHra });
    }
  }, [hra, daysInMonth, daycount, form]);
  useEffect(() => {
    if (
      washingAllowance !== null &&
      washingAllowance !== undefined &&
      daysInMonth &&
      daycount
    ) {
      const calculatedEarnedWashingAllowance = (
        (washingAllowance / daysInMonth) *
        daycount
      ).toFixed(2);
      setEarnedWashingAllowance(calculatedEarnedWashingAllowance);
      form.setFieldsValue({
        earnedwashingAllowance: calculatedEarnedWashingAllowance,
      });
    }
  }, [washingAllowance, daysInMonth, daycount, form]);

  useEffect(() => {
    if (ta !== null && ta !== undefined && daysInMonth && daycount) {
      const calculatedEarnedTa = ((ta / daysInMonth) * daycount).toFixed(2);
      setEarnedTa(calculatedEarnedTa);
      form.setFieldsValue({ earnedta: calculatedEarnedTa });
    }
  }, [ta, daysInMonth, daycount, form]);

  useEffect(() => {
    if (
      medicalAllowance !== null &&
      medicalAllowance !== undefined &&
      daysInMonth &&
      daycount
    ) {
      const calculatedEarnedMedicalAllowance = (
        (medicalAllowance / daysInMonth) *
        daycount
      ).toFixed(2);
      setEarnedMedicalAllowance(calculatedEarnedMedicalAllowance);
      form.setFieldsValue({
        earnedmedicalAllowance: calculatedEarnedMedicalAllowance,
      });
    }
  }, [medicalAllowance, daysInMonth, daycount, form]);
  useEffect(() => {
    if (esic !== null && esic !== undefined && daysInMonth && daycount) {
      const calculatedEarnedEsic = ((esic / daysInMonth) * daycount).toFixed(2);
      setEarnedEsic(calculatedEarnedEsic);
      form.setFieldsValue({ earnedesic: calculatedEarnedEsic });
    }
  }, [esic, daysInMonth, daycount, form]);

  useEffect(() => {
    if (pf !== null && pf !== undefined && daysInMonth && daycount) {
      const calculatedEarnedPf = ((pf / daysInMonth) * daycount).toFixed(2);
      setEarnedPf(calculatedEarnedPf);
      form.setFieldsValue({ earnedhpf: calculatedEarnedPf });
    }
  }, [pf, daysInMonth, daycount, form]);
  useEffect(() => {
    const formValues = form.getFieldsValue();

    const total = [
      earnedBasic !== undefined
        ? parseFloat(earnedBasic)
        : parseFloat(formValues.earnedbasic) || 0,
      earnedHra !== undefined
        ? parseFloat(earnedHra)
        : parseFloat(formValues.earnedhra) || 0,
      earnedWashingAllowance !== undefined
        ? parseFloat(earnedWashingAllowance)
        : parseFloat(formValues.earnedwashingAllowance) || 0,
      earnedTa !== undefined
        ? parseFloat(earnedTa)
        : parseFloat(formValues.earnedta) || 0,
      earnedMedicalAllowance !== undefined
        ? parseFloat(earnedMedicalAllowance)
        : parseFloat(formValues.earnedmedicalAllowance) || 0,
    ]
      .reduce((acc, curr) => acc + curr, 0)
      .toFixed(2);

    setTotalGrossSalary(total);
    // form.setFieldsValue({ earnedSums: total });
  }, [
    earnedBasic,
    earnedHra,
    earnedWashingAllowance,
    earnedTa,
    earnedMedicalAllowance,
    form,
  ]);
  useEffect(() => {
    const formValues = form.getFieldsValue();
    const esicValue =
      parseFloat(earnedEsic) || parseFloat(formValues.earnedesic) || 0;
    const pfValue =
      parseFloat(earnedPf) || parseFloat(formValues.earnedhpf) || 0;
    const ptaxValue = parseFloat(earnedPtax) || 0;
    const sum = advlist2.reduce((acc, item) => acc + item.advanceAdjusted, 0);
    const totalLessDuction = (
      esicValue +
      pfValue +
      ptaxValue +
      duction +
      sum
    ).toFixed(2);
    setTotallessDeduction(totalDeduction);

    form.setFieldsValue({ lessduction: totalLessDuction });
  }, [earnedEsic, earnedPf, earnedPtax, form, duction, advlist2]);
  useEffect(() => {
    const lessDuctionValue = parseFloat(form.getFieldValue("lessduction")) || 0;
    //const total = (lessDuctionValue + parseFloat(receivedValue) || 0).toFixed(2);
    console.log("TotalDuduction", lessDuctionValue);

    setTotalDeduction(lessDuctionValue);
    form.setFieldsValue({ TotalDuduction: lessDuctionValue });
  }, [lessDeduction, receivedValue, form]);

  const handleBasicChange = (e) => {
    setBasic(parseFloat(e.target.value) || 0);
  };
  const handleHraChange = (e) => {
    setHra(parseFloat(e.target.value) || 0);
  };
  const handleWashingAllowanceChange = (e) => {
    setWashingAllowance(parseFloat(e.target.value) || 0);
  };

  const handleTaChange = (e) => {
    setTa(parseFloat(e.target.value) || 0);
  };

  const handleMedicalAllowanceChange = (e) => {
    setMedicalAllowance(parseFloat(e.target.value) || 0);
  };
  const handlePfChange = (e) => {
    setPf(parseFloat(e.target.value) || 0);
  };

  const handleEsicChange = (e) => {
    setEsic(parseFloat(e.target.value) || 0);
  };

  const fetchData3 = useCallback(async () => {
    try {
      if (!selectedempname) {
        const response = await axios.get(
          `${apiUrl}/salarydetails/details/${type}/${id2}`
        );
        const data = response.data.data;
        // const data = dataArray.length > 0 ? dataArray[dataArray.length - 1] : null;
        tempdata = data;

        setoldvalue(data[0]);

        setSelectedempname(data[0].empID);
        const basic = data[0]?.BASIC;
        const hra = data[0].HRARate;
        const washingAllowance = data[0].WashingAllowance;
        const ta = data[0].TA;
        const medicalAllowance = data[0]?.MedicalAllowance;
        const ptax = earnedPtax;
        const hpf = data[0]?.PF;
        const esic = data[0]?.ESIC;
        const sumkhuraki = data[0]?.KhurakiTotalAmt;

        const earnedSum = data[0].GrossSalary;
        const ptaxValue = parseFloat(ptax) || 0;
        const hpfValue = parseFloat(hpf) || 0;
        const esicValue = parseFloat(esic) || 0;
        const advAmountValue = parseFloat(advlist[0]?.advAmount) || 0;
        const amountAdjustValue = parseFloat(Amountadjust) || 0;
        const earnedSumValue = parseFloat(earnedSum) || 0;
        const sum = advlist2.reduce(
          (acc, item) => acc + item.advanceAdjusted,
          0
        );
        const lessduc = ptaxValue + hpfValue + esicValue + sum;
        const totaldeduction = (receivedValue || 0) + lessduc;
        const netsalary = (earnedSumValue - totaldeduction).toFixed(2);
        form.setFieldsValue({
          work: data[0].DaysWorked,

          name: data[0].empID,
          driverHelper1: data[0].empType,
          BASIC: data[0].BASICRate,
          earnedbasic: data[0].BASIC,
          HRA: data[0].HRARate,
          MedicalAllowance: data[0].MedicalAllowanceRate,
          earnedmedicalAllowance: data[0].MedicalAllowance,

          earnedhra: data[0].HRA,
          WashingAllowance: data[0].WashingAllowanceRate,
          earnedwashingAllowance: data[0].WashingAllowance,
          PTAX: data[0].PTAXRate,
          PF: data[0].PFRate,
          earnedhpf: data[0].PF,
          ESIC: data[0].ESICRate,
          earnedesic: data[0].ESIC,
          month: dayjs(data[0].SalaryDate, "MM/YYYY"),
          earnedptax: data[0].PTAX,

          TA: data[0].TARate,
          earnedta: data[0].TA,
          // earnedptax: ptax||0,
          Days: daysInMonth,
          earnedSums: earnedSum?.toFixed(2),
          lessduction: lessduc.toFixed(2) || 0,
          TotalDuduction: data[0].totaldeduction.toFixed(2) || 0,
          Netsalary: data[0].NetSalary || 0,
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
    selectedempname,
    daysInMonth,
    daycount,
    apiUrl,
    form,
    earnedPtax,
    Amountadjust,
    receivedValue,
    id2,
    type,
    daycount,
  ]);

  const recalculateEarnedValues = (workingDays) => {
    const formValues = form.getFieldsValue();
    const daysInMonthValue = daysInMonth || formValues.Days;

    // Calculate all earned values
    const earnedBasic = (
      (formValues.BASIC / daysInMonthValue) *
      workingDays
    ).toFixed(2);
    const earnedHra = (
      (formValues.HRA / daysInMonthValue) *
      workingDays
    ).toFixed(2);
    const earnedWashingAllowance = (
      (formValues.WashingAllowance / daysInMonthValue) *
      workingDays
    ).toFixed(2);
    const earnedTa = ((formValues.TA / daysInMonthValue) * workingDays).toFixed(
      2
    );
    const earnedMedicalAllowance = (
      (formValues.MedicalAllowance / daysInMonthValue) *
      workingDays
    ).toFixed(2);
    const earnedEsic = (
      (formValues.ESIC / daysInMonthValue) *
      workingDays
    ).toFixed(2);
    const earnedPf = ((formValues.PF / daysInMonthValue) * workingDays).toFixed(
      2
    );

    // Get khuraki amount safely
    const khurakiAmount = parseFloat(formValues.khoraki) || 0;
    console.log("Khuraki amount:", formValues);

    // Calculate gross salary including khuraki
    const totalGrossSalary = (
      parseFloat(earnedBasic) +
      parseFloat(earnedHra) +
      parseFloat(earnedWashingAllowance) +
      parseFloat(earnedTa) +
      parseFloat(earnedMedicalAllowance) +
      khurakiAmount
    ).toFixed(2);

    console.log("Total gross salary:", totalGrossSalary);

    // Update ALL form fields in a single setFieldsValue call
    form.setFieldsValue({
      earnedbasic: earnedBasic,
      earnedhra: earnedHra,
      earnedwashingAllowance: earnedWashingAllowance,
      earnedta: earnedTa,
      earnedmedicalAllowance: earnedMedicalAllowance,
      earnedesic: earnedEsic,
      earnedhpf: earnedPf,
      work: workingDays,
      earnedSums: totalGrossSalary, // Make sure this is included
    });

    // Update state
    setDaycount(workingDays);
    setEarnedBasic(earnedBasic);
    setEarnedHra(earnedHra);
    setEarnedWashingAllowance(earnedWashingAllowance);
    setEarnedTa(earnedTa);
    setEarnedMedicalAllowance(earnedMedicalAllowance);
    setEarnedEsic(earnedEsic);
    setEarnedPf(earnedPf);
    setTotalGrossSalary(totalGrossSalary);
  };
  useEffect(() => {
    fetchData3();
  }, [
    fetchData3,
    DriverOrHelper,
    selectedempname,
    daysInMonth,
    daycount,
    apiUrl,
    form,
    earnedPtax,
    Amountadjust,
  ]);

  useEffect(() => {
    const grossSalary = parseFloat(form.getFieldValue("earnedSums")) || 0;
    const totalDeduction =
      parseFloat(form.getFieldValue("TotalDuduction")) || 0;

    const netSalaryValue = (grossSalary - totalDeduction).toFixed(2);

    setNetSalary(netSalaryValue);
    form.setFieldsValue({
      Netsalary: netSalaryValue - oldvalue?.totaldeduction,
    });
  }, [receivedValue]);

  useEffect(() => {
    const fetchData1 = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/AdvanceToStaffEntry/staff/Edit/${id2}`
        );
        const filteredData = response.data.data;

        let totalDuction = 0;

        if (filteredData.length > 0) {
          const sumadjAmount = filteredData.reduce((total, item) => {
            return total + item.adjAmount;
          }, 0);
          totalDuction = sumadjAmount; // Summing up all advance amounts
          setadvlist(filteredData);
          setAdvlist2(filteredData);
          setDuction(totalDuction); //
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading3(false);
      }
    };

    fetchData1();
  }, [DriverOrHelper, selectedempname, advno, oldvalue]);

  const [commonId1, setcomminId] = useState();

  useEffect(() => {
    // Concatenate the values to create the comminId
    const id = month + year + selectedempname + type;
    setcomminId(id); // Set the comminId state
  }, [month, year, selectedempname, DriverOrHelper]);

  const onFinish = async (value) => {
    try {
      const response = await axios.post(
        `${apiUrl}/salarydetails/${oldvalue.id}`,
        {
          ID: oldvalue?.id,
          empType: type,
          empID: selectedempname,
          Year: year,
          Month: month,
          DaysWorked: daycount,
          DaysInMonth: daysInMonth,
          basicRate: value.BASIC.toString(),
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
          iddel: commonId1,
          totaldeduction: value.TotalDuduction,

          Operation: 2,
          advanceList: JSON.stringify(advlist2),
        }
      );

      if (response.status === 200) {
        toast.success("Salary Deatils successful!");
        navigate("/admin/slarydetails");
      }
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div className="h-full">
      <Title level={4} className="py-3 m-3 text-center">
        Salary Process
      </Title>
      <Form
        form={form} // Attach the form instance
        name="basic"
        layout="horizontal"
        style={{ marginLeft: "40px", marginRight: "40px" }}
        autoComplete="off"
        onFinish={onFinish}

        // initialValues={{ initValues }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
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
              // defaultValue={"Helper"}
              // disabled
            >
              <Select.Option value={"DRIVER"}>Driver</Select.Option>
              <Select.Option value={"HELPER"}>Helper</Select.Option>
              <Select.Option value={"Staff"}>Staff</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            style={{ marginBottom: "10px", width: "50%", marginRight: "10px" }}
            label="Name"
            name="name"
            rules={[{ required: true, message: "Name is required" }]}
            // form={form1} // Using useForm locally for this Form.Item
          >
            <Select
              onChange={handleSelectChangename}
              optionFilterProp="children" // Filters options based on the content of the children (party names)
              showSearch
              placeholder="Select Employee"
              // defaultValue={"Select the Employee"}
              // disabled
            >
              {empdetailsarray?.map((item, index) => (
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
              disabled
              defaultValue={dayjs()}
              format={" MM/YYYY - MMMM"}
              // suffixIcon={null}
              onChange={handleMonthChange}
              className="custom-date-picker"
            />
          </Form.Item>
        </div>

        <div className="flex gap-20 ml-4 ">
          <div className="w-1/2 ml-0 ">
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
                  width: "25%",
                  marginLeft: "0px",
                }}
                label="Days of work"
                name="work"
              >
                <Input
                  className="ml-12 dark-placeholder"
                  placeholder={a}
                  value={daycount}
                  onChange={(e) => {
                    const workingDays = parseInt(e.target.value) || 0;
                    recalculateEarnedValues(workingDays);
                  }}
                />
              </Form.Item>
              <Form.Item
                style={{
                  marginBottom: "20px",
                  width: "30%",
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
                <Input
                  className="ml-10"
                  placeholder=""
                  readOnly
                  onChange={handleBasicChange}
                />
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
                <Input className="ml-12" readOnly />
              </Form.Item>
            </div>
            <div className="flex">
              <Form.Item
                style={{ marginBottom: "20px", width: "25%", marginLeft: "0" }}
                label="HRA"
                name="HRA"
              >
                <Input
                  className="ml-10"
                  placeholder=""
                  readOnly
                  onChange={handleHraChange}
                />
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
                <Input placeholder="" className="ml-12" readOnly />
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
                <Input
                  className="ml-2"
                  placeholder=""
                  readOnly
                  onChange={handleWashingAllowanceChange}
                />
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
                <Input placeholder="" className="ml-12" readOnly />
              </Form.Item>
            </div>
            <div className="flex">
              <Form.Item
                style={{ marginBottom: "20px", width: "24%", marginLeft: "0" }}
                label={<span style={{ padding: "0 3px" }}>TA</span>}
                name="TA"
              >
                <Input
                  className="ml-12"
                  placeholder=""
                  readOnly
                  onChange={handleTaChange}
                />
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
                <Input placeholder="" className="ml-12" readOnly />
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
                <Input
                  className="ml-2"
                  placeholder=""
                  readOnly
                  onChange={handleMedicalAllowanceChange}
                />
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
                <Input placeholder="" className="ml-12" readOnly />
              </Form.Item>
            </div>
            <div className="flex">
              <Form.Item
                style={{ marginBottom: "20px", width: "29%", marginLeft: "0" }}
                label={<span>Khoraki Amt</span>}
                name="khoraki"
              >
                <Input
                  className="ml-2"
                  placeholder=""
                  onChange={(e) => {
                    // Get the current working days value
                    const workingDays = form.getFieldValue("work") || 0;
                    // Trigger recalculation with current working days
                    recalculateEarnedValues(workingDays);
                  }}
                />
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
          <div className="float-right w-2/2">
            <div className="flex">
              {/* <Form.Item
            style={{ marginBottom: "20px", width: "25%", marginLeft: "0" }}
            label="Days of work"
            name="work1"
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
                <Input
                  className="ml-12 "
                  placeholder=""
                  readOnly
                  onChange={handlePfChange}
                />
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
                <Input placeholder="" readOnly className="ml-12" />
              </Form.Item>
            </div>
            <div className="flex">
              <Form.Item
                style={{ marginBottom: "20px", width: "25%", marginLeft: "0" }}
                label="ESIC"
                name="ESIC"
              >
                <Input
                  className="ml-10"
                  placeholder=""
                  readOnly
                  onChange={handleEsicChange}
                />
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
                <Input placeholder="" className="ml-12" readOnly />
              </Form.Item>
            </div>
            <div className="mt-20 pt-14">
              <AdvanceSalaryprocess
                list={advlist}
                loading={false}
                onBookingClose={handleBookingClose}
                commonId={commonId1}
              />
            </div>
            <div className="flex mt-2">
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

export default Updatesalaryprocess;
