import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  TimePicker,
  Typography,
  Card,
  Row,
  Col,
  Space,
  Divider,
} from "antd";
import { toast } from "react-toastify";
import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import { loadAllBusCategory } from "../../../redux/rtk/features/busCategory/busCategorySlice";
import { updateLocalBooking } from "../../../redux/rtk/features/localBusBooking/localBusBookingSlice";
import TextArea from "antd/es/input/TextArea";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  SaveOutlined,
  CarOutlined,
  DollarOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;

function UpdateBookingDrawer({ data, id, isIncludeGST, onClose, drawerClose }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [fixedRate, setFixedRate] = useState(data?.rateType === "FR");
  const [loader, setLoader] = useState(false);
  const [amount, setAmount] = useState(data?.Amt || 0);

  const { list: busCatList, loading: busCatLoading } = useSelector(
    (state) => state.busCategories
  );

  useEffect(() => {
    if (!busCatList || busCatList.length === 0) {
      dispatch(loadAllBusCategory({ page: 1, count: 10000, status: true }));
    }
  }, [dispatch, busCatList]);

  // Sync state with data when it changes
  useEffect(() => {
    if (data) {
      const isFixed = data.rateType === "FR";
      setFixedRate(isFixed);

      const rate = Number(data.rate) || 0;
      const busQty = Number(data.busQty) || 1;
      const initialAmt = Number(data.Amt) || (isFixed ? rate * busQty : 0);

      setAmount(initialAmt);
      form.setFieldsValue({
        ...getInitialValues(),
        Amt: initialAmt
      });
    }
  }, [data, form]);

  const handleRateType = (value) => {
    setFixedRate(value === "FR");
    const rate = form.getFieldValue("rate") || 0;
    const busQty = form.getFieldValue("busQty") || 0;
    calculateAmount(rate, busQty);
  };

  const calculateAmount = (rate = 0, busQty = 0) => {
    const newAmount = rate * busQty;
    setAmount(newAmount);
    form.setFieldsValue({ Amt: newAmount });
  };

  const onFinish = async (values) => {
    try {
      setLoader(true);
      const selectedBusTypeId = values?.busType;
      const selectedBusCategory = busCatList?.find(
        (busCategory) => busCategory.id === selectedBusTypeId
      );

      const busCategoryName = selectedBusCategory?.buscategory || data?.busCategory;

      const formattedValues = {
        ...values,
        busCategory: busCategoryName,
        BusTypeID: selectedBusTypeId,
        ReportDate: values.ReportDate.format("DD-MM-YYYY"),
        tripEndDate: values.tripEndDate.format("DD-MM-YYYY"),
        reportTime: values.reportTime.format("hh:mm a"),
        ReturnTime: values.ReturnTime.format("hh:mm a"),
        ID: id,
      };

      dispatch(updateLocalBooking({ id, values: formattedValues }));
      toast.success("Changes saved successfully!");
      setLoader(false);
      onClose({ id: id, values: formattedValues });
      if (drawerClose) {
        drawerClose();
      }
    } catch (error) {
      setLoader(false);
    }
  };

  const handleValuesChange = (changedValues, allValues) => {
    if (changedValues.rate || changedValues.busQty) {
      const rate = allValues.rate || 0;
      const busQty = allValues.busQty || 0;
      calculateAmount(rate, busQty);
    }
  };

  // Prepare initial values for the form
  const getInitialValues = () => {
    const busTypeId = data?.BusTypeID || data?.busType;
    return {
      busType: busTypeId ? Number(busTypeId) : undefined,
      sittingCapacity: data?.sittingCapacity,
      tripDescription: data?.tripDescription,
      ReportDate: data?.ReportDate ? dayjs(data.ReportDate, "DD-MM-YYYY") : dayjs(),
      tripEndDate: data?.tripEndDate ? dayjs(data.tripEndDate, "DD-MM-YYYY") : dayjs(),
      reportTime: data?.reportTime ? dayjs(data.reportTime, ["hh:mm a", "HH:mm", "H:mm"]) : null,
      ReturnTime: data?.ReturnTime ? dayjs(data.ReturnTime, ["hh:mm a", "HH:mm", "H:mm"]) : null,
      rateType: data?.rateType || "FR",
      busQty: Number(data?.busQty) || 1,
      rate: Number(data?.rate) || 0,
      Amt: Number(data?.Amt) || 0,
      hours: Number(data?.hours),
      kms: Number(data?.kms),
      extraHourRate: Number(data?.extraHourRate),
      extraKMRate: Number(data?.extraKMRate),
    };
  };

  return (
    <div className="bg-slate-50 min-h-screen p-6">
      <div className="mb-6">
        <Space align="start" size="middle">
          <div style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            padding: '12px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
          }}>
            <SaveOutlined className="text-white text-2xl" />
          </div>
          <div>
            <Title level={4} style={{ margin: 0, fontWeight: 700 }}>Update Booking</Title>
            <Text type="secondary">Modify trip specifications for #{id}</Text>
          </div>
        </Space>
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={getInitialValues()}
        onFinish={onFinish}
        onValuesChange={handleValuesChange}
        requiredMark="optional"
      >
        <Row gutter={24}>
          <Col xs={24} lg={15}>
            <Card
              className="shadow-sm border-none rounded-2xl mb-6"
              title={<Space><EnvironmentOutlined className="text-emerald-500" /><span>Itinerary Details</span></Space>}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Vehicle Type"
                    name="busType"
                    rules={[{ required: true, message: "Required" }]}
                  >
                    <Select
                      placeholder="Select bus type"
                      loading={busCatLoading}
                      className="rounded-lg"
                    >
                      {busCatList?.map((cat) => (
                        <Select.Option key={cat.id} value={Number(cat.id)}>
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
                    <InputNumber className="w-full rounded-lg" min={1} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Trip Description"
                name="tripDescription"
                rules={[{ required: true, message: "Required" }]}
              >
                <TextArea rows={4} className="rounded-lg" />
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
              title={<Space><ClockCircleOutlined className="text-emerald-500" /><span>Timeline & Metrics</span></Space>}
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
                    label="Return Time"
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
                      label="Billable Hours"
                      name="hours"
                      rules={[{ required: true, message: "Required" }]}
                    >
                      <InputNumber className="w-full rounded-lg" min={0} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Estimated Kilometers"
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
              title={<Space><DollarOutlined className="text-emerald-500" /><span>Financials</span></Space>}
              bodyStyle={{ padding: '0px' }}
            >
              <div className="p-5 bg-emerald-50/50">
                <Form.Item
                  label="Pricing Model"
                  name="rateType"
                  rules={[{ required: true, message: "Required" }]}
                >
                  <Select onChange={handleRateType} className="rounded-lg">
                    <Select.Option value="FR">Fixed Rate Package</Select.Option>
                    <Select.Option value="KMPH">Time & Distance (KM/HR)</Select.Option>
                  </Select>
                </Form.Item>

                <div className="grid grid-cols-2 gap-4">
                  <Form.Item
                    label="Qty"
                    name="busQty"
                    rules={[{ required: true, message: "Required" }]}
                  >
                    <InputNumber className="w-full rounded-lg" min={1} prefix={<CarOutlined />} />
                  </Form.Item>

                  {fixedRate && (
                    <Form.Item
                      label="Unit Rate"
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
                    <Text className="text-emerald-100 text-sm font-medium uppercase tracking-wider block mb-1">Current Trip Value</Text>
                    <Title level={2} style={{ color: 'white', margin: 0, fontWeight: 800 }}>
                      ₹{amount.toLocaleString()}
                    </Title>
                    <Divider className="opacity-10 my-3" />
                    <Text className="text-emerald-200 text-xs italic opacity-80 decoration-slate-200">Values are updated in real-time based on quantity.</Text>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Form.Item
                      label="Extra Hour Rate"
                      name="extraHourRate"
                      rules={[{ required: true, message: "Required" }]}
                    >
                      <InputNumber className="w-full rounded-lg" prefix="₹" />
                    </Form.Item>
                    <Form.Item
                      label="Extra KM Rate"
                      name="extraKMRate"
                      rules={[{ required: true, message: "Required" }]}
                    >
                      <InputNumber className="w-full rounded-lg" prefix="₹" />
                    </Form.Item>
                  </div>
                )}

                <div className="mt-8">
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    block
                    className="h-14 rounded-2xl shadow-lg shadow-emerald-100 border-none font-bold text-lg hover:scale-[1.02] transition-transform"
                    style={{ background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)' }}
                    loading={loader}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default UpdateBookingDrawer;
