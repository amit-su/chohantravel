import { Button, Form, Input } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import {
  loadAllState,
  updateState,
} from "../../redux/rtk/features/state/stateSlice";

function UpdateState({ data, id }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [loader, setLoader] = useState();
  const [initValues, setInitValues] = useState({
    state: data.state,
    statename: data.state,
    companyname: data.compname,
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
      const res = await dispatch(updateState({ id, values: uppercaseValues }));
      if (res) {
        dispatch(loadAllState({ status: true, page: 1, count: 1000 }));
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
              label="State"
              name="state"
              rules={[
                {
                  required: false,
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
                  required: false,
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

export default UpdateState;
