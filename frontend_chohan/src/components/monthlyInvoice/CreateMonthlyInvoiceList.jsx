import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Card, Button, Space, Typography, Table, Modal, Tag } from "antd";
import { DeleteOutlined, EnvironmentOutlined, CalculatorOutlined } from "@ant-design/icons";
import UserPrivateComponent from "../PrivacyComponent/UserPrivateComponent";
import CreateDrawer from "../CommonUi/CreateDrawer";
import TableNoPagination from "../CommonUi/TableNoPagination";
import AddMonthlyInvoiceDrawer from "./AddMonthlyInvoiceDrawer";
import UpdateMonthlyInvoiceDrawer from "./UpdateMonthlyInvoiceDrawer";
import { toast } from "react-toastify";
import axios from "axios";
import dayjs from "dayjs";

const { Text, Title } = Typography;

const CreateMonthlyInvoiceList = ({
    onBookingClose,
    list,
    loading,
}) => {
    const [open, setOpen] = useState(false);

    // Controlled component: use list from props directly

    const onDelete = async (index) => {
        try {
            const newList = list.filter((_, i) => i !== index);
            onBookingClose(newList);
            toast.success("Removed from list");
        } catch (error) {
            toast.error("Error deleting item");
        }
    };

    const handleAddItem = (values) => {
        setOpen(false);
        const reactKey = Date.now();
        const newItem = { ...values, SLNO: 0, key: reactKey, isNew: true };
        const newList = [...(list || []), newItem];
        onBookingClose(newList);
    };

    const handleUpdateItem = (index, values) => {
        const newArray = [...(list || [])];
        if (index >= 0 && index < newArray.length) {
            const originalItem = newArray[index];
            newArray[index] = {
                ...originalItem,
                ...values,
                key: originalItem.key || originalItem.SLNO,
            };
            onBookingClose(newArray);
            toast.success("Bus entry updated");
        }
    };

    const columns = [
        {
            title: "Bus Type",
            dataIndex: "busCategory",
            key: "busCategory",
            render: (text) => <Text strong className="text-slate-700">{text}</Text>
        },
        {
            title: "Capacity",
            dataIndex: "sittingCapacity",
            key: "sittingCapacity",
            render: (text) => <Tag color="blue" className="rounded-md px-2">{text} Seater</Tag>
        },
        {
            title: "Description",
            dataIndex: "tripDescription",
            key: "tripDescription",
            width: 200,
        },
        {
            title: "Route / Description",
            dataIndex: "routeNo",
            key: "routeNo",
            render: (text) => <Text className="text-slate-600">{text || "-"}</Text>
        },
        {
            title: "Bill Month",
            dataIndex: "billMonth",
            key: "billMonth",
            render: (text) => <Text className="text-slate-600">{text ? dayjs(text).format("MM-YYYY") : "-"}</Text>
        },
        {
            title: "Qty",
            dataIndex: "busQty",
            key: "busQty",
            render: (text) => <Text strong className="text-cyan-600">{text}</Text>
        },
        {
            title: "Rate",
            dataIndex: "rate",
            key: "rate",
            render: (text) => <Text>₹{Number(text).toLocaleString()}</Text>
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            render: (text) => <Text strong className="text-slate-900">₹{Number(text).toLocaleString()}</Text>
        },
        {
            title: "Action",
            key: "action",
            width: 100,
            render: (text, record, index) => {
                return (
                    <div className="flex items-center gap-3">
                        <CreateDrawer
                            update={1}
                            permission={"update-driver"}
                            title={"Edit Bus"}
                            minimalEdit
                        >
                            <UpdateMonthlyInvoiceDrawer
                                data={{ ...record }}
                                onClose={(values) => handleUpdateItem(index, values)}
                            />
                        </CreateDrawer>

                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => onDelete(index)}
                            className="hover:bg-red-50 rounded-lg flex items-center justify-center"
                        />
                    </div>
                );
            },
        },
    ];

    return (
        <Card
            className="border-none shadow-none bg-white rounded-xl overflow-hidden"
            bodyStyle={{ padding: '24px' }}
        >
            <div className="flex items-center justify-between mb-6">
                <Space align="center" size="middle">
                    <div style={{
                        background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
                        padding: '10px',
                        borderRadius: '10px',
                        boxShadow: '0 4px 10px rgba(8, 145, 178, 0.15)'
                    }}>
                        <EnvironmentOutlined className="text-white text-xl" />
                    </div>
                    <div>
                        <Title level={4} style={{ margin: 0, color: '#1e293b', fontWeight: 700 }}>Trip Details & Bookings</Title>
                        <Text style={{ color: '#64748b', fontSize: '14px' }}>Manage individual bus entries</Text>
                    </div>
                </Space>

                <CreateDrawer
                    permission={"create-bus"}
                    title={"Add New Bus Entry"}
                    width={40}
                    open={open}
                    setOpen={setOpen}
                >
                    <AddMonthlyInvoiceDrawer onClose={handleAddItem} />
                </CreateDrawer>
            </div>

            <UserPrivateComponent permission={"readAll-setup"}>
                <TableNoPagination
                    columns={columns}
                    list={list}
                    loading={loading}
                    scrollX={1200}
                    summary={(pageData) => {
                        let totalQty = 0;
                        let totalAmount = 0;

                        pageData.forEach((item) => {
                            totalQty += Number(item.busQty) || 0;
                            totalAmount += Number(item.amount) || 0;
                        });

                        return (
                            <Table.Summary fixed>
                                <Table.Summary.Row className="bg-slate-50 font-bold">
                                    <Table.Summary.Cell index={0} colSpan={5}>
                                        <Space>
                                            <CalculatorOutlined className="text-cyan-600" />
                                            <Text strong className="text-slate-700">Total Summary</Text>
                                        </Space>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={5}>
                                        <Text strong className="text-cyan-600 text-lg">{totalQty}</Text>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={6}>
                                        <Text className="text-slate-400 font-normal">Total</Text>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={7} colSpan={2}>
                                        <Text strong className="text-slate-900 text-lg">₹{totalAmount.toLocaleString()}</Text>
                                    </Table.Summary.Cell>
                                </Table.Summary.Row>
                            </Table.Summary>
                        );
                    }}
                />
            </UserPrivateComponent>
        </Card>
    );
};

export default CreateMonthlyInvoiceList;
