import {
    Button,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Select,
    Card,
    Row,
    Col,
    Typography,
    Divider,
} from "antd";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadPartyPaginated } from "../../redux/rtk/features/party/partySlice";
import { loadAllCompany } from "../../redux/rtk/features/company/comapnySlice";
import { FileTextOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { addMonthlyInvoice, updateMonthlyInvoice, loadSingleMonthlyInvoice, clearMonthlyInvoice } from "../../redux/rtk/features/monthlyInvoice/monthlyInvoiceSlice";
import TextArea from "antd/es/input/TextArea";
import CreateMonthlyInvoiceList from "./CreateMonthlyInvoiceList";
import { loadAllBusCategory } from "../../redux/rtk/features/busCategory/busCategorySlice";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const AddMonthlyInvoice = ({ repeat = false }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [bookingArray, setBookingArray] = useState([]);
    const [lastLoadedId, setLastLoadedId] = useState(null);
    const [loader, setLoader] = useState(false);
    const [netAmount, setNetAmount] = useState(0);
    const [total, setTotal] = useState(0);
    const [totalBusQty, setTotalBusQty] = useState(0);

    const [afterTollParking, setAfterTollParking] = useState(0);
    const [initValues, setInitValues] = useState({ date: dayjs(), GstType: "CGST" });
    const [SGSTamt, setSGSTamt] = useState(0);
    const [CGSTamt, setCGSTamt] = useState(0);
    const [IGSTamt, setIGSTamt] = useState(0);

    const dispatch = useDispatch();
    const [form] = Form.useForm();

    const { list: partyList } = useSelector((state) => state.party);
    const { list: companyList } = useSelector((state) => state.companies);
    const { list: busCategoryList } = useSelector((state) => state.busCategories);
    const { monthlyInvoice } = useSelector((state) => state.monthlyInvoices);

    const [GstType, setGstType] = useState("CGST");

    useEffect(() => {
        dispatch(loadPartyPaginated({ page: 1, count: 10000, status: true }));
        dispatch(loadAllCompany({ page: 1, count: 10000, status: true }));

        if (!busCategoryList || busCategoryList.length === 0) {
            dispatch(loadAllBusCategory({ page: 1, count: 10000, status: "t" }));
        }

        setBookingArray([]);
        setLastLoadedId(null);
        if (id && id !== "new") {
            dispatch(loadSingleMonthlyInvoice({ id }));
        } else {
            dispatch(clearMonthlyInvoice());
            form.resetFields();
        }
    }, [dispatch, id, form]); // Added form dependency

    useEffect(() => {
        if (monthlyInvoice && id && id !== "new") {
            // Only load initial values if the monthlyInvoice ID matches the URL ID
            // and we haven't already loaded THIS specific invoice into state
            if (String(monthlyInvoice.ID) === String(id) && lastLoadedId !== id) {
                const values = {
                    ...monthlyInvoice,
                    date: repeat ? null : (monthlyInvoice.invoiceDate ? dayjs(monthlyInvoice.invoiceDate) : dayjs()),
                    company_id: monthlyInvoice.companyname,
                    PartyID: Number(monthlyInvoice.partyName),
                    CGST: monthlyInvoice.CGSTPer,
                    SGST: monthlyInvoice.SGSTPer,
                    IGST: monthlyInvoice.IGSTPer,
                    advAmount: monthlyInvoice.advAmount,
                    advancePayment: monthlyInvoice.advAmount,
                    GstType: monthlyInvoice.GstType || "CGST",
                    tollParking: monthlyInvoice.tollParkingAmt,
                    RefInvoiceNo: repeat ? "" : monthlyInvoice.RefInvoiceNo,
                    ContactPersonName: monthlyInvoice.contactPersonName,
                    ContactPersonNo: monthlyInvoice.contactPersonNo,
                    address: monthlyInvoice.partyAddr,
                    GSTNO: monthlyInvoice.GSTNo,
                    extra: monthlyInvoice.extradesc,
                    invoiceNo: repeat ? "" : monthlyInvoice.invoiceNo
                }
                setInitValues(values);
                form.setFieldsValue(values);


                let parsedList = [];
                if (monthlyInvoice.LocalProformaList) {
                    try {
                        const rawList = typeof monthlyInvoice.LocalProformaList === "string"
                            ? JSON.parse(monthlyInvoice.LocalProformaList)
                            : monthlyInvoice.LocalProformaList;

                        // Normalize field names from DB (Uppercase) to Frontend (camelCase)
                        parsedList = Array.isArray(rawList) ? rawList.map((item, idx) => ({
                            SLNO: item.SLNO || item.SlNo || 0,
                            busTypeId: Number(item.BusTypeID || item.busTypeId || item.BusTypeId),
                            busCategory: item.BusCategoryName || item.busCategory || "",
                            sittingCapacity: item.SittingCapacity || item.sittingCapacity || "",
                            tripDescription: item.TripDesc || item.tripDescription || "",
                            routeNo: item.RouteNo || item.routeNo || null,
                            billMonth: repeat ? null : (item.BillMonth || item.billMonth || item.Billmonth || null),
                            busQty: item.BusQty || item.busQty || 0,
                            rate: item.Rate || item.rate || 0,
                            amount: item.Amt || item.amount || 0,
                            key: item.SLNO || item.SlNo || `db-${idx}-${Date.now()}`,
                            isNew: false
                        })) : [];
                    } catch (e) {
                        console.error("Error parsing LocalProformaList", e);
                        parsedList = [];
                    }
                }
                setBookingArray(parsedList);
                setGstType(monthlyInvoice.GstType || "CGST");
                setLastLoadedId(id);
            }
        }
    }, [monthlyInvoice, id, form, lastLoadedId]);


    const totalCalculator = useCallback(() => {
        let totalAmount = 0;
        let sumBusQty = 0;
        if (Array.isArray(bookingArray)) {
            bookingArray.forEach((booking) => {
                totalAmount += parseFloat(booking.amount) || 0;
                sumBusQty += parseFloat(booking.busQty) || 0;
            });
        }
        setTotal(totalAmount);
        setTotalBusQty(sumBusQty);
        calculateAfterTollParking(totalAmount);
    }, [bookingArray]); // Dependency included

    const calculateAfterGST = useCallback(
        (amount) => {
            const sgst = parseFloat(form.getFieldValue("SGST")) || 0;
            const cgst = parseFloat(form.getFieldValue("CGST")) || 0;
            const igst = parseFloat(form.getFieldValue("IGST")) || 0;

            let sgstAmount = 0, cgstAmount = 0, igstAmount = 0;

            if (GstType === 'CGST') {
                sgstAmount = (amount * sgst) / 100;
                cgstAmount = (amount * cgst) / 100;
                form.setFieldsValue({ SGSTamt: sgstAmount, CGSTamt: cgstAmount });
                setSGSTamt(sgstAmount);
                setCGSTamt(cgstAmount);
            } else {
                igstAmount = (amount * igst) / 100;
                form.setFieldsValue({ IGSTamt: igstAmount });
                setIGSTamt(igstAmount);
            }

            const totalGST = sgstAmount + cgstAmount + igstAmount;
            const totalWithGST = amount + totalGST;
            setNetAmount(Math.ceil(totalWithGST));
        },
        [form, GstType]
    );

    const calculateAfterTollParking = (totalAmount) => {
        const tollParking = parseFloat(form.getFieldValue("tollParking")) || 0;
        const totalWithTollParking = totalAmount + tollParking;
        setAfterTollParking(totalWithTollParking);
        calculateAfterGST(totalWithTollParking);
    };

    useEffect(() => {
        calculateAfterGST(afterTollParking);
    }, [
        form, // Added form
        afterTollParking,
        calculateAfterGST,
        GstType
    ]);

    const handleTollParkingChange = () => {
        calculateAfterTollParking(total);
    };

    useEffect(() => {
        totalCalculator();
    }, [bookingArray, totalCalculator]);


    const handlePartySelect = (partyId) => {
        const selectedParty = partyList?.find((party) => party.id === partyId);

        if (selectedParty) {
            const { partyAddr, gstNo, referredBy, cpName, cpNumber } = selectedParty;
            const newValues = {
                PartyID: partyId,
                ContactPersonName: cpName,
                ContactPersonNo: cpNumber,
                address: partyAddr,
                GSTNO: gstNo,
                ReferredBy: referredBy,
            };
            form.setFieldsValue(newValues);
        }
    };

    const onFormSubmit = async (values) => {
        setLoader(true);
        try {
            const formattedBookingArray = (Array.isArray(bookingArray) ? bookingArray : []).map((booking) => ({
                SLNO: (booking.isNew || (booking.SLNO && booking.SLNO > 2147483647)) ? 0 : booking.SLNO,
                BusTypeID: booking.busTypeId,
                BusCategoryName: booking.busCategory,
                SittingCapacity: booking.sittingCapacity,
                tripDescription: booking.tripDescription,
                RouteNo: booking.routeNo || null,
                BillMonth: booking.billMonth ? (dayjs.isDayjs(booking.billMonth) ? booking.billMonth.format("YYYY-MM-DD") : booking.billMonth) : null,
                busQty: booking.busQty,
                rate: booking.rate,
                amount: booking.amount,
            }));

            const selectedCompany = companyList?.find((c) => c.Name === values.company_id);

            const payload = {
                ...values,
                ID: (id === "new" || repeat) ? 0 : id,
                invoiceDate: values.date.format("YYYY-MM-DD"),
                invoiceNo: values.RefInvoiceNo,

                companyname: values.company_id,
                CompanyID: selectedCompany?.Id,

                address: values.address,

                busQtyRequired: totalBusQty,

                advancePayment: values.advAmount,

                CGSTPer: values.CGST,
                SGSTPer: values.SGST,
                IGSTPer: values.IGST,

                CGSTAmt: values.CGSTamt,
                SGSTAmt: values.SGSTamt,
                IGSTAmt: values.IGSTamt,

                netAmount: netAmount,
                RoundOff: afterTollParking,
                GrossAmount: afterTollParking,

                localProformaList: JSON.stringify(formattedBookingArray),
            };


            let resp;
            if (id === "new" || repeat) {
                payload.ID = 0;
                resp = await dispatch(addMonthlyInvoice(payload));
            } else {
                resp = await dispatch(updateMonthlyInvoice(payload));
            }


            if (resp.payload && (resp.payload.status === 1 || resp.payload.status === 200 || resp.payload.success || resp.payload.message === "Success" || resp.payload.message === "success")) {
                navigate("/admin/monthly-invoice");
            }

        } catch (error) {
            console.error(error);
            toast.error("Error submitting form");
        } finally {
            setLoader(false);
        }
    };

    const onBookingClose = (payload) => {
        setBookingArray(Array.isArray(payload) ? payload : []);
    };

    const sortedPartyList = Array.isArray(partyList)
        ? [...partyList].sort((a, b) => a.partyName.localeCompare(b.partyName))
        : [];

    return (
        <div className="bg-slate-50 min-h-screen">
            <Form
                form={form}
                layout="vertical"
                onFinish={onFormSubmit}
                initialValues={initValues}
                size="large"
            >
                <div className="p-4">
                    {/* Header */}
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
                                <Title level={4} style={{ margin: 0, color: '#0f172a', fontWeight: 700 }}>{(id === "new" || repeat) ? "Create" : "Update"} Monthly Invoice</Title>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Button onClick={() => navigate("/admin/monthly-invoice")}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit" loading={loader}>
                                {(id === "new" || repeat) ? "Create" : "Update"}
                            </Button>
                        </div>
                    </div>

                    <Row gutter={[16, 16]}>
                        <Col xs={24} lg={16}>
                            <Card title="Basic Information" className="mb-6 rounded-xl">
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item label="Company" name="company_id" rules={[{ required: true }]}>
                                            <Select placeholder="Select company" showSearch optionFilterProp="children">
                                                {companyList?.map(c => <Select.Option key={c.Id} value={c.Name}>{c.Name}</Select.Option>)}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Invoice No (Ref)" name="RefInvoiceNo" rules={[{ required: true }]}>
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item label="Party" name="PartyID" rules={[{ required: true }]}>
                                            <Select placeholder="Select party" showSearch optionFilterProp="children" onSelect={handlePartySelect}>
                                                {sortedPartyList?.map(p => <Select.Option key={p.id} value={p.id}>{p.partyName}</Select.Option>)}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Date" name="date" rules={[{ required: true }]}>
                                            <DatePicker className="w-full" format="DD-MM-YYYY" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item label="Contact Person" name="ContactPersonName">
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Contact Number" name="ContactPersonNo">
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Form.Item label="Address" name="address">
                                    <TextArea rows={2} />
                                </Form.Item>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item label="GST Type" name="GstType">
                                            <Select onChange={setGstType}>
                                                <Select.Option value="CGST">CGST (Local)</Select.Option>
                                                <Select.Option value="IGST">IGST (Interstate)</Select.Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Party GST" name="GSTNO">
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Form.Item label="Remarks" name="Remarks">
                                    <Input />
                                </Form.Item>
                            </Card>
                        </Col>

                        <Col xs={24} lg={8}>
                            {/* Summary */}
                            <Card title="Payment Details" className="rounded-xl">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-slate-600">
                                        <Text>Subtotal</Text>
                                        <Text strong>₹{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
                                    </div>

                                    <Divider className="my-2" />

                                    <Form.Item label="Extra Desc" name="extra" className="mb-2">
                                        <Input />
                                    </Form.Item>

                                    <Form.Item label="Toll & Parking" name="tollParking" className="mb-4">
                                        <InputNumber className="w-full" onChange={handleTollParkingChange} />
                                    </Form.Item>

                                    <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                                        <Text strong className="text-slate-700">Gross Amount</Text>
                                        <Text strong className="text-slate-900 text-lg">₹{afterTollParking.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
                                    </div>

                                    <Divider className="my-4" />
                                </div>

                                {GstType === "CGST" ? (
                                    <>
                                        <Row gutter={8}>
                                            <Col span={10}><Form.Item label="CGST %" name="CGST"><InputNumber className="w-full" onChange={() => calculateAfterGST(afterTollParking)} /></Form.Item></Col>
                                            <Col span={14}><Form.Item label="Amt" name="CGSTamt"><InputNumber disabled className="w-full" /></Form.Item></Col>
                                        </Row>
                                        <Row gutter={8}>
                                            <Col span={10}><Form.Item label="SGST %" name="SGST"><InputNumber className="w-full" onChange={() => calculateAfterGST(afterTollParking)} /></Form.Item></Col>
                                            <Col span={14}><Form.Item label="Amt" name="SGSTamt"><InputNumber disabled className="w-full" /></Form.Item></Col>
                                        </Row>
                                    </>
                                ) : (
                                    <Row gutter={8}>
                                        <Col span={10}><Form.Item label="IGST %" name="IGST"><InputNumber className="w-full" onChange={() => calculateAfterGST(afterTollParking)} /></Form.Item></Col>
                                        <Col span={14}><Form.Item label="Amt" name="IGSTamt"><InputNumber disabled className="w-full" /></Form.Item></Col>
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

                                <Form.Item label="Advance" name="advAmount">
                                    <InputNumber className="w-full" />
                                </Form.Item>
                            </Card>
                        </Col>
                    </Row>

                    <div className="mt-6">
                        <CreateMonthlyInvoiceList
                            list={bookingArray}
                            onBookingClose={onBookingClose}
                        />
                    </div>

                </div>
            </Form>
        </div>
    );
};

export default AddMonthlyInvoice;
