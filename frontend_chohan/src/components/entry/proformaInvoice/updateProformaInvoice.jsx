import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Card,
  Row,
  Col,
  Typography,
  Divider,
} from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import getStaffId from "../../../utils/getStaffId";
import { loadPartyPaginated } from "../../../redux/rtk/features/party/partySlice";
import { loadAllCompany } from "../../../redux/rtk/features/company/comapnySlice";
import { PercentageOutlined, PlusOutlined, InfoCircleOutlined, BankOutlined, UserOutlined, EnvironmentOutlined, FileTextOutlined, SaveOutlined, EditOutlined } from "@ant-design/icons";

import { useNavigate, useParams } from "react-router-dom";
import FormItem from "antd/es/form/FormItem";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import InvoiceAdd from "./CreateProformaInvoice";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import {
  addproformaInvoice,
  loadSingleproformaInvoice,
  clearproformaInvoice,
} from "../../../redux/rtk/features/proformaInvoice/proformaInvoiceSlice";
import {
  addLocalProforma,
  clearLocalProforma,
} from "../../../redux/rtk/features/localProformaInvoice/localProformaSlice";
import AddParty from "../../Party/addParty";
import CreateDrawer from "../../CommonUi/CreateDrawer";

const { Title, Text } = Typography;
const UpdateProformaInvoice = () => {
  const { id } = useParams();

  const [bookingArray, setBookingArray] = useState([]);
  const [initValues, setInitValues] = useState({ date: dayjs() });
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [GstType, setGstType] = useState("");
  //----------API----------//
  const apiUrl = import.meta.env.VITE_APP_API;

  //-----------END----------------//

  const [netAmount, setNetAmount] = useState([]);
  const [total, setTotal] = useState(0);
  const [advancePayment, setAdvancePayment] = useState(0);

  const [totalBusQty, setTotalBusQty] = useState(0);

  const [afterTollParking, setAfterTollParking] = useState(0);
  const [afterGST, setAfterGST] = useState(0);
  const [isHold, setHold] = useState("false");

  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const handleLoadParty = () => {
    dispatch(loadPartyPaginated({ page: 1, count: 10000 }));
  };
  const { list: companyList } = useSelector((state) => state.companies);

  const handleLoadCompany = () => {
    dispatch(loadAllCompany({ page: 1, count: 10000, status: true }));
  };

  useEffect(() => {
    handleLoadParty();
    handleLoadCompany();
  }, []);

  const { list: partyList } = useSelector((state) => state.party);
  const { list: localProforma } = useSelector((state) => state.localProforma);
  const staffId = getStaffId();
  const [userId, setUserId] = useState(staffId);
  const [SGSTamt, setSGSTamt] = useState(0);
  const [CGSTamt, setCGSTamt] = useState(0);
  const [IGSTamt, setIGSTamt] = useState(0);
  const onBookingClose = (payload) => {


    if (payload.length) {
      setBookingArray(payload);
    }
  };

  const calculateAll = (currentBookingArray = bookingArray) => {
    const values = form.getFieldsValue();

    // 1. Calculate Subtotal
    let subtotal = 0;
    let sumBusQty = 0;
    currentBookingArray?.forEach((booking) => {
      subtotal += parseFloat(booking.amount) || 0;
      sumBusQty += parseInt(booking.busQty) || 0;
    });
    setTotal(subtotal);
    setTotalBusQty(sumBusQty);

    // 2. Calculate Gross Amount (Subtotal + Toll/Parking)
    const tollParking = parseFloat(values.tollParking) || 0;
    const grossAmount = subtotal + tollParking;
    setAfterTollParking(grossAmount);

    // 3. Calculate GST Amounts
    const sgstPer = parseFloat(values.SGST) || 0;
    const cgstPer = parseFloat(values.CGST) || 0;
    const igstPer = parseFloat(values.IGST) || 0;

    const sgstAmt = (grossAmount * sgstPer) / 100;
    const cgstAmt = (grossAmount * cgstPer) / 100;
    const igstAmt = (grossAmount * igstPer) / 100;

    // 4. Calculate Net Amount
    const totalGstAmt = GstType === "CGST" ? (sgstAmt + cgstAmt) : igstAmt;
    const netAmt = Math.ceil(grossAmount + totalGstAmt);

    // 5. Calculate Advance Amount
    const advPer = parseFloat(values.AdvAmtPer) || 0;
    const advAmt = (netAmt * advPer) / 100;

    // Update Form Fields
    form.setFieldsValue({
      SGSTamt: sgstAmt.toFixed(2),
      CGSTamt: cgstAmt.toFixed(2),
      IGSTamt: igstAmt.toFixed(2),
      advAmount: advAmt.toFixed(2),
    });

    setNetAmount(netAmt);
    setAfterGST(netAmt);
    setAdvancePayment((subtotal * advPer) / 100); // For internal state if needed
  };

  const handleTollParkingChange = () => calculateAll();
  const handleSGSTChange = () => calculateAll();
  const handleCGSTChange = () => calculateAll();
  const handleIGSTChange = () => calculateAll();
  const handleAdvancePaymentChange = () => calculateAll();
  const handleGstTypeChange = (value) => {
    setGstType(value);
    if (value === "CGST") {
      form.setFieldsValue({ IGST: 0, IGSTamt: 0 });
    } else {
      form.setFieldsValue({ SGST: 0, SGSTamt: 0, CGST: 0, CGSTamt: 0 });
    }
    // Use a small timeout to ensure setGstType state is updated before calculation
    setTimeout(() => calculateAll(), 0);
  };

  const [confirmBookings, setConfirmBookings] = useState(false);
  const handleConfirm = () => {
    setConfirmBookings(true);
  };

  const handlePartySelect = (partyId, isInitialLoad = false) => {
    const selectedParty = partyList?.find((party) => Number(party.id) === Number(partyId));

    if (selectedParty) {
      const {
        partyAddr,
        gstNo,
        referredBy,
        cpName,
        cpNumber,
      } = selectedParty;

      const fieldsToUpdate = {
        ContactPersonName: cpName,
        ContactPersonNo: cpNumber,
        address: partyAddr,
        GSTNO: gstNo,
        ReferredBy: referredBy,
      };

      form.setFieldsValue(fieldsToUpdate);

      // Trigger calculation after setting party-specific details
      calculateAll();
    }
  };
  const onFormSubmit = async (values) => {
    try {
      const formattedBookingArray = bookingArray.map((booking) => ({
        ...booking,
        ReportDate: booking.ReportDate
          ? dayjs(booking.ReportDate, "DD-MM-YYYY").format("YYYY-MM-DD")
          : "",
        tripEndDate: booking.tripEndDate
          ? dayjs(booking.tripEndDate, "DD-MM-YYYY").format("YYYY-MM-DD")
          : "",
      }));

      const data = {
        ID: proformaInvoice.ID,
        PartyID: values.PartyID,
        companyname: values.company_id,
        BookingDate: values.date.format("YYYY-MM-DD"),
        invoiceNo: id,
        ContactPersonName: values.ContactPersonName,
        ContactPersonNo: values.ContactPersonNo,
        address: values.address,
        busQtyRequired: totalBusQty,
        GSTNO: values.GSTNO,
        ReferredBy: values.ReferredBy,
        Remarks: values.Remarks,
        advancePayment: values.advAmount,
        AdvAmtPer: values.AdvAmtPer,
        tollParking: values.tollParking,
        CGSTPer: values.CGST,
        CGSTAmt: values.CGSTamt,
        SGSTPer: values.SGST,
        SGSTAmt: values.SGSTamt,
        IGSTPer: values.IGST,
        IGSTAmt: values.IGSTamt,
        PermitReq: values.PermitReq,
        GstType: GstType,
        RoundOff: afterTollParking.toFixed(),
        netAmount: netAmount,
        RefInvoiceNo: values.RefInvoiceNo,
        extra: values.extra,
        localProformaList: JSON.stringify(formattedBookingArray),
      };

      if (bookingArray.length > 0 && confirmBookings === true) {
        const resp = await dispatch(addproformaInvoice(data));
        setConfirmBookings(false);

        if (resp.payload.status == 1) {
          setLoader(false);
          toast.success("Proforma Invoice Update Successful.");
          navigate("/admin/proforma-invoice");
        } else if (resp.payload.status == 3) {
          setLoader(false);
          toast.error("Invoice No Already Used.");
        } else {
          setLoader(false);
        }
      }
    } catch (error) {
      setLoader(false);
    }
  };

  useEffect(() => {
    calculateAll();
  }, [localProforma, bookingArray]);


  const handleIncludepermit = (value) => {
    // setIsIncludeGST(value);
  };

  useEffect(() => {
    dispatch(loadSingleproformaInvoice({ id }));

    return () => {
      dispatch(clearproformaInvoice());
      dispatch(clearLocalProforma());
      setBookingArray([]);
    };
  }, [id, dispatch]);
  const { proformaInvoice } = useSelector((state) => state.proformaInvoices);


  useEffect(() => {
    // Parse the LocalBookingList string into an array of objects
    if (proformaInvoice && proformaInvoice?.LocalProformaList) {
      const parsedList = JSON.parse(
        proformaInvoice && proformaInvoice?.LocalProformaList
      );
      setBookingArray(parsedList);

      dispatch(clearLocalProforma());
      if (parsedList && parsedList.length > 0) {
        parsedList.forEach((item) => {
          dispatch(addLocalProforma(item));
        });
      }
    }
  }, [proformaInvoice, dispatch]);
  // useEffect(() => {
  //   if (proformaInvoice) {
  //     const entry = proformaInvoice;

  //     // Set all other fields immediately
  //     form.setFieldsValue({
  //       date: dayjs(entry.invoiceDate),
  //       GSTNO: entry.GSTNo,
  //       PartyID: parseInt(entry.partyName),
  //       company_id: entry.companyname,
  //       ContactPersonName: entry.contactPersonName,
  //       includeGST: entry.GSTInclude,
  //       ContactPersonNo: entry.contactPersonNo,
  //       address: entry.partyAddr,
  //       email: entry.Email,
  //       tollParking: entry.tollParkingAmt,
  //       SGST: entry.SGSTPer,
  //       CGST: entry.CGSTPer,
  //       IGST: entry.IGSTPer,
  //       IGSTamt: entry.IGSTAmt,
  //       advAmount: entry.advAmount,
  //       AdvAmtPer: entry.AdvAmtPer,
  //       ReferredBy: entry.ReferredBy,
  //       Remarks: entry.Remarks,
  //       PermitReq: entry.PermitReq,
  //       GstType: entry.GstType,
  //       RefInvoiceNo: entry.RefInvoiceNo,
  //       extra: entry.extra,
  //     });
  //     setGstType(entry.GstType);
  //     setAdvancePayment(
  //       (parseInt(entry.advAmount || 0) / 100) * (proformaInvoice.roundOff || 0)
  //     );

  //     // Handle PartyID selection
  //     if (entry.partyName) {
  //       const partyId = Number(entry.partyName);
  //       form.setFieldsValue({ PartyID: partyId });
  //     }

  //     // Trigger final calculation after all fields are set
  //     calculateAll();
  //   }
  // }, [proformaInvoice, form, partyList]);

  useEffect(() => {
    if (!proformaInvoice || !partyList?.length) return;

    const entry = proformaInvoice;

    form.setFieldsValue({
      date: dayjs(entry.invoiceDate),
      GSTNO: entry.GSTNo,
      PartyID: parseInt(entry.partyName),
      company_id: entry.companyname,
      ContactPersonName: entry.contactPersonName,
      ContactPersonNo: entry.contactPersonNo,
      address: entry.partyAddr,
      tollParking: entry.tollParkingAmt,
      SGST: entry.SGSTPer,
      CGST: entry.CGSTPer,
      IGST: entry.IGSTPer,
      IGSTamt: entry.IGSTAmt,
      advAmount: entry.advAmount,
      AdvAmtPer: entry.AdvAmtPer,
      ReferredBy: entry.ReferredBy,
      Remarks: entry.Remarks,
      PermitReq: entry.PermitReq,
      GstType: entry.GstType,
      RefInvoiceNo: entry.RefInvoiceNo,
      extra: entry.extra,
    });

    setGstType(entry.GstType);
    calculateAll();
  }, [proformaInvoice, partyList]);

  const uniquePartyList = partyList?.filter(
    (party, index, self) =>
      index === self.findIndex((p) => p.id === party.id)
  ) || [];

  const sortedPartyList = [...uniquePartyList].sort((a, b) =>
    a.partyName.localeCompare(b.partyName)
  );

  return (
    <div className="bg-slate-50 min-h-screen">
      <Form
        form={form}
        name="update_proforma_invoice_form"
        onFinish={onFormSubmit}
        onFinishFailed={() => setLoader(false)}
        layout="vertical"
        initialValues={initValues}
        size="large"
      >
        <div className="p-4">
          {/* Header Section */}
          <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between px-6 py-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div style={{
                background: 'linear-gradient(135deg, #0891b2 0%, #0d9488 100%)',
                padding: '12px',
                borderRadius: '16px',
                boxShadow: '0 4px 12px rgba(8, 145, 178, 0.2)'
              }}>
                <EditOutlined className="text-white text-2xl" />
              </div>
              <div>
                <Title level={4} style={{ margin: 0, color: '#0f172a', fontWeight: 700 }}>Update Proforma Invoice</Title>
                <Text className="text-slate-500 text-xs">Modify the details of proforma invoice: <Text strong className="text-cyan-600">{id}</Text></Text>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                size="large"
                onClick={() => navigate("/admin/proforma-invoice")}
                className="rounded-xl hover:bg-slate-50-50 border-slate-200 text-slate-600 font-medium"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loader}
                size="large"
                onClick={handleConfirm}
                icon={<SaveOutlined />}
                style={{ background: 'linear-gradient(135deg, #0891b2 0%, #0d9488 100%)', border: 'none' }}
                className="rounded-xl shadow-lg shadow-cyan-500/20 px-6 font-semibold hover:opacity-90 transition-all"
              >
                Update Invoice
              </Button>
            </div>
          </div>

          <Row gutter={[16, 16]}>
            {/* Left Column - Main Details */}
            <Col xs={24} lg={16}>
              <Card
                title={<span className="text-blue-600 font-bold flex items-center gap-2"><BankOutlined /> Basic Information</span>}
                className="mb-6 shadow-md border-t-4 border-blue-500 rounded-xl bg-white/80 backdrop-blur-sm"
                bordered={false}
                bodyStyle={{ padding: '16px 20px' }}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Company"
                      name="company_id"
                      rules={[{ required: true, message: "Please select a company" }]}
                    >
                      <Select
                        placeholder="Select company"
                        showSearch
                        optionFilterProp="children"
                        className="rounded-lg"
                      >
                        {companyList?.map((company) => (
                          <Select.Option key={company.Id} value={company.Name}>
                            {company.Name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Invoice No"
                      name="RefInvoiceNo"
                    >
                      <Input placeholder="Invoice No" className="rounded-lg bg-slate-50" readOnly />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label={<span className="font-semibold text-gray-700">Party</span>}
                      required
                      style={{ marginBottom: "24px" }}
                    >
                      <div className="flex gap-2">
                        <Form.Item
                          name="PartyID"
                          rules={[{ required: true, message: "Please Select Party!" }]}
                          noStyle
                        >
                          <Select
                            showSearch
                            onSelect={handlePartySelect}
                            onClick={handleLoadParty}
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
                        </Form.Item>
                        <CreateDrawer
                          width={60}
                          permission={"create-party"}
                          title={"New Party"}
                          color="bg-gradient-to-r from-teal-500 to-emerald-500 border-none shadow hover:from-teal-600 hover:to-emerald-600"
                        >
                          <AddParty />
                        </CreateDrawer>
                      </div>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Invoice Date" name="date">
                      <DatePicker format="DD-MM-YYYY" className="w-full rounded-lg" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Contact Person" name="ContactPersonName">
                      <Input placeholder="Name" prefix={<UserOutlined className="text-slate-400" />} className="rounded-lg" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Contact Number" name="ContactPersonNo">
                      <Input placeholder="Number" type="number" className="rounded-lg" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item label="Party Address" name="address" rules={[{ required: true, message: "Please enter address" }]}>
                  <TextArea rows={3} placeholder="Enter full address" className="rounded-lg" />
                </Form.Item>
              </Card>

              <Card
                title={<span className="text-purple-600 font-bold flex items-center gap-2"><InfoCircleOutlined /> Additional Details</span>}
                className="mb-6 shadow-md border-t-4 border-purple-500 rounded-xl bg-white/80 backdrop-blur-sm"
                bordered={false}
                bodyStyle={{ padding: '16px 20px' }}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="GST Type" name="GstType" rules={[{ required: true, message: "Select GST type" }]}>
                      <Select placeholder="Select GST Type" onChange={handleGstTypeChange} className="rounded-lg">
                        <Select.Option value="CGST">CGST (Local)</Select.Option>
                        <Select.Option value="IGST">IGST (Interstate)</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Party GST NO" name="GSTNO">
                      <Input placeholder="Enter GST NO" className="rounded-lg" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Reference" name="ReferredBy">
                      <Input placeholder="Referred By" className="rounded-lg" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Permit Required" name="PermitReq">
                      <Select placeholder="Select" className="rounded-lg">
                        <Select.Option value="Yes">Yes</Select.Option>
                        <Select.Option value="No">No</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item label="Remarks" name="Remarks">
                  <Input placeholder="Any additional notes..." className="rounded-lg" />
                </Form.Item>
              </Card>
            </Col>

            {/* Right Column - Summary & Calculations */}
            <Col xs={24} lg={8}>
              <Card
                title={<span className="text-indigo-600 font-bold flex items-center gap-2"><FileTextOutlined /> Order Summary</span>}
                className="shadow-md border-t-4 border-indigo-500 rounded-xl bg-white/80 backdrop-blur-sm sticky top-4 overflow-hidden"
                bordered={false}
                bodyStyle={{ padding: '16px 20px' }}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-slate-600">
                    <Text>Subtotal</Text>
                    <Text strong>₹{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
                  </div>

                  <Divider className="my-2" />

                  <Form.Item label="Extra / Description" name="extra" className="mb-2">
                    <Input placeholder="e.g. Toll & Parking" className="rounded-lg" />
                  </Form.Item>

                  <Form.Item label="Toll & Parking Amount" name="tollParking" className="mb-4">
                    <InputNumber
                      className="w-full rounded-lg"
                      onChange={handleTollParkingChange}
                      formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/\₹\s?|(,*)/g, '')}
                      placeholder="0.00"
                    />
                  </Form.Item>

                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <Text strong className="text-slate-700">Gross Amount</Text>
                    <Text strong className="text-slate-900 text-lg">₹{afterTollParking.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
                  </div>

                  <Divider className="my-4" />

                  {GstType === "CGST" ? (
                    <>
                      <Row gutter={8} align="bottom">
                        <Col span={10}>
                          <Form.Item label="SGST (%)" name="SGST" rules={[{ required: true, message: "Required" }]}>
                            <InputNumber className="w-full rounded-lg" onChange={handleSGSTChange} suffix="%" />
                          </Form.Item>
                        </Col>
                        <Col span={14}>
                          <Form.Item label="SGST Amount" name="SGSTamt">
                            <InputNumber className="w-full rounded-lg" disabled prefix="₹" />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={8} align="bottom">
                        <Col span={10}>
                          <Form.Item label="CGST (%)" name="CGST" rules={[{ required: true, message: "Required" }]}>
                            <InputNumber className="w-full rounded-lg" onChange={handleCGSTChange} suffix="%" />
                          </Form.Item>
                        </Col>
                        <Col span={14}>
                          <Form.Item label="CGST Amount" name="CGSTamt">
                            <InputNumber className="w-full rounded-lg" disabled prefix="₹" />
                          </Form.Item>
                        </Col>
                      </Row>
                    </>
                  ) : (
                    <Row gutter={8} align="bottom">
                      <Col span={10}>
                        <Form.Item label="IGST (%)" name="IGST" rules={[{ required: true, message: "Required" }]}>
                          <InputNumber className="w-full rounded-lg" onChange={handleIGSTChange} suffix="%" />
                        </Form.Item>
                      </Col>
                      <Col span={14}>
                        <Form.Item label="IGST Amount" name="IGSTamt">
                          <InputNumber className="w-full rounded-lg" disabled prefix="₹" />
                        </Form.Item>
                      </Col>
                    </Row>
                  )}

                  <Divider className="my-4" />

                  <div className="bg-gradient-to-br from-cyan-500 to-teal-600 p-4 rounded-xl shadow-md shadow-cyan-100 mb-4 transform hover:scale-[1.01] transition-transform">
                    <div className="flex justify-between items-center mb-1">
                      <Text className="text-white/90 font-medium text-base">Net Payable Amount</Text>
                      <Text className="text-white text-2xl font-black">₹{netAmount.toLocaleString()}</Text>
                    </div>
                    <Text className="text-white/70 text-xs italic">Inclusive of all taxes and charges</Text>
                  </div>

                  <Card className="bg-slate-50 border-slate-200 rounded-lg" bodyStyle={{ padding: '16px' }}>
                    <Text strong className="block mb-3 text-slate-700">Advance Payment</Text>
                    <Row gutter={8}>
                      <Col span={10}>
                        <Form.Item name="AdvAmtPer" className="mb-0">
                          <InputNumber className="w-full rounded-lg" onChange={handleAdvancePaymentChange} suffix="%" placeholder="%" />
                        </Form.Item>
                      </Col>
                      <Col span={14}>
                        <Form.Item name="advAmount" className="mb-0">
                          <InputNumber className="w-full rounded-lg" prefix="₹" placeholder="Amount" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                </div>
              </Card>
            </Col>
          </Row>

          {/* Booking Items Section */}
          <div className="mt-6">
            <Card
              title={<span className="text-pink-600 font-bold flex items-center gap-2"><EnvironmentOutlined /> Trip Details & Bookings</span>}
              className="mb-8 shadow-md border-0 border-t-4 border-pink-500 rounded-xl bg-white/90 backdrop-blur-sm"
              bordered={false}
              bodyStyle={{ padding: 0 }}
            >
              <InvoiceAdd
                list={bookingArray}
                loading={false}
                onBookingClose={onBookingClose}
              />
            </Card>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default UpdateProformaInvoice;
