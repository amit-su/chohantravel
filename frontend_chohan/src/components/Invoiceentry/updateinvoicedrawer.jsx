import { Button, DatePicker, Form, Input, Select, TimePicker,Card } from "antd";
import React, { useBusCategory, useState,useCallback,useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import axios from "axios";
import TableComponentwithcheckbox from '../CommonUi/Tablecomponentwithcheck'; // Adjust import path as necessary


import { loadAllBusCategory } from "../../redux/rtk/features/busCategory/busCategorySlice";
import { updateLocalProforma } from "../../redux/rtk/features/localProformaInvoice/localProformaSlice";
let arraydata=[];
function UpdatePartyBookinglistdrawer({ data, id,onClose }) {
  console.log(data,"977787777777777",id)
  arraydata=data;
  console.log(arraydata,"777676")

  //Date issue//
  const [data1, setList1] = useState([]);
  const [loading2, setLoading2] = useState(true);
  const apiUrl = import.meta.env.VITE_APP_API;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/invoiceentry/booking`,);
        setList1(response.data.data);
        console.log(response.data.data);
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
    },
    {
      id: 9,
      title: 'Booking No',
      dataIndex: 'BookingID',
      key: 'BookingID',
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
    },
    {
      id: 9,
      title: 'Rate',
      dataIndex: 'Rate',
      key: 'Rate',
    },
    {
      id: 10,
      title: 'Amount',
      dataIndex: 'Amt',
      key: 'Amt',
    },
  ];

  const handleClickButton = (selectedData) => {
    console.log('Selected Data in Drawer:', selectedData);
    onClose(selectedData);
  };
  const staticBookingData = {
    SlNo: 2,
    BookingID: bi.join(","),
    Rate: 100.0,
    Amt: 1000.0
};

  return (
    <div className="card card-custom mt-2">
      <div className="card-body">
        <Card
          className="border-0 md:border md:p-6 bg-transparent md:bg-[#fafafa]"
          bodyStyle={{ padding: 0 }}
        >
          <div className="md:flex items-center justify-between pb-3">
            <h1 className="text-lg font-bold">Booking List</h1>
          </div>
          <TableComponentwithcheckbox
            list={data1}
            columns={columns}
            csvFileName={'Booking List'}
            onClose={handleClickButton}
          />
        </Card>
      </div>
    </div>
  );}
export default UpdatePartyBookinglistdrawer;
