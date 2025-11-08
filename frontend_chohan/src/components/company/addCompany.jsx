import { Button, Card, Form, Input, Select, Typography } from "antd";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadAllCity } from "../../redux/rtk/features/city/citySlice";
import { addCompany } from "../../redux/rtk/features/company/comapnySlice";
import TextArea from "antd/es/input/TextArea";

const AddCompany = () => {
  const dispatch = useDispatch();
  const { Title } = Typography;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const handleLoadCity = () => {
    dispatch(loadAllCity({ page: 1, count: 10000, status: true }));
  };
  const { list: cityList } = useSelector((state) => state.city);

  const onFinish = async (values) => {
    try {
      const uppercaseValues = Object.keys(values).reduce((acc, key) => {
        acc[key] =
          typeof values[key] === "string"
            ? values[key].toUpperCase()
            : values[key];
        return acc;
      }, {});
      const resp = await dispatch(addCompany(uppercaseValues, dispatch));

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
          Add Company Details
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
          <div className="md:flex md:flex-wrap">
            <div className="w-full md:w-1/2 md:pr-2">
              <Form.Item
                style={{ marginBottom: "10px" }}
                label="Company Name"
                name="Name"
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
                name="Address"
                rules={[
                  {
                    required: true,
                    message: "Please fill input !",
                  },
                ]}
              >
                <TextArea placeholder="Enter address" rows={4} />
              </Form.Item>
              <Form.Item
                style={{ marginBottom: "10px" }}
                label="HSN Code"
                name="HSNCode"
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
                label="CIN No"
                name="CINNo"
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
                label="CGST"
                name="CGST"
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
            <div className="w-full md:w-1/2 md:pl-2">
              <Form.Item
                style={{ marginBottom: "10px" }}
                label="SGST"
                name="SGST"
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
                label="IGST"
                name="IGST"
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
                label="Phone"
                name="Phone"
                rules={[
                  {
                    required: true,
                    message: "Please fill input !",
                  },
                ]}
              >
                <Input type="number" />
              </Form.Item>
              <Form.Item
                style={{ marginBottom: "10px" }}
                label="City"
                name="City"
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
                name="PANNo"
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
          </div>
          <div className="md:flex md:flex-wrap">
            <div className="w-full md:w-1/2 md:pr-2">
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
                name="Email"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Please provide valid Email !",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                style={{ marginBottom: "10px" }}
                label="Fax"
                name="Fax"
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
                label="Bank Name"
                name="BankName"
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
                label="Bank IFS Code
"
                name="BankIFSCode"
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
                label="PF Registration No
"
                name="PFRegNo"
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
            <div className="w-full md:w-1/2 md:pl-2">
              <Form.Item
                style={{ marginBottom: "10px" }}
                label="Website"
                name="Website"
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
                label="GSTNo "
                name="GSTNo"
                rules={[
                  {
                    required: true,
                    message: "Please input status!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                style={{ marginBottom: "10px" }}
                label="Bank Account Name"
                name="BankAcName"
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
                label="Bank A/c No"
                name="BankAcNo"
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
                label="Bank Branch Addr"
                name="BankBranchAddr"
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
                label="ESI Registration No"
                name="ESIRegNo"
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
          </div>
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
              Add Company
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default AddCompany;
