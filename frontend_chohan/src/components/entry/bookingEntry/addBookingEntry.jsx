import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Card,
  Row,
  Col,
  Space
} from "antd";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadPartyPaginated } from "../../../redux/rtk/features/party/partySlice";
import BookingsAdd from "./Bookings";
import dayjs from "dayjs";
import { useParams, useNavigate, Link } from "react-router-dom";
import { addbookingEntry } from "../../../redux/rtk/features/bookingEntry/bookingsEntrySlice";
import TextArea from "antd/es/input/TextArea";
import {
  RocketOutlined,
  LeftOutlined,
  SaveOutlined,
  UserOutlined,
  InfoCircleOutlined,
  EnvironmentOutlined
} from "@ant-design/icons";
import { loadAllBusCategory } from "../../../redux/rtk/features/busCategory/busCategorySlice";
import { clearLocalBooking } from "../../../redux/rtk/features/localBusBooking/localBusBookingSlice";
import CreateDrawer from "../../CommonUi/CreateDrawer";
import AddParty from "../../Party/addParty";

const AddBookingEntry = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const [loader, setLoader] = useState(false);
  const [bookingArray, setBookingArray] = useState([]);
  const [confirmBookings, setConfirmBookings] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const [initValues, setInitValues] = useState({
    bookingDate: dayjs(),
    BookingNo: "New",
  });

  // Redux Selectors
  const { list: partyList } = useSelector((state) => state.party);
  const { list: localBookingList } = useSelector((state) => state.localBookingsData);

  const handleConfirm = () => {
    setConfirmBookings(true);
  };

  const handleLoadParty = () => {
    dispatch(loadPartyPaginated({ page: 1, count: 10000, status: true }));
  };

  const handleLoadBus = () => {
    dispatch(loadAllBusCategory({ page: 1, count: 10000, status: true }));
  };

  useEffect(() => {
    dispatch(clearLocalBooking());
    handleLoadParty();
    handleLoadBus();
  }, [dispatch]);

  const handlePartySelect = (partyId) => {
    const selectedParty = partyList?.find((party) => party.id === partyId);

    if (selectedParty) {
      const { cpName, cpNumber, partyAddr, gstNo, referredBy } = selectedParty;
      setInitValues({
        ...form.getFieldsValue(),
        PartyID: partyId,
        ContactPersonName: cpName,
        ContactPersonNo: cpNumber,
        address: partyAddr,
        GSTNO: gstNo,
        referredBy: referredBy,
      });
      form.setFieldsValue({
        ContactPersonName: cpName,
        ContactPersonNo: cpNumber,
        address: partyAddr,
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

  const onFinish = async (values) => {
    setLoader(true);
    try {
      const uppercaseValues = Object.keys(values).reduce((acc, key) => {
        acc[key] = typeof values[key] === "string" ? values[key].toUpperCase() : values[key];
        return acc;
      }, {});

      // Note: Backend might rely on this random number, or it should be handled by backend. Keeping as is for safety.
      uppercaseValues.BookingNo = Math.floor(Math.random() * 9007165) + 1;
      uppercaseValues.BookingDate = selectedDate.isValid() ? selectedDate.format("YYYY-MM-DD") : "";

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
        const resp = await dispatch(addbookingEntry(data));
        if (resp.payload.message === "success") {
          setConfirmBookings(false);
          navigate("/admin/booking-entry");
        }
      } else if (bookingArray.length === 0) {
        // Handle case where no buses are added? Or just submit head? 
        // Original code only submitted if bookingArray.length > 0.
        // Assuming we need at least one booking detail.
        setLoader(false);
      }
    } catch (error) {
      // Error handling
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    form.setFieldsValue(initValues);
  }, [initValues, form]);


  const handleDateChange = useCallback((date) => {
    const newDate = dayjs(date, "DD-MM-YYYY");
    setSelectedDate(newDate.isValid() ? newDate : dayjs());
  }, []);

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
              <h1 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-sm">Create Booking</h1>
              <p className="text-blue-100 mt-2 text-lg font-medium">Add new travel booking details</p>
            </div>
          </div>
        </div>

        <Form
          form={form}
          name="dynamic_form_nest_item"
          onFinish={onFinish}
          layout="vertical"
          initialValues={initValues}
          onFinishFailed={() => setLoader(false)}
          size="large"
          autoComplete="off"
        >
          <Row gutter={24}>
            {/* Left Column: Basic Details */}
            <Col span={24} lg={12}>
              <Card
                title={<span className="text-blue-600 font-bold flex items-center gap-2"><UserOutlined /> Party Details</span>}
                className="mb-6 shadow-md border-t-4 border-blue-500 rounded-xl bg-white/80 backdrop-blur-sm"
                bordered={false}
              >
                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item
                      label="Party"
                      name="PartyID"
                      rules={[{ required: true, message: "Please select a party!" }]}
                    >
                      <div className="flex gap-2">
                        <Select
                          showSearch
                          onSelect={handlePartySelect}
                          placeholder="Select party"
                          optionFilterProp="children"
                          className="flex-1"
                        >
                          {sortedPartyList?.map((party) => (
                            <Select.Option key={party.id} value={party.id}>
                              {party.partyName}
                            </Select.Option>
                          ))}
                        </Select>
                        <CreateDrawer width={60} permission={"create-party"} title={"Create Party"}>
                          <AddParty />
                        </CreateDrawer>
                      </div>
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item label="Booking No" name="BookingNo">
                      <Input placeholder="Auto Generated" disabled className="bg-gray-50 text-gray-500" />
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
                  <Col span={12}>
                    <Form.Item label="Contact Person No" name="ContactPersonNo">
                      <Input type="number" placeholder="Enter Number" />
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <Form.Item label="Party Address" name="address">
                      <TextArea rows={3} placeholder="Enter address" />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* Right Column: Payment & Terms */}
            <Col span={24} lg={12}>
              <Card
                title={<span className="text-purple-600 font-bold flex items-center gap-2"><InfoCircleOutlined /> Terms & Conditions</span>}
                className="mb-6 shadow-md border-t-4 border-purple-500 rounded-xl bg-white/80 backdrop-blur-sm"
                bordered={false}
              >
                <Row gutter={16}>
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

                  <Col span={24}>
                    <Form.Item label="Email" name="email">
                      <Input placeholder="Enter Email" />
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

          {/* Bus Details Section */}
          <Card
            className="mb-8 shadow-md border-0 border-t-4 border-pink-500 rounded-xl bg-white/90 backdrop-blur-sm"
            bordered={false}
            bodyStyle={{ padding: '0px' }} // Let child component handle padding or wrapping
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


          {/* Submit Action */}
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
              Create Booking Entry
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AddBookingEntry;
