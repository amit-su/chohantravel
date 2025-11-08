import { Button, DatePicker, Form, Input, Select, TimePicker } from "antd";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import dayjs from "dayjs";
import { toast } from "react-toastify";

import { loadAllBusCategory } from "../../../redux/rtk/features/busCategory/busCategorySlice";
import { updateLocalProforma } from "../../../redux/rtk/features/localProformaInvoice/localProformaSlice";

import { loadAllBus } from "../../../redux/rtk/features/bus/busSlice";
import { updateLocalBooking } from "../../../redux/rtk/features/localBusBooking/localBusBookingSlice";
function UpdatePartyBusListDrawer({ data, id, onClose }) {
  //Date issue//
  const convertToISO = (date) => {
    if (moment(date, moment.ISO_8601, true).isValid()) {
      return date;
    }

    if (moment(date, "DD-MM-YYYY", true).isValid()) {
      return moment(date, "DD-MM-YYYY").format("YYYY-MM-DD");
    }

    return null;
  };
  //END//
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const calculateAmount = (rate, busQty) => {
    return rate * busQty;
  };

  const handleLoadBus = () => {
    dispatch(loadAllBusCategory({ page: 1, count: 10000, status: true }));
  };
  // const { list: busList } = useSelector((state) => state.buses);
  const { list: busCategoryList } = useSelector((state) => state.busCategories);

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        busType: data.BusTypeID, // The Select uses the ID
        sittingCapacity: data.sittingCapacity,
        tripDescription: data.tripDescription,
        ReportDate: data.ReportDate,
        tripEndDate: data.tripEndDate,
        reportTime: data.reportTime,
        busQty: data.busQty,
        rate: data.rate,
        amount: data.amount,
      });
    }
  }, [data, form]);

  const onFinish = async (values) => {
    try {
      const selectedBusTypeId = values.busType;

      const selectedBusCategory = busCategoryList?.find(
        (busCategory) => busCategory.id === selectedBusTypeId
      );

      const busCategoryName = selectedBusCategory
        ? selectedBusCategory.buscategory
        : data.busCategory; // Fallback to original name
      const busTypeIdFinal = selectedBusCategory
        ? selectedBusCategory.id
        : data.BusTypeID; // Fallback to original ID

      values.busCategory = busCategoryName;
      values.BusTypeID = busTypeIdFinal;

      dispatch(updateLocalProforma({ id, values }));
      toast.success("Update successful!");

      console.log("value", values);

      setLoader(false);

      onClose(values);
    } catch (error) {
      setLoader(false);
    }
  };

  const handleBusTypeChange = (value) => {
    const selectedBus = busCategoryList.find((bus) => bus.id === value);
    if (selectedBus) {
      form.setFieldsValue({ sittingCapacity: selectedBus.sittingCapacity });
    }
  };

  const onFinishFailed = () => {};

  const formatDateInput = (e, fieldName) => {
    let value = e.target.value.replace(/\D/g, ""); // Keep only digits

    if (value.length > 8) value = value.slice(0, 8);

    let formatted = value;
    if (value.length >= 5) {
      formatted = `${value.slice(0, 2)}-${value.slice(2, 4)}-${value.slice(4)}`;
    } else if (value.length >= 3) {
      formatted = `${value.slice(0, 2)}-${value.slice(2)}`;
    }

    form.setFieldsValue({ [fieldName]: formatted });
  };

  return (
    <>
      <div className="text-center">
        <div className="">
          <Form
            initialValues={data}
            form={form}
            layout="vertical"
            name="basic"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            {/* <Form.Item
              style={{ marginBottom: "10px" }}
              label="SLNO"
              name="SLNO"
              rules={[
                {
                  required: true,
                  message: "Please fill input !",
                },
              ]}
            >
              <Input type="number" />
            </Form.Item> */}
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
                showSearch
                optionFilterProp="children"
                onClick={handleLoadBus}
                onChange={handleBusTypeChange}
                placeholder="Select bus type"
              >
                {busCategoryList?.map((category) => (
                  <Select.Option key={category.id} value={category.id}>
                    {category.buscategory}
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
                  required: false,
                  message: "Please fill input !",
                },
              ]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              style={{ marginBottom: "10px" }}
              label="Trip Description"
              name="tripDescription"
              rules={[
                {
                  required: false,
                  message: "Please fill input !",
                },
              ]}
            >
              <Input />
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
                  const amount = calculateAmount(rate, busQty);
                  form.setFieldsValue({ amount });
                }}
              />
            </Form.Item>
            <Form.Item
              style={{ marginBottom: "10px" }}
              label="Rate"
              name="rate"
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
                  const amount = calculateAmount(rate, busQty);
                  form.setFieldsValue({ amount });
                }}
              />
            </Form.Item>

            <Form.Item
              style={{ marginBottom: "10px" }}
              label="Amount"
              name="amount"
              rules={[
                {
                  required: false,
                  message: "Please input branch!",
                },
              ]}
            >
              <Input type="number" />
            </Form.Item>

            <Form.Item style={{ marginBottom: "10px" }}>
              <Button
                onClick={() => setLoader(true)}
                // block
                type="primary"
                htmlType="submit"
                loading={loader}
                shape="round"
              >
                Update Now
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
}

export default UpdatePartyBusListDrawer;
