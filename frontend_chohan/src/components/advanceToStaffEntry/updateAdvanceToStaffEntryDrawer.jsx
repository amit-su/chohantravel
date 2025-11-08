import {
  Button,
  Form,
  Card,
  InputNumber,
  Typography,
  Select,
  Input,
  DatePicker,
  Table,
  Space,
  message,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

const { Title } = Typography;

const UpdateAdvanceToStaffEntryDrawer = () => {
  const apiUrl = import.meta.env.VITE_APP_API;
  const location = useLocation();
  const navigate = useNavigate();

  // Get AdvanceNo from URL params
  const searchParams = new URLSearchParams(location.search);
  const AdvanceNo = searchParams.get("AdvanceNo");

  // Form state
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Data state
  const [employeeType, setEmployeeType] = useState("DRIVER");
  const [employees, setEmployees] = useState([]);
  const [existingEntries, setExistingEntries] = useState([]);
  const [newEntries, setNewEntries] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [searchTerm, setSearchTerm] = useState("");

  // Load initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Load existing advance entries
        const advanceResponse = await axios.get(
          `${apiUrl}/AdvanceToStaffEntry/${AdvanceNo}`
        );

        if (advanceResponse.data.data?.length) {
          setEmployeeType(advanceResponse.data.data[0].Type || "DRIVER");
          setSelectedDate(dayjs(advanceResponse.data.message));
          setExistingEntries(
            advanceResponse.data.data.map((entry) => ({
              ...entry,
              isExisting: true,
            }))
          );

          form.setFieldsValue({
            bookingDate: dayjs(advanceResponse.data.message),
            driverHelper: advanceResponse.data.data[0].Type || "DRIVER",
          });
        }

        // 2. Load employee data based on type
        const empResponse = await axios.get(`${apiUrl}/${employeeType}`);
        let empData = empResponse.data.data || [];

        // Remove duplicates
        const uniqueEmps = empData.filter(
          (emp, index, self) =>
            index === self.findIndex((e) => e.name === emp.name)
        );

        setEmployees(uniqueEmps);
      } catch (error) {
        message.error("Failed to load data: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [AdvanceNo, apiUrl, form, employeeType]);

  // Handle employee type change
  const handleEmployeeTypeChange = (value) => {
    setEmployeeType(value);
    setNewEntries([]);
  };

  // Add new staff member to the advance
  const handleAddNewStaff = () => {
    setNewEntries([
      ...newEntries,
      {
        id: `new-${Date.now()}`,
        advAmount: 0,
        remark: "",
        isNew: true,
        employeeId: null,
        Name: "",
      },
    ]);
  };

  // Remove new staff member
  const handleRemoveNewStaff = (id) => {
    setNewEntries(newEntries.filter((entry) => entry.id !== id));
  };

  // Handle changes to existing entries
  const handleExistingEntryChange = (id, field, value) => {
    setExistingEntries(
      existingEntries.map((entry) =>
        entry.entryId === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  // Handle changes to new entries
  const handleNewEntryChange = (id, field, value) => {
    setNewEntries(
      newEntries.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  // Handle employee selection for new entries
  const handleEmployeeSelect = (id, employeeId) => {
    const selectedEmployee = employees.find((emp) => emp.id === employeeId);
    setNewEntries(
      newEntries.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              employeeId,
              Name: selectedEmployee?.name || "",
            }
          : entry
      )
    );
  };

  // Submit the form with both formats
  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      // Prepare existing entries in the original format
      const existingTransactions = existingEntries.map((entry) => ({
        entryId: entry.entryId,
        EmpID: entry.EmpID.toString(),
        Type: employeeType,
        advAmount: Number(entry.advAmount),
        remark: entry.remark || "",
        AdvanceNo: AdvanceNo,
        adjAmount: null,
        advanceAdjusted: null,
        Name: entry.Name,
      }));

      // Prepare new entries in the simplified format
      const newTransactions = newEntries
        .filter((entry) => entry.employeeId)
        .map((entry) => ({
          id: entry.employeeId, // Using employeeId as id for new entries
          advAmount: Number(entry.advAmount),
          remark: entry.remark || "",
        }));

      const allTransactions = [...existingTransactions, ...newTransactions];

      const payload = {
        AdvanceNo: AdvanceNo,
        driverHelper: employeeType,
        date: selectedDate.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
        transactions: JSON.stringify(allTransactions),
      };

      console.log("Submitting payload:", payload);

      // Submit to API
      await axios.post(`${apiUrl}/advanceToStaffEntry`, payload);

      message.success("Advance entry updated successfully");
      navigate("/admin/AdvanceToStaffEntry");
    } catch (error) {
      message.error("Failed to update advance entry: " + error.message);
      console.error("Error details:", error.response?.data);
    } finally {
      setSubmitting(false);
    }
  };

  // Table columns
  const columns = [
    {
      title: "Employee Name",
      dataIndex: "Name",
      key: "Name",
      render: (text, record) => {
        if (record.isNew) {
          return (
            <Select
              showSearch
              placeholder="Select employee"
              optionFilterProp="children"
              style={{ width: "100%" }}
              onChange={(value) => handleEmployeeSelect(record.id, value)}
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {employees.map((emp) => (
                <Select.Option key={emp.id} value={emp.id}>
                  {emp.name}
                </Select.Option>
              ))}
            </Select>
          );
        }
        return text;
      },
    },
    {
      title: "Advance Amount",
      dataIndex: "advAmount",
      key: "advAmount",
      render: (amount, record) => (
        <InputNumber
          style={{ width: "100%" }}
          value={amount}
          onChange={(value) =>
            record.isNew
              ? handleNewEntryChange(record.id, "advAmount", value)
              : handleExistingEntryChange(record.entryId, "advAmount", value)
          }
        />
      ),
    },
    {
      title: "Remark",
      dataIndex: "remark",
      key: "remark",
      render: (remark, record) => (
        <Input
          value={remark}
          onChange={(e) =>
            record.isNew
              ? handleNewEntryChange(record.id, "remark", e.target.value)
              : handleExistingEntryChange(
                  record.entryId,
                  "remark",
                  e.target.value
                )
          }
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) =>
        record.isNew && (
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleRemoveNewStaff(record.id)}
          />
        ),
    },
  ];

  return (
    <div className="h-full p-4">
      <Title level={4} className="mb-6 text-center">
        Update Advance Entry #{AdvanceNo}
      </Title>

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          bookingDate: selectedDate,
          driverHelper: employeeType,
          AdvanceNo: AdvanceNo,
        }}
      >
        <div className="flex flex-wrap gap-6 mb-6">
          <Form.Item
            label="Advance Number"
            name="AdvanceNo"
            className="flex-1 min-w-[200px]"
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="Staff Type"
            name="driverHelper"
            className="flex-1 min-w-[200px]"
            rules={[{ required: true }]}
          >
            <Select
              onChange={handleEmployeeTypeChange}
              disabled={existingEntries.length > 0}
            >
              <Select.Option value="DRIVER">Driver</Select.Option>
              <Select.Option value="HELPER">Helper</Select.Option>
              <Select.Option value="STAFF">Staff</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Date"
            name="bookingDate"
            className="flex-1 min-w-[200px]"
            rules={[{ required: true }]}
          >
            <DatePicker
              format="DD-MM-YYYY"
              className="w-full"
              onChange={(date) => setSelectedDate(date || dayjs())}
            />
          </Form.Item>
        </div>
      </Form>

      <div className="flex justify-end mb-4">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddNewStaff}
        >
          Add Staff Member
        </Button>
      </div>

      <Card className="mb-6">
        <Table
          columns={columns}
          dataSource={[...existingEntries, ...newEntries]}
          rowKey={(record) => (record.isNew ? record.id : record.entryId)}
          loading={loading}
          pagination={false}
          scroll={{ x: true }}
        />
      </Card>

      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold">
          Total Advance Amount:{" "}
          {[...existingEntries, ...newEntries]
            .reduce((sum, entry) => sum + (entry.advAmount || 0), 0)
            .toFixed(2)}
        </div>

        <Space>
          <Button onClick={() => navigate(-1)}>Cancel</Button>
          <Button type="primary" loading={submitting} onClick={handleSubmit}>
            Update Advance Entry
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default UpdateAdvanceToStaffEntryDrawer;
