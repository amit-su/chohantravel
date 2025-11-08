import React, { useEffect, useState } from "react";
import UserPrivateComponent from "../PrivacyComponent/UserPrivateComponent";
import TableComponent from "../CommonUi/TableComponent";
import { Card, Drawer } from "antd";

import CreateDrawer from "../CommonUi/CreateDrawer";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import { loadSingleBookingBusAllotment } from "../../redux/rtk/features/bookingBusAllotment/bookingBusAllotmentSlice";
import { useParams } from "react-router-dom";
// import CloseDutyDrawer from "./CloseDutyDrawer";

const GetAllAllotedAndClosed = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const decodedBookingID = decodeURIComponent(id);
  const formattedBookingID = decodedBookingID.replace(/\//g, "-");
  const { list, total, loading } = useSelector(
    (state) => state.bookingBusAllotments
  );

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
      render: (date) => moment(date).format("DD-MM-YYYY"),
    },

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

    {
      id: 9,
      title: "Garage Out Time",
      dataIndex: "GarageOutTime",
      key: "GarageOutTime",
      render: (time) => moment(time, "HH:mm:ss").format("LT"),
    },
    {
      id: 9,
      title: "Bus Allotment Status",
      dataIndex: "BusAllotmentStatus",
      key: "BusAllotmentStatus",
      render: (status) =>
        status == null ? "Unallotted" : status === 1 ? "Alloted" : "Closed",
    },
    {
      id: 10,
      title: "Pur Rate",
      dataIndex: "PurRate",
      key: "PurRate",
    },
    {
      id: 10,
      title: "Extra KM Driven",
      dataIndex: "extraKMDriven",
      key: "extraKMDriven",
      render: (item) => (item != null ? item : " - - "),
    },
    {
      id: 10,
      title: "Extra Hour Driven",
      dataIndex: "extraHourDriven",
      key: "extraHourDriven",
      render: (item) => (item != null ? item : " - - "),
    },
    // {
    //   id: 3,
    //   title: "Action",
    //   dataIndex: "",
    //   key: "action",
    //   fixed: "right",
    //   width: 200,
    //   render: ({ ID, ...restData }) => (
    //     <div className="flex items-center gap-2">
    //       {/* {console.log(ID)} */}
    //       <UserPrivateComponent permission="update-closeDuty">
    //         <CreateDrawer
    //           update={1}
    //           permission={"update-closeDuty"}
    //           title={"Close Bus Duty"}
    //           width={30}
    //           color={
    //             restData?.BusAllotmentStatus != null
    //               ? "bg-green-500"
    //               : "bg-red-500"
    //           }
    //         >
    //           {/* {console.log("restData", restData)} */}
    //           {/* <CloseDutyDrawer data={restData} id={ID} /> */}
    //         </CreateDrawer>
    //       </UserPrivateComponent>
    //     </div>
    //   ),
    // },
  ];

  useEffect(() => {
    const res = dispatch(
      loadSingleBookingBusAllotment({
        id: formattedBookingID,
        decodedBookingID,
        page: 1,
        count: 10000,
        status: true,
        allotmentStatus: 2,
      })
    );
  }, [dispatch, decodedBookingID, formattedBookingID]);
  return (
    <Card
      className="border-0 md:border md:p-6 bg-transparent md:bg-[#fafafa]"
      bodyStyle={{ padding: 0 }}
    >
      <div className="md:flex items-center justify-between pb-3">
        <h1 className="text-lg font-bold">Closed Duties</h1>
      </div>
      <UserPrivateComponent permission={"readAll-closeDuty"}>
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

export default GetAllAllotedAndClosed;
