import { Button, Form, Input, InputNumber, TimePicker, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadSingleBookingTran } from "../../redux/rtk/features/booking/bookingTran.Slice";
import {
  loadAllBookingBusAllotment,
  updateBookingBusAllotment,
} from "../../redux/rtk/features/bookingBusAllotment/bookingBusAllotmentSlice";

const CloseDutyDrawer = ({ id, data }) => {
  const dispatch = useDispatch();
  const { Title } = Typography;
  const [initValues, setInitValues] = useState({});
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const { list, total, bookingTran } = useSelector(
    (state) => state.bookingTrans
  );
  console.log("tran resp", bookingTran);

  const onFinish = async (values) => {
    try {
      values = {
        ...values,
        BusAllotmentStatus: 2,
        ID: id,
        BookingID: data?.BookingID,
      };
      const uppercaseValues = Object.keys(values).reduce((acc, key) => {
        acc[key] =
          typeof values[key] === "string"
            ? values[key].toUpperCase()
            : values[key];
        return acc;
      }, {});
      const res = await dispatch(
        updateBookingBusAllotment({ id, values: uppercaseValues })
      );
      if (res) {
        dispatch(
          loadAllBookingBusAllotment({ page: 1, count: 500, status: true })
        );
      }
      setLoading(false);
      form.resetFields();
      // }
    } catch (error) {
      setLoading(false);
    }
  };

  const onClick = () => {
    setLoading(true);
  };

  useEffect(() => {
    dispatch(loadSingleBookingTran(parseInt(data?.BookingTranID)));
  }, [dispatch, data?.BookingTranID]);

  return (
    <>
      <div className="h-full">
        <Title level={4} className="m-3 text-center">
          Close Duty
        </Title>
        <Form
          form={form}
          layout="vertical"
          style={{ marginLeft: "40px", marginRight: "40px" }}
          initialValues={initValues} // Set initial values here
          onFinish={onFinish}
          autoComplete="off"
          labelAlign="left"
        >
          {bookingTran?.RateType === "FR" ? (
            <>
              <Form.Item
                style={{ marginBottom: "10px" }}
                label=" Garage In Time"
                name="garageIntTime"
                rules={[
                  {
                    required: false,
                    message: "Please fill input !",
                  },
                ]}
              >
                <TimePicker format={"HH:mm"} />
              </Form.Item>
            </>
          ) : (
            <>
              <Form.Item
                style={{ marginBottom: "10px" }}
                label="Extra KM Driven"
                name="extraKM"
                rules={[
                  {
                    required: false,
                    message: "Please fill input !",
                  },
                ]}
              >
                <InputNumber />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: "10px" }}
                label="Extra Hour Driven"
                name="extraHour"
                rules={[
                  {
                    required: false,
                    message: "Please fill input !",
                  },
                ]}
              >
                <InputNumber />
              </Form.Item>
              <Form.Item
                style={{ marginBottom: "10px" }}
                label=" Garage In Time"
                name="garageIntTime"
                rules={[
                  {
                    required: false,
                    message: "Please fill input !",
                  },
                ]}
              >
                <TimePicker format={"HH:mm"} />
              </Form.Item>
            </>
          )}

          <Form.Item
            style={{ marginBottom: "10px" }}
            className="flex justify-center mt-[24px]"
          >
            <Button
              type="primary"
              htmlType="submit"
              shape="round"
              loading={loading}
              onClick={onClick}
            >
              Close Duty
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default CloseDutyDrawer;
