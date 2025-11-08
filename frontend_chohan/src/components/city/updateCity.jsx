import { Button, Form, Input, Select } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loadAllCity,
  updateCity,
} from "../../redux/rtk/features/city/citySlice";

function UpdateCity({ data, id }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { list } = useSelector((state) => state.StateNames);
  const [loader, setLoader] = useState();
  const [initValues, setInitValues] = useState({
    name: data.name,
    id: data.id,
    state: data.state,
  });

  const onFinish = async (values) => {
    try {
      const uppercaseValues = Object.keys(values).reduce((acc, key) => {
        acc[key] =
          typeof values[key] === "string"
            ? values[key].toUpperCase()
            : values[key];
        return acc;
      }, {});
      const res = await dispatch(updateCity({ id, values: uppercaseValues }));
      if (res) {
        dispatch(loadAllCity({ status: true, page: 1, count: 1000 }));
      }
      setInitValues({});
      setLoader(false);
    } catch (error) {
      setLoader(false);
    }
  };

  const onFinishFailed = () => {};

  return (
    <>
      <div className="text-center">
        <div className="">
          <Form
            initialValues={{
              ...initValues,
            }}
            form={form}
            layout="vertical"
            name="basic"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              style={{ marginBottom: "10px" }}
              fields={[{ name: "Name" }]}
              label="Name"
              name="name"
              rules={[
                {
                  required: false,
                  message: "Please input Category name!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              style={{ marginBottom: "10px" }}
              label="State"
              name="stateName"
              rules={[
                {
                  required: false,
                  message: "Please input state!",
                },
              ]}
            >
              <Select
                optionFilterProp="children" // Filters options based on the content of the children (party names)
                showSearch
                placeholder="Select state"
              >
                {list?.map((state) => (
                  <Select.Option key={state.id} value={state.state}>
                    {state.state}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item style={{ marginBottom: "10px" }}>
              <Button
                onClick={() => setLoader(true)}
                block
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

export default UpdateCity;
