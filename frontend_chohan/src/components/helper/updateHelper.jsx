import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, DatePicker, Form, Input, Select } from "antd";
import Title from "antd/es/skeleton/Title";
import {
  loadAllHelper,
  updateHelper,
} from "../../redux/rtk/features/helper/helperSlice";
import { loadAllCity } from "../../redux/rtk/features/city/citySlice";
import { loadAllBranch } from "../../redux/rtk/features/branch/branchSlice";
import moment from "moment";
import TextArea from "antd/es/input/TextArea";
import { loadAllCompany } from "../../redux/rtk/features/company/comapnySlice";

const UpdateHelper = ({ id, data }) => {
  const dispatch = useDispatch();

  const { list: cityList } = useSelector((state) => state.city);
  const { list: companyList = [] } = useSelector((state) => state.companies);

  const [loading, setLoading] = useState(false);
  const onClick = () => {
    setLoading(true);
  };

  const [form] = Form.useForm();
  const [loader, setLoader] = useState();

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
        updateHelper({ id, values: uppercaseValues })
      );
      console.log(resp);
      if (resp.payload.message === "success") {
        await dispatch(loadAllHelper({ status: true, page: 1, count: 1000 }));
        setLoading(false);
        form.resetFields();
      }
    } catch (error) {
      setLoader(false);
    }
    setLoader(false);
  };

  const onFinishFailed = () => {
    setLoader(false);
  };

  const [initValues, setInitValues] = useState({
    helperName: data?.name,
    EmployeeNo: data?.EmployeeNo,
    Dateofjoin: data?.Dateofjoin ? moment(data.Dateofjoin) : null,
    helperAddr: data?.helperAddr,
    cityID: parseInt(data?.cityID),
    pincode: data?.pincode,
    mobileNo: data?.mobileNo,
    whatsAppNo: data?.whatsAppNo,
    aadharCardNo: data?.aadharCardNo,
    bankName: data?.bankName,
    bankBranch: data?.bankBranch,
    bankAcNo: data?.bankAcNo,
    bankAcType: data?.bankAcType,
    bankIFSC: data?.bankIFSC,
    adharPath: data?.adharPath,
    pfNo: data?.pfNo,
    esiNo: data?.esiNo,
    referredBy: data?.referredBy,
    helperActive: data?.helperActive,
    Company_ID: String(data?.companyId),
  });
  useEffect(() => {
    handleLoadCompany();
    dispatch(loadAllCity({ page: 1, count: 10000, status: true }));
    dispatch(loadAllBranch({ page: 1, count: 10000, status: true }));
  }, [dispatch]);

  const handleLoadCompany = () => {
    dispatch(loadAllCompany({ page: 1, count: 10000, status: true }));
  };
  return (
    <Fragment>
      <div className="h-full">
        <Title level={4} className="m-2 text-center">
          Update Helper
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
          <div className="md:flex md:flex-wrap">
            <div className="w-full md:w-1/2 md:pr-2">
              <Form.Item
                style={{ marginBottom: "10px" }}
                label="Helper Name"
                name="helperName"
                rules={[
                  {
                    required: false,
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
                    required: false,
                    message: "Please provide input !",
                  },
                ]}
              >
                <TextArea placeholder="Enter address" rows={4} />
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
                label="Helper Active status "
                name="helperActive"
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
              Update Helper
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Fragment>
  );
};

export default UpdateHelper;
