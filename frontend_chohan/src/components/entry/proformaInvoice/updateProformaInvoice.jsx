import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
} from "antd";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addproformaInvoice } from "../../../redux/rtk/features/proformaInvoice/proformaInvoiceSlice";

import getStaffId from "../../../utils/getStaffId";
import { loadPartyPaginated } from "../../../redux/rtk/features/party/partySlice";
import { loadAllCompany } from "../../../redux/rtk/features/company/comapnySlice";

import CreateProformaInvoice from "./CreateProformaInvoice";
import { PercentageOutlined } from "@ant-design/icons";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";
import FormItem from "antd/es/form/FormItem";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import InvoiceAdd from "./CreateProformaInvoice";
import { toast } from "react-toastify";
import dayjs from "dayjs";

import {
  updateproformaInvoice,
  loadSingleproformaInvoice,
} from "../../../redux/rtk/features/proformaInvoice/proformaInvoiceSlice";
import {
  addLocalProforma,
  updateLocalProforma,
  clearLocalProforma,
} from "../../../redux/rtk/features/localProformaInvoice/localProformaSlice";
let performa = [];
let listvalue = [];

const UpdateProformaInvoice = () => {
  const { id } = useParams();
  console.log(id, "jsdj");
  const [bookingArray, setBookingArray] = useState([]);
  const [initValues, setInitValues] = useState({ date: moment() });
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [GstType, setGstType] = useState("");
  //----------API----------//
  const [list2, setList] = useState([]);

  const [loading2, setLoading2] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_APP_API;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/proformaInvoice/${id}`);

        setList(response.data.data);
        listvalue = response.data.data;
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading2(false);
      }
    };

    // Call the function
    fetchData();
  }, [bookingArray, apiUrl]);
  //-----------END----------------//
  console.log(list2, "787686");

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
    dispatch(loadPartyPaginated({ page: 1, count: 10000, status: true }));
  };
  const { list: companyList } = useSelector((state) => state.companies);

  const handleLoadCompany = () => {
    dispatch(loadAllCompany({ page: 1, count: 10000, status: true }));
  };

  const { list: partyList } = useSelector((state) => state.party);
  const { list: localProforma } = useSelector((state) => state.localProforma);
  const staffId = getStaffId();
  const [userId, setUserId] = useState(staffId);
  const [SGSTamt, setSGSTamt] = useState(0);
  const [CGSTamt, setCGSTamt] = useState(0);
  const [IGSTamt, setIGSTamt] = useState(0);
  const onBookingClose = (payload) => {
    console.log("onBookingClose");
    performa = payload;

    if (payload.length) {
      setBookingArray(payload);
      //list=payload
    }
    //
  };

  const totalCalculator = () => {
    let totalAmount = 0;
    let sumBusQty = 0;
    performa?.forEach((booking) => {
      totalAmount += parseFloat(booking.amount) || 0;
      sumBusQty += parseInt(booking.busQty) || 0;
    });
    setTotal(totalAmount);
    handleIGSTChange(totalAmount);
    setTotalBusQty(totalBusQty);
    console.log(totalAmount, "ytyr");
    calculateAfterTollParking(totalAmount);
    // calculateAfterGST(totalWithTollParking);
  };

  const calculateAfterTollParking = async (totalAmount) => {
    const tollParking = form.getFieldValue("tollParking") || 0;
    const totalWithTollParking = totalAmount + parseFloat(tollParking);
    await setAfterTollParking(totalWithTollParking);
    calculateAfterGST(totalWithTollParking);
  };

  const calculateAfterGST = (amount) => {
    const sgst = form.getFieldValue("SGST") || 0;
    const cgst = form.getFieldValue("CGST") || 0;
    const igst = form.getFieldValue("IGST") || 0;

    const advance = form.getFieldValue("AdvAmtPer") || 0;

    const sgstAmount = (amount * parseFloat(sgst)) / 100;
    const cgstAmount = (amount * parseFloat(cgst)) / 100;

    const igstAmount = (amount * parseFloat(igst)) / 100;

    const AdvanceAmount =
      ((amount + sgstAmount + cgstAmount + igstAmount) * parseFloat(advance)) /
      100;

    const totalGST = sgstAmount + cgstAmount + igstAmount;
    const totalWithGST = amount + totalGST;
    form.setFieldsValue({
      SGSTamt: sgstAmount,
      CGSTamt: cgstAmount,
      advAmount: AdvanceAmount,
      IGSTamt: igstAmount,
    });
    setAfterGST(totalWithGST);
    setNetAmount(Math.ceil(totalWithGST));
  };

  const handleTollParkingChange = (value) => {
    calculateAfterTollParking(total);
  };

  const handleSGSTChange = (value) => {
    calculateAfterGST(afterTollParking);
  };

  const handleCGSTChange = (value) => {
    calculateAfterGST(afterTollParking);
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

  const [confirmBookings, setConfirmBookings] = useState(false);
  const handleConfirm = () => {
    setConfirmBookings(true);
  };

  const handlePartySelect = (partyId) => {
    const selectedParty = partyList?.find((party) => party.id === partyId);

    if (selectedParty) {
      const {
        partyName,
        mobileNo,
        partyAddr,
        gstNo,
        ReferredBy,
        SGSTPer,
        CGSTPer,
      } = selectedParty;
      console.log("selectedParty", selectedParty);
      setInitValues({
        PartyID: partyId,
        company_id: companyname,
        ContactPersonName: partyName,
        ContactPersonNo: mobileNo,
        address: partyAddr,
        GSTNO: gstNo,
        ReferredBy: ReferredBy,
        Remarks: Remarks,
        SGST: SGSTPer,
        CGST: CGSTPer,
        advAmount: advAmount,
        AdvAmtPer: AdvAmtPer,
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

        //
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
      console.log(localProforma, "lc");
      if (bookingArray.length > 0 && confirmBookings === true) {
        console.log("you are in");

        const resp = await dispatch(addproformaInvoice(data));
        console.log("Res", resp);
        console.log(resp.payload.message, "ef");
        setConfirmBookings(false);

        if (resp.payload.status == 1) {
          setLoader(false);
          toast.success("Proforma Invoice Update Successfull.");
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
    form.setFieldsValue(initValues);
    handleLoadParty();
    totalCalculator();
  }, [initValues, form, localProforma, performa, bookingArray]);

  const handleAdvancePaymentChange = (value) => {
    // Extract the percentage from advance payment and calculate the amount to subtract from total
    const percent = parseFloat(value);
    const amountToSubtract = (percent / 100) * total || 0;
    const amountToSubtract1 = (percent / 100) * netAmount || 0;

    setAdvancePayment(amountToSubtract);
    form.setFieldsValue({ advAmount: amountToSubtract1.toFixed(2) });
  };
  const handleIncludepermit = (value) => {
    // setIsIncludeGST(value);
  };

  useEffect(() => {
    const res = dispatch(loadSingleproformaInvoice({ id }));
  }, []);
  const { proformaInvoice } = useSelector((state) => state.proformaInvoices);
  console.log("single proforma INv", proformaInvoice);

  useEffect(() => {
    // Parse the LocalBookingList string into an array of objects
    if (proformaInvoice && proformaInvoice?.LocalProformaList) {
      const parsedList = JSON.parse(
        proformaInvoice && proformaInvoice?.LocalProformaList
      );
      console.log("parsedList", parsedList);
      setBookingArray(parsedList);

      dispatch(clearLocalProforma());
      if (parsedList && parsedList.length > 0) {
        parsedList.forEach((item) => {
          dispatch(addLocalProforma(item));
        });
      }
    }
  }, [proformaInvoice, dispatch]);
  useEffect(() => {
    if (proformaInvoice) {
      const entry = proformaInvoice;

      form.setFieldsValue({
        Date: moment(entry.invoiceDate),
        GSTNO: entry.GSTNo,
        company_id: entry.companyname,
        ContactPersonName: entry.contactPersonName,
        PartyID: parseInt(entry.partyName),
        includeGST: entry.GSTInclude,
        ContactPersonNo: entry.contactPersonNo,
        address: entry.partyAddr,
        email: entry.Email,
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
      console.log(
        entry.advAmount,
        "989899",
        (parseInt(entry.advAmount) / 100) * proformaInvoice.roundOff,
        proformaInvoice.roundOff
      );
      handlePartySelect(parseInt(entry.PartyID), parseInt(entry.companyname));
      setAdvancePayment(
        (parseInt(entry.advAmount) / 100) * proformaInvoice.roundOff
      );
      // setAfterTollParking(proformaInvoice?.grossAmount);
      // setNetAmount(proformaInvoice?.netAmount);
    }
  }, [proformaInvoice, form, localProforma, bookingArray, apiUrl, performa]);

  const sortedPartyList = Array.isArray(partyList)
    ? [...partyList].sort((a, b) => a.partyName.localeCompare(b.partyName))
    : [];

  return (
    <Form
      form={form}
      name="dynamic_form_nest_item"
      onFinish={onFormSubmit}
      onFinishFailed={() => {
        setLoader(false);
      }}
      size="medium"
      autoComplete="off"
      layout="vertical"
      initialValues={initValues}
    >
      <div className="flex gap-5 my-5 ml-4 ">
        <div className="w-1/2 ml-4 ">
          <div className="my-2 mb-4">
            {/* <h4>
              Proforma Invoice No : <strong>{id}</strong>{" "}
            </h4> */}
          </div>
          <div className="flex gap-5 mt-4">
            <Form.Item
              style={{ marginBottom: "10px" }}
              label="company"
              name="company_id"
              className="w-80"
              rules={[
                {
                  required: true,
                  message: "Please provide input !",
                },
              ]}
            >
              <Select
                // onSelect={handleCompanySelect}
                onClick={handleLoadCompany}
                placeholder="Select company"
                optionFilterProp="children" // Filters options based on the content of the children (party names)
                showSearch
              >
                {companyList?.map((company) => (
                  <Select.Option key={company.Id} value={company.Name}>
                    {company.Name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            className="w-80"
            label="Invoice No"
            name="RefInvoiceNo"
            rules={[
              {
                required: false,
                message: "Please provide input !",
              },
            ]}
          >
            <Input
              className="cursor-not-allowed"
              placeholder="Enter Invoice No"
              type="text"
              readOnly
            />
          </Form.Item>

          <div className="flex items-center gap-3">
            <Form.Item
              style={{ marginBottom: "10px" }}
              label="Party"
              name="PartyID"
              className="w-80"
              rules={[
                {
                  required: true,
                  message: "Please provide input!",
                },
              ]}
            >
              <Select
                showSearch
                onSelect={handlePartySelect}
                onClick={handleLoadParty}
                placeholder="Select party"
                optionFilterProp="children" // Search will filter based on the content of the options
              >
                {sortedPartyList?.map((party) => (
                  <Select.Option key={party.id} value={party.id}>
                    {party.partyName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            className="mb-2 w-80 pb-15"
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
            className="w-80"
            label="Contact Persion No"
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
              style={{ marginBottom: "10px" }}
            />
          </Form.Item>
          {/* <Form.Item
            className="w-80"
            label="Contact Person Name"
            name="ContactPersonName"
            rules={[
              {
                required: true,
                message: "Please provide input !",
              },
            ]}
          >
            <Input placeholder="Enter contact Person Name" />
          </Form.Item> */}
          <Form.Item
            style={{ width: "30rem" }}
            label="Party Address"
            name="address"
            rules={[
              {
                required: true,
                message: "Please provide input !",
              },
            ]}
          >
            <TextArea rows={4} placeholder="Enter Party address" />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: "10px" }}
            label="GST Type"
            name="GstType"
            className="w-80"
            rules={[
              {
                required: true,
                message: "Please select GST Type!",
              },
            ]}
          >
            <Select
              placeholder="Select GST Type"
              onChange={(value) => {
                setGstType(value);
              }}
            >
              <Select.Option value="CGST">CGST</Select.Option>
              <Select.Option value="IGST">IGST</Select.Option>
            </Select>
          </Form.Item>
        </div>

        <div className="float-right w-1/2">
          <Form.Item
            label="Date"
            className="mt-12 mb-2 w-80"
            name="date"
            rules={[
              {
                required: false,
                message: "Please input Date!",
              },
            ]}
          >
            <DatePicker
              style={{ marginBottom: "", width: "100%" }}
              label="date"
              format={"DD-MM-YYYY"}
              value={moment(initValues.date, "DD-MM-YYYY")}
            />
          </Form.Item>

          <Form.Item
            style={{ width: "30rem" }}
            label="Party GST NO"
            name="GSTNO"
          >
            <Input
              className=""
              placeholder="Enter Party GST NO"
              size={"small"}
              style={{ marginBottom: "10px" }}
            />
          </Form.Item>

          <Form.Item
            style={{ width: "30rem" }}
            label="Party Reference"
            name="ReferredBy"
          >
            <Input
              className=""
              placeholder="Enter Party Reference"
              size={"small"}
              style={{ marginBottom: "10px" }}
            />
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
          <Form.Item style={{ width: "30rem" }} label="Remarks" name="Remarks">
            <Input
              className=""
              placeholder="Remarks"
              size={"small"}
              style={{ marginBottom: "10px" }}
            />
          </Form.Item>
        </div>
      </div>

      <InvoiceAdd
        list={bookingArray}
        loading={false}
        onBookingClose={onBookingClose}
      />

      <div className="float-right w-1/2 mx-5">
        <div className="py-2">
          <div className="flex justify-between p-1">
            <strong>Total: </strong>
            <strong>{total.toFixed(2)} </strong>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="">Toll & Parking: </span>
            <Form.Item className="mb-0" name="extra">
              <Input className="w-40" size={"small"} placeholder="Add Extra" />
            </Form.Item>

            <Form.Item className="mb-0" name="tollParking">
              <InputNumber
                className="w-80"
                size={"small"}
                onChange={handleTollParkingChange}
                addonAfter="₹"
                placeholder="Enter Toll and Parking Cost"
              />
            </Form.Item>
          </div>
          <div className="flex items-center justify-between py-1 mb-1">
            <span>Gross Amount: </span>
            <span>{afterTollParking.toFixed(2)}</span>
          </div>
          {GstType === "CGST" && (
            <div className="flex items-center justify-between py-2">
              <span className="">SGST: </span>

              <Space.Compact className="w-80">
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: "Please provide input !",
                    },
                  ]}
                  className="mb-0"
                  name="SGST"
                >
                  <InputNumber
                    style={{
                      width: "100%",
                      marginRight: "5px",
                    }}
                    onChange={handleSGSTChange}
                    addonAfter={<PercentageOutlined />}
                  />
                </Form.Item>

                <FormItem name={"SGSTamt"}>
                  <InputNumber
                    style={{
                      width: "100%",
                    }}
                    disabled
                    value={SGSTamt.toFixed(2)} // Display SGST amount here
                    addonAfter="₹"
                  />
                </FormItem>
              </Space.Compact>
            </div>
          )}
          {GstType === "CGST" && (
            <div className="flex items-center justify-between py-2">
              <span className="">CGST: </span>

              <Space.Compact className="w-80">
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: "Please provide input !",
                    },
                  ]}
                  className="mb-0"
                  name="CGST"
                >
                  <InputNumber
                    style={{
                      width: "100%",
                      marginRight: "5px",
                    }}
                    onChange={handleCGSTChange}
                    addonAfter={<PercentageOutlined />}
                  />
                </Form.Item>
                <FormItem name={"CGSTamt"}>
                  <InputNumber
                    style={{
                      width: "100%",
                    }}
                    disabled
                    value={CGSTamt.toFixed(2)} // Display CGST amount here
                    addonAfter="₹"
                  />
                </FormItem>
              </Space.Compact>
            </div>
          )}
          {GstType === "IGST" && (
            <div className="flex items-center justify-between py-2">
              <span className="">IGST: </span>

              <Space.Compact className="w-80">
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: "Please provide input !",
                    },
                  ]}
                  className="mb-0"
                  name="IGST"
                >
                  <InputNumber
                    style={{
                      width: "100%",
                      marginRight: "5px",
                    }}
                    onChange={handleIGSTChange}
                    addonAfter={<PercentageOutlined />}
                  />
                </Form.Item>
                <FormItem name={"IGSTamt"}>
                  <InputNumber
                    style={{
                      width: "100%",
                    }}
                    disabled
                    value={IGSTamt.toFixed(2)} // Display CGST amount here
                    addonAfter="₹"
                  />
                </FormItem>
              </Space.Compact>
            </div>
          )}
          <div className="flex items-center justify-between py-1 mb-1">
            <span>Net Amount: </span>
            <span>{netAmount}</span>
          </div>

          {/* <div className="flex items-center justify-between py-2">
            <span className="">Advance Payment: </span>
            <Form.Item className="mb-0" name="advancePayment">
              <InputNumber
                placeholder="Enter Payment Percent %"
                className="w-80"
                style={{
                  // width: "100%",
                  marginRight: "5px",
                }}
                
                onChange={handleAdvancePaymentChange}
                addonAfter={<PercentageOutlined />}
              />
            </Form.Item>
            <div className="flex justify-between py-1 mx-0 mb-1">
            <span>{advancePayment.toFixed(2)}</span>
          </div>
          </div>
           */}
          <div className="flex items-center justify-between py-2">
            <span className="">Advance Payment: </span>

            <Space.Compact className="w-80">
              <Form.Item name="AdvAmtPer">
                <InputNumber
                  style={{
                    width: "100%",
                    marginRight: "5px",
                  }}
                  onChange={handleAdvancePaymentChange}
                  addonAfter={<PercentageOutlined />}
                />
              </Form.Item>
              <Form.Item name="advAmount">
                <InputNumber
                  style={{
                    width: "100%",
                  }}
                  value={advancePayment.toFixed(2)} // Display CGST amount here
                  addonAfter="₹"
                />
              </Form.Item>
            </Space.Compact>
          </div>
        </div>

        <div className="flex gap-2">
          <Form.Item style={{ marginTop: "15px" }} className="w-full">
            <Button
              block
              type="primary"
              htmlType="submit"
              loading={loader}
              onClick={handleConfirm}
            >
              Update Invoice
            </Button>
          </Form.Item>
        </div>
      </div>
    </Form>
  );
};

export default UpdateProformaInvoice;
