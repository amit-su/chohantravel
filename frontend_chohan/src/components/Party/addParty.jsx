import { Button, Form, Input, Select, Typography } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addSingleParty,
  loadPartyPaginated,
} from "../../redux/rtk/features/party/partySlice";
import Title from "antd/es/skeleton/Title";
import TextArea from "antd/es/input/TextArea";
import { useEffect } from "react";
import { loadAllCompany } from "../../redux/rtk/features/company/comapnySlice";

const AddParty = () => {
  const dispatch = useDispatch();
  const { cityList, list, total } = useSelector((state) => state.party);

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { list: companyList } = useSelector((state) => state.companies);

  const onClick = () => {
    setLoading(true);
  };

  const handleLoadCompany = () => {
    dispatch(loadAllCompany({ page: 1, count: 10000, status: true }));
  };

  const onFinish = async (values) => {
    try {
      const uppercaseValues = Object.keys(values).reduce((acc, key) => {
        acc[key] =
          typeof values[key] === "string"
            ? values[key].toUpperCase()
            : values[key];
        return acc;
      }, {});
      const resp = await dispatch(addSingleParty(uppercaseValues));
      setLoading(false);
      form.resetFields();
    } catch (error) {
      setLoading(false);
    }
  };

  const onFinishFailed = () => {
    setLoading(false);
  };

  useEffect(() => {
    if (cityList.length > 0) {
      const kolkata = cityList.find(
        (city) => city.name.toLowerCase() === "kolkata"
      );
      if (kolkata) {
        form.setFieldsValue({ cityId: kolkata.id });
      }
    }
  }, [cityList]);
  return (
    <>
      <div className="flex items-center justify-center h-full">
        <Title level={4} className="mb-4 text-center">
          Add Party
        </Title>
        <Form
          form={form}
          name="basic"
          layout="vertical"
          style={{ width: "90%", maxWidth: "900px" }}
          initialValues={{
            remember: true,
            partyActive: "1",
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <div className="flex flex-wrap justify-between">
            <div className="w-full p-2 md:w-1/3">
              <Form.Item
                label="PARTY NAME"
                name="partyName"
                rules={[
                  {
                    required: true,
                    message: "Please input Party name!",
                  },
                ]}
              >
                <Input placeholder="Party Name" className="full-width-input" />
              </Form.Item>

              <Form.Item
                label="ADDRESS"
                name="address"
                rules={[
                  {
                    required: false,
                    message: "Please input address!",
                  },
                ]}
              >
                <TextArea placeholder="Enter address" rows={4} />
              </Form.Item>
              <Form.Item
                label="CITY"
                name="cityId"
                rules={[
                  {
                    required: true,
                    message: "Please select city!",
                  },
                ]}
              >
                <Select placeholder="Select city" className="full-width-input">
                  {cityList.map((city) => (
                    <Select.Option key={city.id} value={city.id}>
                      {city.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="WHAT'S APP NO"
                name="whatsAppNo"
                rules={[
                  {
                    required: false,
                    message: "Please input What's App Number!",
                  },
                ]}
              >
                <Input
                  placeholder="WhatsApp Number"
                  type="number"
                  className="full-width-input"
                />
              </Form.Item>

              <Form.Item
                label="CR LIMIT"
                name="crLimit"
                rules={[
                  {
                    required: false,
                    message: "Please input CR Limit!",
                  },
                ]}
              >
                <Input
                  type="number"
                  placeholder="CR Limit"
                  className="full-width-input"
                />
              </Form.Item>
            </div>
            <div className="w-full p-2 md:w-1/3">
              <Form.Item
                label="PIN CODE"
                name="pinCode"
                rules={[
                  {
                    required: false,
                    message: "Please input Pincode!",
                  },
                ]}
              >
                <Input
                  placeholder="Pin code"
                  type="number"
                  className="full-width-input"
                />
              </Form.Item>
              <Form.Item
                label="MOBILE NO"
                name="mobileNo"
                rules={[
                  {
                    required: false,
                    message: "Please input Mobile No!",
                  },
                ]}
              >
                <Input
                  placeholder="Mobile No"
                  type="number"
                  className="full-width-input"
                />
              </Form.Item>
              <Form.Item
                label="EMAIL"
                name="email"
                rules={[
                  {
                    required: false,
                    type: "email",
                    message: "Please input valid email!",
                  },
                ]}
              >
                <Input placeholder="Email" className="full-width-input" />
              </Form.Item>

              <Form.Item
                label="GST NO"
                name="gstNo"
                rules={[
                  {
                    required: false,
                    message: "Please input GST Number!",
                  },
                ]}
              >
                <Input placeholder="GST No" className="full-width-input" />
              </Form.Item>

              <Form.Item
                label="CONTACT PERSON NAME"
                name="cpName"
                rules={[
                  {
                    required: false,
                    message: "Please input !",
                  },
                ]}
              >
                <Input
                  placeholder="Contact Persion Name"
                  className="full-width-input"
                />
              </Form.Item>

              <Form.Item
                label="Party Type"
                name="partyType"
                rules={[
                  {
                    required: false,
                    message: "Please select status!",
                  },
                ]}
              >
                <Select placeholder="Select type" className="full-width-input">
                  <Select.Option value="rcm">RCM</Select.Option>
                  <Select.Option value="b2b">B2B</Select.Option>
                  <Select.Option value="b2c">B2C</Select.Option>
                </Select>
              </Form.Item>
            </div>
            <div className="w-full p-2 md:w-1/3">
              <Form.Item
                label="PAN NO"
                name="panNo"
                rules={[
                  {
                    required: false,
                    message: "Please input PAN Number!",
                  },
                ]}
              >
                <Input placeholder="PAN No" className="full-width-input" />
              </Form.Item>
              <Form.Item
                label="REFERRED BY"
                name="referredBy"
                rules={[
                  {
                    required: false,
                    message: "Please input referred by!",
                  },
                ]}
              >
                <Input placeholder="Referred By" className="full-width-input" />
              </Form.Item>
              <Form.Item
                label="PARTY ACTIVE STATUS"
                name="partyActive"
                rules={[
                  {
                    required: true,
                    message: "Please select status!",
                  },
                ]}
              >
                <Select
                  placeholder="Select status"
                  className="full-width-input"
                >
                  <Select.Option value="1">Yes</Select.Option>
                  <Select.Option value="0">No</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="CR DAYS"
                name="crDays"
                rules={[
                  {
                    required: false,
                    message: "Please input CR Days!",
                  },
                ]}
              >
                <Input
                  type="number"
                  placeholder="CR Days"
                  className="full-width-input"
                />
              </Form.Item>

              <Form.Item
                label="CONTACT PERSON MOBILE NUNBER"
                name="cpNumber"
                rules={[
                  {
                    required: false,
                    message: "Please Input Mobile number!",
                  },
                ]}
              >
                <Input
                  type="number"
                  placeholder="Mobile number"
                  className="full-width-input"
                />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: "10px" }}
                label="company"
                name="Company_ID"
                rules={[
                  {
                    required: true,
                    message: "Please provide input !",
                  },
                ]}
              >
                <Select
                  // onSelect={handleCompanySelect}
                  onClick={handleLoadCompany}
                  placeholder="Select company"
                  optionFilterProp="children" // Filters options based on the content of the children (party names)
                  showSearch
                >
                  {companyList?.map((company) => (
                    <Select.Option key={company.Id} value={company.Id}>
                      {company.Name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </div>

          <Form.Item className="mt-6 text-center">
            <Button
              loading={loading}
              type="primary"
              htmlType="submit"
              shape="round"
              onClick={onClick}
            >
              Add Party
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default AddParty;
