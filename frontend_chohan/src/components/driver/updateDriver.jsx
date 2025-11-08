import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Drawer, Form, Input, Select } from "antd";
import Title from "antd/es/skeleton/Title";
import {
  loadAllDriver,
  updateDriver,
} from "../../redux/rtk/features/driver/driverSlice";
import { loadAllCity } from "../../redux/rtk/features/city/citySlice";
import { loadAllBranch } from "../../redux/rtk/features/branch/branchSlice";
import moment from "moment";
import { loadAllCompany } from "../../redux/rtk/features/company/comapnySlice";

const UpdateDriver = ({ id, data, open, onClose }) => {
  const dispatch = useDispatch();
  const { list: cityList } = useSelector((state) => state.city);
  const { list: companyList = [] } = useSelector((state) => state.companies);

  const [loading, setLoading] = useState(false);
  const onClick = () => {
    setLoading(true);
  };

  const [form] = Form.useForm();
  const [loader, setLoader] = useState();

  const handleDateInputChange = (e, fieldName) => {
    const inputValue = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
    let formattedValue = inputValue;

    if (inputValue.length > 2) {
      formattedValue = `${inputValue.slice(0, 2)}-${inputValue.slice(2)}`;
    }
    if (inputValue.length > 4) {
      formattedValue = `${inputValue.slice(0, 2)}-${inputValue.slice(
        2,
        4
      )}-${inputValue.slice(4, 8)}`;
    }

    form.setFieldsValue({ [fieldName]: formattedValue });
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

      if (uppercaseValues.Dateofjoin) {
        uppercaseValues.Dateofjoin = moment(
          uppercaseValues.Dateofjoin,
          "DD-MM-YYYY"
        ).format("YYYY-MM-DD");
      }
      if (uppercaseValues.drvLicenseExpDate) {
        uppercaseValues.drvLicenseExpDate = moment(
          uppercaseValues.drvLicenseExpDate,
          "DD-MM-YYYY"
        ).format("YYYY-MM-DD");
      }

      const resp = await dispatch(
        updateDriver({ id, values: uppercaseValues })
      );
      console.log(resp);
      if (resp.payload.message === "success") {
        dispatch(loadAllDriver({ status: true, page: 1, count: 1000 }));
        form.resetFields();
        onClose();
      }
    } catch (error) {
      console.error("Failed to update driver:", error);
    }
    setLoading(false);
  };

  const onFinishFailed = () => {
    setLoader(false);
  };

  const getInitValues = (data) => ({
    driverName: data?.name,
    EmployeeNo: data?.EmployeeNo,
    Dateofjoin: data?.Dateofjoin
      ? moment(data.Dateofjoin).format("DD-MM-YYYY")
      : null,
    driverAddr: data?.driverAddr,
    cityID: parseInt(data?.cityID),
    pincode: data?.pincode,
    mobileNo: data?.mobileNo,
    whatsAppNo: data?.whatsAppNo,
    drvLicenseNo: data?.drvLicenseNo,
    drvLicenseExpDate: data?.drvLicenseExpDate
      ? moment(data.drvLicenseExpDate).format("DD-MM-YYYY")
      : null,
    aadharCardNo: data?.aadharCardNo,
    bankName: data?.bankName,
    bankBranch: data?.bankBranch,
    bankAcNo: data?.bankAcNo,
    bankAcType: data?.bankAcType,
    bankIFSC: data?.bankIFSC,
    licensePath: data?.licensePath,
    adharPath: data?.adharPath,
    pfNo: data?.pfNo,
    esiNo: data?.esiNo,
    referredBy: data?.referredBy,
    driverActive: data?.driverActive,
    Company_ID: String(data?.companyId),
  });

  useEffect(() => {
    handleLoadCompany();
    dispatch(loadAllCity({ page: 1, count: 10000, status: true }));
  }, []);
  const handleLoadCompany = () => {
    dispatch(loadAllCompany({ page: 1, count: 10000, status: true }));
  };

  useEffect(() => {
    if (data) {
      const initialValues = getInitValues(data);
      form.setFieldsValue(initialValues);
    }
  }, [data, form]);

  return (
    <Drawer
      title="Edit Driver"
      placement="right"
      onClose={onClose}
      open={open}
      width={800}
    >
      <div className="h-full">
        <Title level={4} className="m-2 text-center">
          Update Driver
        </Title>

        <Form
          form={form}
          layout="vertical"
          style={{ marginLeft: "40px", marginRight: "40px" }}
          initialValues={getInitValues(data)} // Set initial values here
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          labelAlign="left"
        >
          <div className="md:flex md:flex-wrap">
            <div className="w-full md:w-1/2 md:pr-2">
              <Form.Item
                style={{ marginBottom: "10px" }}
                label="Driver Name"
                name="driverName"
                rules={[
                  {
                    required: false,
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
                    required: false,
                    message: "Please provide input !",
                  },
                ]}
              >
                <Input placeholder="Address" />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: "10px" }}
                label="city"
                name="cityID"
                rules={[
                  {
                    required: false,
                    message: "Please provide input !",
                  },
                ]}
              >
                <Select
                  optionFilterProp="children" // Filters options based on the content of the children (party names)
                  showSearch
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
                    required: false,
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
                    required: false,
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
                    required: false,
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
                    required: false,
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
                    required: false,
                    message: "Please provide input !",
                  },
                ]}
              >
                <Input
                  placeholder="DD-MM-YYYY"
                  onChange={(e) =>
                    handleDateInputChange(e, "drvLicenseExpDate")
                  }
                  maxLength={10}
                />
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
              <Form.Item
                style={{ marginBottom: "10px" }}
                label="Driver Active status "
                name="driverActive"
                rules={[
                  {
                    required: false,
                    message: "Please input status!",
                  },
                ]}
              >
                <Select placeholder="Select status">
                  <Select.Option value="1">Yes</Select.Option>
                  <Select.Option value="0">No</Select.Option>
                </Select>
              </Form.Item>
            </div>
            <div className="w-full md:w-1/2 md:pl-2">
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
                name="bankBranch"
                rules={[
                  {
                    required: false,
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
                label="Date of Join"
                name="Dateofjoin"
                rules={[
                  {
                    required: true,
                    message: "Please provide input !",
                  },
                ]}
              >
                <Input
                  placeholder="DD-MM-YYYY"
                  onChange={(e) => handleDateInputChange(e, "Dateofjoin")}
                  maxLength={10}
                />
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
              Update Driver
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Drawer>
  );
};

export default UpdateDriver;
