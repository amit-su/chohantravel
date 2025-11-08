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

const GetAllSalary = () => {
  const [data, setData] = useState([]); // Renamed setList1 to setData for clarity
  const [loading, setLoading] = useState(true); // Renamed loading2 to loading
  const [error, setError] = useState(null);
  const [selectedEmpType, setSelectedEmpType] = useState("HELPER");
  const [selectedMonth, setSelectedMonth] = useState(dayjs()); // default to current month
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  // const [empID, setempID] = useState(0); // This state wasn't actively used in a meaningful way in the component body
  const apiUrl = import.meta.env.VITE_APP_API;
  const navigate = useNavigate();

  const dispatch = useDispatch();

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

        const response = await axios.post(
          `${apiUrl}/salarydetails/salary`,
          payload
        );

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
        const BASIC = +(item.PerDayBasic * item.PaidDays).toFixed(2);
        const HRA = +(item.PerDayHRA * item.PaidDays).toFixed(2);
        const MedicalAllowance = +(
          item.PerDayMedicalAllowance * item.PaidDays
        ).toFixed(2);
        const WashingAllowance = +(
          item.PerDayWashingAllowance * item.PaidDays
        ).toFixed(2);
        const TA = +(item.PerDayTA * item.PaidDays).toFixed(2);

        const ESIC = +(item.PerDayESIC * item.PaidDays).toFixed(2);
        const PF = +(item.PerDayPF * item.PaidDays).toFixed(2);
        const PTAX = +(item.PerDayPTAX * item.PaidDays).toFixed(2);

        const TotalKhurakiAmt = +(item.KhurakiAmt || 0).toFixed(2);

        // Gross Salary
        const GrossSalary = +(
          BASIC +
          HRA +
          MedicalAllowance +
          WashingAllowance +
          TA +
          TotalKhurakiAmt
        ).toFixed(2);

        // Total Deductions
        const totaldeduction = +(ESIC + PF + PTAX + TotalKhurakiAmt).toFixed(2);

        // Net Salary
        const NetSalary = +(
          GrossSalary -
          (ESIC + PF + PTAX + (item.AdvanceAdjusted || 0))
        ).toFixed(2);

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
          AdvanceAdjusted: +(item.AdvanceAdjusted || 0).toFixed(2),
          KhurakiTotalAmt: TotalKhurakiAmt,
          GrossSalary,
          NetSalary,
          amountadjust: +(item.AdvanceAdjusted || 0).toFixed(2),
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
        dataIndex: "id",
        key: "id",
        width: 20,
        fixed: "left",
        // Align left for IDs
      },
      {
        id: 9,
        title: "Name",
        dataIndex: "name",
        key: "Name",
        width: 30,
        fixed: "left",
      },
      {
        id: 10,
        title: "Days of work",
        dataIndex: "DaysWorked",
        key: "DaysWorked",
        width: 20,
      },
      {
        id: 1,
        title: "Basic",
        dataIndex: "BASIC",
        key: "BASIC",
        width: 20,
        align: "right",
      },
      {
        id: 6,
        title: "HRA",
        dataIndex: "HRA",
        key: "HRA",
        width: 20,
        align: "right",
      },
      {
        id: 1,
        title: "TA",
        dataIndex: "TA",
        key: "TA",
        width: 20,
        align: "right",
      },
      {
        id: 7,
        title: "Medical Allowance",
        dataIndex: "MedicalAllowance",
        key: "MedicalAllowanc",
        width: 20,
        align: "right",
      },
      {
        id: 2,
        title: "Washing Allowance",
        dataIndex: "WashingAllowance",
        key: "WashingAllowance",
        width: 20,
        align: "right",
      },
      {
        id: 12,
        title: "Khuraki Total Amount",
        dataIndex: "KhurakiTotalAmt",
        key: "KhurakiAmt",
        width: 20,
        align: "right",
      },
      {
        id: 13,
        title: "Gross Salary",
        key: "GrossSalary",
        dataIndex: "GrossSalary",
        width: 20,
        align: "right",
      },
      {
        id: 5,
        title: "PF",
        dataIndex: "PF",
        key: "PF_Deduction",
        width: 20,
        align: "right",
      },
      {
        id: 4,
        title: "ESIC",
        dataIndex: "ESIC",
        key: "ESIC_Deduction",
        width: 20,
        align: "right",
      },
      {
        id: 8,
        title: "P Tax",
        dataIndex: "PTAX",
        key: "PTAX_Deduction",
        width: 20,
        align: "right",
      },
      // {
      //   id: 14,
      //   title: "Advance Due",
      //   dataIndex: "TotalAdvanceDue",
      //   key: "TotalAdvanceDue",
      //   width: 120,
      //   align: "right",
      // },
      {
        id: 15,
        title: "Advance Adjusted",
        dataIndex: "AdvanceAdjusted",
        key: "AdvanceAdjusted",
        width: 20,
        align: "right",
      },
      {
        id: 16,
        title: "Net Salary",
        key: "NetSalary",
        dataIndex: "NetSalary",
        width: 20,
        align: "right",
      },
      {
        id: 3,
        title: "Action",
        dataIndex: "",
        key: "action",
        fixed: "right",
        width: 30, // Increased width to accommodate all buttons
        render: (record) => (
          <div className="flex items-center gap-2">
            {/* <UserPrivateComponent permission="update-driver">
              <Link
                to={`/admin/updateslaryprocess/${selectedEmpType}/${record.id}`}
              >
                <EditOutlined
                  className="bg-blue-500 p-2 text-white rounded-md hover:bg-blue-600 transition duration-300"
                  style={{ fontSize: "15px", cursor: "pointer" }}
                  title="Edit Salary Details"
                />
              </Link>
            </UserPrivateComponent>
            <UserPrivateComponent permission={"delete-driver"}>
              <DeleteOutlined
                onClick={() => onDelete(record.id)}
                className="bg-red-500 p-2 text-white rounded-md hover:bg-red-600 transition duration-300"
                style={{ fontSize: "15px", cursor: "pointer" }}
                title="Delete Salary Details"
              />
            </UserPrivateComponent> */}
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
                Complite Salary ({selectedEmpType})
              </h1>
              <div className="flex items-center gap-4">
                {/* <Button
                  title={"Save"}
                  onClick={handleSave}
                  bgColor="bg-green-600"
                  textColor="text-white"
                  hoverBgColor="hover:bg-green-700"
                >
                  Save All
                </Button> */}
                <Button
                  title="Salary Process"
                  className="bg-red-600 text-white font-medium rounded hover:bg-red-700 transition duration-300 text-sm"
                  bgColor="bg-red-600"
                  textColor="text-white"
                  hoverBgColor="hover:bg-blue-700"
                  onClick={() => navigate("/admin/slarydetails")} // ✅ wrapped inside arrow function
                >
                  Salary Process
                </Button>
                {/* <Link to={`/admin/slaryprocess`}>
                  <SimpleButton title={"Add Salary Entry"} />
                </Link> */}
              </div>
            </div>
            {error && <p className="text-red-500 p-4">Error: {error}</p>}
            <UserPrivateComponent permission={"create-bookingEntry"}>
              <Table
                // rowSelection={rowSelection}
                dataSource={data} // Use 'data' state
                columns={columns}
                loading={loading} // Use 'loading' state
                rowKey="id" // Assuming 'id' is a unique key for each salary detail record
                pagination={false}
                scroll={{ x: 1800, y: "calc(100vh - 350px)" }}
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

export default GetAllSalary;
