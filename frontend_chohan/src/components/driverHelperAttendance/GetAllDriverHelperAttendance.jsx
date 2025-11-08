import React, { useEffect, useState, useCallback } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Spin,
  Table,
  Typography,
  Tag,
  Space,
} from "antd";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { loadAllDriver } from "../../redux/rtk/features/driver/driverSlice";
import {
  loadAllDriverHelperAttendance,
  createDriverHelperAttendance,
} from "../../redux/rtk/features/driverHelperAttendance/driverHelperAttendanceSlice";
import { loadAllHelper } from "../../redux/rtk/features/helper/helperSlice";
import axios from "axios";
import { toast } from "react-toastify";
import { PlusOutlined } from "@ant-design/icons";

// Helper function to extract counts from the success message
const parseCountsFromMessage = (message) => {
  let insertedCount = 0;
  let deletedCount = 0;
  const failedCount = 0;

  if (!message || typeof message !== "string") {
    return { insertedCount, deletedCount, failedCount };
  }

  // Regex 1: Find inserted count (e.g., "1 records inserted")
  const insertedMatch = message.match(/(\d+)\s+records inserted/i);
  if (insertedMatch) {
    insertedCount = parseInt(insertedMatch[1], 10);
  }

  // Regex 2: Find deleted count (e.g., "0 existing records deleted")
  const deletedMatch = message.match(/(\d+)\s+existing records deleted/i);
  if (deletedMatch) {
    deletedCount = parseInt(deletedMatch[1], 10);
  }

  return { insertedCount, deletedCount, failedCount };
};

