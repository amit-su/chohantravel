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
} from "antd";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
// TableComponent, UserPrivateComponent, SimpleButton are likely used but not shown in import/export
// import TableComponent from "../CommonUi/TableComponent"; // Kept for context but removed from usage
import UserPrivateComponent from "../PrivacyComponent/UserPrivateComponent";
import SimpleButton from "../Buttons/SimpleButton";
import axios from "axios";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { loadAllBookingEntry } from "../../redux/rtk/features/bookingEntry/bookingsEntrySlice";
import { useNavigate } from "react-router-dom";

// Removed the unnecessary global variable slartysetdeil = [];

const GetSalaryDetails = () => {
  const [data, setData] = useState([]); // Renamed setList1 to setData for clarity
  const [loading, setLoading] = useState(true); // Renamed loading2 to loading
  const [error, setError] = useState(null);
  const [selectedEmpType, setSelectedEmpType] = useState("HELPER");
  const [selectedMonth, setSelectedMonth] = useState(dayjs()); // default to current month
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  // const [empID, setempID] = useState(0); // This state wasn't actively used in a meaningful way in the component body
  const apiUrl = import.meta.env.VITE_APP_API;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Renamed fetchData to loadSalaryDetails and wrapped it in useCallback
  const loadSalaryDetails = useCallback(
    async (employeeType, month) => {
      setLoading(true);
      setError(null);
      try {
        const payload = {
          monthYear: month.format("YYYY-MM"), // Use selected month
          employType: employeeType, // "DRIVER" | "HELPER" | "STAFF"
        };

        const response = await axios.post(`${apiUrl}/salarydetails`, payload);

        setData(response.data.data || []); // Assuming response.data.data is the array of salary details
        // Note: The original code had separate states for helperData, driverData and was setting empID which is now removed for simplification.
        // The state logic is simplified to just use a single `data` state.
      } catch (err) {
        setError(err.message || "Failed to fetch salary details");
        toast.error(err.message || "Failed to fetch salary details");
        setData([]); // Clear data on error
      } finally {
        setLoading(false);
      }
    },
    [apiUrl] // Removed setData from dependencies as it's a stable setter from useState
  );

  useEffect(() => {
    loadSalaryDetails(selectedEmpType, selectedMonth);
  }, [selectedEmpType, selectedMonth, loadSalaryDetails]);

  // Remove the list1 and slartysetdeil logic, use 'data' directly
  // const list1 = selectedEmpType === "HELPER" ? helperData : driverData;
  // slartysetdeil = list1;

  const handleSelectChange = useCallback((value) => {
    // No need for 'newtype' state
    setSelectedEmpType(value);
  }, []);

  const handleMonthChange = (date) => {
    if (date) {
      setSelectedMonth(date);
    }
  };

  const onDelete = async (id) => {
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
        // Refresh the data after deletion
        loadSalaryDetails(selectedEmpType, selectedMonth);
      }
    } catch (error) {
      toast.error("There was an error deleting the item!");
      console.error("Delete error:", error); // Keep console.error for actual errors
    }
  };

  const handleSave = async () => {
    if (selectedRowKeys.length === 0) {
      toast.warn("No rows selected to save.");
      return;
    }

    setLoading(true);
    try {
      // Filter the data to only include selected rows
      const selectedData = data.filter((item) =>
        selectedRowKeys.includes(item.id)
      );

      // The SP expects `DaysWorked`, but the frontend data has `PaidDays`.
      // We map the data to match the SP's expected field names.
      const payload = selectedData.map((item) => {
        const BASIC = Math.round(item.PerDayBasic * item.PaidDays);
        const HRA = Math.round(item.PerDayHRA * item.PaidDays);
        const MedicalAllowance = Math.round(
          item.PerDayMedicalAllowance * item.PaidDays
        );
        const WashingAllowance = Math.round(
          item.PerDayWashingAllowance * item.PaidDays
        );
        const TA = Math.round(item.PerDayTA * item.PaidDays);

        const ESIC = Math.round(item.PerDayESIC * item.PaidDays);
        const PF = Math.round(item.PerDayPF * item.PaidDays);
        const PTAX = Math.round(item.PerDayPTAX * item.PaidDays);

        const TotalKhurakiAmt = Math.round(item.KhurakiAmt || 0);

        // Gross Salary
        const GrossSalary =
          BASIC +
          HRA +
          MedicalAllowance +
          WashingAllowance +
          TA +
          TotalKhurakiAmt;

        // Total Deductions
        const totaldeduction = ESIC + PF + PTAX;

        // Net Salary
        const NetSalary =
          GrossSalary - (totaldeduction + (item.AdvanceAdjusted || 0));

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
          AdvanceAdjusted: item.AdvanceAdjusted || 0,
          KhurakiTotalAmt: TotalKhurakiAmt,
          GrossSalary,
          NetSalary,
          amountadjust: item.AdvanceAdjusted || 0,
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
        setSelectedRowKeys([]); // Clear selection after save
        loadSalaryDetails(selectedEmpType, selectedMonth); // Refresh data to confirm changes
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

  // Removed unused states/handlers: list2, setList, empID1, setempID, setHelperData, setDriverData, expandedRowKeys, setExpandedRowKeys, handleExpand

  // Use useMemo for columns to prevent unnecessary re-renders
  const columns = useMemo(
    () => [
      {
        id: 9,
        title: "ID",
        dataIndex: "EmployeeID",
        key: "id",
        width: 30,
        fixed: "left",
        // Align left for IDs
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
          const basic = record.PerDayBasic * record.PaidDays;
          const hra = record.PerDayHRA * record.PaidDays;
          const ta = record.PerDayTA * record.PaidDays;
          const medical = record.PerDayMedicalAllowance * record.PaidDays;
          const washing = record.PerDayWashingAllowance * record.PaidDays;
          const khuraki = record.KhurakiAmt || 0;
          const gross = basic + hra + ta + medical + washing + khuraki;
          const pf = record.PerDayPF * record.PaidDays;
          const esic = record.PerDayESIC * record.PaidDays;
          const ptax = record.PerDayPTAX * record.PaidDays;
          const advance = record.AdvanceAdjusted || 0;
          return Math.round(gross - (pf + esic + ptax + advance));
        },
      },
      // {
      //   id: 3,
      //   title: "Action",
      //   dataIndex: "",
      //   key: "action",
      //   fixed: "right",
      //   width: 100, // Increased width to accommodate all buttons
      //   render: (record) => (
      //     <div className="flex items-center gap-2">
      //       {/* <UserPrivateComponent permission="update-driver">
      //         <Link
      //           to={`/admin/updateslaryprocess/${selectedEmpType}/${record.id}`}
      //         >
      //           <EditOutlined
      //             className="bg-blue-500 p-2 text-white rounded-md hover:bg-blue-600 transition duration-300"
      //             style={{ fontSize: "15px", cursor: "pointer" }}
      //             title="Edit Salary Details"
      //           />
      //         </Link>
      //       </UserPrivateComponent>
      //       <UserPrivateComponent permission={"delete-driver"}>
      //         <DeleteOutlined
      //           onClick={() => onDelete(record.id)}
      //           className="bg-red-500 p-2 text-white rounded-md hover:bg-red-600 transition duration-300"
      //           style={{ fontSize: "15px", cursor: "pointer" }}
      //           title="Delete Salary Details"
      //         />
      //       </UserPrivateComponent> */}
      //       {/* <button
      //         className="bg-green-600 text-white font-medium py-1 px-3 rounded hover:bg-green-700 transition duration-300 text-sm"
      //         onClick={() =>
      //           window.open(`/admin/salaryprint/${record.id}`, "_blank")
      //         }
      //         style={{ minWidth: "90px" }}
      //       >
      //         Print
      //       </button> */}
      //     </div>
      //   ),
      // },
    ],
    [selectedEmpType, data, onDelete] // handleInputBlur is removed
  );

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // Initial load for booking entry data - kept as per original component logic
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
            </div>
          </Form>
        </div>

        <div className="card-body">
          <Card
            className="border md:p-6 bg-[#fafafa]"
            bodyStyle={{ padding: 0 }}
          >
            <div className="flex items-center justify-between pb-3 px-4 md:px-0">
              <h1 className="text-xl font-semibold text-gray-800">
                Salary Due ({selectedEmpType})
              </h1>
              <div className="flex items-center gap-4">
                <Button
                  title="Salary Process"
                  className="bg-pink-600 text-white font-medium rounded hover:bg-pink-700 transition duration-300 text-sm"
                  bgColor="bg-red-600"
                  textColor="text-white"
                  hoverBgColor="hover:bg-blue-700"
                  onClick={() => navigate("/admin/salary")} // ✅ wrapped inside arrow function
                >
                  Complite Salary
                </Button>
                <Button
                  title={"Save"}
                  onClick={handleSave}
                  bgColor="bg-green-600"
                  className="bg-green-600 text-white font-medium rounded hover:bg-green-700 transition duration-300 text-sm"
                  textColor="text-white"
                  hoverBgColor="hover:bg-green-700"
                >
                  Save All
                </Button>
                {/* <Link to={`/admin/slaryprocess`}>
                  <SimpleButton title={"Add Salary Entry"} />
                </Link> */}
              </div>
            </div>
            {error && <p className="text-red-500 p-4">Error: {error}</p>}
            <UserPrivateComponent permission={"create-bookingEntry"}>
              <Table
                rowSelection={rowSelection}
                dataSource={data} // Use 'data' state
                columns={columns}
                loading={loading} // Use 'loading' state
                rowKey="id" // Assuming 'id' is a unique key for each salary detail record
                pagination={false}
                scroll={{ x: 1800, y: "calc(100vh - 350px)" }} // Adjusted scroll to accommodate all columns
                bordered // Added borders for better table distinction
                size="middle" // Set size for better density
              />
            </UserPrivateComponent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default GetSalaryDetails;
