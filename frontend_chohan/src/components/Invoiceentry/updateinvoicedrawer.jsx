import { Card, Typography, Space } from "antd";
import React, { useState, useEffect } from "react";
import moment from "moment";
import axios from "axios";
import TableComponentwithcheckbox from '../CommonUi/Tablecomponentwithcheck';
import { UnorderedListOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

function UpdatePartyBookinglistdrawer({ data, id, onClose }) {

  const [data1, setList1] = useState([]);
  const [loading2, setLoading2] = useState(true);
  const apiUrl = import.meta.env.VITE_APP_API;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/invoiceentry/booking`);
        setList1(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading2(false);
      }
    };

    fetchData();
  }, []);

  const columns = [
    {
      id: 2,
      title: 'Bus Type',
      dataIndex: 'busCategory',
      key: 'busCategory',
      render: (text) => <Text strong className="text-slate-700">{text}</Text>
    },
    {
      id: 9,
      title: 'Booking No',
      dataIndex: 'BookingID',
      key: 'BookingID',
      render: (text) => <Text className="text-slate-600">{text}</Text>
    },
    {
      id: 3,
      title: 'Sitting Capacity',
      dataIndex: 'SittingCapacity',
      key: 'SittingCapacity',
    },
    {
      id: 4,
      title: 'Trip Description',
      dataIndex: 'TripDesc',
      key: 'TripDesc',
      width: 200,
    },
    {
      id: 5,
      title: 'Trip Start Date',
      dataIndex: 'TripStartDate',
      key: 'TripStartDate',
      render: (createdAt) => {
        const parsedDate = moment(createdAt, 'DD-MM-YYYY');
        return parsedDate.isValid() ? parsedDate.format('DD-MM-YYYY') : 'Invalid date';
      },
    },
    {
      id: 6,
      title: 'Trip End Date',
      dataIndex: 'TripEndDate',
      key: 'TripEndDate',
      render: (createdAt) => {
        const parsedDate = moment(createdAt, 'DD-MM-YYYY');
        return parsedDate.isValid() ? parsedDate.format('DD-MM-YYYY') : 'Invalid date';
      },
    },
    {
      id: 8,
      title: 'No of Bus',
      dataIndex: 'BusQty',
      key: 'BusQty',
      render: (text) => <Text strong className="text-cyan-600">{text}</Text>
    },
    {
      id: 9,
      title: 'Rate',
      dataIndex: 'Rate',
      key: 'Rate',
      render: (text) => <Text>₹{Number(text).toLocaleString()}</Text>
    },
    {
      id: 10,
      title: 'Amount',
      dataIndex: 'Amt',
      key: 'Amt',
      render: (text) => <Text strong className="text-slate-900">₹{Number(text).toLocaleString()}</Text>
    },
  ];

  const handleClickButton = (selectedData) => {
    onClose(selectedData);
  };

  return (
    <Card
      className="border-none shadow-none bg-white rounded-xl overflow-hidden"
      bodyStyle={{ padding: '0px' }}
    >
      <div className="flex items-center justify-between mb-6 p-1">
        <Space align="center" size="middle">
          <div style={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
            padding: '10px',
            borderRadius: '10px',
            boxShadow: '0 4px 10px rgba(139, 92, 246, 0.2)'
          }}>
            <UnorderedListOutlined className="text-white text-xl" />
          </div>
          <div>
            <Title level={5} style={{ margin: 0, color: '#1e293b', fontWeight: 700 }}>Booking List</Title>
            <Text style={{ color: '#64748b', fontSize: '13px' }}>Select bookings to update invoice</Text>
          </div>
        </Space>
      </div>

      <div className="border border-slate-100 rounded-lg overflow-hidden">
        <TableComponentwithcheckbox
          list={data1}
          columns={columns}
          csvFileName={'Booking List'}
          onClose={handleClickButton}
        />
      </div>
    </Card>
  );
}
export default UpdatePartyBookinglistdrawer;
