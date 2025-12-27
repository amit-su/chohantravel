import moment from "moment";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import UserPrivateComponent from "../PrivacyComponent/UserPrivateComponent";
import CreateDrawer from "../CommonUi/CreateDrawer";
import { DeleteOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { Card, Typography, Space, Button } from "antd";
import { useDispatch } from "react-redux";
import TableNoPagination from "../CommonUi/TableNoPagination";
import AddPartyBookinglistdrawer from "./addinvoicedrawer";
import {
  clearLocalProforma,
  deleteLocalProforma,
} from "../../redux/rtk/features/localProformaInvoice/localProformaSlice";
import UpdatePartyBookinglistdrawer from "./updateinvoicedrawer";

const { Text, Title } = Typography;

const CreateInvoice = ({
  isIncludeGST,
  onBookingClose,
  list,
  loading,
  partyId,
}) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [bookingArray, setBookingArray] = useState([]);
  const [childrenDrawer, setChildrenDrawer] = useState(false);
  const apiUrl = import.meta.env.VITE_APP_API;

  useEffect(() => {
    // Sync list props to local state
    setBookingArray(list || []);
  }, [list]);

  const onClose = (selectedData) => {
    setOpen(false);
    setChildrenDrawer(false);
    setBookingArray((prevBookingArray) => {
      return [...prevBookingArray, ...selectedData];
    });
  };

  useEffect(() => {
    onBookingClose(bookingArray);
  }, [bookingArray, onBookingClose]);

  const columns = [
    {
      id: 2,
      title: "Bus Type",
      dataIndex: "busCategory",
      key: "busCategory",
      render: (text) => <Text strong className="text-slate-700">{text}</Text>
    },
    {
      id: 9,
      title: "Booking No",
      dataIndex: "BookingID",
      key: "BookingID",
      render: (text) => <Text className="text-slate-600">{text}</Text>
    },
    {
      id: 3,
      title: "Capacity",
      dataIndex: "SittingCapacity",
      key: "SittingCapacity",
    },
    {
      id: 4,
      title: "Trip Description",
      dataIndex: "TripDesc",
      key: "TripDesc",
      width: 200,
    },
    {
      id: 5,
      title: "Start Date",
      dataIndex: "TripStartDate",
      key: "TripStartDate",
    },
    {
      id: 6,
      title: "End Date",
      dataIndex: "TripEndDate",
      key: "TripEndDate",
    },
    {
      id: 8,
      title: "No of Bus",
      dataIndex: "BusQty",
      key: "BusQty",
      render: (text) => <Text strong className="text-cyan-600">{text}</Text>
    },
    {
      id: 9,
      title: "Rate",
      dataIndex: "Rate",
      key: "Rate",
      render: (text) => <Text>₹{Number(text).toLocaleString()}</Text>
    },
    {
      id: 10,
      title: "Amount",
      dataIndex: "Amt",
      key: "Amt",
      render: (text) => <Text strong className="text-slate-900">₹{Number(text).toLocaleString()}</Text>
    },
    {
      id: 3,
      title: "Action",
      dataIndex: "",
      key: "action",
      render: ({ SLNO, ...restData }) => (
        <div className="flex items-center gap-2">
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDelete(restData)}
            className="hover:bg-red-50 rounded-lg flex items-center justify-center"
          />
        </div>
      ),
    },
  ];

  const onDelete = async (restData) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        const response = await fetch(
          `${apiUrl}/invoiceentry/booking/${restData.BookingID}/${restData.InvHeadSlNo}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          window.location.reload();
        } else {
          console.error("Failed to delete the invoice.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

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
          title={"Add Bookings"}
          width={70}
          open={open}
        >
          <AddPartyBookinglistdrawer
            onClose={onClose}
            existingBookingIDs={bookingArray.map((item) => item.BookingID)}
            partyId={partyId}
          />
        </CreateDrawer>
      </div>

      <UserPrivateComponent permission={"readAll-setup"}>
        <TableNoPagination
          columns={columns}
          list={bookingArray}
          loading={loading}
        //   scrollX={1200} // Optional
        />
      </UserPrivateComponent>
    </Card>
  );
};

export default CreateInvoice;
