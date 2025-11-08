import { Button, DatePicker, Form, Input, InputNumber, Select } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadAllBus, updateBus } from "../../redux/rtk/features/bus/busSlice";
import { loadAllVendor } from "../../redux/rtk/features/vendor/vendorSlice";
import { loadAllDriver } from "../../redux/rtk/features/driver/driverSlice";
import { loadAllCompany } from "../../redux/rtk/features/company/comapnySlice";
import { loadAllCity } from "../../redux/rtk/features/city/citySlice";
import {
  loadAllFuel,
  updateFuel,
} from "../../redux/rtk/features/fuel/fuelSlice";
import moment from "moment";

function UpdateBus({ data, id }) {
  console.log(data);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [loader, setLoader] = useState();
  const [fuelQty, setFuelQty] = useState(data?.Fuel);
  const [rate, setRate] = useState(data?.Rate);
  const [initValues, setInitValues] = useState({
    ...data,
    bus_id: data?.bus_id,
    fuelType: data?.FuelType,
    vendor_id: data?.vendor_id,
    driver_id: data?.driver_id,
    company_id: data?.company_id.toString(),
    Date: moment(data?.Date),
    FullTank: parseInt(data?.FullTank),
  });

  const { list: busList } = useSelector((state) => state.buses);
  const { list: vendorList } = useSelector((state) => state.vendors);
  const { list: driverList } = useSelector((state) => state.drivers);
  const { list: companyList } = useSelector((state) => state.companies);
  const { list: cityList } = useSelector((state) => state.city);

  const onFinish = async (values) => {
    try {
      const uppercaseValues = Object.keys(values).reduce((acc, key) => {
        acc[key] =
          typeof values[key] === "string"
            ? values[key].toUpperCase()
            : values[key];
        return acc;
      }, {});
      const res = await dispatch(
        updateFuel({ id, values: uppercaseValues, dispatch })
      );

      setLoader(false);
    } catch (error) {
      setLoader(false);
    }
  };

  const handleLoadBus = () => {
    dispatch(loadAllBus({ page: 1, count: 10000, status: true }));
  };

  const handleLoadVendor = () => {
    dispatch(loadAllVendor({ page: 1, count: 10000, status: true }));
  };

  const handleLoadDriver = () => {
    dispatch(loadAllDriver({ page: 1, count: 10000, status: true }));
  };

  const handleLoadCompany = () => {
    dispatch(loadAllCompany({ page: 1, count: 10000, status: true }));
  };

  const handleLoadCity = () => {
    dispatch(loadAllCity({ page: 1, count: 10000, status: true }));
  };

  useEffect(() => {
    dispatch(loadAllBus({ page: 1, count: 10000, status: true }));
    dispatch(loadAllVendor({ page: 1, count: 10000, status: true }));
    dispatch(loadAllDriver({ page: 1, count: 10000, status: true }));
    dispatch(loadAllCompany({ page: 1, count: 10000, status: true }));
    dispatch(loadAllCity({ page: 1, count: 10000, status: true }));
  }, [dispatch]);

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

  return (
    <>
      <div className="">
        <Form
          form={form}
          layout="vertical"
          style={{ marginLeft: "40px", marginRight: "40px" }}
          initialValues={initValues} // Set initial values here
          onFinish={onFinish}
          autoComplete="off"
          labelAlign="left"
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
                onClick={handleLoadBus}
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
              <Select placeholder="Select Unit">
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
              <InputNumber readOnly />
            </Form.Item>
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
          </div>
          <Form.Item style={{ marginBottom: "10px" }}>
            <Button
              onClick={() => setLoader(true)}
              block
              type="primary"
              htmlType="submit"
              loading={loader}
              shape="round"
            >
              Update Now
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
}

export default UpdateBus;
