import { Button, DatePicker, Form, Input } from "antd";
import React, { useBusCategory, useState } from "react";
import { useDispatch } from "react-redux";
import moment from "moment";
import {
  loadAllBusCategory,
  updateBusCategory,
} from "../../redux/rtk/features/busCategory/busCategorySlice";
import dayjs from "dayjs";

function UpdateBusCategory({ data, id }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [loader, setLoader] = useState();
  const [initValues, setInitValues] = useState({
    ...data,
    entrydate: dayjs(data?.entrydate),
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
      const res = await dispatch(
        updateBusCategory({ id, values: uppercaseValues })
      );
      if (res) {
        dispatch(loadAllBusCategory({ status: true, page: 1, count: 1000 }));
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
              label="Bus Category"
              name="buscategory"
              rules={[
                {
                  required: false,
                  message: "Please  provide input!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              style={{ marginBottom: "10px" }}
              label="Entry Date"
              name="entrydate"
              rules={[
                {
                  required: false,
                  message: "Please provide input !",
                },
              ]}
            >
              <DatePicker format={"DD-MM-YYYY"} />
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

export default UpdateBusCategory;
