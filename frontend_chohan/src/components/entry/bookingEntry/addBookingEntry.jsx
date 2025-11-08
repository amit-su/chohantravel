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
import { loadPartyPaginated } from "../../../redux/rtk/features/party/partySlice";
import BookingsAdd from "./Bookings";
import moment from "moment";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { addbookingEntry } from "../../../redux/rtk/features/bookingEntry/bookingsEntrySlice";
import { useNavigate } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import { PercentageOutlined } from "@ant-design/icons";
import { loadAllBusCategory } from "../../../redux/rtk/features/busCategory/busCategorySlice";
import { clearLocalBooking } from "../../../redux/rtk/features/localBusBooking/localBusBookingSlice";
import CreateDrawer from "../../CommonUi/CreateDrawer";
import AddParty from "../../Party/addParty";

const AddBookingEntry = () => {
  let { id } = useParams();
  id = Number.isFinite(+id) ? +id : 1;
  console.log("id", id);
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [isIncludeGST, setIsIncludeGST] = useState();
  const [bookingArray, setBookingArray] = useState([]);
  const [confirmBookings, setConfirmBookings] = useState(false);
  const [GstType, setGstType] = useState("");
  const [total, setTotal] = useState(0);

  const [totalBusQty, setTotalBusQty] = useState(0);

  const [afterTollParking, setAfterTollParking] = useState(0);
  const handleConfirm = () => {
    setConfirmBookings(true);
  };
  const [initValues, setInitValues] = useState({
    bookingDate: dayjs(),
    BookingNo: "New",
  });
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const handleLoadParty = () => {
    dispatch(loadPartyPaginated({ page: 1, count: 10000, status: true }));
  };
  //API CALL FOR PARTY//
  const [list2, setList] = useState([]);

  const [loading2, setLoading2] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_APP_API;
  const [SGSTamt, setSGSTamt] = useState(0);
  const [CGSTamt, setCGSTamt] = useState(0);
  const [IGSTamt, setIGSTamt] = useState(0);
  const [netAmount, setNetAmount] = useState([]);
  const [afterGST, setAfterGST] = useState(0);
  const [advancePayment, setAdvancePayment] = useState(0);
  useEffect(() => {
    // Call the function
  }, []);
  //END//
  // const { list: partyList } = useSelector((state) => state.party);

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
      setInitValues({
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
    // Check if the payload has an ID to determine if it's an update or a new entry
    if (payload.id) {
      const { id, values } = payload;
      setBookingArray((prev) =>
        prev.map((item) => (item.ID === id ? { ...item, ...values } : item))
      );
    } else {
      // It's a new booking, add it to the array
      // Give it a temporary unique ID for key purposes in the list
      const newBooking = { ...payload, ID: `temp-${Date.now()}` };
      setBookingArray((prev) => [...prev, newBooking]);
    }
  };
  const handleIncludepermit = (value) => {
    // setIsIncludeGST(value);
  };
  const onFinish = async (values) => {
    try {
      const uppercaseValues = Object.keys(values).reduce((acc, key) => {
        acc[key] =
          typeof values[key] === "string"
            ? values[key].toUpperCase()
            : values[key];
        return acc;
      }, {});
      uppercaseValues.BookingNo = Math.floor(Math.random() * 9007165) + 1;
      uppercaseValues.BookingDate = selectedDate.isValid()
        ? selectedDate.format("YYYY-MM-DD")
        : "";
      console.log("bookingArray", bookingArray);

      const formattedBookingArray = bookingArray.map((booking) => ({
        ...booking, // Keep existing properties
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

      console.log("formattedBookingArray", formattedBookingArray);

      const data = {
        ...uppercaseValues,
        localBookingList: JSON.stringify(formattedBookingArray),
      };

      if (bookingArray.length > 0 && confirmBookings === true) {
        const resp = await dispatch(addbookingEntry(data));
        if (resp.payload.message === "success") {
          setLoader(false);
          setConfirmBookings(false);
          navigate("/admin/booking-entry");

          // Redirect to page = "admin/booking-entry"
        }
      }
    } catch (error) {
      setLoader(false);
    }
  };
  const handleLoadBus = () => {
    dispatch(loadAllBusCategory({ page: 1, count: 10000, status: true }));
  };
  useEffect(() => {
    form.setFieldsValue(initValues);
  }, [initValues, form, localBookingList]);
  useEffect(() => {
    dispatch(clearLocalBooking());
    handleLoadParty();
    handleLoadBus();
  }, []);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const handleDateChange = useCallback((date) => {
    const newDate = dayjs(date, "DD-MM-YYYY");
    setSelectedDate(newDate.isValid() ? newDate : dayjs());
  }, []);
  const sortedPartyList = Array.isArray(partyList)
    ? [...partyList].sort((a, b) => a.partyName.localeCompare(b.partyName))
    : [];
  console.log(partyList, "yyyy");

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
            />
          </Form.Item>

          <Form.Item
            label="Party"
            name="PartyID"
            style={{ marginBottom: "5px" }}
            className="mb-4"
            rules={[
              {
                required: true,
                message: "Please provide input!",
              },
            ]}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Select
                optionFilterProp="children"
                showSearch
                onSelect={handlePartySelect}
                onClick={fetchData}
                placeholder="Select party"
                style={{ flex: 1 }} // Makes Select take full available width
              >
                {sortedPartyList?.map((party) => (
                  <Select.Option key={party.id} value={party.id}>
                    {party.partyName}
                  </Select.Option>
                ))}
              </Select>

              <CreateDrawer
                width={60}
                permission={"create-party"}
                title={"Create Party"}
              >
                <AddParty />
              </CreateDrawer>
            </div>
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
            <TextArea placeholder="Enter  address" rows={4} />
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
              Create Booking Entry
            </Button>
          </Form.Item>
        </div>
      </div>
    </Form>
  );
};

export default AddBookingEntry;
