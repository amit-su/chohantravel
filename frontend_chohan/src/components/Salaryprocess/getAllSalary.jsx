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
  Input, // 💡 Import Input for search
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

const GetAllSalary = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmpType, setSelectedEmpType] = useState("HELPER");
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // 💡 State for search query

  const apiUrl = import.meta.env.VITE_APP_API;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loadSalaryDetails = useCallback(
    async (employeeType, month) => {
      setLoading(true);
      setError(null);
      try {
        const payload = {
          monthYear: month.format("YYYY-MM"),
          employType: employeeType,
        };

        // 🎯 Using the specific endpoint for completed salaries
        const response = await axios.post(
          `${apiUrl}/salarydetails/salary`,
          payload
        );

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

  const onDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this salary detail entry?"
      )
    ) {
      return;
    }
    try {
      // Assuming the ID here is the unique ID of the saved salary record
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

  // NOTE: handleSave logic is commented out in the JSX so I've removed the implementation here
  // to avoid confusion, as this is a "completed salary" (read-only) view.

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  // 💡 NEW: Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // 💡 NEW: Filtered data logic
  const filteredData = useMemo(() => {
    if (!searchQuery) {
      return data;
    }
    const lowerCaseQuery = searchQuery.toLowerCase();

    // Filter by EmployeeName (assuming the saved data uses 'name' or 'EmployeeName')
    return data.filter(
      (item) => item.name && item.name.toLowerCase().includes(lowerCaseQuery) // 💡 Used 'name' as per your column definition, check if API uses 'EmployeeName' instead
    );
  }, [data, searchQuery]);

  // Use useMemo for columns to prevent unnecessary re-renders
  const columns = useMemo(
    () => [
      {
        id: 9,
        title: "ID",
        dataIndex: "id", // Assuming 'id' is the primary key from the API
        key: "id",
        width: 20,
        fixed: "left",
      },
      {
        id: 9,
        title: "Name",
        dataIndex: "name", // 💡 Using 'name' (Check against your actual API response field)
        key: "Name",
        width: 30,
        fixed: "left",
      },
      {
        id: 10,
        title: "Days of work",
        dataIndex: "DaysWorked", // 💡 Assuming this is the finalized field name
        key: "DaysWorked",
        width: 20,
      },
      {
        id: 1,
        title: "Basic",
        dataIndex: "BASIC", // 💡 Displaying the saved calculated value
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
        width: 30,
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
            <button
              className="bg-red-500 p-2 text-white rounded-md hover:bg-red-600 transition duration-300"
              onClick={() => onDelete(record.id)}
              style={{
                fontSize: "15px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              title="Delete Salary Details"
            >
              <DeleteOutlined />
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
        {/* Filter Section */}
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
        {/* --- */}

        <div className="card-body">
          <Card
            className="border md:p-6 bg-[#fafafa]"
            bodyStyle={{ padding: 0 }}
          >
            {/* Header and Action Section */}
            <div className="flex items-center justify-between pb-3 px-4 md:px-0">
              <h1 className="text-xl font-semibold text-gray-800">
                **Completed Salary** ({selectedEmpType})
              </h1>
              <div className="flex items-center gap-4">
                {/* 💡 Search Input Grouped with Actions */}
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
                {/* Button to go to Salary Process/Due */}
                <Button
                  title="Salary Process"
                  className="bg-red-600 text-white font-medium rounded hover:bg-red-700 transition duration-300 text-sm"
                  onClick={() => navigate("/admin/slarydetails")}
                >
                  Salary Process
                </Button>
              </div>
            </div>
            {/* --- */}

            {error && <p className="text-red-500 p-4">Error: {error}</p>}
            <UserPrivateComponent permission={"create-bookingEntry"}>
              <Table
                // rowSelection={rowSelection} // Removed selection as this is a read-only view
                dataSource={filteredData} // 🎯 Using the filtered data
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

export default GetAllSalary;
