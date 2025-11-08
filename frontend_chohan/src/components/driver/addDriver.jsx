import { Button, DatePicker, Form, Input, Select, Typography } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addDriver } from "../../redux/rtk/features/driver/driverSlice";
import Title from "antd/es/skeleton/Title";
import { loadAllCity } from "../../redux/rtk/features/city/citySlice";
import { loadAllBranch } from "../../redux/rtk/features/branch/branchSlice";
import TextArea from "antd/es/input/TextArea";
import { toast } from "react-toastify";
import { loadAllCompany } from "../../redux/rtk/features/company/comapnySlice";

const AddDriver = () => {
  const dispatch = useDispatch();
  const handleLoadCity = () => {
    dispatch(loadAllCity({ page: 1, count: 10000, status: true }));
  };
  const { list: cityList } = useSelector((state) => state.city);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { list: companyList } = useSelector((state) => state.companies);

  const onClick = () => {
    setLoading(true);
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
      const resp = await dispatch(addDriver(uppercaseValues, { dispatch }));
      if (resp.payload.message === "success") {
        setLoading(false);
        form.resetFields();
      }
    } catch (error) {
      setLoading(false);
    }
  };
  const handleLoadCompany = () => {
    dispatch(loadAllCompany({ page: 1, count: 10000, status: true }));
  };

  const onFinishFailed = () => {
    setLoading(false);
  };

  return (
    <div className="h-full">
      <Title level={4} className="text-center">
        Add Driver
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
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            style={{ marginBottom: "10px" }}
            label="Driver Name"
            name="driverName"
            rules={[
              {
                required: true,
                message: "Please provide input !",
              },
            ]}
          >
            <Input placeholder="Driver Name" />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: "10px" }}
            label="Employee No."
            name="EmployeeNo"
            rules={[
              {
                required: true,
                message: "Please provide input !",
              },
            ]}
          >
            <Input placeholder="Employee No" />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: "10px" }}
            label="Address"
            name="driverAddr"
            rules={[
              {
                required: true,
                message: "Please provide input !",
              },
            ]}
          >
            <TextArea placeholder="Enter  address" rows={4} />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: "10px" }}
            label="city"
            name="cityID"
            rules={[
              {
                required: true,
                message: "Please provide input !",
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
                <Select.Option key={city.id} value={city.id}>
                  {city.name}
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
                message: "Please provide input !",
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
                required: true,
                message: "Please provide input !",
              },
            ]}
          >
            <Input placeholder="Mobile No" type="number" />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: "10px" }}
            label="What's App No"
            name="whatsAppNo"
            rules={[
              {
                required: true,
                message: "Please provide input !",
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: "10px" }}
            label="Driver License"
            name="drvLicenseNo"
            rules={[
              {
                required: true,
                message: "Please provide input !",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: "10px" }}
            label="License Expiry Date"
            name="drvLicenseExpDate"
            rules={[
              {
                required: true,
                message: "Please provide input !",
              },
            ]}
          >
            <DatePicker format={"DD-MM-YYYY"} />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: "10px" }}
            label="Adhaar No"
            name="aadharCardNo"
            rules={[
              {
                required: false,
                message: "Please provide input !",
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: "10px" }}
            label="Bank Name"
            name="bankName"
            rules={[
              {
                required: false,
                message: "Please provide input !",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: "10px" }}
            label="Bank Branch"
            name="branch_name"
            rules={[
              {
                required: true,
                message: "Please input branch!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: "10px" }}
            label="Bank Acc No"
            name="bankAcNo"
            rules={[
              {
                required: false,
                message: "Please provide input !",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: "10px" }}
            label="Bank Account type"
            name="bankAcType"
            rules={[
              {
                required: false,
                message: "Please provide input !",
              },
            ]}
          >
            <Select placeholder="Select Cccount Type">
              <Select.Option value="Savings">Savings</Select.Option>
              <Select.Option value="Current">Current</Select.Option>
              <Select.Option value="Salaried">Salaried</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            style={{ marginBottom: "10px" }}
            label="Bank IFSC"
            name="bankIFSC"
            rules={[
              {
                required: false,
                message: "Please provide input !",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: "10px" }}
            label="License Path"
            name="licensePath"
            rules={[
              {
                required: false,
                message: "Please provide input !",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: "10px" }}
            label="Aadhar Path"
            name="adharPath"
            rules={[
              {
                required: false,
                message: "Please provide input !",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: "10px" }}
            label="PFNO"
            name="pfNo"
            rules={[
              {
                required: false,
                message: "Please provide input !",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: "10px" }}
            label="ESI NO"
            name="esiNo"
            rules={[
              {
                required: false,
                message: "Please provide input !",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: "10px" }}
            label="ReferredBy"
            name="referredBy"
            rules={[
              {
                required: false,
                message: "Please provide input !",
              },
            ]}
          >
            <Input />
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

          <Form.Item
            style={{ marginBottom: "10px" }}
            label="Driver Active status "
            name="driverActive"
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
            style={{ marginBottom: "10px" }}
            label="Date of Join"
            name="Dateofjoin"
            rules={[
              {
                required: true,
                message: "Please provide input !",
              },
            ]}
          >
            <DatePicker format={"DD-MM-YYYY"} />
          </Form.Item>
        </div>
        <div className="flex justify-center mt-[24px]">
          <Button
            loading={loading}
            type="primary"
            htmlType="submit"
            shape="round"
            onClick={onClick}
          >
            Add Driver
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddDriver;
