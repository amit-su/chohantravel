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
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import getStaffId from "../../../utils/getStaffId";
import { loadPartyPaginated } from "../../../redux/rtk/features/party/partySlice";
import { loadAllCompany } from "../../../redux/rtk/features/company/comapnySlice";
import { PercentageOutlined, PlusOutlined, InfoCircleOutlined, BankOutlined, UserOutlined, EnvironmentOutlined, FileTextOutlined } from "@ant-design/icons";

import { useNavigate, useParams } from "react-router-dom";
import { addproformaInvoice } from "../../../redux/rtk/features/proformaInvoice/proformaInvoiceSlice";
import TextArea from "antd/es/input/TextArea";
import FormItem from "antd/es/form/FormItem";
import InvoiceAdd from "./CreateProformaInvoice";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import AddParty from "../../Party/addParty";
import CreateDrawer from "../../CommonUi/CreateDrawer";

const { Title, Text } = Typography;

const AddProformaInvoice = () => {
  const { Option } = Select;
  const { id } = useParams();
  const navigate = useNavigate();
  const [bookingArray, setBookingArray] = useState([]);
  const [loader, setLoader] = useState(false);
  const [netAmount, setNetAmount] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalBusQty, setTotalBusQty] = useState(0);

  const [afterTollParking, setAfterTollParking] = useState(0);
  const [afterGST, setAfterGST] = useState(0);
  const [initValues, setInitValues] = useState({ date: dayjs() });
  const [SGSTamt, setSGSTamt] = useState(0);
  const [CGSTamt, setCGSTamt] = useState(0);
  const [IGSTamt, setIGSTamt] = useState(0);
  const [advancePayment, setAdvancePayment] = useState(0);

  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const handleLoadParty = () => {
    dispatch(loadPartyPaginated({ page: 1, count: 10000, status: true }));
  };
  const handleLoadCompany = () => {
    dispatch(loadAllCompany({ page: 1, count: 10000, status: true }));
  };
  const { list: partyList } = useSelector((state) => state.party);
  const { list: companyList } = useSelector((state) => state.companies);
  const [GstType, setGstType] = useState("CGST");
  const { list: localProforma } = useSelector((state) => state.localProforma);
  const staffId = getStaffId();
  const [userId, setUserId] = useState(staffId);

  const totalCalculator = () => {
    let totalAmount = 0;
    let sumBusQty = 0;
    bookingArray?.forEach((booking) => {
      totalAmount += parseFloat(booking.amount) || 0;
      sumBusQty += parseInt(booking.busQty) || 0;
    });
    setTotal(totalAmount);
    setTotalBusQty(totalBusQty);
    calculateAfterTollParking(totalAmount);
  };

  const calculateAfterTollParking = (totalAmount) => {
    const tollParking = form.getFieldValue("tollParking") || 0;
    const totalWithTollParking = totalAmount + parseFloat(tollParking);
    setAfterTollParking(totalWithTollParking);
    calculateAfterGST(totalWithTollParking);
  };

  const calculateAfterGST = useCallback(
    (amount) => {
      const sgst = parseFloat(form.getFieldValue("SGST")) || 0;
      const cgst = parseFloat(form.getFieldValue("CGST")) || 0;
      const sgstAmount = (amount * sgst) / 100;
      const cgstAmount = (amount * cgst) / 100;

      form.setFieldsValue({
        SGSTamt: sgstAmount,
        CGSTamt: cgstAmount,
      });

      const totalGST = sgstAmount + cgstAmount;
      const totalWithGST = amount + totalGST;
      setNetAmount(Math.ceil(totalWithGST));
    },
    [form, setNetAmount, setAfterTollParking]
  );

  useEffect(() => {
    calculateAfterGST(
      afterTollParking,
      setAfterTollParking,
      setNetAmount,
      form
    );
  }, [
    form.getFieldValue("SGST"),
    form.getFieldValue("CGST"),
    afterTollParking,
    calculateAfterGST,
  ]);

  const handleTollParkingChange = (value) => {
    calculateAfterTollParking(total);
  };

  const handleSGSTChange = (value) => {
    const sgstPercentage = parseFloat(value);
    const sgstAmount = (afterTollParking * sgstPercentage) / 100;
    const cgstPercentage = form.getFieldValue("CGST") || 0;
    const cgstAmount = (afterTollParking * cgstPercentage) / 100;
    setSGSTamt(sgstAmount);
    setCGSTamt(cgstAmount);
    setNetAmount(Math.ceil(afterTollParking + sgstAmount + cgstAmount));
  };

  const handleCGSTChange = (value) => {
    const cgstPercentage = parseFloat(value);
    const cgstAmount = (afterTollParking * cgstPercentage) / 100;
    const sgstPercentage = form.getFieldValue("SGST") || 0;
    const sgstAmount = (afterTollParking * sgstPercentage) / 100;
    setCGSTamt(cgstAmount);
    setSGSTamt(sgstAmount);
    setNetAmount(Math.ceil(afterTollParking + sgstAmount + cgstAmount));
  };
  const handleIGSTChange = (value) => {
    const igst = form.getFieldValue("IGST") || 0;
    const igstAmount = (afterTollParking * parseFloat(igst)) / 100;
    form.setFieldsValue({
      IGSTamt: igstAmount,
    });
    setIGSTamt(igstAmount);
    setNetAmount(Math.ceil(afterTollParking + igstAmount));
  };

  const handlePartySelect = (partyId) => {
    const selectedParty = partyList?.find((party) => party.id === partyId);

    if (selectedParty) {
      const { partyAddr, gstNo, referredBy, cpName, cpNumber } = selectedParty;
      setInitValues({
        PartyID: partyId,
        ContactPersonName: cpName,
        ContactPersonNo: cpNumber,
        address: partyAddr,
        GSTNO: gstNo,
        ReferredBy: referredBy,
      });
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
      const selectedCompany = companyList?.find((c) => c.Name === values.company_id);
      const data = {
        PartyID: values.PartyID,
        BookingDate: values.date.format("YYYY-MM-DD"),
        invoiceNo: id,
        companyname: values.company_id,
        ContactPersonName: values.ContactPersonName,
        ContactPersonNo: values.ContactPersonNo,
        address: values.address,
        busQtyRequired: totalBusQty,
        GSTNO: values.GSTNO,
        ReferredBy: values.ReferredBy,
        advancePayment: values.advAmount,
        AdvAmtPer: values.AdvAmtPer,
        tollParking: values.tollParking,
        CGSTPer: values.CGST,
        CGSTAmt: values.CGSTamt,
        SGSTPer: values.SGST,
        SGSTAmt: values.SGSTamt,
        IGSTPer: values.IGST,
        IGSTAmt: values.IGSTamt,
        RoundOff: afterTollParking.toFixed(),
        netAmount: netAmount,
        Remarks: values.Remarks,
        PermitReq: values.PermitReq,
        localProformaList: JSON.stringify(formattedBookingArray),
        RefInvoiceNo: values.RefInvoiceNo,
        GstType: values.GstType,
        CompanyID: selectedCompany?.Id ? parseInt(selectedCompany.Id) : null,
        extra: values.extra,
      };
      if (bookingArray.length > 0) {
        const resp = await dispatch(addproformaInvoice(data));
        if (resp.payload.status == 1) {
          setLoader(false);
          toast.success("Proforma Invoice Entry Successful.");
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

  const onBookingClose = (payload) => {
    if (payload.length) {
      setBookingArray(payload);
    }
  };
  const handleIncludepermit = (value) => {
    // setIsIncludeGST(value);
  };

  useEffect(() => {
    form.setFieldsValue(initValues);
  }, [initValues, form]);

  useEffect(() => {
    totalCalculator();
  }, [bookingArray]);

  useEffect(() => {
    handleLoadParty();
  }, []);

  const handleAdvancePaymentChange = (value) => {
    const percent = parseFloat(value);
    const amountToSubtract = (percent / 100) * total || 0;
    const amountToSubtract1 = (percent / 100) * netAmount || 0;

    setAdvancePayment(amountToSubtract);
    form.setFieldsValue({ advAmount: amountToSubtract1.toFixed(2) });
  };

  const sortedPartyList = Array.isArray(partyList)
    ? [...partyList].sort((a, b) => a.partyName.localeCompare(b.partyName))
    : [];

  return (
    <div className="bg-slate-50 min-h-screen">
      <Form
        form={form}
        name="proforma_invoice_form"
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
                <FileTextOutlined className="text-white text-2xl" />
              </div>
              <div>
                <Title level={4} style={{ margin: 0, color: '#0f172a', fontWeight: 700 }}>Create Proforma Invoice</Title>
                <Text className="text-slate-500 text-xs">Generate a new professional proforma invoice.</Text>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                size="large"
                onClick={() => navigate("/admin/proforma-invoice")}
                className="rounded-xl hover:bg-slate-50 border-slate-200 text-slate-600 font-medium"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loader}
                size="large"
                style={{ background: 'linear-gradient(135deg, #0891b2 0%, #0d9488 100%)', border: 'none' }}
                className="rounded-xl shadow-lg shadow-cyan-500/20 px-6 font-semibold hover:opacity-90 transition-all"
              >
                Create Invoice
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
                        onClick={handleLoadCompany}
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
                      rules={[{ required: true, message: "Please enter invoice number" }]}
                    >
                      <Input placeholder="Enter Invoice No" className="rounded-lg" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Party"
                      name="PartyID"
                      rules={[{ required: true, message: "Please select a party" }]}
                    >
                      <div className="flex gap-2">
                        <Select
                          showSearch
                          onSelect={handlePartySelect}
                          onClick={handleLoadParty}
                          placeholder="Select party"
                          className="flex-1 rounded-lg"
                          optionFilterProp="children"
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
                          title={"New Party"}
                          color="bg-gradient-to-r from-teal-500 to-emerald-500 border-none shadow hover:from-teal-600 hover:to-emerald-600"
                        >
                          <AddParty />
                        </CreateDrawer>
                      </div>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Invoice Date"
                      name="date"
                      rules={[{ required: true, message: "Please select invoice date" }]}
                    >
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
                      <Select placeholder="Select GST Type" onChange={setGstType} className="rounded-lg">
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

                  <Divider className="my-3" />

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

export default AddProformaInvoice;
