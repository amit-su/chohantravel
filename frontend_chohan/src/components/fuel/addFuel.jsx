import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFuel, loadAllFuel } from "../../redux/rtk/features/fuel/fuelSlice";
import { loadAllBus } from "../../redux/rtk/features/bus/busSlice";
import { loadAllVendor } from "../../redux/rtk/features/vendor/vendorSlice";
import { loadAllDriver } from "../../redux/rtk/features/driver/driverSlice";
import { loadAllCompany } from "../../redux/rtk/features/company/comapnySlice";
import { loadAllCity } from "../../redux/rtk/features/city/citySlice";
import dayjs from "dayjs";

const AddFuel = () => {
  const dispatch = useDispatch();
  const { Title } = Typography;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fuelQty, setFuelQty] = useState(0);
  const [rate, setRate] = useState(0);
  const [selectedBus, setSelectedBus] = useState(0);
  const [filteredDriverList, setFilteredDriverList] = useState([]);
  useEffect(() => {
    dispatch(loadAllBus({ page: 1, count: 10000, status: true }));
  }, [dispatch]);
  const { list: busList } = useSelector((state) => state.buses);

  const handleLoadVendor = () => {
    dispatch(loadAllVendor({ page: 1, count: 10000, status: true }));
  };
  const { list: vendorList } = useSelector((state) => state.vendors);
  const handleLoadDriver = () => {
    dispatch(loadAllDriver({ page: 1, count: 10000, status: true }));
  };
  const { list: allDriverList } = useSelector((state) => state.drivers);
  useEffect(() => {
    console.log("selectedBus", selectedBus);

    const filteredList =
      allDriverList?.filter(
        (driver) => Number(driver?.bus_id) === selectedBus
      ) || [];
    setFilteredDriverList(filteredList);
  }, [selectedBus, allDriverList]);
  const driverList = filteredDriverList;

  const handleLoadCompany = () => {
    dispatch(loadAllCompany({ page: 1, count: 10000, status: true }));
  };
  const { list: companyList } = useSelector((state) => state.companies);

  const handleLoadCity = () => {
    dispatch(loadAllCity({ page: 1, count: 10000, status: true }));
  };
  const { list: cityList } = useSelector((state) => state.city);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const handleDateChange = useCallback((date) => {
    const newDate = dayjs(date, "YYYY-MM-DD");
    setSelectedDate(newDate.isValid() ? newDate : dayjs());
  }, []);

  const handleFuelQtyChange = (value) => {
    setFuelQty(value);
    form.setFieldsValue({
      Amount: value * rate,
    });
  };

  const handleRateChange = (value) => {
    setRate(value);
    form.setFieldsValue({
      Amount: value * fuelQty,
    });
  };

  const onFinish = async (values) => {
    try {
      const uppercaseValues = Object.keys(values).reduce((acc, key) => {
        acc[key] =
          typeof values[key] === "string"
            ? values[key].toUpperCase()
            : values[key];
        return acc;
      }, {});
      const resp = await dispatch(
        addFuel({ values: uppercaseValues, dispatch })
      );

      if (resp.payload.message === "success") {
        setLoading(false);
        form.resetFields();
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const onFinishFailed = () => {
    setLoading(false);
  };

  const onClick = () => {
    setLoading(true);
  };

  return (
    <>
      <div className="h-full">
        <Title level={4} className="m-3 text-center">
          Add Fuel Details
        </Title>
        <Form
          form={form}
          className=""
          name="basic"
          layout="vertical"
          style={{ marginLeft: "40px", marginRight: "40px" }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              style={{ marginBottom: "10px" }}
              label="Date"
              name="Date"
              rules={[
                {
                  required: true,
                  message: "Please fill input !",
                },
              ]}
            >
              <DatePicker format={"DD-MM-YYYY"} />
            </Form.Item>
            <Form.Item
              style={{ marginBottom: "10px" }}
              label="Bus No"
              name="bus_id"
              rules={[
                {
                  required: true,
                  message: "Please fill input !",
                },
              ]}
            >
              <Select
                showSearch
                optionFilterProp="children"
                onChange={(value) => setSelectedBus(value)}
                placeholder="Select Bus"
              >
                {busList?.map((bus) => (
                  <Select.Option key={bus.id} value={bus.id}>
                    {bus.busNo}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              style={{ marginBottom: "10px" }}
              label="Reference No"
              name="ReferenceNo"
              rules={[
                {
                  required: true,
                  message: "Please fill input !",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              style={{ marginBottom: "10px" }}
              label="Kilometer"
              name="Kilometer"
              rules={[
                {
                  required: true,
                  message: "Please fill input !",
                },
              ]}
            >
              <InputNumber />
            </Form.Item>
            <Form.Item
              style={{ marginBottom: "10px" }}
              label="Fuel Type"
              name="fuelType"
              rules={[
                {
                  required: true,
                  message: "Please fill input !",
                },
              ]}
            >
              <Select
                // onChange={handleSelectUNIT}
                placeholder="Select Unit"
              >
                <Select.Option value={"DIESEL"}>DIESEL</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              style={{ marginBottom: "10px" }}
              label="Fuel Qty"
              name="Fuel"
              rules={[
                {
                  required: true,
                  message: "Please fill input !",
                },
              ]}
            >
              <InputNumber onChange={handleFuelQtyChange} />
            </Form.Item>
            <Form.Item
              style={{ marginBottom: "10px" }}
              label="Rate"
              name="Rate"
              rules={[
                {
                  required: true,
                  message: "Please fill input !",
                },
              ]}
            >
              <InputNumber onChange={handleRateChange} />
            </Form.Item>
            <Form.Item
              style={{ marginBottom: "10px" }}
              label="Amount"
              name="Amount"
              rules={[
                {
                  required: true,
                  message: "Please fill input !",
                },
              ]}
            >
              <InputNumber disabled />
            </Form.Item>

            {/* <Form.Item
              style={{ marginBottom: "10px" }}
              label="Vendor"
              name="vendor_id"
              // rules={[
              //   {
              //     required: true,
              //     message: "Please fill input !",
              //   },
              // ]}
            >
              <Select
                // onChange={handleBusTypeChange}
                onClick={handleLoadVendor}
                placeholder="Select Vendor"
              >
                {vendorList?.map((vendor) => (
                  <Select.Option key={vendor.id} value={vendor.id}>
                    {vendor.vendorName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item> */}
            <Form.Item
              style={{ marginBottom: "10px" }}
              label="Driver"
              name="driver_id"
              rules={[
                {
                  required: true,
                  message: "Please fill input !",
                },
              ]}
            >
              <Select
                showSearch
                optionFilterProp="children"
                onClick={handleLoadDriver}
                placeholder="Select driver"
              >
                {driverList?.map((driver) => (
                  <Select.Option key={driver.id} value={driver.id}>
                    {driver.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            {/* <Form.Item
              style={{ marginBottom: "10px" }}
              label="Full Tank"
              name="FullTank"
              rules={[
                {
                  required: true,
                  message: "Please fill input !",
                },
              ]}
            >
              <Select placeholder="Select status">
                <Select.Option value={1}>Yes</Select.Option>
                <Select.Option value={0}>No</Select.Option>
              </Select>
            </Form.Item> */}
            {/* <Form.Item
              style={{ marginBottom: "10px" }}
              label="Paid By"
              name="PaidBy"
              rules={[
                {
                  required: true,
                  message: "Please fill input !",
                },
              ]}
            >
                <Select placeholder="Select status">
                <Select.Option value={"Party"}>Party</Select.Option>
                <Select.Option value={"Company"}>Company</Select.Option>
                <Select.Option value={"Driver"}>Driver</Select.Option>

              </Select>
            </Form.Item> */}
            {/* <Form.Item
              style={{ marginBottom: "10px" }}
              label="Payment Mode"
              name="Paymode"
              rules={[
                {
                  required: true,
                  message: "Please fill input !",
                },
              ]}
            >
               <Select placeholder="Select status">
                <Select.Option value={"Cash"}>Cash</Select.Option>
                <Select.Option value={"Cheque"}>Cheque</Select.Option>
                <Select.Option value={"RTGS"}>RTGS</Select.Option>
                <Select.Option value={"NEFT"}>NEFT</Select.Option>
                <Select.Option value={"UPI"}>UPI</Select.Option>
                <Select.Option value={"Card"}>Card</Select.Option>




              </Select>
            </Form.Item> */}
            <Form.Item
              style={{ marginBottom: "10px" }}
              label="City"
              name="City"
              rules={[
                {
                  required: true,
                  message: "Please fill input !",
                },
              ]}
            >
              <Select
                showSearch
                optionFilterProp="children"
                onClick={handleLoadCity}
                placeholder="Select city"
              >
                {cityList?.map((city) => (
                  <Select.Option key={city.id} value={city.name}>
                    {city.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              style={{ marginBottom: "10px" }}
              label="Remarks"
              name="Remarks"
              rules={[
                {
                  required: false,
                  message: "Please fill input !",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              style={{ marginBottom: "10px" }}
              label="Company"
              name="company_id"
              rules={[
                {
                  required: true,
                  message: "Please fill input !",
                },
              ]}
            >
              <Select
                showSearch
                optionFilterProp="children"
                onClick={handleLoadCompany}
                placeholder="Select Company"
              >
                {companyList?.map((company) => (
                  <Select.Option key={company.Id} value={company.Id}>
                    {company.Name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            {/* <Form.Item
              style={{ marginBottom: "10px" }}
              label="Advance Amount"
              name="AdvAmount"
              rules={[
                {
                  required: true,
                  message: "Please fill input !",
                },
              ]}
            >
              <Input />
            </Form.Item> */}

            {/* <Form.Item
              style={{ marginBottom: "10px" }}
              label="Purchased from"
              name="purchase_from_id"
              rules={[
                {
                  required: true,
                  message: "Please fill input !",
                },
              ]}
            >
              <Input />
            </Form.Item> */}
          </div>
          <Form.Item
            style={{ marginBottom: "10px" }}
            className="flex justify-center mt-[24px]"
          >
            <Button
              type="primary"
              htmlType="submit"
              shape="round"
              loading={loading}
              onClick={onClick}
            >
              Add Fuel
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default AddFuel;
