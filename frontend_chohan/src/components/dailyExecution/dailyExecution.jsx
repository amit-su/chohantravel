// Import necessary modules from React, Ant Design, and Redux
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DatePicker, Form, Select } from "antd";
import UserPrivateComponent from "../PrivacyComponent/UserPrivateComponent";
import { Card, Button } from "antd";
import TableComponent from "../CommonUi/TableComponent";
import dayjs from "dayjs";
import axios from "axios";
import { loadAllDailyExecution, updateDailyExecution } from "../../redux/rtk/features/dailyExecution/dailyExecutionSlice";
import { loadAllDriver } from "../../redux/rtk/features/driver/driverSlice";
import { loadAllHelper } from "../../redux/rtk/features/helper/helperSlice";
import { loadAllBus } from "../../redux/rtk/features/bus/busSlice";

const DailyExecution = () => {
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [loadingSave, setLoadingSave] = useState(false);

  const { list: dailylist, total, loading: loadingDaily } = useSelector((state) => state.dailyExecutions);
  const { list: driverList } = useSelector((state) => state.drivers);
  const { list: helperList } = useSelector((state) => state.helpers);
  const { list: busList } = useSelector((state) => state.buses);

  const [newDriver, setNewDriver] = useState("");
  const [newHelper, setNewHelper] = useState("");
  const [newBus, setNewBus] = useState("");

  useEffect(() => {
    dispatch(loadAllDailyExecution({ status: selectedDate.format("YYYY-MM-DD"), page: 1, count: 10 }));
    dispatch(loadAllDriver({ page: 1, count: 10000, status: true }));
    dispatch(loadAllHelper({ page: 1, count: 10000, status: true }));
    dispatch(loadAllBus({ page: 1, count: 10000, status: true }));
  }, [dispatch, selectedDate]);

  const handleDateChange = useCallback((date) => {
    setSelectedDate(date || dayjs());
  }, []);

  const handleSelectChange1 = useCallback((value) => {
    setNewDriver(value);
  }, []);

  const handleSelectChange2 = useCallback((value) => {
    setNewHelper(value);
  }, []);

  const handleSelectChange3 = useCallback((value) => {
    setNewBus(value);
  }, []);

  const onSave = async (record) => {
    setLoadingSave(true);
    try {
      const updatedRecord = {
        ...record,
        HelperID: newHelper !== "" ? newHelper : record.HelperID,
        DriverID: newDriver !== "" ? newDriver : record.DriverID,
        busNo: newBus !== "" ? newBus : record.busNo,
      };

      const foundHelper = helperList?.find(helper => helper.id === updatedRecord.HelperID);
      const foundDriver = driverList?.find(driver => driver.id === updatedRecord.DriverID);

      updatedRecord.DriverName = foundDriver ? foundDriver.name : updatedRecord.DriverName;
      updatedRecord.HelperName = foundHelper ? foundHelper.name : updatedRecord.HelperName;

      await dispatch(updateDailyExecution({ id: record.id, values: updatedRecord }));
      dispatch(loadAllDailyExecution({ status: selectedDate.format("YYYY-MM-DD"), page: 1, count: 10 }));
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setLoadingSave(false);
    }
  };

  const columns = [
    {
      title: "Party Name",
      dataIndex: "PartyName",
      key: "PartyName",
      width: 200,
    },
    {
      title: "Site Name",
      dataIndex: "SiteName",
      key: "SiteName",
      width: 200,
    },
    {
      title: "Bus No",
      dataIndex: "busNo",
      key: "busNo",
      width: 150,
      render: (text, record) => (
        <Select
          optionFilterProp="children"
          showSearch
          defaultValue={text}
          style={{ width: 150 }}
          onChange={handleSelectChange3}
        >
          {busList?.map(bus => (
            <Select.Option key={bus.id} value={bus.busNo}>
              {bus.busNo}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Bus Type",
      dataIndex: "busType",
      key: "busType",
      width: 150,
    },
    {
      title: "Driver Name",
      dataIndex: "DriverName",
      key: "DriverName",
      width: 150,
      render: (text, record) => (
        <Select
          optionFilterProp="children"
          showSearch
          defaultValue={record.DriverID}
          style={{ width: 150 }}
          onChange={handleSelectChange1}
        >
          {driverList?.map(driver => (
            <Select.Option key={driver.id} value={driver.id}>
              {driver.name}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Helper Name",
      dataIndex: "HelperName",
      key: "HelperName",
      width: 150,
      render: (text, record) => (
        <Select
          optionFilterProp="children"
          showSearch
          onChange={handleSelectChange2}
          defaultValue={record.HelperID}
          style={{ width: 150 }}
        >
          {helperList?.map(helper => (
            <Select.Option key={helper.id} value={helper.id}>
              {helper.name}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Created On",
      dataIndex: "CreatedOn",
      key: "CreatedOn",
      render: (date) => dayjs(date).format("DD-MM-YYYY"),
      width: 150,
    },
    {
      title: "Action",
      key: "action",
      width: 60,
      render: (_, record) => (
        <div className="flex-initial flex items-center space-x-2">
          <Button
            type="primary"
            className="bg-green-600 text-white rounded-md flex text-center"
            style={{ width: "60px" }}
            loading={loadingSave}
            onClick={() => onSave(record)}
          >
            Save
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Card
      className="border-0 md:border md:p-6 bg-transparent md:bg-[#fafafa]"
      bodyStyle={{ padding: 0 }}
    >
      <Form.Item
        style={{
          marginBottom: "10px",
          width: "21%",
        }}
        label="Date"
        name="date"
      >
        <DatePicker
          picker="date"
          defaultValue={dayjs()}
          format={"YYYY-MM-DD"}
          onChange={handleDateChange}
          className="custom-date-picker"
        />
      </Form.Item>
      <div className="lg:flex items-center justify-between pb-3">
        <h1 className="text-lg font-bold">Daily Execution</h1>
      </div>
      <UserPrivateComponent permission={"readAll-dailyExecution"}>
        <TableComponent
          list={dailylist}
          csvFileName={"dailyExecution"}
          total={total}
          loading={loadingDaily}
          columns={columns}
          paginatedThunk={loadAllDailyExecution}
          paginationStatus={selectedDate.format("YYYY-MM-DD")}
          scrollX={1700}
          pageSize={10}
        />
      </UserPrivateComponent>
    </Card>
  );
};

export default DailyExecution;
