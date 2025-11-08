import { Button, Card, DatePicker, Form, Input, Typography } from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  addBusCategory,
  loadAllBusCategory,
} from "../../redux/rtk/features/busCategory/busCategorySlice";
import moment from "moment";
import dayjs from "dayjs";

const AddBusCategory = ({ drawer }) => {
  const dispatch = useDispatch();
  const { Title } = Typography;

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      const uppercaseValues = Object.keys(values).reduce((acc, key) => {
        acc[key] =
          typeof values[key] === "string"
            ? values[key].toUpperCase()
            : values[key];
        return acc;
      }, {});
      const resp = await dispatch(addBusCategory(uppercaseValues, dispatch));

      if (resp.payload.message === "success") {
        dispatch(loadAllBusCategory({ status: true, page: 1, count: 1000 }));
        setLoading(false);
        form.resetFields();
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const onFinishFailed = () => {
    setLoading(false);
  };

  const onClick = () => {
    setLoading(true);
  };

  return (
    <>
      <div className="h-full">
        <Title level={4} className="m-3 text-center">
          Add Bus Category
        </Title>
        <Form
          form={form}
          name="basic"
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
            label="BUS CATEGORY"
            name="buscategory"
            rules={[
              {
                required: true,
                message: "Please  provide input!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: "10px" }}
            label="ENTRY DATE"
            name="entrydate"
            initialValue={dayjs()}
            rules={[
              {
                required: false,
                message: "Please provide input !",
              },
            ]}
          >
            <DatePicker format={"DD-MM-YYYY"} />
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
              onClick={onClick}
            >
              Add Bus Category
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default AddBusCategory;
