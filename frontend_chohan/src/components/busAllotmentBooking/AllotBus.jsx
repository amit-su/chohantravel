import React, { useEffect, useState } from "react";
import UserPrivateComponent from "../PrivacyComponent/UserPrivateComponent";
import TableComponent from "../CommonUi/TableComponent";
import { Card, Drawer } from "antd";
import { deleteLocalBooking } from "../../redux/rtk/features/localBusBooking/localBusBookingSlice";
import CreateDrawer from "../CommonUi/CreateDrawer";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useParams } from "react-router-dom";
import AllotBusDrawer from "./AllotBusDrawer";
import { loadSingleBookingBusAllotment } from "../../redux/rtk/features/bookingBusAllotment/bookingBusAllotmentSlice";
const AllotBus = ({ ID, onSuccess }) => {
  const { id } = useParams();

  let bookingID = ID?.BookingNo ?? null;
  let decodedBookingID = null;
  let formattedBookingID = null;

  if (bookingID !== null) {
    formattedBookingID = bookingID;
  } else if (id) {
    decodedBookingID = decodeURIComponent(id);
    formattedBookingID = decodedBookingID.replace(/\//g, "-");
  } else {
    formattedBookingID = null;
  }

  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { list, total, loading } = useSelector(
    (state) => state.bookingBusAllotments
  );
  console.log(list, "8876555");
  const onClose = () => {
    setOpen(false);
    onSuccess?.();
  };
  const columns = [
    {
      id: 2,
      title: "Bus Type",
      dataIndex: "BusTypeName",
      key: "BusTypeName",
    },
    {
      id: 2,
      title: "Bus No.",
      dataIndex: "BusNo",
      key: "BusNo",
    },
    {
      id: 3,
      title: "Sitting Capacity",
      dataIndex: "SittingCapacity",
      key: "SittingCapacity",
    },
    {
      id: 4,
      title: "Booking Date",
      dataIndex: "CreateDate",
      key: "CreateDate",
      render: (createdAt) => moment(createdAt).format("DD-MM-YYYY"),
    },
    // {
    //   id: 5,
    //   title: "Trip Start Date",
    //   dataIndex: "ReportDate",
    //   key: "ReportDate",
    //   render: (createdAt) => moment(createdAt).format("YYYY-MM-DD"),
    // },

    // {
    //   id: 8,
    //   title: "No of Bus",
    //   dataIndex: "busQty",
    //   key: "busQty",
    // },
    {
      id: 9,
      title: "Driver Name",
      dataIndex: "driverName",
      key: "driverName",
    },
    {
      id: 9,
      title: "Driver Contact No",
      dataIndex: "DriverContactNo",
      key: "DriverContactNo",
    },
    {
      id: 9,
      title: "Helper Name",
      dataIndex: "helperName",
      key: "helperName",
    },
    // {
    //   id: 10,
    //   title: "Vendor Name",
    //   dataIndex: "vendorName",
    //   key: "vendorName",
    // },
    // {
    //   id: 9,
    //   title: "Garage Out Time",
    //   dataIndex: "GarageOutTime",
    //   key: "GarageOutTime",
    //   render: (time) => moment(time, "HH:mm:ss").format("LT"),
    // },
    {
      id: 9,
      title: "Bus Allotment Status",
      dataIndex: "BusAllotmentStatus",
      key: "BusAllotmentStatus",
      render: (status) => (status == null ? "Unallotted" : "Alloted"),
    },
    {
      id: 10,
      title: "Pur Rate",
      dataIndex: "PurRate",
      key: "PurRate",
    },

    {
      id: 3,
      title: "Action",
      dataIndex: "",
      key: "action",
      fixed: "right",
      width: 200,
      render: ({ ID, ...restData }) => (
        <div className="flex items-center gap-2">
          {/* {console.log(ID)} */}
          <UserPrivateComponent permission="update-bookingEntry">
            <CreateDrawer
              update={1}
              permission={"update-bookingEntry"}
              title={"Allot Bus"}
              onClick={() => setOpen(true)}
              width={30}
              open={open}
              color={
                restData?.BusAllotmentStatus != null
                  ? "bg-green-500"
                  : "bg-red-500"
              }
            >
              {/* {console.log("restData", restData)} */}
              <AllotBusDrawer
                data={restData}
                id={ID}
                formattedBookingID={formattedBookingID}
                decodedBookingID={decodedBookingID}
                onClose={onClose}
              />
            </CreateDrawer>
          </UserPrivateComponent>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const res = dispatch(
      loadSingleBookingBusAllotment({
        id: formattedBookingID,
        decodedBookingID,
        page: 1,
        count: 10000,
        status: true,
        allotmentStatus: 0,
      })
    );
  }, [dispatch, decodedBookingID, formattedBookingID]);

  const onDelete = async (ID) => {
    dispatch(deleteLocalBooking(ID));
  };

  return (
    <Card
      className="border-0 md:border md:p-6 bg-transparent md:bg-[#fafafa]"
      bodyStyle={{ padding: 0 }}
    >
      <div className="items-center justify-between pb-3 md:flex">
        <h1 className="text-lg font-bold">
          Allot Bus for Booking ID : {formattedBookingID}
        </h1>
      </div>
      <UserPrivateComponent permission={"readAll-bookingBusAllotment"}>
        <TableComponent
          scrollX={2000}
          columns={columns}
          list={list}
          loading={loading}
        />
      </UserPrivateComponent>
    </Card>
  );
};

export default AllotBus;
