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
  Card,
  Row,
  Col,
  Space,
  Divider,
  message,
} from "antd";
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadAllBusCategory } from "../../../redux/rtk/features/busCategory/busCategorySlice";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import { CheckBusAvalability } from "../../../redux/rtk/features/bookingEntry/bookingsEntrySlice";
import { CiCircleInfo, CiViewList } from "react-icons/ci";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  PlusOutlined,
  InfoCircleOutlined,
  CarOutlined,
  TagOutlined,
  DollarOutlined
} from "@ant-design/icons";
import TableNoPagination from "../../CommonUi/TableNoPagination";
import TextArea from "antd/es/input/TextArea";

const { Title, Text } = Typography;

const AddBooking = ({ isIncludeGST, onClose }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [fixedRate, setFixedRate] = useState(true);
  const [amount, setAmount] = useState(0);

  const { stock, list: availableBusList } = useSelector(
    (state) => state.bookingEntry
  );

  const { list: busCatList, loading: busCatLoading } = useSelector(
    (state) => state.busCategories
  );

  const handleLoadBus = useCallback(() => {
    if (!busCatList || busCatList.length === 0) {
      dispatch(loadAllBusCategory({ page: 1, count: 10000, status: true }));
    }
  }, [dispatch, busCatList]);

  useEffect(() => {
    handleLoadBus();
    // Sync fixedRate with form's initial values if needed
    const currentRateType = form.getFieldValue("rateType") || "FR";
    setFixedRate(currentRateType === "FR");
  }, [handleLoadBus, form]);

  const handleRateType = (value) => {
    setFixedRate(value === "FR");
    calculateAmount(form.getFieldValue("rate") || 0, form.getFieldValue("busQty") || 0);
  };

  const handleBusAvailabilityCheck = useCallback((values) => {
    const { busType, ReportDate, tripEndDate, busQty } = values;
    if (busType && ReportDate && tripEndDate && busQty) {
      dispatch(CheckBusAvalability({
        ...values,
        ReportDate: ReportDate.format("DD-MM-YYYY"),
        tripEndDate: tripEndDate.format("DD-MM-YYYY"),
      }));
    }
  }, [dispatch]);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const selectedBusTypeId = values?.busType;
      const selectedBusCategory = busCatList?.find(
        (busCategory) => busCategory.id === selectedBusTypeId
      );

      const busCategoryName = selectedBusCategory?.buscategory || "";

      const formattedValues = {
        ...values,
        busCategory: busCategoryName,
        BusTypeID: selectedBusTypeId,
        ReportDate: values.ReportDate.format("DD-MM-YYYY"),
        tripEndDate: values.tripEndDate.format("DD-MM-YYYY"),
        reportTime: values.reportTime.format("hh:mm a"),
        ReturnTime: values.ReturnTime.format("hh:mm a"),
      };

      onClose(formattedValues);
      message.success("Booking Added Successfully");
      form.resetFields();
      setAmount(0);
      setFixedRate(true);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const calculateAmount = (rate = 0, busQty = 0) => {
    const newAmount = rate * busQty;
    setAmount(newAmount);
    form.setFieldsValue({ Amt: newAmount });
  };

  const handleValuesChange = (changedValues, allValues) => {
    if (changedValues.busType || changedValues.ReportDate || changedValues.tripEndDate || changedValues.busQty) {
      handleBusAvailabilityCheck(allValues);
    }

    if (changedValues.rate || changedValues.busQty) {
      const rate = allValues.rate || 0;
      const busQty = allValues.busQty || 0;
      calculateAmount(rate, busQty);
    }
  };

  const modalCol = [
    {
      title: "Bus No.",
      dataIndex: "busNo",
      key: "busNo",
    },
    {
      title: "Sitting Capacity",
      dataIndex: "sittingCapacity",
      key: "sittingCapacity",
    },
    {
      title: "Bus Category",
      dataIndex: "buscategory",
      key: "buscategory",
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="p-6">
        {/* Header section with gradient */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <Space align="start" size="middle">
            <div style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              padding: '12px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)'
            }}>
              <PlusOutlined className="text-white text-2xl" />
            </div>
            <div>
              <Title level={4} style={{ margin: 0, fontWeight: 700 }}>Add Trip Details</Title>
              <Text type="secondary">Configuration for vehicle booking and schedule</Text>
            </div>
          </Space>

          <Alert
            className="rounded-xl border-none shadow-sm"
            style={{
              backgroundColor: stock > 0 ? '#f0fdf4' : stock === -1 ? '#f8fafc' : '#fef2f2',
              minWidth: '240px'
            }}
            message={
              <div className="flex items-center justify-between">
                <Space>
                  <CiCircleInfo className={stock > 0 ? "text-green-600" : stock === -1 ? "text-slate-500" : "text-red-600"} size={20} />
                  <Text strong style={{ color: stock > 0 ? '#166534' : stock === -1 ? '#475569' : '#991b1b' }}>
                    {stock > 0
                      ? `${stock} Bus Available`
                      : stock === -1
                        ? "Select requirements to check stock"
                        : "No Vehicles Available"}
                  </Text>
                </Space>
                {stock > 0 && (
                  <Button
                    size="small"
                    type="text"
                    className="flex items-center text-green-700 hover:text-green-800 font-semibold ml-2"
                    onClick={() => setModalVisible(true)}
                    icon={<CiViewList size={16} />}
                  >
                    View
                  </Button>
                )}
              </div>
            }
          />
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onValuesChange={handleValuesChange}
          initialValues={{
            ReportDate: dayjs(),
            tripEndDate: dayjs(),
            busQty: 1,
            rateType: "FR"
          }}
          requiredMark="optional"
        >
          <Row gutter={24}>
            <Col xs={24} lg={15}>
              <Card
                className="shadow-sm border-none rounded-2xl mb-6"
                title={<Space><EnvironmentOutlined className="text-indigo-500" /><span>Voyage Information</span></Space>}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Vehicle Category"
                      name="busType"
                      rules={[{ required: true, message: "Required" }]}
                    >
                      <Select
                        placeholder="Select type"
                        loading={busCatLoading}
                        className="rounded-lg"
                      >
                        {busCatList?.map((cat) => (
                          <Select.Option key={cat.id} value={cat.id}>
                            {cat.buscategory}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Seating Capacity"
                      name="sittingCapacity"
                      rules={[{ required: true, message: "Required" }]}
                    >
                      <InputNumber className="w-full rounded-lg" placeholder="e.g. 50" min={1} />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  label="Itinerary Description"
                  name="tripDescription"
                  rules={[{ required: true, message: "Required" }]}
                >
                  <TextArea placeholder="Details about the destination and purpose..." rows={4} className="rounded-lg" />
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Start Date"
                      name="ReportDate"
                      rules={[{ required: true, message: "Required" }]}
                    >
                      <DatePicker className="w-full rounded-lg" format="DD-MM-YYYY" prefix={<CalendarOutlined />} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="End Date"
                      name="tripEndDate"
                      rules={[{ required: true, message: "Required" }]}
                    >
                      <DatePicker className="w-full rounded-lg" format="DD-MM-YYYY" prefix={<CalendarOutlined />} />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              <Card
                className="shadow-sm border-none rounded-2xl"
                title={<Space><ClockCircleOutlined className="text-indigo-500" /><span>Schedule & Metrics</span></Space>}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Reporting Time"
                      name="reportTime"
                      rules={[{ required: true, message: "Required" }]}
                    >
                      <TimePicker className="w-full rounded-lg" format="hh:mm a" use12Hours />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Estimated Return"
                      name="ReturnTime"
                      rules={[{ required: true, message: "Required" }]}
                    >
                      <TimePicker className="w-full rounded-lg" format="hh:mm a" use12Hours />
                    </Form.Item>
                  </Col>
                </Row>

                {!fixedRate && (
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label="Usage Hours"
                        name="hours"
                        rules={[{ required: true, message: "Required" }]}
                      >
                        <InputNumber className="w-full rounded-lg" min={0} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Est. Kilometers"
                        name="kms"
                        rules={[{ required: true, message: "Required" }]}
                      >
                        <InputNumber className="w-full rounded-lg" min={0} />
                      </Form.Item>
                    </Col>
                  </Row>
                )}
              </Card>
            </Col>

            <Col xs={24} lg={9}>
              <Card
                className="shadow-sm border-none rounded-2xl overflow-hidden mb-6"
                title={<Space><DollarOutlined className="text-indigo-500" /><span>Commercials</span></Space>}
                bodyStyle={{ padding: '0px' }}
              >
                <div className="p-5 bg-indigo-50/50">
                  <Form.Item
                    label="Rate Structure"
                    name="rateType"
                    rules={[{ required: true, message: "Required" }]}
                  >
                    <Select onChange={handleRateType} className="rounded-lg shadow-sm">
                      <Select.Option value="FR">Fixed Rate Package</Select.Option>
                      <Select.Option value="KMPH">Time & Mileage (KM/HR)</Select.Option>
                    </Select>
                  </Form.Item>

                  <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                      label="No. of Vehicles"
                      name="busQty"
                      rules={[{ required: true, message: "Required" }]}
                    >
                      <InputNumber className="w-full rounded-lg" min={1} prefix={<CarOutlined />} />
                    </Form.Item>

                    {fixedRate && (
                      <Form.Item
                        label="Rate Per Unit"
                        name="rate"
                        rules={[{ required: true, message: "Required" }]}
                      >
                        <InputNumber
                          className="w-full rounded-lg"
                          prefix="₹"
                          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        />
                      </Form.Item>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  {fixedRate ? (
                    <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-5 rounded-2xl shadow-lg shadow-emerald-200">
                      <Text className="text-indigo-100 text-sm font-medium uppercase tracking-wider block mb-1">Total Trip Value</Text>
                      <Title level={2} style={{ color: 'white', margin: 0, fontWeight: 800 }}>
                        ₹{amount.toLocaleString()}
                      </Title>
                      <Divider className="opacity-10 my-3" />
                      <Text className="text-indigo-200 text-xs italic opacity-80 decoration-slate-200">• Base fare calculated on fixed rate package</Text>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Form.Item
                        label="Extra Hour Rate"
                        name="extraHourRate"
                        rules={[{ required: true, message: "Required" }]}
                      >
                        <InputNumber className="w-full rounded-lg" prefix="₹/hr" />
                      </Form.Item>
                      <Form.Item
                        label="Extra KM Rate"
                        name="extraKMRate"
                        rules={[{ required: true, message: "Required" }]}
                      >
                        <InputNumber className="w-full rounded-lg" prefix="₹/km" />
                      </Form.Item>
                      <div className="p-4 bg-slate-100/50 rounded-xl border border-dashed border-slate-300">
                        <Text type="secondary" size="small">Final billing will be adjusted based on actual logs.</Text>
                      </div>
                    </div>
                  )}

                  <div className="mt-8">
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      block
                      className="h-14 rounded-2xl shadow-lg shadow-indigo-100 border-none font-bold text-lg hover:scale-[1.02] transition-transform"
                      style={{ background: 'linear-gradient(90deg, #4f46e5 0%, #6366f1 100%)' }}
                      loading={loading}
                    >
                      Confirm Booking Entry
                    </Button>
                  </div>
                </div>
              </Card>

              {stock <= 0 && stock !== -1 && (
                <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
                  <Space align="start">
                    <InfoCircleOutlined className="text-orange-500 mt-1" />
                    <div>
                      <Text strong className="text-orange-800">Operational Warning</Text>
                      <br />
                      <Text className="text-orange-700 text-xs text-pretty">You are attempting to book more vehicles than currently available in stock for this category/date.</Text>
                    </div>
                  </Space>
                </div>
              )}
            </Col>
          </Row>
        </Form>
      </div>

      <Modal
        title={
          <Space>
            <CarOutlined className="text-indigo-500" />
            <span>Vehicles Available in Stock</span>
          </Space>
        }
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
        className="rounded-3xl overflow-hidden"
      >
        <TableNoPagination
          columns={modalCol}
          list={availableBusList}
        />
      </Modal>
    </div>
  );
};

export default AddBooking;
