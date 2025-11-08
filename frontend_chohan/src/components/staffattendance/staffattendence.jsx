import React, { useEffect, useState, useCallback } from "react";
import {
  Button,
  DatePicker,
  Form,
  Select,
  Space,
  Spin,
  Table,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { loadAllStaff } from "../../redux/rtk/features/staff/staffslice";
import {
  loadAllStaffAttendance,
  updateStaffAttendance,
} from "../../redux/rtk/features/staffatendence/staffattendenceslice";
import { toast } from "react-toastify";
const EditableCell = ({
  editing,
  dataIndex,
  record,
  options,
  onChange,
  children,
}) => {
  const [value, setValue] = useState(record[dataIndex]);

  useEffect(() => {
    if (editing) {
      setValue(record[dataIndex]);
    }
  }, [editing, record[dataIndex]]);

  const handleChange = (newValue) => {
    setValue(newValue);
    onChange(newValue);
  };

  return (
    <td>
      {editing ? (
        <Form.Item style={{ margin: 0 }}>
          <Select
            style={{ width: "90px" }}
            value={value}
            onChange={handleChange}
          >
            {options.map((option) => (
              <Select.Option key={option} value={option}>
                {option}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const StaffAttendance = () => {
  const dispatch = useDispatch();
  const { Title } = Typography;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [editedRows, setEditedRows] = useState({});
  const [originalData, setOriginalData] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20 });

  const handleMonthChange = useCallback((date) => {
    setSelectedMonth(date);
  }, []);

  const { list: staffList, loading: staffLoading } = useSelector(
    (state) => state.staff
  );
  const { list: staffAttendanceList, loading: attendanceLoading } = useSelector(
    (state) => state.staffatten
  );

  useEffect(() => {
    setLoading(staffLoading || attendanceLoading);
  }, [staffLoading, attendanceLoading]);

  useEffect(() => {
    dispatch(loadAllStaff({ page: 1, count: 10000, status: true }));
    dispatch(
      loadAllStaffAttendance({
        requestArgs: { page: 1, count: 20, status: "Staff" },
        selectedMonth: selectedMonth.format("MM/YYYY"),
      })
    );
  }, [dispatch, selectedMonth]);

  useEffect(() => {
    setOriginalData(generateTableData());
  }, [staffAttendanceList, selectedMonth]);

  const handleSelectChange = useCallback((recordId, dataIndex, newValue) => {
    setEditedRows((prev) => ({
      ...prev,
      [recordId]: {
        ...prev[recordId],
        [dataIndex]: newValue,
      },
    }));
  }, []);

  const generateColumns = (selectedMonth) => {
    const daysInMonth = selectedMonth.daysInMonth();
    let columns = [
      {
        dataIndex: "name",
        title: "Name",
        key: "name",
        editable: false,
        width: 300,
        fixed: "left",
      },
    ];

    for (let i = 1; i <= daysInMonth; i++) {
      const date = selectedMonth.date(i).format("DD");
      const isWeekend = [6, 0].includes(selectedMonth.date(i).day());
      columns.push({
        title: (
          <span
            style={{
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: isWeekend ? "red" : "",
            }}
          >
            {date}
          </span>
        ),
        dataIndex: `attendance_${date}`,
        key: `attendance_${date}`,
        render: (text, record) => (
          <EditableCell
            dataIndex={`attendance_${date}`}
            record={record}
            editing={true}
            value={record[`attendance_${date}`] || undefined} // If undefined → no selection
            options={["P", "A", "L"]}
            placeholder="Select status" // <-- important, pass placeholder
            onChange={(newValue) =>
              handleSelectChange(record.id, `attendance_${date}`, newValue)
            }
          />
        ),
      });
    }
    columns.push({
      title: "Action",
      dataIndex: "operation",
      width: 90,
      key: "operation",
      fixed: "right",
      render: (_, record) => (
        <Button
          type="primary"
          className="flex text-center text-white bg-green-600 rounded-md"
          style={{ width: "60px" }}
          onClick={() => confirm("Save Attendance?") && save(record.id)}
        >
          Save
        </Button>
      ),
    });

    return columns;
  };
  const columns = generateColumns(selectedMonth);

  const generateTableData = useCallback(() => {
    return (
      Array.isArray(staffList) &&
      staffList?.map((staff) => {
        const row = { key: staff?.id, id: staff?.id, name: staff?.name };
        const attendanceStatus = staffAttendanceList?.find(
          (item) => item?.employeeID === staff?.id
        );

        if (attendanceStatus) {
          const attendanceData = JSON.parse(attendanceStatus?.AttendanceStatus);
          for (const data of attendanceData) {
            const date = data?.date;
            const status = data?.status || "";
            row[`attendance_${date}`] = status;
          }
        } else {
          for (let i = 1; i <= selectedMonth?.daysInMonth(); i++) {
            const date = selectedMonth?.date(i).format("DD");
            row[`attendance_${date}`] = "";
          }
        }

        return row;
      })
    );
  }, [staffList, staffAttendanceList, selectedMonth]);

  const save = useCallback(
    async (recordId) => {
      setLoading(true);
      try {
        const editedRow = editedRows?.[recordId];
        const allTableData = generateTableData();
        const originalRow = allTableData?.find((row) => row?.id === recordId);

        if (!editedRow) {
          toast.info("No changes to save for this record.");
          return;
        }

        const monthDates = [];
        for (let i = 1; i <= selectedMonth?.daysInMonth(); i++) {
          const date = selectedMonth?.date(i).format("DD");
          const status =
            editedRow?.[`attendance_${date}`] ??
            originalRow?.[`attendance_${date}`] ??
            "";
          monthDates.push({ date, status });
        }

        await dispatch(
          updateStaffAttendance({
            id: recordId,
            values: {
              id: recordId,
              month: selectedMonth?.format("MM/YYYY"),
              type: "Staff",
              attendance: monthDates,
            },
          })
        ).unwrap(); // Use unwrap to catch potential errors from the thunk

        toast.success("Record saved successfully!");

        // Clear the edited state for this specific row
        setEditedRows((prev) => {
          const newEditedRows = { ...prev };
          delete newEditedRows[recordId];
          return newEditedRows;
        });
      } catch (errInfo) {
        toast.error("Failed to save record.");
        console.error("Save Failed:", errInfo);
      } finally {
        setLoading(false);
      }
    },
    [dispatch, editedRows, originalData, selectedMonth, pagination]
  );

  const handleTableChange = useCallback((pagination, filters, sorter) => {
    setPagination(pagination);
  }, []);

  const onFinish = useCallback(
    async (values) => {
      try {
        setLoading(true);
        dispatch(
          loadAllStaffAttendance({
            page: pagination?.current,
            count: pagination?.pageSize,
            status: "Staff",
          })
        );
      } catch (error) {
        setLoading(false);
      }
    },
    [dispatch, pagination]
  );

  const saveAll = async () => {
    if (Object.keys(editedRows).length === 0) {
      toast.info("No changes to save.");
      return;
    }

    if (!confirm("Are you sure you want to save all changes?")) {
      return;
    }

    setLoading(true);
    try {
      const allTableData = generateTableData();
      const promises = Object.keys(editedRows).map(async (recordId) => {
        const editedRow = editedRows[recordId];
        const originalRow = allTableData.find(
          (row) => row.id === parseInt(recordId, 10)
        );

        if (editedRow && originalRow) {
          const monthDates = [];
          for (let i = 1; i <= selectedMonth.daysInMonth(); i++) {
            const date = selectedMonth.date(i).format("DD");
            const status =
              editedRow[`attendance_${date}`] ??
              originalRow[`attendance_${date}`] ??
              "";
            monthDates.push({ date, status });
          }

          return dispatch(
            updateStaffAttendance({
              id: recordId,
              values: {
                id: recordId,
                month: selectedMonth.format("MM/YYYY"),
                type: "Staff",
                attendance: monthDates,
              },
            })
          );
        }
      });

      await Promise.all(promises.filter(Boolean));
      toast.success("All attendance records saved successfully!");
      setEditedRows({}); // Clear edited rows after saving
      // Data will be re-fetched by the useEffect hook
    } catch (error) {
      toast.error("Failed to save all attendance records.");
      console.error("Save all failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full">
      <Title level={4} className="py-3 m-3 text-center">
        STAFF ATTENDANCE
      </Title>

      <Form
        form={form}
        name="basic"
        layout="horizontal"
        style={{ marginLeft: "40px", marginRight: "40px" }}
        onFinish={onFinish}
        autoComplete="off"
        initialValues={{ month: dayjs() }}
      >
        <div className="flex items-center">
          <Form.Item
            style={{ marginBottom: "10px", width: "30%", marginLeft: "10px" }}
            label="Month"
            name="month"
            rules={[{ required: true, message: "Please select a month" }]}
          >
            <DatePicker
              picker="month"
              defaultValue={dayjs()}
              format={" MM/YYYY - MMMM"}
              onChange={handleMonthChange}
              className="custom-date-picker"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              onClick={saveAll}
              loading={loading}
              style={{ marginLeft: "1rem" }}
            >
              Save All
            </Button>
          </Form.Item>
        </div>
      </Form>
      <Spin spinning={loading}>
        <Table
          className="mt-5"
          bordered
          dataSource={generateTableData()}
          columns={columns}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ["20", "50", "100"],
          }}
          scroll={{ x: 4000, y: window.innerHeight - 319 }}
          onChange={handleTableChange}
        />
      </Spin>
    </div>
  );
};

export default StaffAttendance;
