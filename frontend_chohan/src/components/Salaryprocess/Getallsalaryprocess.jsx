import { Link } from "react-router-dom";

import {
  Card,
  Table,
  Form,
  Select,
  InputNumber,
  DatePicker,
  Button,
  Input, // 💡 Imported Input component
  Modal,
  Collapse,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  MinusOutlined,
  SwapOutlined,
  SwapRightOutlined,
} from "@ant-design/icons";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import UserPrivateComponent from "../PrivacyComponent/UserPrivateComponent";
import SimpleButton from "../Buttons/SimpleButton";
import axios from "axios";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { loadAllCompany } from "../../redux/rtk/features/company/comapnySlice";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const GetSalaryDetails = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedEmpType, setSelectedEmpType] = useState("HELPER");
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // 💡 NEW: State for search query

  // Khoraki Report Modal State
  const [isKhorakiModalVisible, setIsKhorakiModalVisible] = useState(false);
  const [khorakiReportData, setKhorakiReportData] = useState([]);
  const [khorakiLoading, setKhorakiLoading] = useState(false);
  const [selectedEmployeeName, setSelectedEmployeeName] = useState("");

  // Advance Report Modal State
  const [isAdvanceModalVisible, setIsAdvanceModalVisible] = useState(false);
  const [advanceReportData, setAdvanceReportData] = useState([]);
  const [advanceLoading, setAdvanceLoading] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState(null);
  const [advanceAdjustments, setAdvanceAdjustments] = useState({});

  const apiUrl = import.meta.env.VITE_APP_API;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: companyList } = useSelector((state) => state.companies);

  const loadSalaryDetails = useCallback(
    async (employeeType, month, companyID) => {
      setLoading(true);
      setError(null);
      try {
        const payload = {
          monthYear: month.format("YYYY-MM"),
          employType: employeeType,
          CompanyID: companyID,
        };

        const response = await axios.post(`${apiUrl}/salarydetails`, payload);
        let fetchedData = response.data.data || [];

        // Auto-calculate "Default to Full Amount" for AdvanceAdjusted
        fetchedData = fetchedData.map(item => {
          let advances = item.AdvanceDetails || [];
          if (typeof advances === 'string') {
            try {
              advances = JSON.parse(advances);
            } catch (e) {
              console.error("Failed to parse AdvanceDetails on load", e);
              advances = [];
            }
          }

          // Only auto-fill if no adjustment is already saved (AdvanceAdjusted is 0/null)
          // AND there are advances to pay.
          // Wait, if we want to "show the value", we should probably sum the outstanding balance.
          // The user said "Advance Adjusted value is show".
          // If we set AdvanceAdjusted, it will be deducted from Net Salary.
          // Let's assume defaulting to FULL PAY OFF for all strictly outstanding items.

          let totalAutoAdjusted = 0;
          let detailedAdjustments = [];

          if (advances.length > 0 && (!item.AdvanceAdjusted || item.AdvanceAdjusted == 0)) {
            detailedAdjustments = advances.map(adv => ({
              advanceId: adv.ID,
              advanceAmount: adv.advanceAmount,
              AdjusAmt: adv.advanceAmount // Default to full amount
            }));
            totalAutoAdjusted = detailedAdjustments.reduce((sum, adj) => sum + adj.AdjusAmt, 0);

            return {
              ...item,
              AdvanceAdjusted: totalAutoAdjusted,
              DetailedAdjustments: detailedAdjustments,
              AdvanceDetails: advances // Ensure it's parsed
            };
          }

          return {
            ...item,
            AdvanceDetails: advances // Ensure it's parsed
          };
        });

        setData(fetchedData);
      } catch (err) {
        setError(err.message || "Failed to fetch salary details");
        toast.error(err.message || "Failed to fetch salary details");
        setData([]);
      } finally {
        setLoading(false);
      }
    },
    [apiUrl]
  );

  useEffect(() => {
    if (selectedEmpType && selectedMonth && selectedCompany) {
      loadSalaryDetails(selectedEmpType, selectedMonth, selectedCompany);
    }
  }, [selectedEmpType, selectedMonth, selectedCompany, loadSalaryDetails]);

  const handleSelectChange = useCallback((value) => {
    setSelectedEmpType(value);
  }, []);

  const handleMonthChange = (date) => {
    if (date) {
      setSelectedMonth(date);
    }
  };

  // 💡 NEW: Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // 💡 NEW: Filtered data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery) {
      return data;
    }
    const lowerCaseQuery = searchQuery.toLowerCase();

    // Filter by EmployeeName
    return data.filter(
      (item) =>
        item.EmployeeName &&
        item.EmployeeName.toLowerCase().includes(lowerCaseQuery)
    );
  }, [data, searchQuery]);

  const onDelete = async (id) => {
    console.log("Delete Payload (ID):", id); // Added console log as per previous request
    if (
      !window.confirm(
        "Are you sure you want to delete this salary detail entry?"
      )
    ) {
      return;
    }
    try {
      const response = await axios.delete(`${apiUrl}/salarydetails/${id}`);

      if (response.status === 200) {
        toast.success("Delete Details successful!");
        loadSalaryDetails(selectedEmpType, selectedMonth, selectedCompany);
      }
    } catch (error) {
      toast.error("There was an error deleting the item!");
      console.error("Delete error:", error);
    }
  };

  const handleKhorakiClick = async (record) => {
    setSelectedEmployeeName(record.EmployeeName);
    setIsKhorakiModalVisible(true);
    setKhorakiLoading(true);
    try {
      const payload = {
        month: selectedMonth.format("MM"),
        year: selectedMonth.format("YYYY"),
        empID: record.EmployeeID,
        empType: selectedEmpType,
      };
      const response = await axios.post(
        `${apiUrl}/salarydetails/khoraki-report`,
        payload
      );
      setKhorakiReportData(response.data.data || []);
    } catch (err) {
      toast.error("Failed to fetch khoraki report");
      console.error(err);
    } finally {
      setKhorakiLoading(false);
    }
  };

  const syncAdvanceTotal = (adjustments, recordId, advanceData) => {
    const totalAdjusted = Object.values(adjustments).reduce((acc, val) => acc + (val || 0), 0);

    const detailedAdjustments = advanceData.map((adv, idx) => ({
      advanceId: adv.ID,
      advanceAmount: adv.advanceAmount,
      AdjusAmt: adjustments[idx] || 0
    }));

    const newData = data.map((item) =>
      item.id === recordId
        ? { ...item, AdvanceAdjusted: Math.round(totalAdjusted), DetailedAdjustments: detailedAdjustments }
        : item
    );
    setData(newData);
  };

  const handleAdvanceClick = async (record) => {
    setSelectedEmployeeName(record.EmployeeName);
    setSelectedRecordId(record.id);
    setIsAdvanceModalVisible(true);
    // Use the AdvanceDetails directly from the record instead of fetching again
    let advances = record.AdvanceDetails || [];

    // Robust parsing if backend hasn't restarted yet
    if (typeof advances === 'string') {
      try {
        advances = JSON.parse(advances);
      } catch (e) {
        console.error("Failed to parse AdvanceDetails frontend", e);
        advances = [];
      }
    }

    setAdvanceReportData(advances);
    setAdvanceLoading(false);

    // Initialize adjustments state for each advance
    const initialAdjustments = {};
    const existingDetails = record.DetailedAdjustments || [];

    advances.forEach((adv, idx) => {
      // Try to find if we already have an adjustment for this specific advance ID
      const existingAdj = existingDetails.find(d => d.advanceId === adv.ID);
      if (existingAdj) {
        initialAdjustments[idx] = existingAdj.AdjusAmt;
      } else {
        // Default to FULL AMOUNT (Auto-fill value)
        initialAdjustments[idx] = adv.advanceAmount;
      }
    });

    setAdvanceAdjustments(initialAdjustments);

    // Always sync the total if we just created defaults
    if (existingDetails.length === 0 && advances.length > 0) {
      syncAdvanceTotal(initialAdjustments, record.id, advances);
    }
  };

  const handleSave = async () => {
    if (selectedRowKeys.length === 0) {
      toast.warn("No rows selected to save.");
      return;
    }

    setLoading(true);
    try {
      // Filter using the main 'data' state to ensure we save the actual records, not just filtered view
      const selectedData = data.filter((item) =>
        selectedRowKeys.includes(item.id)
      );

      const payload = selectedData.map((item) => {
        // 1. Calculate Raw Earnings
        const rawBasic = item.PerDayBasic * item.PaidDays;
        const rawHRA = item.PerDayHRA * item.PaidDays;
        const rawMedical = item.PerDayMedicalAllowance * item.PaidDays;
        const rawWashing = item.PerDayWashingAllowance * item.PaidDays;
        const rawTA = item.PerDayTA * item.PaidDays;
        const rawKhuraki = item.KhurakiAmt || 0;

        // 2. Gross Salary Calculation (Raw)
        const rawGrossSalary =
          rawBasic + rawHRA + rawMedical + rawWashing + rawTA + rawKhuraki;

        // Rounded components for Payload
        const BASIC = Math.round(rawBasic);
        const HRA = Math.round(rawHRA);
        const MedicalAllowance = Math.round(rawMedical);
        const WashingAllowance = Math.round(rawWashing);
        const TA = Math.round(rawTA);
        const TotalKhurakiAmt = Math.round(rawKhuraki);
        const GrossSalary = Math.round(rawGrossSalary);

        // --- 3. Deductions ---

        // PF (Raw & Rounded)
        const rawPF = item.PF_Deduction > 0 ? item.PerDayPF * item.PaidDays : 0;
        const PF = Math.round(rawPF);

        // ESIC
        let rawESIC = 0;
        let ESIC = 0;
        if (item.ESIC_Deduction > 0) {
          const empType = (item.employType || selectedEmpType || "").toUpperCase();
          let esicBaseAmount = rawGrossSalary;

          if (empType === "DRIVER") {
            // 💡 For DRIVER, exclude Khoraki from ESI calculation
            esicBaseAmount = rawGrossSalary - rawKhuraki;
          } else if (empType === "HELPER") {
            // 💡 For HELPER, include Khoraki in ESI calculation (or as per requirement)
            // Based on the ESIC column logic: if (selectedEmpType === "HELPER") { esicBaseAmount = basic + hra + ta + medical + washing + khuraki; }
            esicBaseAmount = rawGrossSalary;
          }

          rawESIC = esicBaseAmount * 0.0075;
          ESIC = Math.round(rawESIC);
        }

        // PTAX
        let PTAX = 0;
        if (item.PTAX_Deduction > 0) {
          // 💡 P Tax is calculated on (Gross Salary - Khoraki) for ALL employees
          const ptaxBaseAmount = rawGrossSalary - rawKhuraki;

          if (ptaxBaseAmount > 40000) {
            PTAX = 200;
          } else if (ptaxBaseAmount > 25000) {
            PTAX = 150;
          } else if (ptaxBaseAmount > 15000) {
            PTAX = 130;
          } else if (ptaxBaseAmount > 10000) {
            PTAX = 110;
          }
        }

        // Advance
        const rawAdvance = item.AdvanceAdjusted || 0;

        // Total Deductions (Rounded for payload field, but we use raw for Net calc if matching table exactly?)
        // Wait, table uses: Math.round(gross - totalDeductions) where totalDeductions = pf + esic + ptax + advance (all raw-ish)
        // Let's calculate Net Salary exactly like Table
        const totalDeductionsRaw = rawPF + rawESIC + PTAX + rawAdvance;
        const NetSalary = Math.round(rawGrossSalary - totalDeductionsRaw);

        // For the "totaldeduction" field in payload, we usually send the sum of rounded deductions or rounded sum?
        // Let's send the sum of the fields we are sending (PF + ESIC + PTAX + Advance) to be consistent with those fields.
        const totaldeduction = PF + ESIC + PTAX + Math.round(rawAdvance);

        // Unique ID combination
        const empType = item.employType || selectedEmpType;
        const iddel = `${item.SalaryMonth}${item.SalaryYear}${item.EmployeeID}${empType}`;

        return {
          empType: empType,
          empID: item.EmployeeID,
          SalaryMonth: item.SalaryMonth,
          SalaryYear: item.SalaryYear,
          DaysWorked: item.PaidDays,
          DaysInMonth: item.DaysInMonth,
          BASICRate: item.LatestBasicSalary,
          HRARate: item.HRA,
          MedicalAllowanceRate: item.MedicalAllowance,
          WashingAllowanceRate: item.WashingAllowance,
          TARate: item.TA,
          ESICRate: item.ESIC_Deduction,
          PFRate: item.PF_Deduction,
          PTAXRate: item.PTAX_Deduction,
          BASIC,
          HRA,
          MedicalAllowance,
          WashingAllowance,
          TA,
          ESIC,
          PF,
          PTAX,
          AdvanceAdjusted: Math.round(rawAdvance),
          KhurakiTotalAmt: TotalKhurakiAmt,
          GrossSalary,
          NetSalary, // 💡 Matches Table Logic
          amountadjust: Math.round(rawAdvance),
          iddel,
          totaldeduction,
          DetailedAdvanceAdj: item.DetailedAdjustments || [], // 💡 Added detailed adjustments
        };
      });
      console.log(payload);
      const response = await axios.post(
        `${apiUrl}/salarydetails/save`,
        payload
      );

      if (response.status === 200) {
        toast.success("Salary details saved successfully!");
        setSelectedRowKeys([]);
        loadSalaryDetails(selectedEmpType, selectedMonth, selectedCompany);
      }
    } catch (error) {
      toast.error("Failed to save salary details.");
      console.error("Save error:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const columns = useMemo(
    () => [
      {
        id: 9,
        title: "ID",
        dataIndex: "EmployeeID",
        key: "id",
        width: 30,
        fixed: "left",
      },
      {
        id: 9,
        title: "Name",
        dataIndex: "EmployeeName",
        key: "Name",
        width: 100,
        fixed: "left",
      },
      {
        id: 10,
        title: "Days of work",
        dataIndex: "PaidDays",
        key: "PaidDays",
        width: 120,
        render: (text, record) => (
          <InputNumber
            value={text}
            onChange={(value) => {
              const newData = data.map((item) =>
                item.id === record.id ? { ...item, PaidDays: value } : item
              );
              setData(newData);
            }}
          />
        ),
      },
      // ... (rest of the columns) ...
      {
        id: 1,
        title: "Basic",
        dataIndex: "PerDayBasic",
        key: "BASIC",
        width: 80,
        align: "right",
        render: (text, record) =>
          Math.round(record.PerDayBasic * record.PaidDays),
      },
      {
        id: 6,
        title: "HRA",
        dataIndex: "PerDayHRA",
        key: "HRA",
        width: 60,
        align: "right",
        render: (text, record) =>
          Math.round(record.PerDayHRA * record.PaidDays),
      },
      {
        id: 1,
        title: "TA",
        dataIndex: "PerDayTA",
        key: "TA",
        width: 70,
        align: "right",
        render: (text, record) => Math.round(record.PerDayTA * record.PaidDays),
      },
      {
        id: 7,
        title: "Medical Allowance",
        dataIndex: "PerDayMedicalAllowance",
        key: "MedicalAllowanc",
        width: 100,
        align: "right",
        render: (text, record) =>
          Math.round(record.PerDayMedicalAllowance * record.PaidDays),
      },
      {
        id: 2,
        title: "Washing Allowance",
        dataIndex: "PerDayWashingAllowance",
        key: "WashingAllowance",
        width: 110,
        align: "right",
        render: (text, record) =>
          Math.round(record.PerDayWashingAllowance * record.PaidDays),
      },
      {
        id: 12,
        title: "Khuraki Total Amount",
        dataIndex: "KhurakiAmt",
        key: "KhurakiAmt",
        width: 120,
        align: "right",
        render: (text, record) => (
          <div
            className="flex items-center justify-end gap-2 cursor-pointer text-blue-600 hover:text-blue-800"
            onClick={() => handleKhorakiClick(record)}
          >
            <span>{Math.round(+text || 0)}</span>
            <InfoCircleOutlined />
          </div>
        ),
      },
      {
        id: 13,
        title: "Gross Salary",
        key: "GrossSalary",
        width: 120,
        align: "right",
        render: (text, record) => {
          const basic = record.PerDayBasic * record.PaidDays;
          const hra = record.PerDayHRA * record.PaidDays;
          const ta = record.PerDayTA * record.PaidDays;
          const medical = record.PerDayMedicalAllowance * record.PaidDays;
          const washing = record.PerDayWashingAllowance * record.PaidDays;
          const khuraki = record.KhurakiAmt || 0;
          return Math.round(basic + hra + ta + medical + washing + khuraki);
        },
      },
      {
        id: 5,
        title: "PF",
        dataIndex: "PerDayPF",
        key: "PF_Deduction",
        width: 70,
        align: "right",
        render: (text, record) =>
          record.PF_Deduction > 0
            ? Math.round(record.PerDayPF * record.PaidDays)
            : 0,
      },
      {
        id: 4,
        title: "ESIC",
        dataIndex: "PerDayESIC",
        key: "ESIC_Deduction",
        width: 70,
        align: "right",
        render: (text, record) => {
          if (record.ESIC_Deduction > 0) {
            const basic = record.PerDayBasic * record.PaidDays;
            const hra = record.PerDayHRA * record.PaidDays;
            const ta = record.PerDayTA * record.PaidDays;
            const medical = record.PerDayMedicalAllowance * record.PaidDays;
            const washing = record.PerDayWashingAllowance * record.PaidDays;
            const khuraki = record.KhurakiAmt || 0;

            let esicBaseAmount =
              basic + hra + ta + medical + washing;

            // 💡 For HELPER, exclude Khoraki from ESI calculation
            if (selectedEmpType === "HELPER") {
              esicBaseAmount = basic + hra + ta + medical + washing + khuraki;
            }

            return Math.round(esicBaseAmount * 0.0075);
          } else {
            return 0;
          }
        }
      },
      {
        id: 8,
        title: "P Tax",
        dataIndex: "PerDayPTAX",
        key: "PTAX_Deduction",
        width: 70,
        align: "right",
        render: (text, record) => {
          if (record.PTAX_Deduction > 0) {
            const grossSalary =
              record.PerDayBasic * record.PaidDays +
              record.PerDayHRA * record.PaidDays +
              record.PerDayTA * record.PaidDays +
              record.PerDayMedicalAllowance * record.PaidDays +
              record.PerDayWashingAllowance * record.PaidDays +
              (record.KhurakiAmt || 0);

            // 💡 P Tax is calculated on (Gross Salary - Khoraki) for ALL employees
            const ptaxBaseAmount = grossSalary - (record.KhurakiAmt || 0);

            if (ptaxBaseAmount <= 10000) {
              return 0;
            } else if (ptaxBaseAmount <= 15000) {
              return 110;
            } else if (ptaxBaseAmount <= 25000) {
              return 130;
            } else if (ptaxBaseAmount <= 40000) {
              return 150;
            } else {
              return 200;
            }
          } else {
            return 0;
          }
        },
      },
      {
        id: 14,
        title: "Total Advance",
        dataIndex: "TotalAdvanceDue",
        key: "TotalAdvanceDue",
        width: 120,
        align: "right",
        render: (text, record) => (
          <div
            className="flex items-center justify-end gap-2 cursor-pointer text-blue-600 hover:text-blue-800"
            onClick={() => handleAdvanceClick(record)}
          >
            <span>{Math.round(+text || 0)}</span>
            <InfoCircleOutlined />
          </div>
        ),
      },
      {
        id: 15,
        title: "Advance Adjusted",
        dataIndex: "AdvanceAdjusted",
        key: "AdvanceAdjusted",
        width: 120,
        align: "right",
        render: (text, record) => (
          <div className="flex items-center justify-end gap-2">
            <InputNumber
              value={text}
              onChange={(value) => {
                const newData = data.map((item) =>
                  item.id === record.id
                    ? { ...item, AdvanceAdjusted: value }
                    : item
                );
                setData(newData);
              }}
              readOnly  // Added readOnly
              style={{ width: "80px", cursor: "not-allowed" }}
            />
            <InfoCircleOutlined
              className="cursor-pointer text-blue-600 hover:text-blue-800"
              onClick={() => handleAdvanceClick(record)}
            />
          </div>
        ),
      },
      {
        id: 16,
        title: "Advance Due",
        key: "RemainingAdvanceDue",
        width: 120,
        align: "right",
        render: (text, record) => {
          const remaining = (record.TotalAdvanceDue || 0) - (record.AdvanceAdjusted || 0);
          return <span>{Math.round(remaining)}</span>;
        },
      },
      {
        id: 17,
        title: "Net Salary",
        key: "NetSalary",
        width: 120,
        align: "right",
        render: (text, record) => {
          // Calculate Gross Salary components
          const basic = record.PerDayBasic * record.PaidDays;
          const hra = record.PerDayHRA * record.PaidDays;
          const ta = record.PerDayTA * record.PaidDays;
          const medical = record.PerDayMedicalAllowance * record.PaidDays;
          const washing = record.PerDayWashingAllowance * record.PaidDays;
          const khuraki = record.KhurakiAmt || 0;
          const gross = basic + hra + ta + medical + washing + khuraki;

          // --- Deductions ---

          // 1. PF: Calculated correctly as PerDayPF * PaidDays
          const pf =
            record.PF_Deduction > 0
              ? record.PerDayPF * record.PaidDays
              : 0;

          // 2. ESIC: Needs to be calculated based on Gross Salary * 0.0075
          let esic = 0;
          if (record.ESIC_Deduction > 0) {
            const empType = (selectedEmpType || "").toUpperCase();
            let esicBaseAmount = gross;

            // 💡 For DRIVER, exclude Khoraki from ESI calculation
            // 💡 For HELPER, include Khoraki in ESI calculation
            if (empType === "DRIVER") {
              esicBaseAmount = gross - (record.KhurakiAmt || 0);
            } else if (empType === "HELPER") {
              esicBaseAmount = gross;
            }

            esic = Math.round(esicBaseAmount * 0.0075);
          }

          // 3. P Tax: Needs to be calculated based on the P Tax slab logic
          let ptax = 0;
          if (record.PTAX_Deduction > 0) {
            // 💡 P Tax is calculated on (Gross Salary - Khoraki) for ALL employees
            const ptaxBaseAmount = gross - (record.KhurakiAmt || 0);

            if (ptaxBaseAmount > 40000) {
              ptax = 200;
            } else if (ptaxBaseAmount > 25000) {
              ptax = 150;
            } else if (ptaxBaseAmount > 15000) {
              ptax = 130;
            } else if (ptaxBaseAmount > 10000) {
              ptax = 110;
            }
          }

          // 4. Advance Adjusted
          const advance = record.AdvanceAdjusted || 0;

          // Total Deductions
          const totalDeductions = pf + esic + ptax + advance;

          // Net Salary
          return Math.round(gross - totalDeductions);
        },
      },
      // {
      //   id: 3,
      //   title: "Action",
      //   dataIndex: "",
      //   key: "action",
      //   fixed: "right",
      //   width: 100,
      //   render: (record) => (
      //     <div className="flex items-center gap-2">
      //       <button
      //         className="bg-green-600 text-white font-medium py-1 px-3 rounded hover:bg-green-700 transition duration-300 text-sm"
      //         onClick={() =>
      //           window.open(`/admin/salaryprint/${record.id}`, "_blank")
      //         }
      //         style={{ minWidth: "90px" }}
      //       >
      //         Print
      //       </button>
      //     </div>
      //   ),
      // },
    ],
    [selectedEmpType, data, onDelete]
  );

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  useEffect(() => {
    dispatch(loadAllCompany({ page: 1, count: 100, status: "true" }));
  }, [dispatch]);

  return (
    <>
      <div className="card card-custom mt-2">
        <div className="p-4 bg-white rounded-lg shadow-md mb-4 flex gap-4">
          <Form layout="inline" component={false}>
            <div className="flex items-center gap-4">
              <Form.Item
                label="Employee Type"
                name="employeeType"
                initialValue={"HELPER"}
                rules={[
                  { required: true, message: "Please select an employee type" },
                ]}
              >
                <Select
                  onChange={handleSelectChange}
                  style={{ width: 200 }}
                  placeholder="Select Employee Type"
                >
                  <Select.Option value={"DRIVER"}>Driver</Select.Option>
                  <Select.Option value={"HELPER"}>Helper</Select.Option>
                  <Select.Option value={"STAFF"}>Staff</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="Select Month">
                <DatePicker
                  onChange={handleMonthChange}
                  picker="month"
                  defaultValue={selectedMonth}
                  format="YYYY-MM"
                />
              </Form.Item>
              <Form.Item label="Select Company" name="company">
                <Select
                  showSearch
                  placeholder="Select Company"
                  optionFilterProp="children"
                  onChange={(value) => setSelectedCompany(value)}
                  filterOption={(input, option) =>
                    (option?.children ?? "").toLowerCase().includes(input.toLowerCase())
                  }
                  style={{ width: 200 }}
                  allowClear
                >
                  {companyList?.map((company) => (
                    <Select.Option key={company.Id} value={company.Id}>
                      {company.Name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              {/* 💡 Search Input */}
            </div>
          </Form>
        </div>

        <div className="card-body">
          <Card
            className="border md:p-6 bg-[#fafafa]"
            bodyStyle={{ padding: 0 }}
          >
            <div className="card-body">
              <div
                className=""
                bodyStyle={{ padding: 0 }}
              >
                <div className="flex items-center justify-between pb-3 px-4 md:px-0">
                  <h1 className="text-xl font-semibold text-gray-800">
                    Salary Due ({selectedEmpType})
                  </h1>
                  <div className="flex items-center gap-4">
                    {/* 💡 MOVED: Search Input is now here (using a simpler label/styling since it's not in a formal Ant Form context here) */}
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700">
                        Search Name
                      </label>
                      <Input
                        placeholder="Search by Employee Name"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        style={{ width: 250 }}
                      />
                    </div>

                    {/* Original Action Buttons */}
                    <Button
                      title="Salary Process"
                      className="bg-pink-600 text-white font-medium rounded hover:bg-pink-700 transition duration-300 text-sm"
                      onClick={() => navigate("/admin/salary")}
                    >
                      Complite Salary
                    </Button>
                    <Button
                      title={"Save"}
                      onClick={handleSave}
                      className="bg-green-600 text-white font-medium rounded hover:bg-green-700 transition duration-300 text-sm"
                    >
                      Save All
                    </Button>
                  </div>
                </div>
                {/* ... rest of the Card content ... */}
              </div>
            </div>
            {error && <p className="text-red-500 p-4">Error: {error}</p>}
            <UserPrivateComponent permission={"create-bookingEntry"}>
              <Table
                rowSelection={rowSelection}
                dataSource={filteredData}
                columns={columns}
                loading={loading}
                rowKey="id"
                pagination={false}
                scroll={{ x: 1800, y: "calc(100vh - 350px)" }}
                bordered
                size="middle"
              />
            </UserPrivateComponent>
          </Card>
        </div>
      </div>

      <Modal
        title={`Khoraki Report - ${selectedEmployeeName}`}
        open={isKhorakiModalVisible}
        onCancel={() => setIsKhorakiModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsKhorakiModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={800}
      >
        <Collapse
          defaultActiveKey={["1"]}
          expandIcon={({ isActive }) =>
            isActive ? <MinusOutlined /> : <PlusOutlined />
          }
          className="bg-white"
        >
          <Collapse.Panel header="Group Wise Summary" key="1">
            <Table
              dataSource={Object.values(
                khorakiReportData.reduce((acc, curr) => {
                  const site = curr.SiteShortName;
                  if (!acc[site]) {
                    acc[site] = {
                      SiteShortName: site,
                      TotalAmount: 0,
                      TotalDays: 0,
                    };
                  }
                  acc[site].TotalAmount += curr.TotalKhurakiAmount;
                  acc[site].TotalDays += curr.DayCount;
                  return acc;
                }, {})
              )}
              pagination={false}
              size="small"
              bordered
              scroll={{ y: 300 }}
              columns={[
                {
                  title: "Site Name",
                  dataIndex: "SiteShortName",
                  key: "SiteShortName",
                },
                {
                  title: "Total Duty",
                  dataIndex: "TotalDays",
                  key: "TotalDays",
                  align: "center",
                },
                {
                  title: "Total Amount",
                  dataIndex: "TotalAmount",
                  key: "TotalAmount",
                  align: "right",
                  render: (text) => Math.round(text),
                },
              ]}
            />
          </Collapse.Panel>

          <Collapse.Panel header="Khoraki Report (Date Wise)" key="2">
            <Table
              dataSource={khorakiReportData}
              loading={khorakiLoading}
              pagination={false}
              size="small"
              bordered
              scroll={{ y: 300 }}
              columns={[
                {
                  title: "Date",
                  dataIndex: "DutyDate",
                  key: "DutyDate",
                  render: (text) => dayjs(text).format("DD-MM-YYYY"),
                },
                {
                  title: "Site Name",
                  dataIndex: "SiteShortName",
                  key: "SiteShortName",
                },
                {
                  title: "Khuraki Amount",
                  dataIndex: "TotalKhurakiAmount",
                  key: "TotalKhurakiAmount",
                  align: "right",
                  render: (text) => Math.round(text),
                },
              ]}
              summary={(pageData) => {
                let totalAmount = 0;
                pageData.forEach(({ TotalKhurakiAmount }) => {
                  totalAmount += TotalKhurakiAmount;
                });

                return (
                  <Table.Summary.Row className="bg-gray-50 font-bold">
                    <Table.Summary.Cell index={0} colSpan={2}>
                      Full Month Total
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} align="right">
                      {Math.round(totalAmount)}
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                );
              }}
            />
          </Collapse.Panel>
        </Collapse>
      </Modal>

      <Modal
        title={`Advance Report - ${selectedEmployeeName}`}
        open={isAdvanceModalVisible}
        onCancel={() => setIsAdvanceModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsAdvanceModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={1100}
      >
        <Table
          dataSource={advanceReportData}
          loading={advanceLoading}
          pagination={false}
          size="small"
          bordered
          scroll={{ y: 400 }}
          className="advance-report-table"
          columns={[
            {
              title: <span className="whitespace-nowrap">Date</span>,
              dataIndex: "created_at",
              key: "created_at",
              render: (text) => dayjs(text).format("DD-MM-YYYY"),
              width: 110,
            },
            {
              title: <span className="whitespace-nowrap">Advance Number</span>,
              dataIndex: "AdvanceNo",
              key: "AdvanceNo",
              width: 150,
            },
            {
              title: <span className="whitespace-nowrap">Advance Given</span>,
              dataIndex: "AdvGiven",
              key: "AdvGiven",
              width: 120,
              align: "right",
              render: (text) => Math.round(text || 0),
            },
            {
              title: <span className="whitespace-nowrap">Advance Adjusted</span>,
              dataIndex: "AdvAdjusted",
              key: "AdvAdjusted",
              width: 130,
              align: "right",
              render: (text) => Math.round(text || 0),
            },
            {
              title: <span className="whitespace-nowrap">Remark</span>,
              dataIndex: "remark",
              key: "remark",
              width: 150,
            },
            {
              title: <span className="whitespace-nowrap">Due Advance Amount</span>,
              dataIndex: "advanceAmount",
              key: "advanceAmount",
              align: "right",
              width: 140,
              render: (text, record, index) => (
                <div className="flex items-center justify-end gap-2 text-blue-600 font-medium">
                  <span>{Math.round(text)}</span>
                  <SwapRightOutlined
                    className="cursor-pointer text-blue-500 hover:text-blue-700 hover:scale-125 transition-all text-xl"
                    title="Transfer to Adjusted"
                    onClick={() => {
                      const newAdjustments = { ...advanceAdjustments, [index]: record.advanceAmount };
                      setAdvanceAdjustments(newAdjustments);
                      syncAdvanceTotal(newAdjustments, selectedRecordId, advanceReportData);
                    }}
                  />
                </div>
              ),
            },
            {
              title: <span className="whitespace-nowrap">Adjusted Amount</span>,
              key: "adjusted",
              width: 130,
              align: "right",
              render: (_, __, index) => (
                <InputNumber
                  value={advanceAdjustments[index] || 0}
                  onChange={(value) => {
                    const newAdjustments = { ...advanceAdjustments, [index]: value };
                    setAdvanceAdjustments(newAdjustments);
                    syncAdvanceTotal(newAdjustments, selectedRecordId, advanceReportData);
                  }}
                  style={{ width: "100%" }}
                  size="small"
                  className="bg-blue-50"
                  placeholder="0"
                />
              ),
            },
          ]}
          summary={(pageData) => {
            let totalAdvGiven = 0;
            let totalAdvAdjustedOld = 0;
            let totalDue = 0;
            let totalAdjusted = 0;

            pageData.forEach((record, index) => {
              totalAdvGiven += (record.AdvGiven || 0);
              totalAdvAdjustedOld += (record.AdvAdjusted || 0);
              totalDue += (record.advanceAmount || 0);
              totalAdjusted += (advanceAdjustments[index] || 0);
            });

            return (
              <Table.Summary.Row className="bg-blue-50 font-bold" style={{ backgroundColor: '#e6f7ff' }}>
                <Table.Summary.Cell index={0} colSpan={2} className="text-center font-bold">
                  TOTALS
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} align="right">
                  {Math.round(totalAdvGiven)}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2} align="right">
                  {Math.round(totalAdvAdjustedOld)}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3}>
                  {/* Remark column */}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4} align="right" className="text-blue-700">
                  {Math.round(totalDue)}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5} align="right" className="text-green-700">
                  {Math.round(totalAdjusted)}
                </Table.Summary.Cell>
              </Table.Summary.Row>
            );
          }}
        />
      </Modal>
    </>
  );
};

export default GetSalaryDetails;
