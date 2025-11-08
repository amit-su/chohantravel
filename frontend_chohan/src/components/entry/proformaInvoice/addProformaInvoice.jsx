import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
} from "antd";

import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import getStaffId from "../../../utils/getStaffId";
import { loadPartyPaginated } from "../../../redux/rtk/features/party/partySlice";
import { loadAllCompany } from "../../../redux/rtk/features/company/comapnySlice";
import CreateProformaInvoice from "./CreateProformaInvoice";
import { PercentageOutlined } from "@ant-design/icons";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";
import { addproformaInvoice } from "../../../redux/rtk/features/proformaInvoice/proformaInvoiceSlice";
import TextArea from "antd/es/input/TextArea";
import FormItem from "antd/es/form/FormItem";
import InvoiceAdd from "./CreateProformaInvoice";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import localProformaSlice from "../../../redux/rtk/features/localProformaInvoice/localProformaSlice";
import AddParty from "../../Party/addParty";
import CreateDrawer from "../../CommonUi/CreateDrawer";

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
    console.log("Form value data", values, bookingArray[0].ReportDate);
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
        extra: values.extra,
      };

      if (bookingArray.length > 0) {
        const resp = await dispatch(addproformaInvoice(data));
        console.log("res", resp);
        if (resp.payload.status == 1) {
          setLoader(false);
          toast.success("Proforma Invoice Entry Sucessfull.");
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
    console.log(payload, "86");
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
                required: true,
                message: "Please provide input !",
              },
            ]}
          >
            <Input
              className=""
              placeholder="Enter Invoice No"
              type="text"
              style={{ marginBottom: "2px" }}
            />
          </Form.Item>

          <Form.Item
            label="Party"
            name="PartyID"
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
                showSearch
                onSelect={handlePartySelect}
                onClick={handleLoadParty}
                placeholder="Select party"
                style={{ flex: 1 }}
                optionFilterProp="children" // Search will filter based on the content of the options
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
                    value={IGSTamt.toFixed(2)} // Display IGST amount here
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
          <Form.Item style={{ marginTop: "10px" }} className="w-full">
            <Button
              block
              type="primary"
              htmlType="submit"
              loading={loader}
              onClick={() => setLoader(true)}
            >
              Create Invoice
            </Button>
          </Form.Item>
        </div>
      </div>
    </Form>
  );
};

export default AddProformaInvoice;
