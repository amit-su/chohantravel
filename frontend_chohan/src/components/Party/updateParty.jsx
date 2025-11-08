import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Input, Select } from "antd";
import Title from "antd/es/skeleton/Title";
import {
  loadPartyPaginated,
  updateParty,
} from "../../redux/rtk/features/party/partySlice";
import TextArea from "antd/es/input/TextArea";
import { loadAllCompany } from "../../redux/rtk/features/company/comapnySlice";

const UpdateParty = ({ id, data }) => {
  const dispatch = useDispatch();
  const { cityList } = useSelector((state) => state.party);

  const [loading, setLoading] = useState(false);
  const { list: companyList = [] } = useSelector((state) => state.companies);

  const onClick = () => {
    setLoading(true);
  };

  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const uppercaseValues = Object.keys(values).reduce((acc, key) => {
        acc[key] =
          typeof values[key] === "string"
            ? values[key].toUpperCase()
            : values[key];
        return acc;
      }, {});
      const resp = await dispatch(
        updateParty({ id, values: uppercaseValues, dispatch })
      );
      console.log(resp);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const onFinishFailed = () => {
    setLoading(false);
  };

  useEffect(() => {
    handleLoadCompany();
  }, []);

  const [initValues, setInitValues] = useState({
    partyName: data?.partyName,
    address: data?.partyAddr,
    cityId: parseInt(data?.cityID),
    pinCode: data?.pincode,
    mobileNo: data?.mobileNo,
    whatsAppNo: data?.whatsAppNo,
    email: data?.email,
    gstNo: data?.gstNo,
    panNo: data?.panNo,
    referredBy: data?.referredBy,
    partyActive: data?.partyActive,
    crDays: parseInt(data?.crDays),
    crLimit: parseFloat(data?.crLimit),
    UserID: 1,
    Operation: 1,
    cpName: data?.cpName,
    cpNumber: data?.cpNumber,
    PartyType: data?.PartyType,
    Company_ID: String(data?.companyID),
  });

  const handleLoadCompany = () => {
    dispatch(loadAllCompany({ page: 1, count: 10000, status: true }));
  };

  return (
    <Fragment>
      <div className="h-full">
        <Title level={4} className="m-2 text-center">
          Update Party
        </Title>
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
            <div className="w-full p-2 md:w-1/3">
              <Form.Item
                style={{ marginBottom: "10px" }}
                label="Party Name"
                name="partyName"
                rules={[
                  {
                    required: true,
                    message: "Please input Party name!",
                  },
                ]}
              >
                <Input placeholder="Party Name" />
              </Form.Item>
              <Form.Item
                style={{ marginBottom: "10px" }}
                label="Address"
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
                style={{ marginBottom: "10px" }}
                label="City"
                name="cityId"
                rules={[
                  {
                    required: true,
                    message: "Please input city!",
                  },
                ]}
              >
                <Select placeholder="Select city">
                  {cityList.map((city) => (
                    <Select.Option key={city.id} value={city.id}>
                      {city.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                style={{ marginBottom: "10px" }}
                label="What's App No"
                name="whatsAppNo"
                rules={[
                  {
                    required: false,
                    message: "Please input What's App Number!",
                  },
                ]}
              >
                <Input placeholder="WhatsApp No" type="number" />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: "10px" }}
                label="CR Limit"
                name="crLimit"
                rules={[
                  {
                    required: false,
                    message: "Please input CR Limit!",
                  },
                ]}
              >
                <Input type="number" placeholder="CR Limit" />
              </Form.Item>
            </div>
            <div className="w-full p-2 md:w-1/3">
              <Form.Item
                style={{ marginBottom: "10px" }}
                label="Pin Code"
                name="pinCode"
                rules={[
                  {
                    required: false,
                    message: "Please input Pincode!",
                  },
                ]}
              >
                <Input placeholder="Pin code" type="number" />
              </Form.Item>
              <Form.Item
                style={{ marginBottom: "10px" }}
                label="Mobile No"
                name="mobileNo"
                rules={[
                  {
                    required: false,
                    message: "Please input Mobile No!",
                  },
                ]}
              >
                <Input placeholder="Mobile No" type="number" />
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
                <Input type="email" placeholder="Email" />
              </Form.Item>
              <Form.Item
                style={{ marginBottom: "10px" }}
                label="Party Active status"
                name="partyActive"
                rules={[
                  {
                    required: true,
                    message: "Please input status!",
                  },
                ]}
              >
                <Select placeholder="Select status">
                  <Select.Option value="1">Yes</Select.Option>
                  <Select.Option value="0">No</Select.Option>
                </Select>
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
                name="PartyType"
                rules={[
                  {
                    required: false,
                    message: "Please select status!",
                  },
                ]}
              >
                <Select placeholder="Select type" className="full-width-input">
                  <Select.Option value="RCM">RCM</Select.Option>
                  <Select.Option value="B2B">B2B</Select.Option>
                  <Select.Option value="B2C">B2C</Select.Option>
                </Select>
              </Form.Item>
            </div>
            <div className="w-full p-2 md:w-1/3">
              <Form.Item
                style={{ marginBottom: "10px" }}
                label="GST No"
                name="gstNo"
                rules={[
                  {
                    required: false,
                    message: "Please input GST Number!",
                  },
                ]}
              >
                <Input placeholder="GST No" />
              </Form.Item>
              <Form.Item
                style={{ marginBottom: "10px" }}
                label="PAN No"
                name="panNo"
                rules={[
                  {
                    required: false,
                    message: "Please input PAN Number!",
                  },
                ]}
              >
                <Input placeholder="PAN No" />
              </Form.Item>
              <Form.Item
                style={{ marginBottom: "10px" }}
                label="Referred By"
                name="referredBy"
                rules={[
                  {
                    required: false,
                    message: "Please input referred by!",
                  },
                ]}
              >
                <Input placeholder="Referred By" />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: "10px" }}
                label="CR Days"
                name="crDays"
                rules={[
                  {
                    required: false,
                    message: "Please input CR Days!",
                  },
                ]}
              >
                <Input type="number" placeholder="CR Days" />
              </Form.Item>

              <Form.Item
                label="CONTACT PERSON MOBILE NUMBER"
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
                  {companyList
                    ?.filter((c) => c?.Id)
                    .map((company) => (
                      <Select.Option key={company.Id} value={company.Id}>
                        {company.Name}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
            </div>
          </div>
          <Form.Item
            style={{ marginBottom: "10px" }}
            className="flex justify-center mt-[24px]"
          >
            <Button
              loading={loading}
              type="primary"
              htmlType="submit"
              shape="round"
              onClick={onClick}
            >
              Update Party
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Fragment>
  );
};

export default UpdateParty;
