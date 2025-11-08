import React, { useState, useEffect } from "react";
import { Card, Button } from "antd";
import moment from "moment";
import axios from "axios";
import TableComponentwithcheckbox from "../CommonUi/Tablecomponentwithcheck"; // Adjust import path as necessary

const AddPartyBookinglistdrawer = ({
  onClose,
  existingBookingIDs,
  partyId,
}) => {
  const [data1, setList1] = useState([]);
  const [loading2, setLoading2] = useState(true);
  const apiUrl = import.meta.env.VITE_APP_API;
  useEffect(() => {
    // Use the partyId as needed within this component
    console.log("Party ID in AddPartyBookinglistdrawer:", partyId);
    // Add your logic here that needs to use the partyId
  }, [partyId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/invoiceentry/booking`);
        console.log(partyId, "87867675");
        console.log(response.data.data);
        const filteredData = response.data.data.filter(
          (item) =>
            item.PartyID === partyId.toString() &&
            !existingBookingIDs.includes(item.BookingID)
        );
        setList1(filteredData);
        console.log(filteredData.PartyID);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading2(false);
      }
    };

    if (partyId) {
      fetchData();
    }
  }, [partyId, existingBookingIDs, apiUrl]);

  const columns = [
    {
      id: 2,
      title: "Bus Type",
      dataIndex: "busCategory",
      key: "busCategory",
    },
    {
      id: 9,
      title: "Booking No",
      dataIndex: "BookingID",
      key: "BookingID",
    },
    {
      id: 3,
      title: "Sitting Capacity",
      dataIndex: "SittingCapacity",
      key: "SittingCapacity",
    },
    {
      id: 4,
      title: "Trip Description",
      dataIndex: "TripDesc",
      key: "TripDesc",
    },
    {
      id: 5,
      title: "Trip Start Date",
      dataIndex: "TripStartDate",
      key: "TripStartDate",
    },
    {
      id: 6,
      title: "Trip End Date",
      dataIndex: "TripEndDate",
      key: "TripEndDate",
    },
    {
      id: 8,
      title: "No of Bus",
      dataIndex: "BusQty",
      key: "BusQty",
    },
    {
      id: 9,
      title: "Rate",
      dataIndex: "Rate",
      key: "Rate",
    },
    {
      id: 10,
      title: "Amount",
      dataIndex: "Amt",
      key: "Amt",
    },
  ];

  const handleClickButton = (selectedData) => {
    console.log("Selected Data in Drawer:", selectedData);
    onClose(selectedData);
  };

  return (
    <div className="mt-2 card card-custom">
      <div className="card-body">
        <Card
          className="border-0 md:border md:p-6 bg-transparent md:bg-[#fafafa]"
          bodyStyle={{ padding: 0 }}
        >
          <div className="items-center justify-between pb-3 md:flex">
            <h1 className="text-lg font-bold">Booking List</h1>
          </div>
          <TableComponentwithcheckbox
            list={data1}
            columns={columns}
            csvFileName={"Booking List"}
            onClose={handleClickButton}
          />
        </Card>
      </div>
    </div>
  );
};

export default AddPartyBookinglistdrawer;
