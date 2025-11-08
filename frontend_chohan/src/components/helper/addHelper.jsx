import { Button, DatePicker, Form, Input, Select, Typography } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addHelper } from "../../redux/rtk/features/helper/helperSlice";
import Title from "antd/es/skeleton/Title";
import { loadAllCity } from "../../redux/rtk/features/city/citySlice";
import { loadAllBranch } from "../../redux/rtk/features/branch/branchSlice";
import TextArea from "antd/es/input/TextArea";
import { toast } from "react-toastify";
import { loadAllCompany } from "../../redux/rtk/features/company/comapnySlice";

const AddHelper = () => {
  const dispatch = useDispatch();
  const handleLoadCity = () => {
    dispatch(loadAllCity({ page: 1, count: 10000, status: true }));
  };
  const { list: companyList } = useSelector((state) => state.companies);

  const { list: cityList } = useSelector((state) => state.city);

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onClick = () => {
    setLoading(true);
  };
  const handleLoadCompany = () => {
    dispatch(loadAllCompany({ page: 1, count: 10000, status: true }));
  };

  // const onFinish = async (values) => {
  //   try {
  //     const uppercaseValues = Object.keys(values).reduce((acc, key) => {
  //       acc[key] =
  //         typeof values[key] === "string"
  //           ? values[key].toUpperCase()
  //           : values[key];
  //       return acc;
  //     }, {});

  //     const resp = await dispatch(addHelper(uppercaseValues));
  //     console.log("Unwrapped response:", resp);

  //     if (resp.payload.data.status == 1) {
  //       setLoading(false);
  //       form.resetFields();
  //       toast.success("Helper inserted successfully.");
  //     } else if (resp.payload.data.status == 3) {
  //       setLoading(false);
  //       toast.error("Helper name already exists.");
  //     }
  //   } catch (error) {
  //     setLoading(false);
  //   }
  // };
  const onFinish = async (values) => {
    try {
      const uppercaseValues = Object.keys(values).reduce((acc, key) => {
        acc[key] =
          typeof values[key] === "string"
            ? values[key].toUpperCase()
            : values[key];
        return acc;
      }, {});

      const resp = await dispatch(addHelper(uppercaseValues));
      if (resp.payload.data.status === 1) {
        setLoading(false);
        form.resetFields();
        toast.success("Helper inserted successfully.");
      } else if (resp.payload.data.status === 3) {
        console.log("error");
        setLoading(false);
        toast.error("Helper name already exists.");
      } else {
        setLoading(false);
        toast.error(resp.payload.message || "Something went wrong.");
      }
    } catch (error) {
      console.log("error", error);
      setLoading(false);
      toast.error("Helper name already exists.");
    }
  };

  const onFinishFailed = () => {
    setLoading(false);
  };

  return (
    <div className="h-full">
      <Title level={4} className="text-center">
        Add Helper
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
            label="Helper Name"
            name="helperName"
            rules={[
              {
                required: true,
                message: "Please provide input !",
              },
            ]}
          >
            <Input placeholder="Helper Name" />
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
            name="helperAddr"
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
            label="Bank Ac type"
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
            label="Helper Active status "
            name="helperActive"
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
            Add Helper
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddHelper;
