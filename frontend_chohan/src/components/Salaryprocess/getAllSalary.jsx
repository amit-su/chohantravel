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
import { useDispatch, useSelector } from "react-redux";
import UserPrivateComponent from "../PrivacyComponent/UserPrivateComponent";
import SimpleButton from "../Buttons/SimpleButton";
import axios from "axios";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loadAllCompany } from "../../redux/rtk/features/company/comapnySlice";
import { useNavigate } from "react-router-dom";
import { generateSalarySlipPDF, generateBulkSalarySlipPDF } from "../../utils/generateSalarySlipPDF";

const GetAllSalary = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedEmpType, setSelectedEmpType] = useState("HELPER");
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // 💡 State for search query
  const [selectedPaymentMode, setSelectedPaymentMode] = useState("ALL"); // 💡 State for payment mode filter
  const [isBulkPrinting, setIsBulkPrinting] = useState(false);

  const apiUrl = import.meta.env.VITE_APP_API;
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
        loadSalaryDetails(selectedEmpType, selectedMonth, selectedCompany);
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

  const handleBulkPrint = async () => {
    if (selectedRowKeys.length === 0) {
      toast.warning("Please select at least one record to print.");
      return;
    }

    setIsBulkPrinting(true);
    try {
      console.log("Fetching data for IDs:", selectedRowKeys);
      const printPromises = selectedRowKeys.map((id) =>
        axios.post(`${apiUrl}/salarydetails/slip-report`, { id: parseInt(id) })
      );

      const responses = await Promise.all(printPromises);
      const allSalaryData = responses
        .map((res) => res.data)
        .filter((item) => item);

      if (allSalaryData.length > 0) {
        const sampleMatchCompany = selectedCompany
          ? companyList?.find(c => c.Id === selectedCompany)
          : companyList?.find(c => String(c.Id) === String(allSalaryData[0]?.salarySlipData[0]?.CompanyID)) || companyList?.[0];

        // Use the new bulk generation function
        await generateBulkSalarySlipPDF(allSalaryData, sampleMatchCompany);
        toast.success("Bulk PDF downloaded successfully!");
      } else {
        toast.error("No valid data found for selected records.");
      }
    } catch (err) {
      console.error("Bulk print error:", err);
      toast.error("Failed to generate PDFs.");
    } finally {
      setIsBulkPrinting(false);
    }
  };

  const handlePrint = async (id) => {
    try {
      const response = await axios.post(
        `${apiUrl}/salarydetails/slip-report`,
        { id: parseInt(id) }
      );
      if (response.data) {
        const salaryDataRaw = response.data?.salarySlipData?.[0] || {};
        const matchCompany = selectedCompany
          ? companyList?.find(c => c.Id === selectedCompany)
          : companyList?.find(c => String(c.Id) === String(salaryDataRaw.CompanyID)) || companyList?.[0];

        await generateSalarySlipPDF(response.data, matchCompany);
      }
    } catch (err) {
      toast.error("Failed to generate PDF");
      console.error(err);
    }
  };

  // 💡 NEW: Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // 💡 NEW: Filtered data logic
  const filteredData = useMemo(() => {
    let filtered = data;

    // Filter by Search Query
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) => item.name && item.name.toLowerCase().includes(lowerCaseQuery)
      );
    }

    // Filter by Payment Mode
    if (selectedPaymentMode !== "ALL") {
      filtered = filtered.filter((item) => {
        if (selectedPaymentMode === "BANK") {
          return !!item.bankAcNo;
        } else if (selectedPaymentMode === "CASH") {
          return !item.bankAcNo;
        }
        return true;
      });
    }

    return filtered;
  }, [data, searchQuery, selectedPaymentMode]);

  // Use useMemo for columns to prevent unnecessary re-renders
  const columns = useMemo(
    () => [
      {
        id: 9,
        title: "ID",
        dataIndex: "id", // Assuming 'id' is the primary key from the API
        key: "id",
        width: 60,
      },
      {
        id: 9,
        title: "Name",
        dataIndex: "name", // 💡 Using 'name' (Check against your actual API response field)
        key: "Name",
        width: 250,
        fixed: "left",
      },
      {
        id: 10,
        title: "Days of work",
        dataIndex: "DaysWorked", // 💡 Assuming this is the finalized field name
        key: "DaysWorked",
        width: 100,
      },
      {
        id: 1,
        title: "Basic",
        dataIndex: "BASIC", // 💡 Displaying the saved calculated value
        key: "BASIC",
        width: 100,
        align: "right",
      },
      {
        id: 6,
        title: "HRA",
        dataIndex: "HRA",
        key: "HRA",
        width: 100,
        align: "right",
      },
      {
        id: 1,
        title: "TA",
        dataIndex: "TA",
        key: "TA",
        width: 100,
        align: "right",
      },
      {
        id: 7,
        title: "Medical Allowance",
        dataIndex: "MedicalAllowance",
        key: "MedicalAllowanc",
        width: 120,
        align: "right",
      },
      {
        id: 2,
        title: "Washing Allowance",
        dataIndex: "WashingAllowance",
        key: "WashingAllowance",
        width: 120,
        align: "right",
      },
      {
        id: 20,
        title: "Fixed Amount",
        dataIndex: "FixedAmt",
        key: "FixedAmt",
        width: 110,
        align: "right",
      },
      {
        id: 12,
        title: "Khuraki Total Amount",
        dataIndex: "KhurakiTotalAmt",
        key: "KhurakiAmt",
        width: 140,
        align: "right",
      },
      {
        id: 13,
        title: "Gross Salary",
        key: "GrossSalary",
        dataIndex: "GrossSalary",
        width: 120,
        align: "right",
      },
      {
        id: 5,
        title: "PF",
        dataIndex: "PF",
        key: "PF_Deduction",
        width: 100,
        align: "right",
      },
      {
        id: 4,
        title: "ESIC",
        dataIndex: "ESIC",
        key: "ESIC_Deduction",
        width: 100,
        align: "right",
      },
      {
        id: 8,
        title: "P Tax",
        dataIndex: "PTAX",
        key: "PTAX_Deduction",
        width: 100,
        align: "right",
      },
      {
        id: 15,
        title: "Advance Adjusted",
        dataIndex: "AdvanceAdjusted",
        key: "AdvanceAdjusted",
        width: 120,
        align: "right",
      },
      {
        id: 16,
        title: "Net Salary",
        key: "NetSalary",
        dataIndex: "NetSalary",
        width: 120,
        align: "right",
      },
      {
        id: 17,
        title: "Bank A/C No",
        dataIndex: "bankAcNo",
        key: "bankAcNo",
        width: 150,
        render: (text) => text || "N/A",
      },
      {
        id: 18,
        title: "Payment Mode",
        key: "paymentMode",
        width: 120,
        render: (_, record) => (record.bankAcNo ? "Bank Transfer" : "Cash"),
      },
      {
        id: 3,
        title: "Action",
        dataIndex: "",
        key: "action",
        fixed: "right",
        width: 120,
        render: (record) => (
          <div className="flex items-center gap-2">
            <button
              className="bg-green-600 text-white font-medium py-1 px-3 rounded hover:bg-green-700 transition duration-300 text-sm"
              onClick={() => handlePrint(record.id)}
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
    dispatch(loadAllCompany({ page: 1, count: 100, status: "true" }));
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
              <Form.Item label="Select Company" name="company">
                <Select
                  showSearch
                  placeholder="Select Company"
                  optionFilterProp="children"
                  onChange={(value) => setSelectedCompany(value)}
                  filterOption={(input, option) =>
                    (option?.children ?? "").toLowerCase().includes(input.toLowerCase())
                  }
                  style={{ width: 400 }}
                  allowClear
                >
                  {companyList?.map((company) => (
                    <Select.Option key={company.Id} value={company.Id}>
                      {company.Name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="Payment Mode">
                <Select
                  onChange={(value) => setSelectedPaymentMode(value)}
                  defaultValue="ALL"
                  style={{ width: 160 }}
                >
                  <Select.Option value="ALL">All Payments</Select.Option>
                  <Select.Option value="BANK">Bank Transfer</Select.Option>
                  <Select.Option value="CASH">Cash</Select.Option>
                </Select>
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

                {/* Bulk Print Button - Visible only when rows are selected */}
                {selectedRowKeys.length > 0 && (
                  <Button
                    type="primary"
                    onClick={handleBulkPrint}
                    loading={isBulkPrinting}
                    className="bg-green-600 hover:bg-green-700 border-none"
                  >
                    Download Selected ({selectedRowKeys.length})
                  </Button>
                )}

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
                rowSelection={rowSelection}
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
