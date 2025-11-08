import {
  Button,
  Form,
  Card,
  Input,
  InputNumber,
  Typography,
  Select,
  DatePicker,
} from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  deleteAdvanceToStaffEntry,
  loadAdvanceToStaffEntryPaginated,
} from "../../redux/rtk/features/advanceToStaffEntry/advanceToStaffEntrySlice";
import UserPrivateComponent from "../PrivacyComponent/UserPrivateComponent";
import TableComponent from "../CommonUi/TableComponent";
import { toast } from "react-toastify";

import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadAllDriver } from "../../redux/rtk/features/driver/driverSlice";
import { loadAllHelper } from "../../redux/rtk/features/helper/helperSlice";
import dayjs from "dayjs";
import { addSingleAdvanceToStaffEntry } from "../../redux/rtk/features/advanceToStaffEntry/advanceToStaffEntrySlice";
let editedRows = [];

const AddAdvanceToStaffEntryDrawer = () => {
  const apiUrl = import.meta.env.VITE_APP_API;

  const [helperData, setHelperData] = useState([]);
  const [driverData, setDriverData] = useState([]);
  const [StaffData, setStaffData] = useState([]);

  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();
  const [data, setList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [loading2, setLoading2] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmpType, setSelectedEmpType] = useState();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      // Reset state before fetching
      setList([]);
      setFilteredData([]);
      setError(null);
      setLoading2(true);
      editedRows = []; // Consider useRef for better React practice

      try {
        const response = await axios.get(`${apiUrl}/${selectedEmpType}`);
        let data = response.data.data || [];

        // Filter out duplicate employee names
        const seenNames = new Set();
        data = data.filter((emp) => {
          if (seenNames.has(emp.name)) {
            return false;
          }
          seenNames.add(emp.name);
          return true;
        });

        // Map employee types to their corresponding state setters
        const typeSetterMap = {
          HELPER: setHelperData,
          DRIVER: setDriverData,
          STAFF: setStaffData,
        };

        // Call the correct setter if exists
        typeSetterMap[selectedEmpType]?.(data);

        // Set common data
        setList(data);
        setFilteredData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading2(false);
      }
    };

    fetchData();
  }, [selectedEmpType]);

  const dispatch = useDispatch();
  const { Title } = Typography;
  const [form] = Form.useForm();
  const [loading1, setLoading] = useState(false);

  const { list, total, loading } = useSelector(
    (state) => state.advanceToStaffEntry
  );

  const onClick = useCallback(
    async (list, rows) => {
      const updatedArray = list
        .filter((item) => item) // Filter out undefined/null items first
        .map((item) => {
          const foundItem = editedRows.find((obj) => obj?.id === item?.id);
          return foundItem
            ? {
                id: item.id,
                advAmount: foundItem.AdvAmt,
                remark: foundItem.Remark,
              }
            : null;
        })
        .filter((item) => item !== null);

      try {
        let obj = {
          AdvanceNo: form.getFieldValue("AdvanceNo"),
          date: selectedDate.format("YYYY-MM-DD"),
          driverHelper: form.getFieldValue("driverHelper") || "HELPER",
          transactions: JSON.stringify(updatedArray),
        };
        const response = await axios.post(
          `${import.meta.env.VITE_APP_API}/advanceToStaffEntry`,
          obj
        );
        if (response.status === 200) {
          toast.success("Advance Entry Added Successfully");
          navigate("/admin/AdvanceToStaffEntry");
        } else {
          toast.error("Failed to add Advance Entry");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading2(false);
      }
    },
    [selectedDate, form]
  );

  const handleSelectChange = useCallback((value) => {
    setSelectedEmpType(value);
  }, []);

  const handleDateChange = useCallback((date) => {
    setSelectedDate(date || dayjs());
  }, []);

  const onFinish = async (values) => {
    try {
      const uppercaseValues = Object.keys(values).reduce((acc, key) => {
        acc[key] =
          typeof values[key] === "string"
            ? values[key].toUpperCase()
            : values[key];
        return acc;
      }, {});
      const resp = await dispatch(
        addSingleAdvanceToStaffEntry({ values: uppercaseValues, dispatch })
      );
      setLoading(false);
      form.resetFields();
    } catch (error) {
      setLoading(false);
    }
  };

  const [initValues, setInitValues] = useState({
    bookingDate: dayjs(),
    AdvanceNo: "New",
    remark: "",
  });

  const onFinishFailed = () => {
    setLoading(false);
  };

  const [initialAmount, setInitialAmount] = useState();

  const handleAdvanceAmountChange = useCallback((recordId, index, newValue) => {
    // Ensure editedRows[index] exists or create it
    console.log("recordId", recordId, "index", index, "newValue", newValue);
    if (editedRows[index] && editedRows[index].id === recordId) {
      editedRows[index] = {
        ...editedRows[index],
        AdvAmt: newValue,
      };
    } else {
      editedRows[index] = {
        id: recordId,
        AdvAmt: newValue,
      };
    }

    const totalSum = editedRows.reduce(
      (sum, row) => sum + (row.AdvAmt || 0),
      0
    );
    setInitialAmount(totalSum);
  }, []);
  const handleRemarkChange = useCallback((recordId, index, newRemark) => {
    if (editedRows[index] && editedRows[index].id === recordId) {
      editedRows[index] = {
        ...editedRows[index],
        Remark: newRemark,
      };
    } else {
      editedRows[index] = {
        id: recordId,
        Remark: newRemark,
      };
    }

    // Optional: log the current state
    console.log("Edited Rows after remark change:", editedRows);
  }, []);

  const handleRowEdit = (record) => {
    console.log(record);
  };

  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
    const filtered = data.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const columns = [
    {
      id: 1,
      title: "Employee Name",
      dataIndex: "name",
      key: "name",
    },
    {
      id: 2,
      title: "Advance Amount",
      dataIndex: "advAmount",
      key: "advAmount",
      render: (advAmount, record, index) => (
        <Form.Item
          style={{ marginBottom: "10px" }}
          name={`advAmount_${record.id}`}
        >
          <InputNumber
            size="small"
            defaultValue={advAmount}
            onChange={(value) =>
              handleAdvanceAmountChange(record.id, index, value)
            }
          />
        </Form.Item>
      ),
    },
    {
      id: 3,
      title: "Remark",
      dataIndex: "remark",
      key: "remark",
      render: (remark, record, index) => (
        <Form.Item style={{ marginBottom: "10px" }} name="remark">
          <Input
            size="small"
            defaultValue={remark}
            onChange={(e) =>
              handleRemarkChange(record.id, index, e.target.value)
            }
          />
        </Form.Item>
      ),
    },
  ];

  return (
    <>
      <div className="h-full">
        <Title level={4} className="m-3 text-center">
          Add Entry
        </Title>

        <Form
          form={form}
          name="basic"
          layout="vertical"
          style={{ marginLeft: "40px", marginRight: "40px" }}
          initialValues={initValues}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <div className="flex gap-20 ml-4">
            <div className="ml-4">
              <Form.Item
                className="w-80"
                label="Advance number"
                name="AdvanceNo"
                rules={[
                  {
                    required: false,
                    message: "Please provide input !",
                  },
                ]}
              >
                <Input placeholder="Enter Advance Number" />
              </Form.Item>
              <Form.Item
                style={{ marginBottom: "10px", width: "80%" }}
                label="Driver / Helper / Staff"
                name="driverHelper"
                rules={[{ required: true, message: "Driver / Helper / Staff" }]}
              >
                <Select
                  onChange={handleSelectChange}
                  placeholder="Select Driver/Helper/Staff"
                >
                  <Select.Option value={"DRIVER"}>Driver</Select.Option>
                  <Select.Option value={"HELPER"}>Helper</Select.Option>
                  <Select.Option value={"STAFF"}>Staff</Select.Option>
                </Select>
              </Form.Item>
            </div>
            <div className="float-right w-2/2">
              <Form.Item
                label="Date"
                className="flex w-80"
                name="date"
                rules={[
                  {
                    required: true,
                    message: "Please input Date!",
                  },
                ]}
              >
                <DatePicker
                  picker="date"
                  defaultValue={dayjs()}
                  format="DD-MM-YYYY"
                  value={dayjs()}
                  onChange={handleDateChange}
                  className="custom-date-picker"
                />
              </Form.Item>
            </div>
          </div>
        </Form>

        <Input
          placeholder="Search Employee Name"
          value={searchTerm}
          onChange={handleSearch}
          style={{ marginLeft: "70px", marginBottom: "20px", width: "20%" }}
        />

        <div className="mt-2 card card-custom">
          <div className="card-body">
            <Card
              className="border-0 md:border md:p-6 bg-transparent md:bg-[#fafafa]"
              bodyStyle={{ padding: 0 }}
            >
              <UserPrivateComponent permission={"readAll-proformaInvoice"}>
                <TableComponent
                  list={filteredData}
                  columns={columns}
                  loading={loading1}
                  total={total}
                  paginatedThunk={loadAdvanceToStaffEntryPaginated}
                  scrollX={200}
                  csvFileName={"Booking List"}
                />
              </UserPrivateComponent>
            </Card>
          </div>
        </div>

        <div className="flex gap-20 ml-4">
          <div className="ml-4">
            <Form.Item
              className="w-90 flex justify-center mt-[24px]"
              label="Total Advance Amount"
            >
              <h3>{initialAmount} </h3>
            </Form.Item>
          </div>
          <div className="float-right w-3/6">
            <Form.Item
              style={{ marginBottom: "10px" }}
              className="flex justify-center mt-[24px]"
            >
              <Button
                type="primary"
                htmlType="submit"
                shape="round"
                loading={loading}
                onClick={() => onClick(data, editedRows)}
              >
                Add Advance Entry
              </Button>
            </Form.Item>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddAdvanceToStaffEntryDrawer;
