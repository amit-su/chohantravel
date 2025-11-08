import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
} from "antd";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { loadPartyPaginated } from "../../../redux/rtk/features/party/partySlice";
import BookingsAdd from "./Bookings";
import { PercentageOutlined } from "@ant-design/icons";
import moment from "moment";
import {
  loadSingleBookingEntry,
  updatebookingEntry,
} from "../../../redux/rtk/features/bookingEntry/bookingsEntrySlice";
import {
  addLocalBooking,
  clearLocalBooking,
} from "../../../redux/rtk/features/localBusBooking/localBusBookingSlice";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import axios from "axios";

const UpdateBookingEntry = () => {
  const { bookingEntry, total, loading } = useSelector(
    (state) => state.bookingEntry
  );
  const { id } = useParams();
  const decodedBookingID = decodeURIComponent(id);
  const [initValues, setInitValues] = useState({
    bookingDate: dayjs(),
    BookingNo: decodedBookingID,
    ContactPersonName: "",
    PartyID: 0,
    includeGST: false,
    ContactPersonNo: "",
    address: "",
    email: "",
    paymentTerms: "",
    localBookingList: [],
  });

  const formattedBookingID = decodedBookingID.replace(/\//g, "-");
  //-----------------API CALL-------------------//
  const [list2, setList] = useState([]);
  const [bookingArray, setBookingArray] = useState([]);
  const [loading2, setLoading2] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = import.meta.env.VITE_APP_API;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/party`);
        setList(response.data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading2(false);
      }
    };

    // Call the function
    fetchData();
  }, []);
  //-------------END----------------------------//

  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [isIncludeGST, setIsIncludeGST] = useState();

  const [confirmBookings, setConfirmBookings] = useState(false);

  const handleConfirm = () => {
    setConfirmBookings(true);
  };

  const dispatch = useDispatch();
  const [form] = Form.useForm();

  // const { list: partyList } = useSelector((state) => state.party);
  const partyList = list2;
  const { list: localBookingList } = useSelector(
    (state) => state.localBookingsData
  );
  const handleIncludeGST = (value) => {
    setIsIncludeGST(value);
  };

  const handlePartySelect = (partyId) => {
    const selectedParty = partyList?.find((party) => party.id === partyId);

    if (selectedParty) {
      const { cpName, cpNumber, partyAddr, gstNo, referredBy } = selectedParty;
      form.setFieldsValue({
        PartyID: partyId,
        ContactPersonName: cpName,
        ContactPersonNo: cpNumber,
        address: partyAddr,
        GSTNO: gstNo,
        referredBy: referredBy,
      });
    }
  };
  const onBookingChange = (payload) => {
    if (payload.id) {
      // This is an update
      const { id, values } = payload;
      setBookingArray((prev) =>
        prev.map((item) => (item.ID === id ? { ...item, ...values } : item))
      );
    } else {
      // This is a new booking
      const newBooking = { ...payload, ID: `temp-${Date.now()}` };
      setBookingArray((prev) => [...prev, newBooking]);
    }
  };
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const handleDateChange = useCallback((date) => {
    const newDate = dayjs(date, "DD-MM-YYYY");
    setSelectedDate(newDate.isValid() ? newDate : dayjs());
  }, []);
  const onFinish = async (values) => {
    try {
      const uppercaseValues = Object.keys(values).reduce((acc, key) => {
        acc[key] =
          typeof values[key] === "string"
            ? values[key].toUpperCase()
            : values[key];
        return acc;
      }, {});
      uppercaseValues.bookingDate = selectedDate.isValid()
        ? selectedDate.format("YYYY-MM-DD") // This was already correct, but ensuring consistency
        : initValues.bookingDate;

      const formattedBookingArray = bookingArray.map((booking) => ({
        ...booking,
        // If ID is temporary, send 0, otherwise send the real ID
        ID:
          typeof booking.ID === "string" && booking.ID.startsWith("temp-")
            ? 0
            : booking.ID,
        ReportDate: booking.ReportDate
          ? dayjs(booking.ReportDate, "DD-MM-YYYY").format("YYYY-MM-DD")
          : "",
        tripEndDate: booking.tripEndDate
          ? dayjs(booking.tripEndDate, "DD-MM-YYYY").format("YYYY-MM-DD")
          : "",
      }));
      const data = {
        ...uppercaseValues,
        localBookingList: JSON.stringify(formattedBookingArray),
      };
      if (bookingArray.length > 0 && confirmBookings === true) {
        // console.log(data);
        const resp = await dispatch(updatebookingEntry(data));
        setConfirmBookings(false);
        if (resp.payload.message === "success") {
          setLoader(false);
          navigate("/admin/booking-entry");
          // setTimeout(() => {
          //   window.location.reload();
          // }, 0.5);
        }
      }
    } catch (error) {
      setLoader(false);
    }
  };
  const handleIncludepermit = (value) => {
    // setIsIncludeGST(value);
  };

  useEffect(() => {
    const res = dispatch(
      loadSingleBookingEntry({ id: formattedBookingID, decodedBookingID })
    );
    dispatch(loadPartyPaginated({ page: 1, count: 10000, status: true }));
  }, [dispatch, formattedBookingID, form, decodedBookingID]);

  useEffect(() => {
    if (bookingEntry && bookingEntry[0]?.LocalBookingList) {
      const parsedList = JSON.parse(
        bookingEntry && bookingEntry[0]?.LocalBookingList
      );
      dispatch(clearLocalBooking());
      setBookingArray(parsedList);
      if (parsedList && parsedList.length > 0) {
        parsedList.forEach((item) => {
          dispatch(addLocalBooking(item));
        });
      }
    }
  }, [bookingEntry, dispatch]);

  useEffect(() => {
    if (bookingEntry && bookingEntry[0]) {
      const entry = bookingEntry[0];
      form.setFieldsValue({
        bookingDate: moment(entry.BookingDate),
        BookingNo: entry.BookingNo,
        ContactPersonName: entry.ContactPersonName,
        PartyID: parseInt(entry.PartyID),
        includeGST: entry.GSTInclude,
        ContactPersonNo: entry.ContactPersonNo,
        address: entry.partyAddr,
        email: entry.Email,
        paymentTerms: entry.PaymentTerms,
        PermitReq: entry.PermitReq,
        tollParking: entry.TollParking,

        SGST: entry.SGSTPer,
        CGST: entry.CGSTPer,
        IGST: entry.IGSTPer,
        advAmount: entry.advAmount,
        AdvAmtPer: entry.AdvAmtPer,
        GstType: entry.GstType,
      });

      handlePartySelect(parseInt(entry.PartyID));
    }
  }, [bookingEntry, form]);
  const sortedPartyList = Array.isArray(partyList)
    ? [...partyList].sort((a, b) => a.partyName.localeCompare(b.partyName))
    : [];

  return (
    <Form
      form={form}
      name="dynamic_form_nest_item"
      onFinish={onFinish}
      layout="vertical"
      initialValues={initValues}
      onFinishFailed={() => {
        setLoader(false);
      }}
      size="medium"
      autoComplete="off"
    >
      <div className="flex gap-20 ml-4 ">
        <div className="w-1/2 ml-4 ">
          <Form.Item
            className="w-80"
            label="Booking No"
            name="BookingNo"
            rules={[
              {
                required: false,
                message: "Please provide input !",
              },
            ]}
          >
            <Input placeholder="Enter contact Person Name" />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: "5px" }}
            label="Party"
            name="PartyID"
            className="mb-4 w-80"
            rules={[
              {
                required: true,
                message: "Please provide input !",
              },
            ]}
          >
            <Select
              onSelect={handlePartySelect}
              placeholder="Select party"
              defaultValue={initValues?.PartyID}
              optionFilterProp="children" // Filters options based on the content of the children (party names)
              showSearch
            >
              {sortedPartyList?.map((party) => (
                <Select.Option key={party.id} value={party.id}>
                  {party.partyName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Booking Date"
            className="w-80"
            name="bookingDate"
            rules={[
              {
                required: false,
                message: "Please input Date!",
              },
            ]}
          >
            <DatePicker
              style={{ marginBottom: "5px", width: "100%" }}
              label="date"
              format={"DD-MM-YYYY"}
              onChange={(value) => handleDateChange(value)}

              // value={dayjs(initValues.bookingDate)}
            />
          </Form.Item>

          <Form.Item
            className="w-80"
            label="Contact Person Name"
            name="ContactPersonName"
            rules={[
              {
                required: false,
                message: "Please provide input !",
              },
            ]}
          >
            <Input placeholder="Enter contact Person Name" />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: "10px" }}
            label="Include GST"
            name="includeGST"
            className="w-80"
          >
            <Select onChange={handleIncludeGST} placeholder="Include GST?">
              <Select.Option value="Yes">Yes</Select.Option>
              <Select.Option value="No">No</Select.Option>
            </Select>
          </Form.Item>
        </div>
        <div className="float-right w-2/2">
          <Form.Item
            className="w-80"
            label="Contact Person No"
            name="ContactPersonNo"
            rules={[
              {
                required: false,
                message: "Please provide input !",
              },
            ]}
          >
            <Input
              className=""
              placeholder="Enter Number"
              size={"small"}
              type="number"
            />
          </Form.Item>
          <Form.Item
            className="w-80"
            style={{ width: "30rem" }}
            label="Party Address"
            name="address"
            rules={[
              {
                required: false,
                message: "Please provide input !",
              },
            ]}
          >
            <TextArea placeholder="Enter Party address" rows={4} />
          </Form.Item>

          <Form.Item
            style={{ width: "30rem" }}
            label="Email"
            className="w-80"
            name="email"
          >
            <Input className="" placeholder="Enter Email" size={"small"} />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: "10px" }}
            label="Permit Required"
            name="PermitReq"
            className="w-80"
          >
            <Select
              onChange={handleIncludepermit}
              placeholder="Permint Required?"
            >
              <Select.Option value="Yes">Yes</Select.Option>
              <Select.Option value="No">No</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            style={{ width: "30rem" }}
            label="Payment Terms"
            className="w-80"
            name="paymentTerms"
            rules={[
              {
                required: true,
                message: "Please provide valid input !",
              },
            ]}
          >
            <Input
              className=""
              placeholder="Enter Payment Terms"
              size={"small"}
            />
          </Form.Item>
        </div>
      </div>

      <BookingsAdd
        isIncludeGST={initValues?.includeGST}
        list={bookingArray}
        loading={false}
        onBookingChange={onBookingChange}
      />
      <div className="float-right w-1/2 mx-5">
        <div className="flex gap-2">
          <Form.Item style={{ marginTop: "15px" }} className="w-full">
            <Button
              block
              type="primary"
              htmlType="submit"
              loading={loader}
              onClick={handleConfirm}
            >
              Update Booking Entry
            </Button>
          </Form.Item>
        </div>
      </div>
    </Form>
  );
};

export default UpdateBookingEntry;
