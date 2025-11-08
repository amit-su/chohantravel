import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  TimePicker,
} from "antd";
import { toast } from "react-toastify";

import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import axios from "axios";
import dayjs from "dayjs";
import { loadAllBus } from "../../../redux/rtk/features/bus/busSlice";
import { loadAllBusCategory } from "../../../redux/rtk/features/busCategory/busCategorySlice";

import { updateLocalBooking } from "../../../redux/rtk/features/localBusBooking/localBusBookingSlice";
import TextArea from "antd/es/input/TextArea";
function UpdateBookingDrawer({ data, id, isIncludeGST, onClose }) {
  //Date issue//
  const convertToISO = (date) => {
    if (moment(date, moment.ISO_8601, true).isValid()) {
      return date;
    }

    if (moment(date, "DD-MM-YYYY", true).isValid()) {
      return moment(date, "DD-MM-YYYY");
    }

    return null;
  };
  //END//
  //API CALL//
  const [list2, setList] = useState([]);

  const [loading2, setLoading2] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_APP_API;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/busCategory`);
        setList(response.data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading2(false);
      }
    };

    // Call the function
    fetchData();
  }, []);
  //END//
  const busCatList = list2;
  console.log("data", data);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  console.log(data, "76565645");
  const [fixedRate, setFixedRate] = useState(
    data?.rateType == "FR" ? true : false
  );
  const handleRateType = (value) => {
    value == "FR" ? setFixedRate(true) : setFixedRate(false);
  };
  const [loader, setLoader] = useState();

  const [initValues, setInitValues] = useState({
    ReportDate: data?.ReportDate,
    Amt: data?.Amt,
    busQty: data?.busQty,
    busType: data?.busCategory,
    rate: data?.rate,
    reportTime: data?.reportTime,
    ReturnTime: data?.ReturnTime,

    sittingCapacity: data?.sittingCapacity,
    tripDescription: data?.tripDescription,
    tripEndDate: data?.tripEndDate,

    rate2: data?.rate2,
    rateType: data?.rateType,
    kms: data?.kms,
    includeGST: data?.includeGST,
    hours: data?.hours,
    extraHourRate: data?.extraHourRate,
    extraKMRate: data?.extraKMRate,

    BusTypeID: data?.BusTypeID,
  });
  console.log(id);
  const [selectedTime, setSelectedTime] = useState(
    moment(initValues.reportTime, "HH:mm")
  );
  const [selectedTime1, setSelectedTime1] = useState(
    initValues.ReturnTime,
    "HH:mm"
  );

  const calculateAmount = (rate, busQty) => {
    return rate * busQty;
  };
  const handleLoadBus = () => {
    dispatch(loadAllBusCategory({ page: 1, count: 10000, status: true }));
  };

  const bus1 = initValues.BusTypeID;
  const bustypeinit = initValues.busType;
  console.log("initValues", initValues);
  // const { list: busCatList } = useSelector((state) => state.busCategories);
  console.log(busCatList, "89888887");
  const onFinish = async (values) => {
    try {
      const selectedBusTypeId = values?.busType;
      const selectedBusCategory = busCatList?.find(
        (busCategory) => busCategory.id === selectedBusTypeId
      );
      const busCategoryName = selectedBusCategory
        ? selectedBusCategory.buscategory
        : bustypeinit;
      values.busCategory = busCategoryName;

      values.BusTypeID = selectedBusCategory ? selectedBusCategory.id : bus1;

      values.sittingCapacity = values.sittingCapacity;
      values.tripDescription = values.tripDescription;
      values.rate = values.rate;
      values.rate2 = values.rate2;
      values.busQty = values.busQty;

      values.Amt = values.Amt;
      values.hours = values.hours;
      values.extraHourRate = values.extraHourRate;
      values.kms = values.kms;

      // values.ReportDate = values.ReportDate?.format("DD-MM-YYYY") || "";
      // values.tripEndDate = values.tripEndDate?.format("DD-MM-YYYY") || "";

      // values.reportTime =
      //   selectedTime?.format("hh:mm a") ||
      //   initValues?.reportTime.format("hh:mm a");
      // values.ReturnTime =
      //   selectedTime1?.format("hh:mm a") ||
      //   initValues?.ReturnTime.format("hh:mm a");

      values.ID = id;
      dispatch(updateLocalBooking({ id, values }));
      toast.success("Save !");

      setLoader(false);
      onClose({ id: id, values: values });
    } catch (error) {
      setLoader(false);
    }
  };
  const handleChange = (time) => {
    setSelectedTime(time);
  };
  const handleChange1 = (time) => {
    setSelectedTime1(time);
  };
  const handleBusTypeChange = (value) => {
    const selectedBus = busCatList.find((bus) => bus.id === value);
    if (selectedBus) {
      form.setFieldsValue({ sittingCapacity: selectedBus.sittingCapacity });
    }
  };
  let reportDate = initValues.ReportDate._i;
  let ab = dayjs(reportDate, "DD-MM-YYYY");
  const [selectedDate, setSelectedDate] = useState(ab);

  const handleDateChange = useCallback((date) => {
    const newDate = dayjs(date, "DD-MM-YYYY");
    setSelectedDate(newDate.isValid() ? newDate : dayjs());
  }, []);

  let date = initValues.tripEndDate._i;
  let ab2 = dayjs(date, "DD-MM-YYYY");
  const [selectedDate2, setSelectedDate2] = useState(ab2);

  const handleDateChange2 = useCallback((date) => {
    const newDate = dayjs(date, "DD-MM-YYYY");
    console.log("new Date", newDate);
    setSelectedDate2(newDate.isValid() ? newDate : dayjs());
  }, []);

  const onFinishFailed = () => {};

  const formatDateInput = (e, fieldName) => {
    let value = e.target.value.replace(/\D/g, ""); // Only digits
    if (value.length > 8) value = value.slice(0, 8);

    let formatted = value;
    if (value.length > 4) {
      formatted = `${value.slice(0, 2)}-${value.slice(2, 4)}-${value.slice(4)}`;
    } else if (value.length > 2) {
      formatted = `${value.slice(0, 2)}-${value.slice(2)}`;
    }

    form.setFieldsValue({ [fieldName]: formatted });
  };

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        style={{ marginLeft: "40px", marginRight: "40px" }}
        initialValues={initValues} // Set initial values here
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        labelAlign="left"
      >
        <div className="flex flex-wrap justify-between">
          <div className="w-full p-2 md:w-1/2">
            <Form.Item
              style={{ marginBottom: "10px" }}
              label="Bus Type"
              name="busType"
              rules={[
                {
                  required: false,
                  message: "Please fill input !",
                },
              ]}
            >
              <Select
                placeholder="Select bus type"
                defaultValue={initValues?.buscattpe}
              >
                {busCatList?.map((busCategory) => (
                  <Select.Option key={busCategory.id} value={busCategory.id}>
                    {busCategory.buscategory}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              style={{ marginBottom: "10px" }}
              label="Sitting Capacity"
              name="sittingCapacity"
              rules={[
                {
                  required: true,
                  message: "Please fill input !",
                },
              ]}
            >
              <Input
                placeholder="Enter Sitting Capacity of Bus"
                type="number"
              />
            </Form.Item>
            <Form.Item
              style={{ marginBottom: "10px" }}
              label="Trip Description"
              name="tripDescription"
              rules={[
                {
                  required: true,
                  message: "Please fill input !",
                },
              ]}
            >
              <TextArea placeholder="Enter  Description" rows={4} />
            </Form.Item>

            <Form.Item
              label="Trip Start Date"
              name="ReportDate"
              rules={[{ required: false, message: "Please fill input!" }]}
            >
              <Input
                maxLength={10}
                placeholder="DD-MM-YYYY"
                onChange={(e) => formatDateInput(e, "ReportDate")}
              />
            </Form.Item>

            <Form.Item
              label="Trip End Date"
              name="tripEndDate"
              rules={[{ required: false, message: "Please fill input!" }]}
            >
              <Input
                maxLength={10}
                placeholder="DD-MM-YYYY"
                onChange={(e) => formatDateInput(e, "tripEndDate")}
              />
            </Form.Item>

            <Form.Item
              style={{ marginBottom: "10px" }}
              label="Hours"
              name="hours"
              hidden={fixedRate}
              rules={[
                {
                  required: !fixedRate,
                  message: "Please provide input !",
                },
              ]}
            >
              <InputNumber />
            </Form.Item>

            <Form.Item
              style={{ marginBottom: "10px" }}
              label="Kilometers"
              name="kms"
              hidden={fixedRate}
              rules={[
                {
                  required: !fixedRate,
                  message: "Please provide input !",
                },
              ]}
            >
              <InputNumber />
            </Form.Item>
          </div>
          <div className="w-full p-2 md:w-1/2">
            <Form.Item
              style={{ marginBottom: "10px" }}
              label="Report Time"
              name="reportTime"
              rules={[
                {
                  required: true,
                  message: "Please fill input!",
                },
              ]}
            >
              <Input
                placeholder="HH:mm"
                maxLength={5}
                onInput={(e) => {
                  let value = e.target.value.replace(/\D/g, ""); // Remove non-digits
                  if (value.length > 4) value = value.slice(0, 4);

                  let formatted = value;
                  if (value.length >= 3) {
                    formatted = `${value.slice(0, 2)}:${value.slice(2)}`;
                  } else if (value.length >= 1) {
                    formatted = value;
                  }

                  e.target.value = formatted;
                  form.setFieldsValue({ reportTime: formatted });
                }}
              />
            </Form.Item>

            <Form.Item
              style={{ marginBottom: "10px" }}
              label="Bus Return Time"
              name="ReturnTime"
              rules={[
                {
                  required: true,
                  message: "Please fill input!",
                },
              ]}
            >
              <Input
                placeholder="HH:mm"
                maxLength={5}
                onInput={(e) => {
                  let value = e.target.value.replace(/\D/g, ""); // Remove non-digits
                  if (value.length > 4) value = value.slice(0, 4);

                  let formatted = value;
                  if (value.length >= 3) {
                    formatted = `${value.slice(0, 2)}:${value.slice(2)}`;
                  } else if (value.length >= 1) {
                    formatted = value;
                  }

                  e.target.value = formatted;
                  form.setFieldsValue({ ReturnTime: formatted });
                }}
              />
            </Form.Item>

            <Form.Item
              style={{ marginBottom: "10px" }}
              label="Rate type"
              name="rateType"
              rules={[
                {
                  required: true,
                  message: "Please provide input !",
                },
              ]}
            >
              <Select onChange={handleRateType} placeholder="Select Rate type">
                <Select.Option value="FR">Fixed Rate</Select.Option>
                <Select.Option value="KMPH">KM-HRS</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              style={{ marginBottom: "10px" }}
              label="No of Bus"
              name="busQty"
              rules={[
                {
                  required: false,
                  message: "Please fill input !",
                },
              ]}
            >
              <Input
                type="number"
                onChange={(e) => {
                  const busQty = e.target.value;
                  const rate = form.getFieldValue("rate");
                  const Amt = calculateAmount(rate, busQty);
                  form.setFieldsValue({ Amt });
                }}
              />
            </Form.Item>
            <Form.Item
              style={{ marginBottom: "10px" }}
              label="Rate"
              name="rate"
              hidden={!fixedRate}
              rules={[
                {
                  required: false,
                  message: "Please fill input !",
                },
              ]}
            >
              <Input
                type="number"
                onChange={(e) => {
                  const rate = e.target.value;
                  const busQty = form.getFieldValue("busQty");
                  const Amt = calculateAmount(rate, busQty);
                  form.setFieldsValue({ Amt });
                }}
              />
            </Form.Item>
            <Form.Item
              style={{ marginBottom: "10px" }}
              label="Amount"
              name="Amt"
              hidden={!fixedRate}
              rules={[
                {
                  required: false,
                  message: "Please input branch!",
                },
              ]}
            >
              <InputNumber />
            </Form.Item>

            {/* <Form.Item
                style={{ marginBottom: "10px" }}
                hidden={isIncludeGST === "0" ? true : false}
                label="Include GST"
                name="includeGST"
                rules={[
                  {
                    required: false,
                    message: "Please provide input !",
                  },
                ]}
              >
                <Select placeholder="Include GST?">
                  <Select.Option value="1">Yes</Select.Option>
                  <Select.Option value="0">No</Select.Option>
                </Select>
              </Form.Item> */}
            <Form.Item
              style={{ marginBottom: "0px", marginTop: "10em" }}
              label="Extra Hour Rate"
              name="extraHourRate"
              hidden={fixedRate}
              rules={[
                {
                  required: !fixedRate,
                  message: "Please provide input !",
                },
              ]}
            >
              <InputNumber />
            </Form.Item>
            <Form.Item
              style={{ marginBottom: "5px", marginTop: "7px" }}
              label="Extra KM Rate"
              name="extraKMRate"
              hidden={fixedRate}
              rules={[
                {
                  required: !fixedRate,
                  message: "Please provide input !",
                },
              ]}
            >
              <InputNumber />
            </Form.Item>
          </div>
        </div>
        <Form.Item className="flex justify-center mt-[24px]">
          <Button
            type="primary"
            htmlType="submit"
            shape="round"
            className="mb-3"
          >
            Save
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default UpdateBookingDrawer;
