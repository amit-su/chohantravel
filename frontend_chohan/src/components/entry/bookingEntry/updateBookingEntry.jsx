import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Card,
  Row,
  Col,
  Space,
  Skeleton
} from "antd";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import { loadPartyPaginated } from "../../../redux/rtk/features/party/partySlice";
import BookingsAdd from "./Bookings";
import {
  RocketOutlined,
  LeftOutlined,
  SaveOutlined,
  UserOutlined,
  InfoCircleOutlined,
  EnvironmentOutlined
} from "@ant-design/icons";
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
import CreateDrawer from "../../CommonUi/CreateDrawer";
import AddParty from "../../Party/addParty";

const UpdateBookingEntry = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const decodedBookingID = decodeURIComponent(id);
  const formattedBookingID = decodedBookingID.replace(/\//g, "-");

  // Redux State
  const { bookingEntry, loading } = useSelector((state) => state.bookingEntry);
  const { list: partyList } = useSelector((state) => state.party);
  // localBookingsData is used by BookingsAdd component implicitly or we might need it to sync

  const [loader, setLoader] = useState(false);
  const [bookingArray, setBookingArray] = useState([]);
  const [confirmBookings, setConfirmBookings] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [dataLoaded, setDataLoaded] = useState(false);

  const [initValues, setInitValues] = useState({
    bookingDate: dayjs(),
    BookingNo: decodedBookingID,
    ContactPersonName: "",
    PartyID: null,
    includeGST: "No",
    ContactPersonNo: "",
    address: "",
    email: "",
    paymentTerms: "",
    PermitReq: "No",
    includeParking: "No",
    includeTollTax: "No"
  });

  const handleConfirm = () => {
    setConfirmBookings(true);
  };

  useEffect(() => {
    dispatch(loadPartyPaginated({ page: 1, count: 10000, status: true }));
    dispatch(loadSingleBookingEntry({ id: formattedBookingID, decodedBookingID }));
  }, [dispatch, formattedBookingID, decodedBookingID]);

  // Populate Form Data
  useEffect(() => {
    if (bookingEntry && bookingEntry.length > 0) {
      const entry = bookingEntry[0];

      // Parse LocalBookingList
      if (entry.LocalBookingList) {
        try {
          const parsedList = JSON.parse(entry.LocalBookingList);
          dispatch(clearLocalBooking());
          setBookingArray(parsedList);
          if (parsedList && parsedList.length > 0) {
            parsedList.forEach((item) => {
              dispatch(addLocalBooking(item));
            });
          }
        } catch (e) {
          // ignore parse error
        }
      }

      const initialData = {
        bookingDate: entry.BookingDate ? dayjs(entry.BookingDate) : dayjs(),
        BookingNo: entry.BookingNo,
        ContactPersonName: entry.ContactPersonName,
        PartyID: parseInt(entry.PartyID),
        includeGST: entry.GSTInclude === 1 || entry.GSTInclude === "Yes" ? "Yes" : "No",
        ContactPersonNo: entry.ContactPersonNo,
        address: entry.partyAddr,
        email: entry.Email,
        paymentTerms: entry.PaymentTerms,
        PermitReq: entry.PermitReq,
        includeParking: entry.ParkingExtra === "Y" || entry.ParkingInclude === "Yes" || entry.ParkingInclude === 1 ? "Yes" : "No",
        includeTollTax: entry.TollTaxExtra === "Y" || entry.TollTaxInclude === "Yes" || entry.TollTaxInclude === 1 ? "Yes" : "No",
      };

      setInitValues(initialData);
      form.setFieldsValue(initialData);
      if (entry.BookingDate) {
        setSelectedDate(dayjs(entry.BookingDate));
      }
      setDataLoaded(true);
    }
  }, [bookingEntry, dispatch, form]);

  const handlePartySelect = (partyId) => {
    const selectedParty = partyList?.find((party) => party.id === partyId);

    if (selectedParty) {
      const { cpName, cpNumber, partyAddr, gstNo, referredBy } = selectedParty;
      form.setFieldsValue({
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
      const { id, values } = payload;
      setBookingArray((prev) =>
        prev.map((item) => (item.ID === id ? { ...item, ...values } : item))
      );
    } else {
      const newBooking = { ...payload, ID: `temp-${Date.now()}` };
      setBookingArray((prev) => [...prev, newBooking]);
    }
  };

  const handleDateChange = useCallback((date) => {
    const newDate = dayjs(date, "DD-MM-YYYY");
    setSelectedDate(newDate.isValid() ? newDate : dayjs());
  }, []);

  const onFinish = async (values) => {
    setLoader(true);
    try {
      const uppercaseValues = Object.keys(values).reduce((acc, key) => {
        acc[key] = typeof values[key] === "string" ? values[key].toUpperCase() : values[key];
        return acc;
      }, {});

      uppercaseValues.bookingDate = selectedDate.isValid()
        ? selectedDate.format("YYYY-MM-DD")
        : "";

      const formattedBookingArray = bookingArray.map((booking) => ({
        ...booking,
        ID: typeof booking.ID === "string" && booking.ID.startsWith("temp-") ? 0 : booking.ID,
        ReportDate: booking.ReportDate ? dayjs(booking.ReportDate, "DD-MM-YYYY").format("YYYY-MM-DD") : "",
        tripEndDate: booking.tripEndDate ? dayjs(booking.tripEndDate, "DD-MM-YYYY").format("YYYY-MM-DD") : "",
      }));

      const data = {
        ...uppercaseValues,
        localBookingList: JSON.stringify(formattedBookingArray),
      };

      if (bookingArray.length > 0 && confirmBookings === true) {
        const resp = await dispatch(updatebookingEntry(data));
        setConfirmBookings(false);
        if (resp.payload.message === "success") {
          navigate("/admin/booking-entry");
        }
      }
    } catch (error) {
      // Error
    } finally {
      setLoader(false);
    }
  };

  const sortedPartyList = Array.isArray(partyList)
    ? [...partyList].sort((a, b) => a.partyName.localeCompare(b.partyName))
    : [];

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="w-full px-4">
        {/* Header Section */}
        <div className="flex flex-col gap-4 mb-8 md:flex-row md:items-center md:justify-between p-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg transform transition-all">
          <div className="flex items-center gap-6">
            <Link to="/admin/booking-entry">
              <Button
                icon={<LeftOutlined />}
                shape="circle"
                size="large"
                className="bg-white/20 border-none text-white hover:bg-white/40"
              />
            </Link>
            <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl shadow-inner text-yellow-300">
              <RocketOutlined style={{ fontSize: '32px' }} />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-sm">Update Booking</h1>
              <p className="text-blue-100 mt-2 text-lg font-medium">Edit booking details and trip information</p>
            </div>
          </div>
        </div>

        {loading && !dataLoaded ? (
          <Skeleton active paragraph={{ rows: 10 }} />
        ) : (
          <Form
            form={form}
            name="update_booking_form"
            onFinish={onFinish}
            layout="vertical"
            initialValues={initValues}
            onFinishFailed={() => setLoader(false)}
            size="large"
            autoComplete="off"
          >
            <Row gutter={24}>
              {/* Left Column: Party Details */}
              <Col span={24} lg={12}>
                <Card
                  title={<span className="text-blue-600 font-bold flex items-center gap-2"><UserOutlined /> Party Details</span>}
                  className="mb-6 shadow-md border-t-4 border-blue-500 rounded-xl bg-white/80 backdrop-blur-sm"
                  bordered={false}
                >
                  <Row gutter={16}>
                    <Col span={24}>
                      <Form.Item label="Booking No" name="BookingNo">
                        <Input disabled className="bg-gray-50 text-gray-700 font-semibold" />
                      </Form.Item>
                    </Col>

                    <Col span={24}>
                      <Form.Item
                        label="Party"
                        name="PartyID"
                        rules={[{ required: true, message: "Please select a party!" }]}
                      >
                        <Select
                          showSearch
                          onSelect={handlePartySelect}
                          placeholder="Select party"
                          optionFilterProp="children"
                        >
                          {sortedPartyList?.map((party) => (
                            <Select.Option key={party.id} value={party.id}>
                              {party.partyName}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item label="Booking Date" name="bookingDate">
                        <DatePicker
                          style={{ width: "100%" }}
                          format={"DD-MM-YYYY"}
                          onChange={handleDateChange}
                          allowClear={false}
                        />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item label="Contact Person Name" name="ContactPersonName">
                        <Input placeholder="Enter Name" prefix={<UserOutlined className="text-gray-400" />} />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              </Col>

              {/* Right Column: Contact & Terms */}
              <Col span={24} lg={12}>
                <Card
                  title={<span className="text-purple-600 font-bold flex items-center gap-2"><InfoCircleOutlined /> Contact & Terms</span>}
                  className="mb-6 shadow-md border-t-4 border-purple-500 rounded-xl bg-white/80 backdrop-blur-sm"
                  bordered={false}
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="Contact Person No" name="ContactPersonNo">
                        <Input type="number" placeholder="Enter Number" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Email" name="email">
                        <Input placeholder="Enter Email" />
                      </Form.Item>
                    </Col>

                    <Col span={24}>
                      <Form.Item label="Party Address" name="address">
                        <TextArea rows={2} placeholder="Enter address" />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item label="Include GST" name="includeGST">
                        <Select placeholder="Select Option">
                          <Select.Option value="Yes">Yes</Select.Option>
                          <Select.Option value="No">No</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Permit Required" name="PermitReq">
                        <Select placeholder="Select Option">
                          <Select.Option value="Yes">Yes</Select.Option>
                          <Select.Option value="No">No</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    
                    <Col span={12}>
                      <Form.Item label="Include Parking" name="includeParking">
                        <Select placeholder="Select Option">
                          <Select.Option value="Yes">Yes</Select.Option>
                          <Select.Option value="No">No</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Include Toll/Permit/Tax" name="includeTollTax">
                        <Select placeholder="Select Option">
                          <Select.Option value="Yes">Yes</Select.Option>
                          <Select.Option value="No">No</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        label="Payment Terms"
                        name="paymentTerms"
                        rules={[{ required: true, message: "Please provide payment terms!" }]}
                      >
                        <Input placeholder="Enter Payment Terms" />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>

            {/* Trip Details */}
            <Card
              className="mb-8 shadow-md border-0 border-t-4 border-pink-500 rounded-xl bg-white/90 backdrop-blur-sm"
              bordered={false}
              bodyStyle={{ padding: '0px' }}
            >
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                  <EnvironmentOutlined className="text-pink-500" /> Trip Details
                </h3>
                <BookingsAdd
                  isIncludeGST={initValues?.includeGST}
                  list={bookingArray}
                  loading={false}
                  onBookingChange={onBookingChange}
                />
              </div>
            </Card>

            {/* Actions */}
            <div className="flex justify-end pb-10">
              <Button
                type="primary"
                htmlType="submit"
                loading={loader}
                onClick={handleConfirm}
                size="large"
                icon={<SaveOutlined />}
                className="bg-gradient-to-r from-green-500 to-teal-500 border-none shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all px-12 h-14 text-lg rounded-xl font-bold"
              >
                Update Booking Entry
              </Button>
            </div>
          </Form>
        )}
      </div>
    </div>
  );
};

export default UpdateBookingEntry;
