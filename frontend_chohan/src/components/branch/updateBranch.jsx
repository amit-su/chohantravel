import { Button, Form, Input, InputNumber, Select } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loadAllBranch,
  updateBranch,
} from "../../redux/rtk/features/branch/branchSlice";
import { loadAllCity } from "../../redux/rtk/features/city/citySlice";
import { loadAllState } from "../../redux/rtk/features/state/stateSlice";
import TextArea from "antd/es/input/TextArea";

function UpdateBranch({ data, id }) {
  console.log(data);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const handleLoadCity = () => {
    dispatch(loadAllCity({ page: 1, count: 10000, status: true }));
  };
  const { list: cityList } = useSelector((state) => state.city);
  const handleLoadState = () => {
    dispatch(loadAllState({ page: 1, count: 10000, status: true }));
  };
  const { list: stateList } = useSelector((state) => state.StateNames);

  const [loader, setLoader] = useState();
  const [initValues, setInitValues] = useState({
    ...data,
    status: parseInt(data?.status),
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
      const res = await dispatch(updateBranch({ id, values: uppercaseValues }));
      if (res) {
        dispatch(loadAllBranch({ status: true, page: 1, count: 1000 }));
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
          <div className="w-full md:w-1/2 p-2">
            <Form.Item
              style={{ marginBottom: "10px" }}
              label="Branch Name"
              name="branch_name"
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
              label="Address"
              name="address"
              rules={[
                {
                  required: false,
                  message: "Please fill input !",
                },
              ]}
            >
              <TextArea placeholder="Enter  address" rows={4} />
            </Form.Item>

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
              <Select
                optionFilterProp="children" // Filters options based on the content of the children (party names)
                showSearch
                onClick={handleLoadState}
                placeholder="Select state"
              >
                {stateList?.map((state) => (
                  <Select.Option key={state?.id} value={state?.state}>
                    {state?.state}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              style={{ marginBottom: "10px" }}
              label="Pin Code"
              name="pincode"
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
              label="GST"
              name="gst"
              rules={[
                {
                  required: false,
                  message: "Please fill input !",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </div>
          <div className="w-full md:w-1/2 p-2">
            <Form.Item
              style={{ marginBottom: "10px" }}
              label="City"
              name="city"
              rules={[
                {
                  required: false,
                  message: "Please input city!",
                },
              ]}
            >
              <Select
                optionFilterProp="children" // Filters options based on the content of the children (party names)
                showSearch
                onClick={handleLoadCity}
                placeholder="Select city"
              >
                {cityList?.map((city) => (
                  <Select.Option key={city.id} value={city.name}>
                    {city.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              style={{ marginBottom: "10px" }}
              label="PAN No"
              name="pan"
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
              label="Short Name"
              name="ShortName"
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
              label="Email"
              name="email"
              rules={[
                {
                  required: false,
                  type: "email",
                  message: "Please input valid email!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              style={{ marginBottom: "10px" }}
              label="Active status "
              name="status"
              rules={[
                {
                  required: false,
                  message: "Please input status!",
                },
              ]}
            >
              <Select placeholder="Select status">
                <Select.Option value={1}>Yes</Select.Option>
                <Select.Option value={0}>No</Select.Option>
              </Select>
            </Form.Item>
          </div>
        </div>
        <Form.Item
          style={{ marginBottom: "10px" }}
          label="Phone"
          name="phone"
          rules={[
            {
              required: false,
              message: "Please fill input !",
            },
          ]}
        >
          <InputNumber />
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
    </>
  );
}

export default UpdateBranch;
