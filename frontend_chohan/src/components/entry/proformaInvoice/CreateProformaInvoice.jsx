import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import moment from "moment";
import dayjs from "dayjs";
import { Card, Modal, Typography, Tag, Button, Space, Table } from "antd";
import { DeleteOutlined, PlusOutlined, EnvironmentOutlined, CalculatorOutlined } from "@ant-design/icons";
import UserPrivateComponent from "../../PrivacyComponent/UserPrivateComponent";
import CreateDrawer from "../../CommonUi/CreateDrawer";
import TableNoPagination from "../../CommonUi/TableNoPagination";
import AddPartyBusListDrawer from "./addPartyBusListDrawer";
import UpdatePartyBusListDrawer from "./updatePartyBusListDrawer";
import { toast } from "react-toastify";
import axios from "axios";

const { Text, Title } = Typography;

const CreateProformaInvoice = ({
  isIncludeGST,
  onBookingClose,
  list,
  loading,
}) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [bookingArray, setBookingArray] = useState([]);
  const [childrenDrawer, setChildrenDrawer] = useState(false);
  const apiUrl = import.meta.env.VITE_APP_API;

  useEffect(() => {
    setBookingArray(list || []);
  }, [list]);

  const onDelete = async (index) => {
    try {
      let itemToDelete;

      setBookingArray((prevList) => {
        itemToDelete = prevList[index];
        return prevList;
      });

      if (itemToDelete?.SLNO !== 0) {
        Modal.confirm({
          title: "Are you sure you want to delete this Bus?",
          okText: "Yes",
          okType: "danger",
          cancelText: "No",
          async onOk() {
            const response = await axios.delete(
              `${apiUrl}/proformaInvoice/proformatran/${itemToDelete.SLNO}`
            );

            if (response.data.status === 1) {
              setBookingArray((prevList) =>
                prevList.filter((_, i) => i !== index)
              );
              toast.success("Delete successful");
            } else {
              toast.error("Delete failed");
            }
          },
        });
      } else {
        setBookingArray((prevList) => prevList.filter((_, i) => i !== index));
        toast.success("Deleted from UI only");
      }
    } catch (error) {
      toast.error("Error deleting booking");
    }
  };

  const handleAddItem = (values) => {
    setOpen(false);
    setChildrenDrawer(false);
    const newId = values.SLNO || Date.now();
    const newItem = { ...values, SLNO: newId, key: newId };
    setBookingArray((prev) => [...prev, newItem]);
  };

  const handleUpdateItem = (index, values) => {
    setOpen(false);
    setChildrenDrawer(false);
    setBookingArray((prev) => {
      const newArray = [...prev];
      if (index >= 0 && index < newArray.length) {
        const originalItem = newArray[index];
        newArray[index] = {
          ...originalItem,
          ...values,
          key: originalItem.key || originalItem.SLNO,
        };
      }
      return newArray;
    });
  };

  useEffect(() => {
    if (!open) {
      setChildrenDrawer(false);
    }
  }, [open]);

  useEffect(() => {
    onBookingClose(bookingArray);
  }, [bookingArray, onBookingClose]);

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
      title: "Trip Description",
      dataIndex: "tripDescription",
      key: "tripDescription",
      width: 200,
    },
    {
      title: "Start Date",
      dataIndex: "ReportDate",
      key: "ReportDate",
      render: (text) => <Text className="text-slate-600">{text}</Text>
    },
    {
      title: "End Date",
      dataIndex: "tripEndDate",
      key: "tripEndDate",
      render: (text) => <Text className="text-slate-600">{text}</Text>
    },
    {
      title: "Time",
      dataIndex: "reportTime",
      key: "reportTime",
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
        const { SLNO, ...restData } = record;
        return (
          <div className="flex items-center gap-3">
            <CreateDrawer
              update={1}
              permission={"update-driver"}
              title={"Edit Bus"}
              open={open}
              minimalEdit
            >
              <UpdatePartyBusListDrawer
                data={{ ...restData, SLNO }}
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
            <Text style={{ color: '#64748b', fontSize: '14px' }}>Manage individual bus entries for this proforma invoice</Text>
          </div>
        </Space>

        <CreateDrawer
          permission={"create-bus"}
          title={"Add New Bus Entry"}
          width={40}
          open={open}
        >
          <AddPartyBusListDrawer onClose={handleAddItem} />
        </CreateDrawer>
      </div>

      <UserPrivateComponent permission={"readAll-setup"}>
        <TableNoPagination
          columns={columns}
          list={bookingArray}
          loading={loading}
          scrollX={1200}
          summary={(pageData) => {
            let totalQty = 0;
            let totalAmount = 0;

            pageData.forEach(({ busQty, amount }) => {
              totalQty += Number(busQty) || 0;
              totalAmount += Number(amount) || 0;
            });

            return (
              <Table.Summary fixed>
                <Table.Summary.Row className="bg-slate-50 font-bold">
                  <Table.Summary.Cell index={0} colSpan={6}>
                    <Space>
                      <CalculatorOutlined className="text-cyan-600" />
                      <Text strong className="text-slate-700">Total Summary</Text>
                    </Space>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={6}>
                    <Text strong className="text-cyan-600 text-lg">{totalQty}</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={7}>
                    <Text className="text-slate-400 font-normal">Total</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={8} colSpan={2}>
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

export default CreateProformaInvoice;
