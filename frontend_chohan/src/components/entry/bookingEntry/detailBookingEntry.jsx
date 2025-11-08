import { Card, Drawer, Form } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import BookingsAdd from "./Bookings";

import { loadSingleBookingEntry } from "../../../redux/rtk/features/bookingEntry/bookingsEntrySlice";
import {
  addLocalBooking,
  clearLocalBooking,
} from "../../../redux/rtk/features/localBusBooking/localBusBookingSlice";
import dayjs from "dayjs";
import moment from "moment";
import UserPrivateComponent from "../../PrivacyComponent/UserPrivateComponent";
import AddBooking from "./addBookingDrawer";
import TableComponent from "../../CommonUi/TableComponent";
const DetailBookingEntry = ({ bookingNo }) => {
  console.log("bookingNo", bookingNo);
  const dispatch = useDispatch();
  const { bookingEntry } = useSelector((state) => state.bookingEntry);

  const decodedBookingID = decodeURIComponent(bookingNo);

  const formattedBookingID = decodedBookingID.replace(/\//g, "-");

  const [form] = Form.useForm();

  const { list: localBookingList } = useSelector(
    (state) => state.localBookingsData
  );

  useEffect(() => {
    dispatch(
      loadSingleBookingEntry({ id: formattedBookingID, decodedBookingID })
    );
  }, [dispatch, bookingNo]);

  // console.log("bookingEntry in update", bookingEntry);
  useEffect(() => {
    // Parse the LocalBookingList string into an array of objects
    if (bookingEntry && bookingEntry[0]?.LocalBookingList) {
      const parsedList = JSON.parse(
        bookingEntry && bookingEntry[0]?.LocalBookingList
      );
      console.log("parsedList", parsedList);
      dispatch(clearLocalBooking());
      // dispatch(addLocalBooking(parsedList[0]));
      if (parsedList && parsedList.length > 0) {
        parsedList.forEach((item) => {
          dispatch(addLocalBooking(item));
        });
      }
    }
  }, [bookingEntry, dispatch]);
  const [open, setOpen] = useState(false);
  const onClose = () => {
    setOpen(false);
  };

  const { list, total, loading } = useSelector(
    (state) => state.localBookingsData
  );
  console.log("localBookings", list);
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
      width: 90,
    },
    {
      id: 4,
      title: "Trip Description",
      dataIndex: "tripDescription",
      key: "tripDescription",
      width: 210,
    },
    {
      id: 5,
      title: "Trip Start Date",
      dataIndex: "ReportDate",
      key: "ReportDate",
      render: (createdAt) => {
        const parsedDate = dayjs(createdAt, "DD-MM-YYYY"); // or just dayjs(createdAt)
        return parsedDate.isValid()
          ? parsedDate.format("DD-MM-YYYY")
          : "Invalid date";
      },
    },
    {
      id: 6,
      title: "Trip End Date",
      dataIndex: "tripEndDate",
      key: "tripEndDate",
      render: (createdAt) => {
        const parsedDate = dayjs(createdAt, "DD-MM-YYYY"); // or just dayjs(createdAt)
        return parsedDate.isValid()
          ? parsedDate.format("DD-MM-YYYY")
          : "Invalid date";
      },
    },
    {
      id: 7,
      title: "Report Time",
      dataIndex: "reportTime",
      key: "reportTime",
      render: (time) => moment(time, "HH:mm").format("LT"),
      width: 100,
    },
    {
      id: 8,
      title: "No of Bus",
      dataIndex: "busQty",
      key: "busQty",
      width: 90,
    },
    {
      id: 9,
      title: "Rate",
      dataIndex: "rate",
      key: "rate",
      width: 90,
    },
    {
      id: 10,
      title: "Amount",
      dataIndex: "Amt",
      key: "Amt",
      width: 90,
    },
    {
      id: 10,
      title: "Rate Type",
      dataIndex: "rateType",
      key: "rateType",
      width: 90,
    },

    {
      id: 10,
      title: "Hours",
      dataIndex: "hours",
      key: "hours",
      width: 90,
    },
    {
      id: 10,
      title: "Kilometers",
      dataIndex: "kms",
      key: "kms",
      width: 100,
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
  ];

  return (
    <Card
      className="border-0 md:border md:p-6 bg-transparent md:bg-[#fafafa]"
      bodyStyle={{ padding: 0 }}
    >
      <div className="items-center justify-between pb-3 md:flex">
        <h1 className="text-lg font-bold">Bookings</h1>
        <div className="flex items-center justify-between gap-1 md:justify-start md:gap-3">
          <Drawer
            width={"50%"}
            title={`Add Entry`}
            placement="right"
            onClose={onClose}
            open={open}
          >
            <AddBooking
              onClose={onClose}
              isIncludeGST={bookingEntry && bookingEntry[0]?.GSTInclude}
            />
          </Drawer>
        </div>
      </div>
      <UserPrivateComponent permission={"readAll-setup"}>
        <TableComponent
          scrollX={1500}
          columns={columns}
          list={list}
          loading={loading}
        />
      </UserPrivateComponent>
    </Card>
  );

  // return <BookingsAdd isIncludeGST={initValues?.includeGST} />;
};

export default DetailBookingEntry;
