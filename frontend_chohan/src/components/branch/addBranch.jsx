import { Button, Form, Input, InputNumber, Select, Typography } from "antd";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addBranch } from "../../redux/rtk/features/branch/branchSlice";
import { loadAllCity } from "../../redux/rtk/features/city/citySlice";
import { loadAllState } from "../../redux/rtk/features/state/stateSlice";
import TextArea from "antd/es/input/TextArea";

const AddBranch = () => {
  const dispatch = useDispatch();
  const { Title } = Typography;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const handleLoadCity = () => {
    dispatch(loadAllCity({ page: 1, count: 10000, status: true }));
  };
  const { list: cityList } = useSelector((state) => state.city);
  const handleLoadState = () => {
    dispatch(loadAllState({ page: 1, count: 10000, status: true }));
  };
  const { list: stateList } = useSelector((state) => state.StateNames);
  const onFinish = async (values) => {
    try {
      const uppercaseValues = Object.keys(values).reduce((acc, key) => {
        acc[key] =
          typeof values[key] === "string"
            ? values[key].toUpperCase()
            : values[key];
        return acc;
      }, {});
      const resp = await dispatch(addBranch(uppercaseValues, dispatch));

      if (resp.payload.message === "success") {
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
          Add Branch Details
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
          <div className="flex flex-wrap justify-between">
            <div className="w-full md:w-1/2 p-2">
              <Form.Item
                style={{ marginBottom: "10px" }}
                label="Branch Name"
                name="branch_name"
                rules={[
                  {
                    required: true,
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
                    required: true,
                    message: "Please fill input !",
                  },
                ]}
              >
                <TextArea placeholder="Enter  address" rows={4} />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: "10px" }}
                label="State"
                name="stateName"
                rules={[
                  {
                    required: true,
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
                    required: true,
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
                    required: true,
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
                    required: true,
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
                    required: true,
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
                    required: true,
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
                    required: true,
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
                    required: true,
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
                required: true,
                message: "Please fill input !",
              },
            ]}
          >
            <InputNumber />
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
              Add Branch
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default AddBranch;
