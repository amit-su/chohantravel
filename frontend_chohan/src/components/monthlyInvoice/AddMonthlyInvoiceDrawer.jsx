import {
    Button,
    Form,
    Input,
    Select,
    Typography,
    DatePicker
} from "antd";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { loadAllBusCategory } from "../../redux/rtk/features/busCategory/busCategorySlice";
import TextArea from "antd/es/input/TextArea";

const AddMonthlyInvoiceDrawer = ({ onClose, drawerClose }) => {
    const dispatch = useDispatch();
    const { Title } = Typography;
    const [form] = Form.useForm();

    // Data is now loaded by the parent component (AddMonthlyInvoice)
    const { list: busCategoryList } = useSelector((state) => state.busCategories);

    useEffect(() => {
        // No need to fetch here
    }, []);

    const onFinish = async (values) => {
        try {
            const selectedBusTypeId = values?.busTypeId;
            const selectedBusCategory = busCategoryList?.find(
                (busCategory) => busCategory.id == selectedBusTypeId
            );
            const busCategoryName = selectedBusCategory
                ? selectedBusCategory.buscategory
                : "";

            const newEntry = {
                ...values,
                busCategory: busCategoryName,
                routeNo: values.routeNo ? values.routeNo.format("YYYY-MM-DD") : null,
                billMonth: values.billMonth ? values.billMonth.format("YYYY-MM-DD") : null,
                SLNO: Date.now(), // Unique ID for React state
                isNew: true
            };

            form.resetFields();
            onClose(newEntry);
            if (drawerClose) {
                drawerClose();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const calculateAmount = (rate, busQty) => {
        if (!rate || !busQty) return 0;
        return rate * busQty;
    };

    return (
        <div className="h-full">
            <Title level={4} className="m-3 text-center">
                Add Monthly Bus Entry
            </Title>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                className="px-4"
                initialValues={{
                    busQty: 1,
                    amount: 0
                }}
            >
                <Form.Item
                    label="Bus Type"
                    name="busTypeId"
                    rules={[{ required: true, message: "Required!" }]}
                >
                    <Select
                        showSearch
                        optionFilterProp="children"
                        placeholder="Select category"
                    >
                        {busCategoryList?.map((category) => (
                            <Select.Option key={category.id} value={Number(category.id)}>
                                {category.buscategory}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Sitting Capacity"
                    name="sittingCapacity"
                    rules={[{ required: true, message: "Required!" }]}
                >
                    <Input type="number" placeholder="Capacity" />
                </Form.Item>

                <Form.Item
                    label="Trip Description"
                    name="tripDescription"
                    rules={[{ required: true, message: "Required!" }]}
                >
                    <TextArea rows={3} placeholder="Description" />
                </Form.Item>

                <Form.Item
                    label="Route / Date"
                    name="routeNo"
                    help="Select the date for the route"
                >
                    <DatePicker className="w-full" format="DD-MM-YYYY" />
                </Form.Item>

                <Form.Item
                    label="Bill Month"
                    name="billMonth"
                    help="Select the billing month"
                >
                    <DatePicker className="w-full" picker="month" format="MM-YYYY" />
                </Form.Item>

                <Form.Item
                    label="No of Bus"
                    name="busQty"
                    rules={[{ required: true, message: "Required!" }]}
                >
                    <Input
                        type="number"
                        onChange={(e) => {
                            const busQty = parseFloat(e.target.value) || 0;
                            const rate = parseFloat(form.getFieldValue("rate")) || 0;
                            const amount = calculateAmount(rate, busQty);
                            form.setFieldsValue({ amount });
                        }}
                    />
                </Form.Item>

                <Form.Item
                    label="Rate"
                    name="rate"
                    rules={[{ required: true, message: "Required!" }]}
                >
                    <Input
                        type="number"
                        onChange={(e) => {
                            const rate = parseFloat(e.target.value) || 0;
                            const busQty = parseFloat(form.getFieldValue("busQty")) || 0;
                            const amount = calculateAmount(rate, busQty);
                            form.setFieldsValue({ amount });
                        }}
                    />
                </Form.Item>

                <Form.Item
                    label="Amount"
                    name="amount"
                    rules={[{ required: true, message: "Required!" }]}
                >
                    <Input type="number" />
                </Form.Item>

                <Button type="primary" htmlType="submit" className="w-full mt-4">
                    Add Entry
                </Button>
            </Form>
        </div>
    );
};

export default AddMonthlyInvoiceDrawer;
