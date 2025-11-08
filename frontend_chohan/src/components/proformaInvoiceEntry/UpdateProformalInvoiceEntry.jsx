import { Button, DatePicker, Form, Input, Select, TimePicker } from "antd";
import React, { useBusCategory, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import dayjs from "dayjs";
import { toast } from "react-toastify";

import { loadAllBusCategory } from "../../redux/rtk/features/busCategory/busCategorySlice";
import { updateLocalProforma } from "../../redux/rtk/features/localProformaInvoice/localProformaSlice";

import { loadAllBus } from "../../redux/rtk/features/bus/busSlice";
import { updateLocalBooking } from "../../redux/rtk/features/localBusBooking/localBusBookingSlice";
import { useEffect } from "react";
function UpdateProformalInvoiceEntry({ data, id, onClose }) {
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
  const { list: busCategoryList } = useSelector((state) => state.busCategories);

  useEffect(() => {
    if (data) {
      const newValues = {
        BusTypeID: data?.BusTypeID,
        ReportDate: data?.ReportDate
          ? dayjs(convertToISO(data.ReportDate), "YYYY-MM-DD")
          : null,
        amount: data?.amount,
        busQty: data?.busQty,
        // busType is the name, BusTypeID is the id. The form item should use BusTypeID.
        rate: data?.rate,
        reportTime: data?.reportTime ? dayjs(data.reportTime, "hh:mm a") : null,
        sittingCapacity: data?.sittingCapacity,
        tripDescription: data?.tripDescription,
        tripEndDate: data?.tripEndDate
          ? dayjs(convertToISO(data.tripEndDate), "YYYY-MM-DD")
          : null,
      };
      form.setFieldsValue(newValues);
    }
  }, [data, form]);

  const onFinish = async (values) => {
    try {
      const selectedBusTypeId = values?.BusTypeID;

      const selectedBusCategory = busCategoryList?.find(
        (busCategory) => busCategory.id === selectedBusTypeId
      );

      const busCategoryName = selectedBusCategory
        ? selectedBusCategory.buscategory
        : data.busCategory; // Fallback to original name if not found

      values.busCategory = busCategoryName; // Ensure the name is in the payload

      values.ReportDate = values.ReportDate?.format("DD-MM-YYYY") || "";
      values.tripEndDate = values.tripEndDate?.format("DD-MM-YYYY") || "";
      values.reportTime = values.reportTime?.format("hh:mm a") || "";

      dispatch(updateLocalProforma({ id, values }));
      toast.success("Update successful!");
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

  return (
    <>
      <div className="text-center">
        <div className="">
          <Form
            initialValues={{ ...data }}
            form={form}
            layout="vertical"
            name="basic"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              style={{ marginBottom: "10px" }}
              label="Bus Type"
              name="BusTypeID"
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
              style={{ marginBottom: "10px" }}
              label="Trip Start Date"
              name="ReportDate"
              rules={[
                {
                  required: false,
                  message: "Please fill input !",
                },
              ]}
            >
              <DatePicker format={"DD-MM-YYYY"} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              style={{ marginBottom: "10px" }}
              label="Trip End Date"
              name="tripEndDate"
              rules={[
                {
                  required: false,
                  message: "Please fill input !",
                },
              ]}
            >
              <DatePicker format={"DD-MM-YYYY"} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              style={{ marginBottom: "10px" }}
              label="Report Time"
              name="reportTime"
              rules={[
                {
                  required: false,
                  message: "Please fill input !",
                },
              ]}
            >
              <TimePicker style={{ width: "100%" }} format={"hh:mm a"} />
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

export default UpdateProformalInvoiceEntry;
