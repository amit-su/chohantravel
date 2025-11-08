import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card } from "antd";

import { CheckCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import moment from "moment";
import CreateDrawer from "../CommonUi/CreateDrawer";
import UserPrivateComponent from "../PrivacyComponent/UserPrivateComponent";
import TableComponent from "../CommonUi/TableComponent";

import { deleteBookingBusAllotment } from "../../redux/rtk/features/bookingBusAllotment/bookingBusAllotmentSlice";
import { loadAllBookingHead } from "../../redux/rtk/features/booking/bookingHeadSlice";
import { Link } from "react-router-dom";
import { Tooltip } from "antd";

const GetAllBusAllotmentToBooking = () => {
  const dispatch = useDispatch();
  const { list, total, loading } = useSelector((state) => state.bookingHead);

  const onDelete = async (id) => {
    const res = await dispatch(deleteBookingBusAllotment(id));
    if (res) {
      dispatch(loadAllBookingHead({ status: true, page: 1, count: 1000 }));
    }
  };
  const columns = [
    {
      id: 1,
      title: "Booking NO",
      dataIndex: "BookingNo",
      key: "BookingNo",
      width: 140,
      render: (text) => (
        <Tooltip title={text}>
          <div className="truncate" style={{ maxWidth: 200 }}>
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      id: 6,
      title: " Booking Date ",
      dataIndex: "BookingDate",
      key: "TripStartBookingDateDate",
      responsive: ["md"],
      render: (date) => moment(date).format("DD-MM-YYYY"),
      width: 120,
    },
    {
      id: 1,
      title: "Party Name ",
      dataIndex: "PartyName",
      key: "PartyName",
      render: (text) => (
        <Tooltip title={text}>
          <div className="truncate" style={{ maxWidth: 200 }}>
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      id: 5,
      title: "Contact Person Name",
      dataIndex: "ContactPersonName",
      key: "ContactPersonName",
      render: (text) => (
        <Tooltip title={text}>
          <div className="truncate" style={{ maxWidth: 200 }}>
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      id: 4,
      title: "Contact Person No",
      dataIndex: "ContactPersonNo",
      key: "ContactPersonNo",
      width: 150,
      render: (text) => (
        <Tooltip title={text}>
          <div className="truncate" style={{ maxWidth: 200 }}>
            {text}
          </div>
        </Tooltip>
      ),
    },

    {
      id: 7,
      title: "Reporting Address",
      dataIndex: "ReportAddr",
      key: "ReportAddr",
      responsive: ["md"],
      render: (text) => (
        <Tooltip title={text}>
          <div className="truncate" style={{ maxWidth: 200 }}>
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      id: 2,
      title: "Email",
      dataIndex: "Email",
      key: "Email",
      width: 180,
      render: (text) => (
        <Tooltip title={text}>
          <div className="truncate" style={{ maxWidth: 200 }}>
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      id: 8,
      title: "Payment Terms",
      dataIndex: "PaymentTerms",
      key: "PaymentTerms",
      width: 110,
      render: (text) => (
        <Tooltip title={text}>
          <div className="truncate" style={{ maxWidth: 200 }}>
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      id: 3,
      title: "GST Included",
      dataIndex: `GSTInclude`,
      key: "GSTInclude",
      width: 90,
      render: (status) => (status === 1 ? "YES" : "NO"),
    },
    {
      id: 3,
      title: "Action",
      dataIndex: "",
      key: "action",
      fixed: "right",
      width: 80,
      render: ({ BookingNo, ...restData }) => (
        <div className="flex items-center gap-2">
          <UserPrivateComponent permission="update-bookingBusAllotment">
            {restData.UsedInInvoice === "" && (
              <CreateDrawer
                update={1}
                permission={"update-bookingBusAllotment"}
                title={"Edit Driver details "}
                Allot
                width={50}
                id={BookingNo}
              />
            )}
          </UserPrivateComponent>
        </div>
      ),
    },
  ];
  useEffect(() => {
    dispatch(loadAllBookingHead({ status: true, page: 1, count: 1000 }));
  }, [dispatch]);
  return (
    <Card
      className="border-0 md:border md:p-6 bg-transparent md:bg-[#fafafa]"
      bodyStyle={{ padding: 0 }}
    >
      <div className="items-center justify-between pb-3 lg:flex">
        <h1 className="text-lg font-bold">Bus Allotment </h1>
      </div>

      <UserPrivateComponent permission={"readAll-bookingBusAllotment"}>
        <TableComponent
          list={list}
          total={total}
          loading={loading}
          columns={columns}
          csvFileName="Allotment"
          paginatedThunk={loadAllBookingHead}
          scrollX={1700}
        />
      </UserPrivateComponent>
    </Card>
  );
};

export default GetAllBusAllotmentToBooking;
