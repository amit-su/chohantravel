import moment from "moment";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import UserPrivateComponent from "../PrivacyComponent/UserPrivateComponent";
import CreateDrawer from "../CommonUi/CreateDrawer";
import { DeleteOutlined } from "@ant-design/icons";
import { Card } from "antd";
import { useDispatch } from "react-redux";
import TableNoPagination from "../CommonUi/TableNoPagination";
import AddPartyBookinglistdrawer from "./addinvoicedrawer";
import {
  clearLocalProforma,
  deleteLocalProforma,
} from "../../redux/rtk/features/localProformaInvoice/localProformaSlice";
import UpdatePartyBookinglistdrawer from "./updateinvoicedrawer";

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
  useEffect(() => {
    // Use the partyId as needed within this component
    console.log("Party ID:", partyId);
    // Add your logic here that needs to use the partyId
  }, [partyId]);
  useEffect(() => {
    setBookingArray(list);
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
    {
      id: 3,
      title: "Action",
      dataIndex: "",
      key: "action",
      render: ({ SLNO, ...restData }) => (
        <div className="flex items-center gap-2">
          {/* <CreateDrawer
            update={1}
            permission={"update-driver"}
            title={"Edit Bus"}
            open={open}
            width={70}
            minimalEdit
          >
            <UpdatePartyBookinglistdrawer data={restData} id={SLNO} onClose={onClose}/>
          </CreateDrawer> */}
          <DeleteOutlined
            onClick={() => onDelete(restData)}
            className="p-2 text-white bg-red-600 rounded-md"
          />
        </div>
      ),
    },
  ];
  const apiUrl = import.meta.env.VITE_APP_API;

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
    } else {
      console.log("Delete action canceled by user.");
    }
  };

  return (
    <Card
      className="border-0 md:border md:p-6 bg-transparent md:bg-[#fafafa]"
      bodyStyle={{ padding: 0 }}
    >
      <div className="items-center justify-between pb-3 md:flex">
        <h1 className="text-lg font-bold">Party Booking Details</h1>
        <div className="flex items-center justify-between gap-1 md:justify-start md:gap-3">
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
      </div>
      <UserPrivateComponent permission={"readAll-setup"}>
        <TableNoPagination
          columns={columns}
          list={bookingArray}
          loading={loading}
        />
      </UserPrivateComponent>
    </Card>
  );
};

export default CreateInvoice;