const GetAllDriverHelperAttendance = () => {
  const [DriverOrHelper, setDriverOrHelper] = useState("Helper");
  const [siteId, setSiteId] = useState(0);
  const apiUrl = import.meta.env.VITE_APP_API;
  const [sitename, setSitename] = useState([]);
  const userId = Number(localStorage.getItem("id"));
  const [savingAll, setSavingAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useDispatch();
  const { Title } = Typography;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [originalData, setOriginalData] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20 });
  const [tableData, setTableData] = useState([]);
  const [isAllSites, setIsAllSites] = useState(false);

  // Fetch sites data
  useEffect(() => {
    const fetchSites = async () => {
      try {
        let endpoint;
        if (isAllSites) {
          endpoint = `${apiUrl}/site`;
        } else {
          endpoint =
            userId === 1 ? `${apiUrl}/site` : `${apiUrl}/site/${userId}`;
        }
        const response = await axios.get(endpoint);
        setSitename(response.data.data);
      } catch (error) {
        console.error("Error fetching sites:", error);
      }
    };
    fetchSites();
  }, [userId, apiUrl, isAllSites]);

  // Load drivers/helpers and attendance data
  useEffect(() => {
    dispatch(
      DriverOrHelper === "Driver"
        ? loadAllDriver({ page: 1, count: 10000, status: true, siteId: siteId })
        : loadAllHelper({ page: 1, count: 10000, status: true, siteId: siteId })
    );
    dispatch(
      loadAllDriverHelperAttendance({
        requestArgs: {
          page: 1,
          count: 20,
          status: DriverOrHelper,
          siteId: siteId,
        },
        selectedMonth: selectedMonth.format("MM/YYYY"),
      })
    );
  }, [dispatch, DriverOrHelper, selectedMonth, siteId]);

  const { list: driverList, loading: driverLoading } = useSelector(
    (state) => state.drivers
  );
  const { list: helperList, loading: helperLoading } = useSelector(
    (state) => state.helpers
  );
  const { list: driverHelperAttendanceList, loading: attendanceLoading } =
    useSelector((state) => state.driverHelperAttendance);

  useEffect(() => {
    setLoading(driverLoading || helperLoading || attendanceLoading);
  }, [driverLoading, helperLoading, attendanceLoading]);

  // Generate table data with proper initialization of all dates
  const generateTableData = useCallback(() => {
    const selectedListRaw =
      DriverOrHelper === "Driver" ? driverList : helperList;
    const selectedList =
      selectedListRaw?.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.name === item.name)
      ) || [];

    const data = selectedList.map((driverHelper) => {
      const row = {
        key: driverHelper?.id,
        id: driverHelper?.id,
        name: driverHelper?.name,
      };

      const daysInMonth = selectedMonth.daysInMonth();
      for (let i = 1; i <= daysInMonth; i++) {
        const date = selectedMonth.date(i).format("DD");
        // Initialize as an empty array of objects
        row[`attendance_${date}`] = [];
      }

      const attendanceRecord = driverHelperAttendanceList?.find(
        (item) => item?.employeeID === driverHelper?.id
      );

      if (attendanceRecord) {
        try {
          // Parse the JSON array with the new 'id' field
          const attendanceData = JSON.parse(
            attendanceRecord?.AttendanceStatus || "[]"
          );

          attendanceData.forEach(({ id, date, status }) => {
            if (date && row.hasOwnProperty(`attendance_${date}`)) {
              // Ensure status is treated as a single site ID string for this record
              const siteIdStr = status ? status.toString() : null;

              if (siteIdStr) {
                // Store the whole object including the unique 'dbId' and 'siteId'
                row[`attendance_${date}`].push({
                  dbId: id, // Database ID for the specific attendance record
                  siteId: siteIdStr, // The SiteID as a string
                  key: `${id}-${siteIdStr}`, // Unique key for React/AntD
                });
              }
            }
          });
        } catch (e) {
          console.error("Error parsing attendance data:", e);
        }
      }
      return row;
    });

    setTableData(data);
    setOriginalData(JSON.parse(JSON.stringify(data))); // Deep copy for comparison
  }, [
    DriverOrHelper,
    driverList,
    helperList,
    driverHelperAttendanceList,
    selectedMonth,
  ]);

  useEffect(() => {
    generateTableData();
  }, [generateTableData]);

  // Handler to add a single site instance
  const handleAddSite = (recordId, date, newSiteId) => {
    // For new records, use a temporary negative ID as dbId
    const tempDbId = `new-${Date.now()}-${Math.random()}`;

    setTableData((prev) =>
      prev.map((row) => {
        if (row.id === recordId) {
          const field = `attendance_${date}`;

          // Add a new object to the array
          return {
            ...row,
            [field]: [
              ...(row[field] || []),
              {
                dbId: tempDbId, // Temporary ID for a new record
                siteId: newSiteId.toString(),
                key: `${recordId}-${date}-${tempDbId}`,
              },
            ],
          };
        }
        return row;
      })
    );
  };

  // FIX: Handler to remove a single site instance by its unique dbId
  const handleRemoveSite = (recordId, date, uniqueRecordId) => {
    setTableData((prev) =>
      prev.map((row) => {
        if (row.id === recordId) {
          const field = `attendance_${date}`;
          let newSites = [...(row[field] || [])];

          if (uniqueRecordId === "all") {
            newSites = []; // Clear all sites
          } else {
            // FIX: Filter out the record where dbId matches the uniqueRecordId (which is the database ID or temp ID)
            newSites = newSites.filter((item) => item.dbId !== uniqueRecordId);
          }

          return { ...row, [field]: newSites };
        }
        return row;
      })
    );
  };

  // Helper function: Find site short name
  const getSiteShortName = (siteId) => {
    const site = sitename.find(
      (s) => s.siteID.toString() === siteId.toString()
    );
    return site ? site.siteShortName : `Site ${siteId}`;
  };

  // Generate table columns dynamically for each day of the month
  const generateColumns = () => {
    const daysInMonth = selectedMonth.daysInMonth();
    const columns = [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        width: 250,
        fixed: "left",
        sorter: (a, b) => a.name.localeCompare(b.name),
        render: (text, record) => `${record.name} (${record.id})`,
      },
    ];

    for (let i = 1; i <= daysInMonth; i++) {
      const date = selectedMonth.date(i).format("DD");
      columns.push({
        title: date,
        dataIndex: `attendance_${date}`,
        key: `attendance_${date}`,
        width: 250,
        // siteRecordsArray is now an array of objects: [{ dbId: 39, siteId: "24", key: "..." }, ...]
        render: (siteRecordsArray, record) => {
          return (
            <Space direction="vertical" size={4} style={{ width: "100%" }}>
              <Select
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                suffixIcon={<PlusOutlined />}
                style={{ width: "100%" }}
                placeholder="Add site visit..."
                value={null}
                onChange={(newSiteId) => {
                  handleAddSite(record.id, date, newSiteId);
                }}
                options={sitename.map((site) => ({
                  value: site.siteID.toString(),
                  label: site.siteShortName,
                }))}
              />
              <div className="flex flex-wrap gap-2">
                {(siteRecordsArray || [])
                  .filter((siteRecord) => siteRecord.siteId !== "0") // 🚫 exclude Site 0
                  .map((siteRecord) => (
                    <span
                      key={siteRecord.key}
                      className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center shadow-md"
                    >
                      {getSiteShortName(siteRecord.siteId)}

                      <button
                        type="button"
                        className="ml-2 text-white/80 hover:text-white focus:outline-none"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveSite(record.id, date, siteRecord.dbId);
                        }}
                        aria-label="Remove site"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
              </div>
            </Space>
          );
        },
      });
    }

    columns.push({
      title: "Action",
      key: "action",
      fixed: "right",
      width: 100,
      render: (_, record) => (
        <Button type="primary" onClick={() => saveSingleRecord(record.id)}>
          Save
        </Button>
      ),
    });

    return columns;
  };

  // Save a single record - NOW WITH CLEAR PLACEHOLDER LOGIC
  const saveSingleRecord = async (recordId) => {
    const record = tableData.find((r) => r.id === recordId);
    if (!record) return;

    let requiresSave = false;
    const recordsToSync = [];
    const daysInMonth = selectedMonth.daysInMonth();

    for (let i = 1; i <= daysInMonth; i++) {
      const date = selectedMonth.date(i).format("DD");
      const fullDate = selectedMonth.date(i).format("YYYY-MM-DD");
      const field = `attendance_${date}`;
      const currentValue = record[field] || [];

      // Find the original data for comparison
      const originalArrayForComparison =
        originalData.find((r) => r.id === recordId)?.[field] || [];

      // Simple check to detect if any attendance site/day combination has changed
      const currentSiteIds = JSON.stringify(currentValue.map((r) => r.siteId));
      const originalSiteIds = JSON.stringify(
        originalArrayForComparison.map((r) => r.siteId)
      );

      if (currentSiteIds !== originalSiteIds) {
        requiresSave = true;

        if (currentValue.length > 0) {
          // Case A: Sites are present - push all current site records
          currentValue.forEach((siteRecord) => {
            const siteDetails = sitename.find(
              (s) => s.siteID.toString() === siteRecord.siteId.toString()
            );
            const khurakiAmt = siteDetails
              ? DriverOrHelper === "Driver"
                ? siteDetails.DriverKhurakiAmt
                : siteDetails.HelperKhurakiAmt
              : 0;
            recordsToSync.push({
              DutyDate: fullDate,
              DriverID: DriverOrHelper === "Driver" ? record.id : null,
              HelperID: DriverOrHelper === "Helper" ? record.id : null,
              SiteID: parseInt(siteRecord.siteId, 10),
              KhurakiAmt: khurakiAmt,
            });
          });
        } else {
          // Case B: currentValue is EMPTY (i.e., user cleared all sites for this day).
          // PUSH A PLACEHOLDER RECORD to trigger the DELETE operation in the SP.
          recordsToSync.push({
            DutyDate: fullDate,
            DriverID: DriverOrHelper === "Driver" ? record.id : null,
            HelperID: DriverOrHelper === "Helper" ? record.id : null,
            SiteID: 0, // Placeholder: SiteID 0 (or null) signals a clear operation
            KhurakiAmt: 0,
          });
        }
      }
    }

    if (!requiresSave) {
      toast.info(
        "No changes (additions, deletions, or modifications) to save for this record."
      );
      return;
    }
    setSavingAll(true);

    try {
      // Dispatch the action and capture the result
      const actionResult = await dispatch(
        createDriverHelperAttendance({ id: 0, values: recordsToSync })
      );

      // Assuming a successful RTK thunk resolves to an object with a payload,
      // and that payload contains the API response (status, message, count).
      const apiResponse = actionResult.payload;
      const { insertedCount, deletedCount, failedCount } =
        parseCountsFromMessage(apiResponse?.message || "");

      // Construct the detailed toast message
      const toastMessage = (
        <div>
          <strong>Attendance Save Successful!</strong>
        </div>
      );

      toast.success(toastMessage, {
        autoClose: 5000,
        theme: "colored",
      });

      // After successful save, re-fetch data to get the new DB IDs
      dispatch(
        loadAllDriverHelperAttendance({
          requestArgs: {
            page: 1,
            count: 20,
            status: DriverOrHelper,
            siteId: siteId,
          },
          selectedMonth: selectedMonth.format("MM/YYYY"),
        })
      );
    } catch (error) {
      console.error("Error saving attendance:", error);
      toast.error("Failed to save attendance");
    } finally {
      setSavingAll(false);
    }
  };

  // Save all records - NOW WITH CLEAR PLACEHOLDER LOGIC
  const saveAllRecords = async () => {
    if (!window.confirm("Are you sure you want to save all changes?")) return;

    try {
      setSavingAll(true);
      const recordsToSync = [];
      let requiresSave = false;

      for (const record of tableData) {
        const originalRecord =
          originalData.find((r) => r.id === record.id) || {};
        const daysInMonth = selectedMonth.daysInMonth();

        for (let i = 1; i <= daysInMonth; i++) {
          const date = selectedMonth.date(i).format("DD");
          const fullDate = selectedMonth.date(i).format("YYYY-MM-DD");
          const field = `attendance_${date}`;
          const currentValue = record[field] || [];
          const originalValue = originalRecord[field] || [];

          const currentSiteIds = JSON.stringify(
            currentValue.map((r) => r.siteId)
          );
          const originalSiteIds = JSON.stringify(
            originalValue.map((r) => r.siteId)
          );

          if (currentSiteIds !== originalSiteIds) {
            requiresSave = true;

            if (currentValue.length > 0) {
              // Case A: Sites are present - push all current site records
              currentValue.forEach((siteRecord) => {
                const siteDetails = sitename.find(
                  (s) => s.siteID.toString() === siteRecord.siteId.toString()
                );
                const khurakiAmt = siteDetails
                  ? DriverOrHelper === "Driver"
                    ? siteDetails.DriverKhurakiAmt
                    : siteDetails.HelperKhurakiAmt
                  : 0;
                recordsToSync.push({
                  DutyDate: fullDate,
                  DriverID: DriverOrHelper === "Driver" ? record.id : null,
                  HelperID: DriverOrHelper === "Helper" ? record.id : null,
                  SiteID: parseInt(siteRecord.siteId, 10),
                  KhurakiAmt: khurakiAmt,
                });
              });
            } else {
              // Case B: currentValue is EMPTY - PUSH A PLACEHOLDER RECORD
              recordsToSync.push({
                DutyDate: fullDate,
                DriverID: DriverOrHelper === "Driver" ? record.id : null,
                HelperID: DriverOrHelper === "Helper" ? record.id : null,
                SiteID: 0, // Placeholder: SiteID 0 (or null) signals a clear operation
                KhurakiAmt: 0,
              });
            }
          }
        }
      }

      if (!requiresSave) {
        toast.info("No changes to save across all records.");
        setSavingAll(false);
        return;
      }

      // Dispatch the action and capture the result
      const actionResult = await dispatch(
        createDriverHelperAttendance({ id: 0, values: recordsToSync })
      );

      // Assuming a successful RTK thunk resolves to an object with a payload,
      // and that payload contains the API response (status, message, count).
      const apiResponse = actionResult.payload;
      console.log("apiResponse", apiResponse);
      const { insertedCount, deletedCount, failedCount } =
        parseCountsFromMessage(apiResponse?.message || "");

      // Construct the detailed toast message
      const toastMessage = (
        <div>
          <strong>All Attendance save Successful!</strong>
          {/* <ul className="list-disc ml-4 mt-1">
            <li>
              ✅ Inserted: <strong>{insertedCount}</strong>
            </li>
            <li>
              🗑️ Deleted: <strong>{deletedCount}</strong>
            </li>
            <li>
              ❌ Failed/Ignored: <strong>{failedCount}</strong>
            </li>
          </ul> */}
        </div>
      );

      toast.success(toastMessage, {
        autoClose: 5000,
        theme: "colored",
      });

      // Re-fetch data to get new DB IDs
      dispatch(
        loadAllDriverHelperAttendance({
          requestArgs: {
            page: 1,
            count: 20,
            status: DriverOrHelper,
            siteId: siteId,
          },
          selectedMonth: selectedMonth.format("MM/YYYY"),
        })
      );
    } catch (error) {
      console.error("Error saving all attendance:", error);
      toast.error("Failed to save attendance");
    } finally {
      setSavingAll(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = tableData.filter((row) =>
    row.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full px-4 sm:px-6 md:px-8">
      <Title
        level={4}
        className="py-3 text-lg text-center sm:text-xl md:text-2xl"
      >
        DRIVER / HELPER ATTENDANCE
      </Title>

      <Form form={form} layout="vertical" initialValues={{ month: dayjs() }}>
        {/* FILTERS AND INPUTS (RETAINED) */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Form.Item
            label="Driver/Helper"
            name="driverHelper"
            rules={[{ required: true }]}
            className="w-full sm:w-48"
          >
            <Select onChange={setDriverOrHelper} defaultValue="Helper">
              <Select.Option value="Driver">Driver</Select.Option>
              <Select.Option value="Helper">Helper</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Month"
            name="month"
            rules={[{ required: true }]}
            className="w-full sm:w-48"
          >
            <DatePicker
              picker="month"
              format="MMMM"
              onChange={setSelectedMonth}
              className="w-full"
            />
          </Form.Item>

          <Form.Item
            label="Site"
            name="site"
            rules={[{ required: true }]}
            className="w-full sm:w-64"
          >
            <Select
              onChange={setSiteId}
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {sitename.map((site) => (
                <Select.Option key={site.siteID} value={site.siteID}>
                  {site.siteName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Search" className="w-full md:w-72">
            <Input
              placeholder="Search by name"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </Form.Item>

          <div className="flex items-end">
            <Button
              type="primary"
              onClick={saveAllRecords}
              loading={savingAll}
              disabled={savingAll}
              className="w-full sm:w-auto"
            >
              Save All
            </Button>
          </div>
        </div>
      </Form>

      {/* SHOW ALL SITES TOGGLE (RETAINED) */}
      <div className="mt-4">
        <button
          onClick={() => setIsAllSites((prev) => !prev)}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition-all 
          ${
            isAllSites
              ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {isAllSites ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 7h18M3 12h18M3 17h18"
              />
            </svg>
          )}

          {isAllSites ? "Show My Sites" : "Show All Sites"}
        </button>
      </div>

      {/* TABLE (RETAINED) */}
      <Spin spinning={loading}>
        <Table
          bordered
          dataSource={filteredData}
          columns={generateColumns()}
          scroll={{ x: "max-content", y: "calc(100vh - 300px)" }}
          pagination={{
            pageSize: pagination.pageSize,
            showSizeChanger: true,
            pageSizeOptions: ["20", "50", "100"],
          }}
          onChange={(pagination) => setPagination(pagination)}
        />
      </Spin>
    </div>
  );
};

export default GetAllDriverHelperAttendance;
