import {
    Button,
    Checkbox,
    Form,
    Input,
    Select,
    Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addSingleVendor, loadVendorPaginated } from "../../redux/rtk/features/vendor/vendorSlice";
import { loadAllCompany } from "../../redux/rtk/features/company/comapnySlice";
import { loadAllCity } from "../../redux/rtk/features/city/citySlice";

const AddVendor = ({ drawerClose }) => {
    const dispatch = useDispatch();
    const { Title } = Typography;
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleLoadCompany = () => {
        dispatch(loadAllCompany({ page: 1, count: 10000, status: true }));
    };

    const handleLoadCity = () => {
        dispatch(loadAllCity({ page: 1, count: 10000, status: true }));
    };

    const { list: companyList } = useSelector((state) => state.companies);
    const { list: cityList } = useSelector((state) => state.city);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const resp = await dispatch(addSingleVendor(values));
            if (resp.payload.status === 1) {
                form.resetFields();
                dispatch(loadVendorPaginated({ status: true, page: 1, count: 10 }));
                if (drawerClose) drawerClose();
            }
        } catch (error) {
            console.error("Error adding vendor:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full">
            <Title level={4} className="m-3 text-center">
                Add Vendor
            </Title>
            <Form
                form={form}
                name="addVendor"
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    vendorActive: true,
                    vendorType: "SUPPLIER",
                }}
                autoComplete="off"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                    <Form.Item
                        label="Vendor Name"
                        name="vendorName"
                        rules={[{ required: true, message: "Please input vendor name!" }]}
                    >
                        <Input placeholder="Enter vendor name" />
                    </Form.Item>

                    <Form.Item
                        label="Vendor Type"
                        name="vendorType"
                        rules={[{ required: true, message: "Please select vendor type!" }]}
                    >
                        <Select placeholder="Select vendor type">
                            <Select.Option value="SUPPLIER">SUPPLIER</Select.Option>
                            <Select.Option value="OTHER">OTHER</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="Address" name="vendAddr">
                        <Input.TextArea placeholder="Enter address" rows={1} />
                    </Form.Item>

                    <Form.Item
                        label="City"
                        name="cityID"
                        rules={[{ required: true, message: "Please select city!" }]}
                    >
                        <Select
                            showSearch
                            placeholder="Select city"
                            optionFilterProp="children"
                            onClick={handleLoadCity}
                        >
                            {cityList?.map((city) => (
                                <Select.Option key={city.id} value={city.id}>
                                    {city.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item label="Pin Code" name="pinCode">
                        <Input placeholder="Enter pin code" />
                    </Form.Item>

                    <Form.Item
                        label="Mobile No"
                        name="mobileNo"
                        rules={[{ required: true, message: "Please input mobile number!" }]}
                    >
                        <Input placeholder="Enter mobile number" />
                    </Form.Item>

                    <Form.Item label="WhatsApp No" name="whatsAppNo">
                        <Input placeholder="Enter WhatsApp number" />
                    </Form.Item>

                    <Form.Item label="Email" name="email">
                        <Input type="email" placeholder="Enter email" />
                    </Form.Item>

                    <Form.Item label="GST No" name="gstNo">
                        <Input placeholder="Enter GST number" />
                    </Form.Item>

                    <Form.Item label="PAN No" name="panNo">
                        <Input placeholder="Enter PAN number" />
                    </Form.Item>

                    <Form.Item
                        label="Company"
                        name="companyID"
                        rules={[{ required: true, message: "Please select company!" }]}
                    >
                        <Select
                            showSearch
                            placeholder="Select company"
                            optionFilterProp="children"
                            onClick={handleLoadCompany}
                        >
                            {companyList?.map((company) => (
                                <Select.Option key={company.Id} value={company.Id}>
                                    {company.Name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item label="Bank Name" name="bankName">
                        <Input placeholder="Enter bank name" />
                    </Form.Item>

                    <Form.Item label="Bank Branch" name="bankBranch">
                        <Input placeholder="Enter bank branch" />
                    </Form.Item>

                    <Form.Item label="Bank A/C No" name="bankAcNo">
                        <Input placeholder="Enter bank account number" />
                    </Form.Item>

                    <Form.Item label="Bank A/C Type" name="bankAcType">
                        <Input placeholder="Enter bank account type" />
                    </Form.Item>

                    <Form.Item label="Bank IFSC" name="bankIFSC">
                        <Input placeholder="Enter bank IFSC" />
                    </Form.Item>

                    <Form.Item label="Referred By" name="referredBy">
                        <Input placeholder="Enter referrer name" />
                    </Form.Item>

                    <Form.Item name="vendorActive" valuePropName="checked">
                        <Checkbox>Vendor Active</Checkbox>
                    </Form.Item>
                </div>

                <Form.Item className="flex justify-center mt-4">
                    <Button type="primary" htmlType="submit" loading={loading} shape="round">
                        Add Vendor
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AddVendor;
