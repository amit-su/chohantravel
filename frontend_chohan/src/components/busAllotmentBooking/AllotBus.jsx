import React, { useEffect, useState } from "react";
import UserPrivateComponent from "../PrivacyComponent/UserPrivateComponent";
import TableComponent from "../CommonUi/TableComponent";
import { Card, Drawer, Button, message, Modal, Form, Input, Badge, Dropdown, Space } from "antd";
import { MessageOutlined, SendOutlined, DownOutlined, WhatsAppOutlined } from "@ant-design/icons";
import axios from "axios";
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

  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);
  const [isCaptainSmsModalOpen, setIsCaptainSmsModalOpen] = useState(false);
  const [smsForm] = Form.useForm();
  const [captainSmsForm] = Form.useForm();
  const [smsPreview, setSmsPreview] = useState("");
  const [captainSmsPreview, setCaptainSmsPreview] = useState("");
  const [currentRecordId, setCurrentRecordId] = useState(null);

  const generatePreview = (values) => {
    const {
      bookingNo,
      driverDetails,
      vehicleDetails,
      reportingOn,
      destinationAddress,
      remarks,
    } = values;

    const clean = (val) => (val || "").replace(/\n+/g, " ").replace(/\s+/g, " ").trim();

    return `Dear Customer, GREETINGS OF THE DAY! Vehicle and driver details for Booking No ${clean(bookingNo)} Driver: ${clean(driverDetails)} Vehicle: ${clean(vehicleDetails)} Reporting on: ${clean(reportingOn)} Trip Details: ${clean(destinationAddress)} Remarks: ${clean(remarks)} Regards CHOHAN TOURS AND TRAVELS Contact 8820388881 WISHING YOU A HAPPY JOURNEY`;
  };

  const generateCaptainPreview = (values) => {
    const {
      reportingOn,
      customerName,
      customerMobile,
      tripDetails,
      vehicleDetails,
      remarks,
    } = values;

    const clean = (val) => (val || "").replace(/\n+/g, " ").replace(/\s+/g, " ").trim();
    const splitText = (str, maxLength) => {
      if (str.length <= maxLength) return [str, ""];
      let splitIndex = str.lastIndexOf(" ", maxLength);
      if (splitIndex === -1) splitIndex = maxLength;
      return [str.substring(0, splitIndex).trim(), str.substring(splitIndex).trim()];
    };

    const [name1, name2] = splitText(clean(customerName), 30);

    return `Dear Captain, Reporting data and time - ${clean(reportingOn)} Party name - ${name1} ${name2} Party no. - ${clean(customerMobile)} Reporting Details - ${clean(tripDetails)} ${clean(vehicleDetails)} Remarks - ${clean(remarks)} CHOHAN TOURS AND TRAVELS`;
  };
  const onClose = () => {
    setOpen(false);
    onSuccess?.();
  };

  const openSmsModal = (recordID, restData) => {
    const bookingInfo = ID || (list && list.length > 0 ? list[0] : {});
    const contactNo = bookingInfo?.ContactPersonNo || bookingInfo?.ContactNo || "";
    const numbers = contactNo ? String(contactNo).split(",")[0].trim() : "";

    const initialValues = {
      numbers: numbers,
      customerName: bookingInfo?.ContactPersonName || bookingInfo?.PartyName || "Customer",
      bookingNo: bookingInfo?.BookingNo || formattedBookingID || "",
      driverDetails: `${restData?.driverName || ""}${restData?.DriverContactNo ? `(${restData.DriverContactNo})` : ""}`.trim(),
      vehicleDetails: `${restData?.BusNo || ""} ${restData?.BusTypeName || ""}`.trim(),
      reportingOn: `${restData?.reportTime ? moment.utc(restData.reportTime).format("LT") : ""} ${restData?.TripStartDate ? moment(restData.TripStartDate).format("DD-MM-YYYY") : ""}`.trim(),
      destinationAddress: restData?.TripDesc || bookingInfo?.Destination || restData?.tripDescription || "Local",
      remarks: restData?.Remarks || "",
    };

    setCurrentRecordId(recordID);
    smsForm.setFieldsValue(initialValues);
    setSmsPreview(generatePreview(initialValues));
    setIsSmsModalOpen(true);
  };

  const openCaptainSmsModal = (recordID, restData) => {
    const bookingInfo = ID || (list && list.length > 0 ? list[0] : {});
    const driverNo = restData?.DriverContactNo || "";

    const initialValues = {
      numbers: driverNo,
      reportingOn: `${restData?.reportTime ? moment.utc(restData.reportTime).format("LT") : ""} ${restData?.TripStartDate ? moment(restData.TripStartDate).format("DD-MM-YYYY") : ""}`.trim(),
      customerName: bookingInfo?.ContactPersonName || bookingInfo?.PartyName || "Customer",
      customerMobile: bookingInfo?.ContactPersonNo || bookingInfo?.ContactNo || "",
      tripDetails: restData?.TripDesc || bookingInfo?.Destination || "Local",
      vehicleDetails: `${restData?.BusNo || ""} ${restData?.BusTypeName || ""}`.trim(),
      remarks: restData?.Remarks || "",
    };

    setCurrentRecordId(recordID);
    captainSmsForm.setFieldsValue(initialValues);
    setCaptainSmsPreview(generateCaptainPreview(initialValues));
    setIsCaptainSmsModalOpen(true);
  };

  const handleSendSms = async () => {
    try {
      const values = await smsForm.validateFields();
      const payload = {
        ...values,
        numbers: [values.numbers],
        allotmentId: currentRecordId,
      };

      const apiUrl = import.meta.env.VITE_APP_API;
      const res = await axios.post(`${apiUrl}/sms/allotment`, payload);

      if (res.status === 200) {
        message.success("Allotment SMS sent successfully!");
        setIsSmsModalOpen(false);
        dispatch(
          loadSingleBookingBusAllotment({
            id: formattedBookingID,
            decodedBookingID,
            page: 1,
            count: 10000,
            status: true,
            allotmentStatus: 0,
          })
        );
      }
    } catch (error) {
      message.error("Failed to send Allotment SMS.");
    }
  };

  const handleSendCaptainSms = async () => {
    try {
      const values = await captainSmsForm.validateFields();
      const payload = {
        ...values,
        numbers: [values.numbers],
        allotmentId: currentRecordId,
      };

      const apiUrl = import.meta.env.VITE_APP_API;
      const res = await axios.post(`${apiUrl}/sms/captain-allotment`, payload);

      if (res.status === 200) {
        message.success("Captain SMS sent successfully!");
        setIsCaptainSmsModalOpen(false);
        dispatch(
          loadSingleBookingBusAllotment({
            id: formattedBookingID,
            decodedBookingID,
            page: 1,
            count: 10000,
            status: true,
            allotmentStatus: 0,
          })
        );
      }
    } catch (error) {
      message.error("Failed to send Captain SMS.");
    }
  };

  const handleSendWhatsApp = async () => {
    try {
      const values = await smsForm.validateFields();
      const payload = {
        number: values.numbers,
        message: smsPreview,
      };

      const apiUrl = import.meta.env.VITE_APP_API;
      const res = await axios.post(`${apiUrl}/whatsapp/send`, payload);

      if (res.data.status) {
        message.success("Allotment WhatsApp sent successfully!");
        setIsSmsModalOpen(false);
      } else {
        message.error("Failed to send WhatsApp message.");
      }
    } catch (error) {
      message.error("Failed to send Allotment WhatsApp.");
    }
  };

  const handleSendCaptainWhatsApp = async () => {
    try {
      const values = await captainSmsForm.validateFields();
      const payload = {
        number: values.numbers,
        message: captainSmsPreview,
      };

      const apiUrl = import.meta.env.VITE_APP_API;
      const res = await axios.post(`${apiUrl}/whatsapp/send`, payload);

      if (res.data.status) {
        message.success("Captain WhatsApp sent successfully!");
        setIsCaptainSmsModalOpen(false);
      } else {
        message.error("Failed to send WhatsApp message.");
      }
    } catch (error) {
      message.error("Failed to send Captain WhatsApp.");
    }
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
      width: 300,
      render: (record) => {
        const recordID = record?.ID;
        const restData = record;
        return (
          <div className="flex items-center gap-2">
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
                <AllotBusDrawer
                  data={restData}
                  id={recordID}
                  formattedBookingID={formattedBookingID}
                  decodedBookingID={decodedBookingID}
                  onClose={onClose}
                />
              </CreateDrawer>
            </UserPrivateComponent>
            {restData?.BusAllotmentStatus != null && (
              <div className="flex items-center ml-1 h-[38px]">
                <Badge
                  count={restData?.sms_count || restData?.SMS_Count || 0}
                  offset={[-5, 5]}
                  style={{
                    backgroundColor: "#f1f0f7ff",
                    color: "#045d8aff",
                    border: "1px solid #045d8aff",
                    fontWeight: "bold"
                  }}
                >
                  <Dropdown
                    menu={{
                      items: [
                        {
                          key: '1',
                          label: (
                            <div className="flex justify-between items-center gap-4">
                              <span>Customer SMS</span>
                              <Badge count={restData?.sms_count || restData?.SMS_Count || 0} size="small" />
                            </div>
                          ),
                          icon: <SendOutlined />,
                          onClick: () => openSmsModal(recordID, restData),
                        },
                        {
                          key: '2',
                          label: (
                            <div className="flex justify-between items-center gap-4">
                              <span>Captain SMS</span>
                              <Badge count={restData?.cap_sms_count || restData?.Cap_SMS_Count || 0} size="small" />
                            </div>
                          ),
                          icon: <SendOutlined />,
                          onClick: () => openCaptainSmsModal(recordID, restData),
                        },
                      ],
                    }}
                    placement="bottomRight"
                  >
                    <Button
                      type="primary"
                      className="flex items-center justify-center gap-2 h-full px-4 border-none shadow-sm transition-all duration-300"
                      style={{
                        background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                        borderRadius: '6px'
                      }}
                    >
                      <span className="font-semibold text-sm">Send SMS</span>
                      <DownOutlined className="text-xs" />
                    </Button>
                  </Dropdown>
                </Badge>
              </div>
            )}
          </div>
        );
      },
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

      <Modal
        title="Send Allotment SMS"
        open={isSmsModalOpen}
        onOk={handleSendSms}
        onCancel={() => setIsSmsModalOpen(false)}
        width={800}
        footer={[
          <Button key="cancel" onClick={() => setIsSmsModalOpen(false)}>
            Cancel
          </Button>,
          <Button
            key="whatsapp"
            type="primary"
            icon={<WhatsAppOutlined />}
            style={{ backgroundColor: '#25D366', borderColor: '#25D366' }}
            onClick={handleSendWhatsApp}
          >
            Send via WhatsApp
          </Button>,
          <Button
            key="sms"
            type="primary"
            style={{ backgroundColor: '#25D366', borderColor: '#25D366' }}
            onClick={handleSendSms}
          >
            Send SMS
          </Button>,
        ]}
      >
        <Form
          form={smsForm}
          layout="vertical"
          onValuesChange={() => {
            setSmsPreview(generatePreview(smsForm.getFieldsValue()));
          }}
        >
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="numbers"
              label="Phone Number"
              rules={[{ required: true, message: "Please enter phone number" }]}
            >
              <Input placeholder="Enter Phone Number" />
            </Form.Item>
            <Form.Item name="customerName" label="Customer Name">
              <Input placeholder="Customer Name" />
            </Form.Item>
            <Form.Item name="bookingNo" label="Booking No">
              <Input placeholder="Booking No" />
            </Form.Item>
            <Form.Item name="driverDetails" label="Driver Details">
              <Input placeholder="Driver Details" />
            </Form.Item>
            <Form.Item name="vehicleDetails" label="Vehicle Details">
              <Input placeholder="Vehicle Details" />
            </Form.Item>
            <Form.Item name="reportingOn" label="Reporting On">
              <Input placeholder="Reporting On" />
            </Form.Item>
            <Form.Item name="destinationAddress" label="Trip Details">
              <Input.TextArea rows={2} placeholder="Trip Details" />
            </Form.Item>
            <Form.Item name="remarks" label="Remarks">
              <Input.TextArea rows={2} placeholder="Remarks" />
            </Form.Item>
          </div>
        </Form>
        <div className="mt-4 p-4 bg-gray-100 rounded border border-gray-300">
          <h4 className="font-bold mb-2">Message Preview:</h4>
          <p className="text-gray-700 whitespace-pre-wrap">{smsPreview}</p>
        </div>
      </Modal>

      <Modal
        title="Send Captain SMS"
        open={isCaptainSmsModalOpen}
        onOk={handleSendCaptainSms}
        onCancel={() => setIsCaptainSmsModalOpen(false)}
        width={800}
        footer={[
          <Button key="cancel" onClick={() => setIsCaptainSmsModalOpen(false)}>
            Cancel
          </Button>,
          <Button
            key="whatsapp"
            type="primary"
            icon={<WhatsAppOutlined />}
            style={{ backgroundColor: '#25D366', borderColor: '#25D366' }}
            onClick={handleSendCaptainWhatsApp}
          >
            Send via WhatsApp
          </Button>,
          <Button
            key="sms"
            type="primary"
            style={{ backgroundColor: '#25D366', borderColor: '#25D366' }}
            onClick={handleSendCaptainSms}
          >
            Send Captain SMS
          </Button>,
        ]}
      >
        <Form
          form={captainSmsForm}
          layout="vertical"
          onValuesChange={() => {
            setCaptainSmsPreview(generateCaptainPreview(captainSmsForm.getFieldsValue()));
          }}
        >
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="numbers"
              label="Captain Phone Number"
              rules={[{ required: true, message: "Please enter phone number" }]}
            >
              <Input placeholder="Enter Captain Phone Number" />
            </Form.Item>
            <Form.Item name="reportingOn" label="Reporting Date & Time">
              <Input placeholder="Reporting Date & Time" />
            </Form.Item>
            <Form.Item name="customerName" label="Party Name">
              <Input placeholder="Party Name" />
            </Form.Item>
            <Form.Item name="customerMobile" label="Party No.">
              <Input placeholder="Party No." />
            </Form.Item>
            <Form.Item name="tripDetails" label="Trip Details">
              <Input.TextArea rows={2} placeholder="Trip Details" />
            </Form.Item>
            <Form.Item name="vehicleDetails" label="Vehicle Details">
              <Input placeholder="Vehicle Details" />
            </Form.Item>
            <Form.Item name="remarks" label="Remarks">
              <Input.TextArea rows={2} placeholder="Remarks" />
            </Form.Item>
          </div>
        </Form>
        <div className="mt-4 p-4 bg-orange-50 rounded border border-orange-200">
          <h4 className="font-bold mb-2">Captain Message Preview:</h4>
          <p className="text-gray-700 whitespace-pre-wrap">{captainSmsPreview}</p>
        </div>
      </Modal>
    </Card>
  );
};

export default AllotBus;
