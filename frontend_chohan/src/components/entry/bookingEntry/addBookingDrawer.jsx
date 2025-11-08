import {
  Alert,
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  TimePicker,
  Typography,
} from "antd";
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addLocalBooking } from "../../../redux/rtk/features/localBusBooking/localBusBookingSlice";
import TextArea from "antd/es/input/TextArea";
import { loadAllBusCategory } from "../../../redux/rtk/features/busCategory/busCategorySlice";
import dayjs from "dayjs";
import { CheckBusAvalability } from "../../../redux/rtk/features/bookingEntry/bookingsEntrySlice";
import axios from "axios";
import { CiViewList } from "react-icons/ci";
import TableNoPagination from "../../CommonUi/TableNoPagination";
const AddBooking = ({ isIncludeGST, onClose }) => {
  const dispatch = useDispatch();
  var buscattpe = "";
  const { Title } = Typography;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [initValues, setInitValues] = useState({
    ReportDate: dayjs(),
    tripEndDate: dayjs(),
  });
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedTime1, setSelectedTime1] = useState("");

  const { stock, list: availableBusList } = useSelector(
    (state) => state.bookingEntry
  );

  const [fixedRate, setFixedRate] = useState(false);
  const [amount, setAmount] = useState(0);
  const handleRateType = (value) => {
    value == "FR" ? setFixedRate(true) : setFixedRate(false);
    calculateAmount(0, 0);
  };
  const handleLoadBus = () => {
    dispatch(loadAllBusCategory({ page: 1, count: 10000, status: true }));
  };
  //API CALL//
  const [list2, setList] = useState([]);

  const [loading2, setLoading2] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_APP_API;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/busCategory`);
        setList(response.data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading2(false);
      }
    };

    // Call the function
    fetchData();
  }, []);
  //END//
  const busCatList = list2;
  // const { list: busCatList } = useSelector((state) => state.busCategories);

  const handleBusAvailabilityCheck = async (values) => {
    const { busType, ReportDate, tripEndDate, busQty } = values;
    if (busType && ReportDate && tripEndDate && busQty) {
      try {
        const resp = dispatch(CheckBusAvalability(values));
      } catch (error) {
        console.error("Error checking bus availability:", error);
        setLoading(false);
      }
    }
  };
  const onFinish = async (values) => {
    console.log("value", values);
    try {
      const selectedBusTypeId = values?.busType;

      const selectedBusCategory = busCatList?.find(
        (busCategory) => busCategory.id === selectedBusTypeId
      );

      const busCategoryName = selectedBusCategory?.buscategory || "";

      values.busCategory = busCategoryName;
      values.BusTypeID = selectedBusTypeId;

      // Safely format selected dates
      // values.ReportDate = selectedDate?.isValid?.() ? selectedDate.format("DD-MM-YYYY") : "";

      // values.tripEndDate = selectedDate2?.isValid?.()
      //   ? selectedDate2.format("DD-MM-YYYY")
      //   : "";

      // values.reportTime = selectedTime?.format("hh:mm a") || "";
      // values.ReturnTime = selectedTime1?.format("hh:mm a") || "";

      setLoading(false);
      onClose(values);
    } catch (error) {
      console.error("Error on form submission:", error);
      setLoading(false);
    }
  };

  const handleBusQtyChange = (busQty) => {
    const rate = form.getFieldValue("rate") || 1;
    calculateAmount(rate, busQty);
  };
  const calculateAmount = (rate = 1, busQty = 1) => {
    const newAmount = rate * busQty;
    setAmount(newAmount);
    form.setFieldsValue({ Amt: newAmount });
  };
  const onFinishFailed = () => {
    setLoading(false);
  };

  const handleChange = (time) => {
    setSelectedTime(time);
  };
  const handleChange1 = (time) => {
    setSelectedTime1(time);
  };

  const handleValuesChange = (changedValues, allValues) => {
    handleBusAvailabilityCheck(allValues);
  };
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const handleDateChange = useCallback((date) => {
    const newDate = dayjs(date, "DD-MM-YYYY");
    setSelectedDate(newDate.isValid() ? newDate : dayjs());
  }, []);
  const [selectedDate2, setSelectedDate2] = useState(dayjs());

  const handleDateChange2 = useCallback((date) => {
    const newDate = dayjs(date, "DD-MM-YYYY");
    setSelectedDate2(newDate.isValid() ? newDate : dayjs());
  }, []);

  const formatDateInput = (e, fieldName) => {
    let value = e.target.value.replace(/\D/g, ""); // Keep only digits

    if (value.length > 8) value = value.slice(0, 8);

    let formatted = value;
    if (value.length >= 5) {
      formatted = `${value.slice(0, 2)}-${value.slice(2, 4)}-${value.slice(4)}`;
    } else if (value.length >= 3) {
      formatted = `${value.slice(0, 2)}-${value.slice(2)}`;
    }

    form.setFieldsValue({ [fieldName]: formatted });
  };

  const modalCol = [
    {
      id: 1,
      title: "Bus No.",
      dataIndex: "busNo",
      key: "busNo",
    },
    {
      id: 2,
      title: "Sitting Capacity",
      dataIndex: "sittingCapacity",
      key: "sittingCapacity",
    },
    {
      id: 3,
      title: "Bus Category",
      dataIndex: "buscategory",
      key: "buscategory",
    },
  ];

  useEffect(() => {
    handleLoadBus();
    console.log("handleLoadBus");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <div className="h-full ">
        <Title level={4} className="m-3 text-center">
          Add Booking Details
        </Title>
        <div className="flex items-center justify-between ">
          <Alert
            message={
              <div className="flex items-center">
                {stock > 0
                  ? `${stock} Bus Available`
                  : stock === -1
                  ? "Please select values to check Bus availability"
                  : "No Bus Available"}
                {stock > 0 && (
                  <button
                    className="flex items-center ml-3 text-center bg-green-500 "
                    type="primary"
                    style={{
                      height: "30px",
                      width: "75px",
                      color: "white",
                      borderRadius: "10px",
                    }}
                    onClick={() => setModalVisible(true)}
                  >
                    <CiViewList
                      style={{
                        fontSize: "20px",
                        color: "white",
                        marginRight: "5px",
                        marginInline: "5px",
                      }}
                    />
                    Show
                  </button>
                )}
              </div>
            }
            type={stock > 0 ? "success" : "error"}
            className="text-center "
            style={{ margin: "auto", marginTop: "20px" }}
          />
        </div>
        <Modal
          title="Available Bus Details"
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
        >
          <TableNoPagination
            scrollX={400}
            columns={modalCol}
            list={availableBusList}
          />
        </Modal>
        <Form
          form={form}
          className=""
          name="basicForm"
          layout="vertical"
          style={{ marginLeft: "40px", marginRight: "40px" }}
          initialValues={{
            remember: true,
            initValues,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          onValuesChange={handleValuesChange}
          autoComplete="off"
        >
          <div className="flex flex-wrap justify-between">
            <div className="w-full p-2 md:w-1/2">
              <Form.Item
                style={{ marginBottom: "10px" }}
                label="Bus Type"
                name="busType"
                rules={[
                  {
                    required: false,
                    message: "Please fill input !",
                  },
                ]}
              >
                <Select
                  placeholder="Select bus type"
                  defaultValue={initValues?.buscattpe}
                >
                  {busCatList?.map((busCategory) => (
                    <Select.Option key={busCategory.id} value={busCategory.id}>
                      {busCategory.buscategory}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                style={{ marginBottom: "10px" }}
                label="Sitting Capacity"
                name="sittingCapacity"
                rules={[
                  {
                    required: true,
                    message: "Please fill input !",
                  },
                ]}
              >
                <Input
                  placeholder="Enter Sitting Capacity of Bus"
                  type="number"
                />
              </Form.Item>
              <Form.Item
                style={{ marginBottom: "10px" }}
                label="Trip Description"
                name="tripDescription"
                rules={[
                  {
                    required: true,
                    message: "Please fill input !",
                  },
                ]}
              >
                <TextArea placeholder="Enter  Description" rows={4} />
              </Form.Item>

              <Form.Item
                label="Trip Start Date"
                name="ReportDate"
                rules={[{ required: false, message: "Please fill input!" }]}
              >
                <Input
                  maxLength={10}
                  placeholder="DD-MM-YYYY"
                  onChange={(e) => formatDateInput(e, "ReportDate")}
                />
              </Form.Item>

              <Form.Item
                label="Trip End Date"
                name="tripEndDate"
                rules={[{ required: false, message: "Please fill input!" }]}
              >
                <Input
                  maxLength={10}
                  placeholder="DD-MM-YYYY"
                  onChange={(e) => formatDateInput(e, "tripEndDate")}
                />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: "10px" }}
                label="Hours"
                name="hours"
                hidden={fixedRate}
                rules={[
                  {
                    required: !fixedRate,
                    message: "Please provide input !",
                  },
                ]}
              >
                <InputNumber />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: "10px" }}
                label="Kilometers"
                name="kms"
                hidden={fixedRate}
                rules={[
                  {
                    required: !fixedRate,
                    message: "Please provide input !",
                  },
                ]}
              >
                <InputNumber />
              </Form.Item>
            </div>
            <div className="w-full p-2 md:w-1/2">
              <Form.Item
                style={{ marginBottom: "10px" }}
                label="Report Time"
                name="reportTime"
                rules={[
                  {
                    required: true,
                    message: "Please fill input!",
                  },
                ]}
              >
                <Input
                  placeholder="HH:mm"
                  maxLength={5}
                  onInput={(e) => {
                    let value = e.target.value.replace(/\D/g, ""); // Remove non-digits
                    if (value.length > 4) value = value.slice(0, 4);

                    let formatted = value;
                    if (value.length >= 3) {
                      formatted = `${value.slice(0, 2)}:${value.slice(2)}`;
                    } else if (value.length >= 1) {
                      formatted = value;
                    }

                    e.target.value = formatted;
                    form.setFieldsValue({ reportTime: formatted });
                  }}
                />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: "10px" }}
                label="Bus Return Time"
                name="ReturnTime"
                rules={[
                  {
                    required: true,
                    message: "Please fill input!",
                  },
                ]}
              >
                <Input
                  placeholder="HH:mm"
                  maxLength={5}
                  onInput={(e) => {
                    let value = e.target.value.replace(/\D/g, ""); // Remove non-digits
                    if (value.length > 4) value = value.slice(0, 4);

                    let formatted = value;
                    if (value.length >= 3) {
                      formatted = `${value.slice(0, 2)}:${value.slice(2)}`;
                    } else if (value.length >= 1) {
                      formatted = value;
                    }

                    e.target.value = formatted;
                    form.setFieldsValue({ ReturnTime: formatted });
                  }}
                />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: "10px" }}
                label="Rate type"
                name="rateType"
                rules={[
                  {
                    required: true,
                    message: "Please provide input !",
                  },
                ]}
              >
                <Select
                  onChange={handleRateType}
                  placeholder="Select Rate type"
                >
                  <Select.Option value="FR">Fixed Rate</Select.Option>
                  <Select.Option value="KMPH">KM-HRS</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                style={{ marginBottom: "10px" }}
                label="No of Bus"
                name="busQty"
                rules={[
                  {
                    required: true,
                    message: "Please fill input !",
                  },
                ]}
              >
                <Input
                  type="number"
                  placeholder="Enter Bus Quantity"
                  onChange={(e) => {
                    const busQty = e.target.value;
                    form.setFieldsValue({ busQty }); // Update busQty in form
                    handleBusQtyChange(busQty); // Update amount
                  }}
                />
              </Form.Item>
              <Form.Item
                style={{ marginBottom: "10px" }}
                label="Rate"
                name="rate"
                hidden={!fixedRate}
                rules={[
                  {
                    required: false,
                    message: "Please fill input !",
                  },
                ]}
              >
                <Input
                  type="number"
                  onChange={(e) => {
                    const rate = e.target.value;
                    form.setFieldsValue({ rate }); // Update rate in form
                    const busQty = form.getFieldValue("busQty"); // Get busQty from form
                    const amount = calculateAmount(rate, busQty);
                    form.setFieldsValue({ Amt }); // Update amount in form
                  }}
                />
              </Form.Item>
              <Form.Item
                style={{ marginBottom: "10px" }}
                label="Amount"
                name="Amt"
                hidden={!fixedRate}
                rules={[
                  {
                    required: false,
                    message: "Please input branch!",
                  },
                ]}
              >
                <InputNumber />
              </Form.Item>

              {/* <Form.Item
                style={{ marginBottom: "10px" }}
                hidden={isIncludeGST === "0" ? true : false}
                label="Include GST"
                name="includeGST"
                rules={[
                  {
                    required: false,
                    message: "Please provide input !",
                  },
                ]}
              >
                <Select placeholder="Include GST?">
                  <Select.Option value="1">Yes</Select.Option>
                  <Select.Option value="0">No</Select.Option>
                </Select>
              </Form.Item> */}
              <Form.Item
                style={{ marginBottom: "0px", marginTop: "10em" }}
                label="Extra Hour Rate"
                name="extraHourRate"
                hidden={fixedRate}
                rules={[
                  {
                    required: !fixedRate,
                    message: "Please provide input !",
                  },
                ]}
              >
                <InputNumber />
              </Form.Item>
              <Form.Item
                style={{ marginBottom: "5px", marginTop: "7px" }}
                label="Extra KM Rate"
                name="extraKMRate"
                hidden={fixedRate}
                rules={[
                  {
                    required: !fixedRate,
                    message: "Please provide input !",
                  },
                ]}
              >
                <InputNumber />
              </Form.Item>
            </div>
          </div>
          <Form.Item className="flex justify-center mt-[24px]">
            <Button
              type="primary"
              htmlType="submit"
              shape="round"
              className="mb-3"
              loading={loading}
            >
              Add Entry
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default AddBooking;
