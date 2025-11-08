import { Button, Form, Input, Select, DatePicker, TimePicker } from "antd";
import React, { useEffect, useState, useCallback } from "react";
import moment from "moment";
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";
import { loadAllBus } from "../../redux/rtk/features/bus/busSlice";
import dayjs from "dayjs";
import { loadAllDriver } from "../../redux/rtk/features/driver/driverSlice";
import { loadAllHelper } from "../../redux/rtk/features/helper/helperSlice";
import {
  loadAllBookingBusAllotment,
  loadSingleBookingBusAllotment,
  updateBookingBusAllotment,
} from "../../redux/rtk/features/bookingBusAllotment/bookingBusAllotmentSlice";
import {
  loadAllDriverHelperAttendance,
  updateDriverHelperAttendance,
  createDriverHelperAttendance,
} from "../../redux/rtk/features/driverHelperAttendance/driverHelperAttendanceSlice";
const AllotBusDrawer = ({
  data,
  id,
  formattedBookingID,
  decodedBookingID,
  onClose,
}) => {
  const userId = Number(localStorage.getItem("id"));
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { list } = useSelector((state) => state.StateNames);
  const { list: busList } = useSelector((state) => state.buses);
  const { list: driverList } = useSelector((state) => state.drivers);
  const { list: helperList } = useSelector((state) => state.helpers);
  const [selectedTime, setSelectedTime] = useState();
  const [loader, setLoader] = useState();
  const [initValues, setInitValues] = useState({
    AllotedBusNo: data?.BusAllotmentStatus ? parseInt(data?.BusID) : undefined,
    allotedDriver: data?.BusAllotmentStatus ? data?.DriverID : undefined,
    allotedHelper: data?.BusAllotmentStatus ? data?.HelperID : undefined,
    ReportDate: moment(data?.CreateDate),
    reportTime: data?.reportTime ? moment(data.reportTime, "HH:mm:ss") : null,
    site: data.SiteID,
  });
  const apiUrl = import.meta.env.VITE_APP_API;

  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [sitename, setSitename] = useState([]);
  const [siteId, setSiteId] = useState();
  const handleDateChange = useCallback((date) => {
    const newDate = dayjs(date, "YYYY-MM-DD");
    setSelectedDate(newDate.isValid() ? newDate : dayjs());
  }, []);

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const endpoint =
          userId === 1 ? `${apiUrl}/site` : `${apiUrl}/site/${userId}`;
        const response = await axios.get(endpoint);
        setSitename(response.data.data);
      } catch (error) {
        console.error("Error fetching sites:", error);
      }
    };
    fetchSites();
  }, [userId, apiUrl]);

  const onFinish = async (values) => {
    try {
      values = { ...values, ...data };

      values.ReportDate = selectedDate.isValid()
        ? selectedDate.format("YYYY-MM-DD")
        : "";
      values.reportTime = selectedTime?.format("HH:mm") || null;

      const uppercaseValues = Object.keys(values).reduce((acc, key) => {
        acc[key] =
          typeof values[key] === "string"
            ? values[key].toUpperCase()
            : values[key];
        return acc;
      }, {});
      // Get selected bus object
      const selectedBus = busList?.find(
        (bus) => bus.id === values.AllotedBusNo
      );

      // Get selected driver object
      const selectedDriver = driverList?.find(
        (driver) => driver.id === values.allotedDriver
      );

      // Populate null values from the selected bus and driver
      const updatedValues = {
        ...uppercaseValues,
        ID: id,
        BusID: selectedBus?.id,
        BusNo: selectedBus?.busNo,
        DriverID: selectedDriver?.id,
        BusAllotmentStatus: 1,
        DriverContactNo: selectedDriver ? selectedDriver.mobileNo : null, // Populate DriverContactNo from selected driver
        HelperID: values?.allotedHelper,
      };

      // const { TripStartDate, TripEndDate, site, DriverID, HelperID } =
      //   updatedValues;

      // const end = new Date(TripEndDate);

      // const createAttendanceLoop = async (type, id) => {
      //   const start = new Date(TripStartDate);

      //   while (start <= end) {
      //     const day = String(start.getDate()).padStart(2, "0");
      //     const month = String(start.getMonth() + 1).padStart(2, "0");
      //     const year = start.getFullYear();

      //     const payload = {
      //       id: id,
      //       values: {
      //         id: id,
      //         attendance: [{ date: day, status: String(site) }],
      //         month: `${month}/${year}`,
      //         type: type,
      //       },
      //     };

      //     console.log("payload", payload);

      //     // await dispatch(updateDriverHelperAttendance(payload));
      //     start.setDate(start.getDate() + 1);
      //   }
      // };
      // await createAttendanceLoop("Helper", HelperID);
      // await createAttendanceLoop("Driver", DriverID);

      const { TripStartDate, TripEndDate, site, DriverID, HelperID } =
        updatedValues;

      const end = new Date(TripEndDate);

      const createAttendanceLoop = async (type, id) => {
        const start = new Date(TripStartDate);
        const records = [];

        // Ensure site is always an array
        const siteIds = Array.isArray(site) ? site : [site];

        while (start <= end) {
          const dutyDate = start.toISOString().split("T")[0]; // YYYY-MM-DD

          siteIds.forEach((siteId) => {
            const siteDetails = sitename.find((s) => s.siteID === siteId);
            const khurakiAmt = siteDetails
              ? type === "Driver"
                ? siteDetails.DriverKhurakiAmt
                : siteDetails.HelperKhurakiAmt
              : 0;

            records.push({
              DutyDate: dutyDate,
              DriverID: type === "Driver" ? id : null,
              HelperID: type === "Helper" ? id : null,
              SiteID: siteId,
              KhurakiAmt: khurakiAmt,
              BookingID: updatedValues.BookingID,
            });
          });

          start.setDate(start.getDate() + 1);
        }
        return records;
      };

      const helperPayload = await createAttendanceLoop("Helper", HelperID);
      const driverPayload = await createAttendanceLoop("Driver", DriverID);
      const finalPayload = [...helperPayload, ...driverPayload];
      if (finalPayload.length > 0) {
        console.log("finalPayload", finalPayload);
        await dispatch(
          createDriverHelperAttendance({ id: 0, values: finalPayload })
        );
      }

      const res = await dispatch(
        updateBookingBusAllotment({ id, values: updatedValues })
      );
      if (res) {
        const res = dispatch(
          loadSingleBookingBusAllotment({
            id: formattedBookingID,
            decodedBookingID,
            page: 1,
            count: 10000,
            status: true,
            allotmentStatus: 0,
          })
        );
      }
      onClose();

      setLoader(false);
    } catch (error) {
      setLoader(false);
    }
  };

  const handleBusSelect = (busId) => {
    // Find the selected bus object from busList
    const selectedBus = busList?.find((bus) => bus.id === busId);

    // Set default values for driver and helper based on the selected bus
    const newValues = {
      ...initValues,
      AllotedBusNo: busId,
      allotedDriver: parseInt(selectedBus?.driverID),
      allotedHelper: parseInt(selectedBus?.helperID),
      site: siteId,
    };

    console.log("initValues", siteId);
    setInitValues(newValues);
    form.setFieldsValue(newValues);
  };

  const handleChange = (time) => {
    setSelectedTime(time);
  };

  useEffect(() => {
    dispatch(loadAllBus({ page: 1, count: 10000, status: true }));
    dispatch(loadAllDriver({ page: 1, count: 10000, status: true }));
    dispatch(loadAllHelper({ page: 1, count: 10000, status: true }));
    form.setFieldsValue(initValues);
  }, [initValues, dispatch, form]);

  return (
    <div className="h-full">
      <Form
        form={form}
        layout="vertical"
        style={{ marginLeft: "40px", marginRight: "40px" }}
        initialValues={initValues} // Set initial values here
        onFinish={onFinish}
        autoComplete="off"
        labelAlign="left"
      >
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

        <Form.Item
          style={{ marginBottom: "10px" }}
          label="Bus No:"
          name="AllotedBusNo"
          rules={[
            {
              required: false,
              message: "Please fill input !",
            },
          ]}
        >
          <Select
            optionFilterProp="children" // Filters options based on the content of the children (party names)
            showSearch
            onChange={handleBusSelect}
            placeholder="Select bus type"
          >
            {busList
              ?.filter((bus) => bus.busCategory === data.BusTypeName)
              .map((bus) => (
                <Select.Option key={bus.id} value={bus.id}>
                  {bus.busNo}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item
          style={{ marginBottom: "10px" }}
          label="Allocate Driver"
          name="allotedDriver"
          rules={[
            {
              required: false,
              message: "Please fill input !",
            },
          ]}
        >
          <Select
            optionFilterProp="children" // Filters options based on the content of the children (party names)
            showSearch
            placeholder="Select driver"
          >
            {driverList
              ?.filter(
                (driver, index, self) =>
                  index === self.findIndex((d) => d.name === driver.name)
              )
              .map((driver) => (
                <Select.Option key={driver.id} value={driver.id}>
                  {driver.name}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item
          style={{ marginBottom: "10px" }}
          label="Allocate Helper "
          name="allotedHelper"
          rules={[
            {
              required: false,
              message: "Please fill input !",
            },
          ]}
        >
          <Select
            optionFilterProp="children" // Filters options based on the content of the children (party names)
            showSearch
            placeholder="Select helper"
          >
            {helperList
              ?.filter(
                (helper, index, self) =>
                  index === self.findIndex((h) => h.name === helper.name)
              )
              .map((helper) => (
                <Select.Option key={helper.id} value={helper.id}>
                  {helper.name}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
        {/* <Form.Item
          style={{ marginBottom: "10px" }}
          label="Date"
          name="ReportDate"
          rules={[
            {
              required: false,
              message: "Please fill input !",
            },
          ]}
        >
          <DatePicker
            format={"DD-MM-YYYY"}
            defaultValue={dayjs()}
            onChange={(value) => handleDateChange(value)}
          />
        </Form.Item> */}
        <Form.Item
          style={{ marginBottom: "10px" }}
          className="flex justify-center mt-[24px]"
        >
          <Button
            onClick={() => setLoader(true)}
            block
            type="primary"
            htmlType="submit"
            loading={loader}
            shape="round"
          >
            Allot Bus Now
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AllotBusDrawer;
