import { Button, DatePicker, Form, Select, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { loadAllSite } from "../../redux/rtk/features/site/siteSlice";
import { loadAllBus } from "../../redux/rtk/features/bus/busSlice";
import { loadAllDriver } from "../../redux/rtk/features/driver/driverSlice";
import { loadAllHelper } from "../../redux/rtk/features/helper/helperSlice";
import {
  loadAllDailyExecution,
  updateDailyExecution,
} from "../../redux/rtk/features/dailyExecution/dailyExecutionSlice";
import { loadAllSetup } from "../../redux/rtk/features/setup/setupSlice";
import dayjs from "dayjs";

const UpdatePartyBusListDrawer = ({ id, data }) => {
  const dispatch = useDispatch();
  const { Title } = Typography;

  const { list: busList } = useSelector((state) => state.buses);
  const { list: setupList } = useSelector((state) => state.setups);
  const { list: siteList } = useSelector((state) => state.sites);
  const { list: driverList } = useSelector((state) => state.drivers);
  const { list: helperList } = useSelector((state) => state.helpers);

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    siteID: parseInt(data?.SiteID),
    partyId: data?.PartyID,
    busID: parseInt(data?.BusID),
    driverID: data?.DriverID,
    helperID: data?.HelperID,
    date: dayjs(data?.CreatedOn),
  });

  const handlePartySelected = (value, option) => {
    const selectedSetup = setupList.find((setup) => setup.PartyID === value);
    if (selectedSetup) {
      form.setFieldsValue({ setupID: selectedSetup.id });
      const siteId = selectedSetup.SiteID;
      form.setFieldsValue({ siteID: parseInt(siteId) });
    }
  };

  const handleBusSelected = (value, option) => {
    const selectedBus = busList.find((bus) => bus.id === value);
    if (selectedBus) {
      const driverId = selectedBus.driverID;
      const helperId = selectedBus.helperID;
      form.setFieldsValue({ driverID: driverId });
      form.setFieldsValue({ helperID: helperId });
    }
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

      const resp = dispatch(
        updateDailyExecution({ id, values: uppercaseValues, dispatch })
      );

      if (resp) {
        dispatch(loadAllDailyExecution({ status: true, page: 1, count: 1000 }));
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
  useEffect(() => {
    dispatch(loadAllSetup({ page: 1, count: 10000, status: true }));
    dispatch(loadAllSite({ page: 1, count: 10000, status: true }));
    dispatch(loadAllBus({ page: 1, count: 10000, status: true }));
    dispatch(loadAllDriver({ page: 1, count: 10000, status: true }));
    dispatch(loadAllHelper({ page: 1, count: 10000, status: true }));
  }, []);

  return (
    <>
      <div className="h-full">
        <Title level={4} className="m-3 text-center">
          Update Party Bus List
        </Title>
        <Form
          form={form}
          className=""
          name="basic"
          layout="vertical"
          style={{ marginLeft: "40px", marginRight: "40px" }}
          initialValues={initialValues}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            style={{ marginBottom: "10px" }}
            label="PARTY"
            name="partyId"
            rules={[
              {
                required: true,
                message: "Please provide input !",
              },
            ]}
          >
            <Select onChange={handlePartySelected} placeholder="Select party">
              {setupList?.map((setup) => (
                <Select.Option key={setup.id} value={setup.PartyID}>
                  {setup.partyName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            style={{ marginBottom: "10px" }}
            label="SITE"
            name="siteID"
            rules={[
              {
                required: true,
                message: "Please input site!",
              },
            ]}
          >
            <Select placeholder="Select site">
              {siteList?.map((site) => (
                <Select.Option key={site.siteID} value={site.siteID}>
                  {site.siteName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            style={{ marginBottom: "10px" }}
            label="BUS "
            name="busID"
            rules={[
              {
                required: true,
                message: "Please  provide input !",
              },
            ]}
          >
            <Select onChange={handleBusSelected} placeholder="Select bus">
              {busList?.map((bus) => (
                <Select.Option key={bus.id} value={bus.id}>
                  {bus.busName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            style={{ marginBottom: "10px" }}
            label="DRIVER"
            name="driverID"
            rules={[
              {
                required: true,
                message: "Please  provide input !",
              },
            ]}
          >
            <Select placeholder="Select driver">
              {driverList?.map((driver) => (
                <Select.Option key={driver.id} value={driver.id}>
                  {driver.driverName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            style={{ marginBottom: "10px" }}
            label="HELPER"
            name="helperID"
            rules={[
              {
                required: true,
                message: "Please  provide input !",
              },
            ]}
          >
            <Select placeholder="Select helper">
              {helperList?.map((helper) => (
                <Select.Option key={helper.id} value={helper.id}>
                  {helper.helperName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            style={{ marginBottom: "10px" }}
            label="Date"
            name="date"
            rules={[
              {
                required: true,
                message: "Please  provide input !",
              },
            ]}
          >
            <DatePicker defaultValue={dayjs()} format={"DD-MM-YYYY"} />
          </Form.Item>

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
              Update Party Bus List
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default UpdatePartyBusListDrawer;
