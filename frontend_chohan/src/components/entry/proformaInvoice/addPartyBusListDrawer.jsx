import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Select,
  TimePicker,
  Typography,
} from "antd";
import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import dayjs from "dayjs";
import { loadAllBusCategory } from "../../../redux/rtk/features/busCategory/busCategorySlice";
import TextArea from "antd/es/input/TextArea";
import { addLocalProforma } from "../../../redux/rtk/features/localProformaInvoice/localProformaSlice";
import { useParams } from "react-router-dom";

const AddPartyBusListDrawer = ({ onClose }) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { Title } = Typography;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedTime, setSelectedTime] = useState();
  const handleLoadBusCategories = () => {
    dispatch(loadAllBusCategory({ page: 1, count: 10000, status: true }));
  };
  const { list: busCategoryList } = useSelector((state) => state.busCategories);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const handleDateChange = useCallback((date) => {
    const newDate = dayjs(date, "YYYY-MM-DD");
    setSelectedDate(newDate.isValid() ? newDate : dayjs());
  }, []);
  const [selectedDate2, setSelectedDate2] = useState(dayjs());

  const handleDateChange2 = useCallback((date) => {
    const newDate = dayjs(date, "YYYY-MM-DD");
    setSelectedDate2(newDate.isValid() ? newDate : dayjs());
  }, []);

  const onFinish = async (values) => {
    try {
      console.log("onFinish");
      const selectedBusTypeId = values?.BusTypeID;
      const selectedBusCategory = busCategoryList?.find(
        (busCategory) => busCategory.id === selectedBusTypeId
      );
      console.log(selectedBusTypeId, "id bus");
      const busCategoryName = selectedBusCategory
        ? selectedBusCategory.buscategory
        : "";

      // Include bus category name in the values object
      values.SLNO = Math.floor(Math.random() * (100 - 1 + 1)) + 1;
      values.sittingCapacity = values.sittingCapacity;

      values.busCategory = busCategoryName;
      // values.ReportDate = selectedDate.isValid()
      //   ? selectedDate.format("DD-MM-YYYY")
      //   : "";
      // values.tripEndDate = selectedDate2.isValid()
      //   ? selectedDate2.format("DD-MM-YYYY")
      //   : "";
      // values.reportTime = selectedTime?.format("HH:mm") || null;

      setLoading(false);
      form.resetFields();
      onClose(values);
    } catch (error) {
      setLoading(false);
    }
  };
  const calculateAmount = (rate, busQty) => {
    return rate * busQty;
  };
  const onFinishFailed = () => {
    setLoading(false);
  };

  const onClick = () => {
    console.log("onClick");
    setLoading(true);
  };

  const handleChange = (time) => {
    // Update state when time is changed
    setSelectedTime(time);
  };

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
      <div className="h-full">
        <Title level={4} className="m-3 text-center">
          Add Bus Details
        </Title>
        <Form
          form={form}
          className=""
          name="basicForm"
          layout="vertical"
          style={{ marginLeft: "40px", marginRight: "40px" }}
          initialValues={{
            remember: true,
          }}
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
                required: true,
                message: "Please fill input !",
              },
            ]}
          >
            <Select
              showSearch
              optionFilterProp="children"
              onClick={handleLoadBusCategories}
              placeholder="Select category"
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
                required: true,
                message: "Please fill input !",
              },
            ]}
          >
            <Input type="number" placeholder="Enter Sitting capacity for Bus" />
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
            <TextArea rows={4} placeholder="Enter Description" />
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
                required: true,
                message: "Please fill input !",
              },
            ]}
          >
            <Input
              type="number"
              placeholder="Enter no of bus required"
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
                required: true,
                message: "Please fill input !",
              },
            ]}
          >
            <Input
              type="number"
              placeholder="Enter rate"
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
                required: true,
                message: "Please input branch!",
              },
            ]}
          >
            <Input type="number" placeholder="Enter Amount" />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: "10px" }}
            className="flex justify-center mt-[24px]"
          >
            <Button
              type="primary"
              htmlType="submit"
              shape="round"
              loading={loading}
              onClick={onclick}
            >
              Add Bus
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default AddPartyBusListDrawer;
