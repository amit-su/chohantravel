import { Link } from "react-router-dom";

import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  Card,
  Table,
  Form,
  Select,
  InputNumber,
  DatePicker,
  Button,
  Input, // 💡 Imported Input component
} from "antd";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import UserPrivateComponent from "../PrivacyComponent/UserPrivateComponent";
import SimpleButton from "../Buttons/SimpleButton";
import axios from "axios";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { loadAllBookingEntry } from "../../redux/rtk/features/bookingEntry/bookingsEntrySlice";
import { useNavigate } from "react-router-dom";

const GetSalaryDetails = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmpType, setSelectedEmpType] = useState("HELPER");
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // 💡 NEW: State for search query

  const apiUrl = import.meta.env.VITE_APP_API;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loadSalaryDetails = useCallback(
    async (employeeType, month) => {
      setLoading(true);
      setError(null);
      try {
        const payload = {
          monthYear: month.format("YYYY-MM"),
          employType: employeeType,
        };

        const response = await axios.post(`${apiUrl}/salarydetails`, payload);
        setData(response.data.data || []);
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
    loadSalaryDetails(selectedEmpType, selectedMonth);
  }, [selectedEmpType, selectedMonth, loadSalaryDetails]);

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
        loadSalaryDetails(selectedEmpType, selectedMonth);
      }
    } catch (error) {
      toast.error("There was an error deleting the item!");
      console.error("Delete error:", error);
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
        // 1. Calculate Earnings (Using Math.round for integer precision for DB)
        const BASIC = Math.round(item.PerDayBasic * item.PaidDays);
        const HRA = Math.round(item.PerDayHRA * item.PaidDays);
        const MedicalAllowance = Math.round(
          item.PerDayMedicalAllowance * item.PaidDays
        );
        const WashingAllowance = Math.round(
          item.PerDayWashingAllowance * item.PaidDays
        );
        const TA = Math.round(item.PerDayTA * item.PaidDays);

        const TotalKhurakiAmt = Math.round(item.KhurakiAmt || 0);

        // 2. Gross Salary Calculation
        const GrossSalary =
          BASIC +
          HRA +
          MedicalAllowance +
          WashingAllowance +
          TA +
          TotalKhurakiAmt;

        // --- 3. Deductions: Calculated based on Gross Salary / PerDay rates ---

        // PF
        const PF = Math.round(item.PerDayPF * item.PaidDays);

        // ESIC: Based on Gross Salary * 0.0075
        const ESIC_CALC = GrossSalary * 0.0075;
        const ESIC = Math.round(ESIC_CALC);

        // PTAX: Based on Gross Salary slab
        let PTAX = 0;
        if (GrossSalary > 40000) {
          PTAX = 200;
        } else if (GrossSalary > 25000) {
          PTAX = 150;
        } else if (GrossSalary > 15000) {
          PTAX = 130;
        } else if (GrossSalary > 10000) {
          PTAX = 110;
        }

        // Total Deductions
        const totaldeduction =
          ESIC + PF + PTAX + Math.round(item.AdvanceAdjusted || 0);

        // Net Salary
        const NetSalary = GrossSalary - totaldeduction;

        // Unique ID combination
        const iddel = `${item.SalaryMonth}${item.SalaryYear}${item.EmployeeID}${item.employType}`;

        return {
          empType: item.employType,
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
          AdvanceAdjusted: Math.round(item.AdvanceAdjusted || 0),
          KhurakiTotalAmt: TotalKhurakiAmt,
          GrossSalary,
          NetSalary: Math.round(NetSalary),
          amountadjust: Math.round(item.AdvanceAdjusted || 0),
          iddel,
          totaldeduction,
        };
      });

      console.log("payload", payload);

      const response = await axios.post(
        `${apiUrl}/salarydetails/save`,
        payload
      );

      if (response.status === 200) {
        toast.success("Salary details saved successfully!");
        setSelectedRowKeys([]);
        loadSalaryDetails(selectedEmpType, selectedMonth);
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
        render: (text) => Math.round(+text || 0),
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
        render: (text, record) => Math.round(record.PerDayPF * record.PaidDays),
      },
      {
        id: 4,
        title: "ESIC",
        dataIndex: "PerDayESIC",
        key: "ESIC_Deduction",
        width: 70,
        align: "right",
        render: (text, record) => {
          const basic = record.PerDayBasic * record.PaidDays;
          const hra = record.PerDayHRA * record.PaidDays;
          const ta = record.PerDayTA * record.PaidDays;
          const medical = record.PerDayMedicalAllowance * record.PaidDays;
          const washing = record.PerDayWashingAllowance * record.PaidDays;
          const khuraki = record.KhurakiAmt || 0;
          return (
            (basic + hra + ta + medical + washing + khuraki) *
            0.0075
          ).toFixed(2);
        },
      },
      {
        id: 8,
        title: "P Tax",
        dataIndex: "PerDayPTAX",
        key: "PTAX_Deduction",
        width: 70,
        align: "right",
        render: (text, record) => {
          const grossSalary =
            record.PerDayBasic * record.PaidDays +
            record.PerDayHRA * record.PaidDays +
            record.PerDayTA * record.PaidDays +
            record.PerDayMedicalAllowance * record.PaidDays +
            record.PerDayWashingAllowance * record.PaidDays +
            (record.KhurakiAmt || 0);

          if (grossSalary <= 10000) {
            return 0;
          } else if (grossSalary <= 15000) {
            return 110;
          } else if (grossSalary <= 25000) {
            return 130;
          } else if (grossSalary <= 40000) {
            return 150;
          } else {
            return 200;
          }
        },
      },
      {
        id: 14,
        title: "Advance Due",
        dataIndex: "TotalAdvanceDue",
        key: "TotalAdvanceDue",
        width: 120,
        align: "right",
      },
      {
        id: 15,
        title: "Advance Adjusted",
        dataIndex: "AdvanceAdjusted",
        key: "AdvanceAdjusted",
        width: 120,
        align: "right",
        render: (text, record) => (
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
          />
        ),
      },
      {
        id: 16,
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
          const pf = record.PerDayPF * record.PaidDays;

          // 2. ESIC: Needs to be calculated based on Gross Salary * 0.0075
          const esic = gross * 0.0075;

          // 3. P Tax: Needs to be calculated based on the P Tax slab logic
          let ptax = 0;
          if (gross > 40000) {
            ptax = 200;
          } else if (gross > 25000) {
            ptax = 150;
          } else if (gross > 15000) {
            ptax = 130;
          } else if (gross > 10000) {
            ptax = 110;
          }

          // 4. Advance Adjusted
          const advance = record.AdvanceAdjusted || 0;

          // Total Deductions
          const totalDeductions = pf + esic + ptax + advance;

          // Net Salary
          return Math.round(gross - totalDeductions);
        },
      },
      {
        id: 3,
        title: "Action",
        dataIndex: "",
        key: "action",
        fixed: "right",
        width: 100,
        render: (record) => (
          <div className="flex items-center gap-2">
            <button
              className="bg-green-600 text-white font-medium py-1 px-3 rounded hover:bg-green-700 transition duration-300 text-sm"
              onClick={() =>
                window.open(`/admin/salaryprint/${record.id}`, "_blank")
              }
              style={{ minWidth: "90px" }}
            >
              Print
            </button>
          </div>
        ),
      },
    ],
    [selectedEmpType, data, onDelete]
  );

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  useEffect(() => {
    dispatch(loadAllBookingEntry({ status: true, page: 1, count: 1000 }));
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
    </>
  );
};

export default GetSalaryDetails;
