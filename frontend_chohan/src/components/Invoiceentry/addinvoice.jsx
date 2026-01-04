import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Typography,
  Card,
  Row,
  Col,
  Divider,
} from "antd";

import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import getStaffId from "../../utils/getStaffId";
import { loadPartyPaginated } from "../../redux/rtk/features/party/partySlice";
import { loadAllCompany } from "../../redux/rtk/features/company/comapnySlice";
import {
  FileTextOutlined,
  BankOutlined,
  InfoCircleOutlined,
  UserOutlined,
  EnvironmentOutlined
} from "@ant-design/icons";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import InvoiceAdd from "./createinvoice";
import axios from "axios";
import { toast } from "react-toastify";

const { Title, Text } = Typography;

let performa = [];
let bi = [];
let c = 0;

const AddInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bookingArray, setBookingArray] = useState([]);
  const [loader, setLoader] = useState(false);
  const [netAmount, setNetAmount] = useState(0);
  const [total, setTotal] = useState(0);
  const [totalBusQty, setTotalBusQty] = useState(0);
  const [GstType, setGstType] = useState("");
  const [afterTollParking, setAfterTollParking] = useState(0);
  const [initValues, setInitValues] = useState({ date: moment() });
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
  const { list: localProforma } = useSelector((state) => state.localProforma);

  // Constants
  const staffId = getStaffId();

  const totalCalculator = useCallback(() => {
    let totalAmount = 0;
    let sumBusQty = 0;

    performa?.forEach((booking) => {
      totalAmount += parseFloat(booking.Amt) || 0;
      sumBusQty += parseInt(booking.BusQty) || 0;
    });
    setTotal(totalAmount);
    setTotalBusQty(sumBusQty);
    calculateAfterTollParking(totalAmount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const calculateAfterGST = useCallback(
    (amount) => {
      const gType = form.getFieldValue("GSTType");

      if (gType === 'IGST') {
        const igst = parseFloat(form.getFieldValue("IGST")) || 0;
        const igstAmount = (amount * igst) / 100;
        form.setFieldsValue({
          IGSTamt: igstAmount,
          SGSTamt: 0,
          CGSTamt: 0
        });
        setIGSTamt(igstAmount);
        setSGSTamt(0);
        setCGSTamt(0);
        const totalWithGST = amount + igstAmount;
        setNetAmount(Math.ceil(totalWithGST));
      } else {
        // Default to CGST/SGST or if unspecified
        const sgst = parseFloat(form.getFieldValue("SGST")) || 0;
        const cgst = parseFloat(form.getFieldValue("CGST")) || 0;
        const sgstAmount = (amount * sgst) / 100;
        const cgstAmount = (amount * cgst) / 100;

        form.setFieldsValue({
          SGSTamt: sgstAmount,
          CGSTamt: cgstAmount,
          IGSTamt: 0
        });

        setSGSTamt(sgstAmount);
        setCGSTamt(cgstAmount);
        setIGSTamt(0);

        const totalGST = sgstAmount + cgstAmount;
        const totalWithGST = amount + totalGST;
        setNetAmount(Math.ceil(totalWithGST));
      }
    },
    [form]
  );

  const calculateAfterTollParking = (totalAmount) => {
    const tollParking = parseFloat(form.getFieldValue("tollParking")) || 0;
    const totalWithTollParking = totalAmount + tollParking;
    setAfterTollParking(totalWithTollParking);
    calculateAfterGST(totalWithTollParking);
  };


  const handleIncludepermit = (value) => {
    // Logic if needed
  };

  // Watchers for immediate calculation updates
  const tollParkingVal = Form.useWatch('tollParking', form);
  const sgstVal = Form.useWatch('SGST', form);
  const cgstVal = Form.useWatch('CGST', form);
  const igstVal = Form.useWatch('IGST', form);
  const gstTypeVal = Form.useWatch('GSTType', form);


  useEffect(() => {
    if (total > 0 || tollParkingVal >= 0) {
      calculateAfterTollParking(total);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total, tollParkingVal, sgstVal, cgstVal, igstVal, gstTypeVal]);


  const handlePartySelect = (party_Id) => {
    const selectedParty = partyList?.find((party) => party.id === party_Id);

    if (selectedParty) {
      const { partyName, mobileNo, partyAddr, gstNo, ReferredBy } = selectedParty;
      // Using setFieldsValue instead of setInitValues to update form dynamically
      form.setFieldsValue({
        PartyID: party_Id,
        ContactPersonName: partyName, // Mapping cpName to ContactPersonName based on typical use, adjust if needed
        ContactPersonNo: mobileNo,
        address: partyAddr,
        GSTNO: gstNo,
        ReferredBy: ReferredBy,
      });
    }
  };

  const staticBookingData = {
    SlNo: 2,
    BookingID: bi.join(","),
    Rate: 100.0,
    Amt: 1000.0,
  };


  async function onFormSubmit(values) {
    try {
      setLoader(true);
      const data = {
        PartyID: values.PartyID,
        BookingDate: values.date ? values.date.format("YYYY-MM-DD") : null,
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
        Remarks: values.Remarks,
        PermitReq: values.PermitReq,
        GstType: values.GSTType,
        tollParking: values.tollParking,
        CGSTPer: values.CGST,
        CGSTAmt: CGSTamt,
        SGSTPer: values.SGST,
        SGSTAmt: SGSTamt,
        IGSTPer: values.IGST,
        IGSTAmt: IGSTamt,
        GrossAmount: afterTollParking,
        RoundOff: (netAmount - (afterTollParking + SGSTamt + CGSTamt + IGSTamt)).toFixed(2),
        netAmount: netAmount,
        RefInvoiceNo: values.RefInvoiceNo,
        localProformaList: JSON.stringify(staticBookingData),
      };

      if (bookingArray.length >= 0) {
        const resp = await axios.post(
          `${import.meta.env.VITE_APP_API}/invoiceentry`,
          data
        );
        if (resp.data.status == 1) {
          toast.success("Invoice Entry Created successfully.");
          navigate("/admin/invoiceentry");
        } else if (resp.data.status == 3) {
          toast.error("Invoice No Already Used.");
        } else {
          toast.error("Failed to create invoice.");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Error submitting invoice.");
    } finally {
      setLoader(false);
    }
  }

  const onBookingClose = (payload) => {
    performa = payload;
    if (payload.length) {
      setBookingArray(payload);
    }
    bi = [];
    c = 0;
    for (let i = 0; i < performa.length; i++) {
      // Avoid duplicates if needed, logic taken from original
      bi.push(performa[i].BookingID);
      c++;
    }
    totalCalculator();
  };

  useEffect(() => {
    totalCalculator();
  }, [totalCalculator]);


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
        name="dynamic_form_nest_item"
        onFinish={onFormSubmit}
        onFinishFailed={() => setLoader(false)}
        size="large"
        autoComplete="off"
        layout="vertical"
        initialValues={initValues}
      >
        <div className="p-4">
          {/* Header Section */}
          <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between px-6 py-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div style={{
                background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
                padding: '12px',
                borderRadius: '16px',
                boxShadow: '0 4px 12px rgba(8, 145, 178, 0.2)'
              }}>
                <FileTextOutlined className="text-white text-2xl" />
              </div>
              <div>
                <Title level={4} style={{ margin: 0, color: '#0f172a', fontWeight: 700 }}>Add New Invoice</Title>
                <Text className="text-slate-500 text-xs">Create a new invoice entry for the system.</Text>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                size="large"
                onClick={() => navigate("/admin/invoiceentry")}
                className="rounded-xl hover:bg-slate-50 border-slate-200 text-slate-600 font-medium"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loader}
                size="large"
                style={{ background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)', border: 'none' }}
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
                      rules={[{ required: true, message: "Please Select Company!" }]}
                    >
                      <Select
                        showSearch
                        optionFilterProp="children"
                        onClick={handleLoadCompany}
                        placeholder="Select company"
                        className="w-full rounded-lg"
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
                      rules={[{ required: true, message: "Please provide Invoice No!" }]}
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
                      rules={[{ required: true, message: "Please Select Party!" }]}
                    >
                      <Select
                        showSearch
                        onSelect={handlePartySelect}
                        onClick={handleLoadParty}
                        placeholder="Select party"
                        optionFilterProp="children"
                        className="rounded-lg"
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
                    <Form.Item
                      label="Date"
                      name="date"
                    >
                      <DatePicker
                        format={"DD/MM/YYYY"}
                        className="w-full rounded-lg"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Contact Person Name"
                      name="ContactPersonName"
                    >
                      <Input placeholder="Enter contact Person Name" prefix={<UserOutlined className="text-slate-400" />} className="rounded-lg" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Contact Person No"
                      name="ContactPersonNo"
                    >
                      <Input type="number" placeholder="Enter Number" className="rounded-lg" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  label="Party Address"
                  name="address"
                  rules={[{ required: true, message: "Please provide Address!" }]}
                >
                  <TextArea rows={3} placeholder="Enter Party address" className="rounded-lg" />
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
                    <Form.Item
                      label="GST Type"
                      name="GSTType"
                      rules={[{ required: true, message: "Please select GST Type!" }]}
                    >
                      <Select
                        placeholder="Select GST Type"
                        onChange={(value) => setGstType(value)}
                        className="rounded-lg"
                      >
                        <Select.Option value="CGST">CGST</Select.Option>
                        <Select.Option value="IGST">IGST</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Party GST NO"
                      name="GSTNO"
                    >
                      <Input placeholder="Enter Party GST NO" className="rounded-lg" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Permit Required"
                      name="PermitReq"
                    >
                      <Select
                        onChange={handleIncludepermit}
                        placeholder="Permit Required?"
                        className="rounded-lg"
                      >
                        <Select.Option value="Yes">Yes</Select.Option>
                        <Select.Option value="No">No</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Remarks"
                      name="Remarks"
                    >
                      <Input placeholder="Remarks" className="rounded-lg" />
                    </Form.Item>
                  </Col>
                </Row>
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

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Toll & Parking:</span>
                    <Form.Item name="tollParking" noStyle>
                      <InputNumber
                        className="w-32 rounded-lg"
                        formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ', ')}
                        parser={value => value.replace(/\₹\s?|(,*)/g, '')}
                        placeholder="0"
                      />
                    </Form.Item>
                  </div>

                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <Text strong className="text-slate-700">Gross Amount</Text>
                    <Text strong className="text-slate-900 text-lg">₹{afterTollParking.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
                  </div>

                  <Divider className="my-4" />

                  {/* GST Calculations */}
                  {(form.getFieldValue("GSTType") || GstType) === "CGST" && (
                    <>
                      <Row gutter={8} align="bottom" className="mb-2">
                        <Col span={10}>
                          <Form.Item name="SGST" label="SGST (%)" className="mb-0" rules={[{ required: true }]}>
                            <InputNumber className="w-full rounded-lg" suffix="%" />
                          </Form.Item>
                        </Col>
                        <Col span={14}>
                          <Form.Item name="SGSTamt" label="Amount" className="mb-0">
                            <InputNumber className="w-full rounded-lg" disabled prefix="₹" />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={8} align="bottom">
                        <Col span={10}>
                          <Form.Item name="CGST" label="CGST (%)" className="mb-0" rules={[{ required: true }]}>
                            <InputNumber className="w-full rounded-lg" suffix="%" />
                          </Form.Item>
                        </Col>
                        <Col span={14}>
                          <Form.Item name="CGSTamt" label="Amount" className="mb-0">
                            <InputNumber className="w-full rounded-lg" disabled prefix="₹" />
                          </Form.Item>
                        </Col>
                      </Row>
                    </>
                  )}

                  {(form.getFieldValue("GSTType") || GstType) === "IGST" && (
                    <Row gutter={8} align="bottom">
                      <Col span={10}>
                        <Form.Item name="IGST" label="IGST (%)" className="mb-0" rules={[{ required: true }]}>
                          <InputNumber className="w-full rounded-lg" suffix="%" />
                        </Form.Item>
                      </Col>
                      <Col span={14}>
                        <Form.Item name="IGSTamt" label="Amount" className="mb-0">
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

          {/* Invoice Items Section */}
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
                partyId={form.getFieldValue("PartyID")}
              />
            </Card>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default AddInvoice;
