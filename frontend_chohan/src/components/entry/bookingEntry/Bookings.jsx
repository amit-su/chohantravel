import moment from "moment";
import React, { useState, useEffect } from "react";
import UserPrivateComponent from "../../PrivacyComponent/UserPrivateComponent";
import CreateDrawer from "../../CommonUi/CreateDrawer";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Card, Drawer } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { deleteLocalBooking } from "../../../redux/rtk/features/localBusBooking/localBusBookingSlice";
import AddBooking from "./addBookingDrawer";
import TableComponent from "../../CommonUi/TableComponent";
import UpdateBookingDrawer from "./updateBookingDrawer";
import dayjs from "dayjs";
import axios from "axios";
import { deleteBookingTran } from "../../../redux/rtk/features/bookingEntry/bookingsEntrySlice";
import { Modal, Button } from "antd";

const BookingsCopy = ({ isIncludeGST, onBookingChange, list, loading }) => {
  //
  const apiUrl = import.meta.env.VITE_APP_API;

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };
  //
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const columns = [
    {
      id: 2,
      title: "Bus Type",
      dataIndex: "busCategory",
      key: "busCategory",
    },
    {
      id: 3,
      title: "Sitting Capacity",
      dataIndex: "sittingCapacity",
      key: "sittingCapacity",
    },
    {
      id: 4,
      title: "Trip Description",
      dataIndex: "tripDescription",
      key: "tripDescription",
    },

    {
      id: 5,
      title: "Trip Start Date",
      dataIndex: "ReportDate",
      key: "ReportDate",
    },
    {
      id: 6,
      title: "Trip End Date",
      dataIndex: "tripEndDate",
      key: "tripEndDate",
    },

    {
      id: 7,
      title: "Report Time",
      dataIndex: "reportTime",
      key: "reportTime",
    },
    {
      id: 8,
      title: "No of Bus",
      dataIndex: "busQty",
      key: "busQty",
    },
    {
      id: 9,
      title: "Rate",
      dataIndex: "rate",
      key: "rate",
    },
    {
      id: 10,
      title: "Amt",
      dataIndex: "Amt",
      key: "Amt",
    },
    {
      id: 10,
      title: "Rate Type",
      dataIndex: "rateType",
      key: "rateType",
    },

    {
      id: 10,
      title: "Hours",
      dataIndex: "hours",
      key: "hours",
    },
    {
      id: 10,
      title: "Kilometers",
      dataIndex: "kms",
      key: "kms",
    },

    {
      id: 10,
      title: "Extra Hour Rate",
      dataIndex: "extraHourRate",
      key: "extraHourRate",
    },
    {
      id: 10,
      title: "Extra KM Rate",
      dataIndex: "extraKMRate",
      key: "extraKMRate",
    },
    {
      id: 3,
      title: "Action",
      dataIndex: "",
      key: "action",
      fixed: "right",
      render: ({ ID, ...restData }) => (
        <div className="flex items-center gap-2">
          <UserPrivateComponent permission="update-bookingEntry">
            <CreateDrawer
              update={1}
              permission={"update-bookingEntry"}
              title={"Edit Booking"}
              onClick={() => setOpen(true)}
              width={50}
              open={open}
              minimalEdit
            >
              <UpdateBookingDrawer
                isIncludeGST={isIncludeGST}
                data={restData}
                id={ID}
                onClose={(payload) => {
                  onBookingChange(payload);
                  setOpen(false);
                }}
              />
            </CreateDrawer>
          </UserPrivateComponent>

          <DeleteOutlined
            onClick={() => onDelete(ID)}
            className="p-2 text-white bg-red-600 rounded-md"
          />
        </div>
      ),
    },
  ];

  const onDelete = async (ID) => {
    Modal.confirm({
      title: "Are you sure you want to delete this booking?",

      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      async onOk() {
        await dispatch(deleteBookingTran(ID));
        window.location.reload();
      },
    });
  };

  return (
    <Card
      className="border-0 md:border md:p-6 bg-transparent md:bg-[#fafafa]"
      bodyStyle={{ padding: 0 }}
    >
      <div className="items-center justify-between pb-3 md:flex">
        <h1 className="text-lg font-bold">Bookings</h1>
        <div className="flex items-center justify-between gap-1 md:justify-start md:gap-3">
          <button
            onClick={() => setOpen(true)}
            className={`xs:px-3 px-1 text-sm md:text-base py-1 lg:px-5  border 
            color: bg-violet-700
        } hover:bg-violet-500 text-white rounded cursor-pointer`}
          >
            <div className="flex items-center justify-center gap-2">
              <PlusOutlined />
              <div className="min-w-[110px]">{"Add Booking"}</div>
            </div>
          </button>
          <Drawer
            width={"50%"}
            title={`Add Entry`}
            placement="right"
            onClose={() => setOpen(false)}
            open={open}
          >
            <AddBooking
              onClose={(payload) => {
                onBookingChange(payload);
                setOpen(false);
              }}
              isIncludeGST={isIncludeGST}
            />
          </Drawer>
        </div>
      </div>
      <UserPrivateComponent permission={"readAll-setup"}>
        <TableComponent
          scrollX={2500}
          columns={columns}
          list={list}
          loading={loading}
        />
      </UserPrivateComponent>
    </Card>
  );
};

export default BookingsCopy;
