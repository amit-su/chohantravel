import { Button, Card, Form, Input, Typography } from "antd";

import { useState } from "react";
import { CSVLink } from "react-csv";
import { useDispatch } from "react-redux";

import {
  addState,
  loadAllState,
} from "../../redux/rtk/features/state/stateSlice";

const AddState = ({ drawer }) => {
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
      const resp = await dispatch(addState(uppercaseValues, dispatch));

      if (resp.payload.message === "success") {
        // dispatch(loadAllState({ status: true, page: 1, count: 1000 }));
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
          Add State
        </Title>
        <Form
          form={form}
          className=""
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
            label="State"
            name="state"
            rules={[
              {
                required: true,
                message: "Please input state!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: "10px" }}
            label="State Name"
            name="statename"
            rules={[
              {
                required: true,
                message: "Please input state name!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          {/* <Form.Item
            style={{ marginBottom: "10px" }}
            label="Company Name"
            name="companyname"
            rules={[
              {
                required: true,
                message: "Please input company name!",
              },
            ]}
          >
            <Input />
          </Form.Item> */}

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
              Add State
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default AddState;
