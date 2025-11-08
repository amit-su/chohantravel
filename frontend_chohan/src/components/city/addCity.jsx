import { Button, Card, Form, Input, Select, Typography } from "antd";

import { useState } from "react";
import { CSVLink } from "react-csv";
import { useDispatch, useSelector } from "react-redux";
import { addCity, loadAllCity } from "../../redux/rtk/features/city/citySlice";
import { loadAllState } from "../../redux/rtk/features/state/stateSlice";

const AddCity = ({ drawer }) => {
  const dispatch = useDispatch();
  const { Title } = Typography;
  const { list } = useSelector((state) => state.StateNames);
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
      const resp = await dispatch(addCity(uppercaseValues, dispatch));
      if (resp.payload.message === "success") {
        dispatch(loadAllCity({ page: 1, count: 1000, status: true }));
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
          Add City
        </Title>
        <Form
          form={form}
          className=""
          name="basic"
          labelCol={{
            span: 5,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            style={{ marginBottom: "10px" }}
            label=" Name"
            name="name"
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
                <Select.Option key={state.id} value={state.state}>
                  {state.state}
                </Select.Option>
              ))}
            </Select>
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
              Add City
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default AddCity;
