import { Button, Form, Select } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loadAllSetup,
  updateSetup,
} from "../../redux/rtk/features/setup/setupSlice";
import { loadPartyPaginated } from "../../redux/rtk/features/party/partySlice";
import { loadAllSite } from "../../redux/rtk/features/site/siteSlice";
import { loadAllBus } from "../../redux/rtk/features/bus/busSlice";
import { loadAllDriver } from "../../redux/rtk/features/driver/driverSlice";
import { loadAllHelper } from "../../redux/rtk/features/helper/helperSlice";

function UpdateSetup({ data, id }) {
  console.log(data, "565");
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [loader, setLoader] = useState();
  const [initValues, setInitValues] = useState({
    PartyID: parseInt(data?.PartyID) || 0,
    SiteID: parseInt(data?.SiteID) || 0,
    BusID: parseInt(data?.BusID) || 0,
    DriverID: parseInt(data?.DriverID) || 0,
    helperID: parseInt(data?.HelperID) || 0,
    siteClosed: data?.SiteClosed === "1" ? "true" : "false",
    duty_type: data?.duty_type,
  });

  useEffect(() => {
    dispatch(loadAllDriver({ page: 1, count: 10000, status: true }));
    dispatch(loadAllBus({ page: 1, count: 10000, status: true }));
    dispatch(loadAllSite({ page: 1, count: 10000, status: true }));
    dispatch(loadPartyPaginated({ page: 1, count: 10000, status: true }));
    dispatch(loadAllHelper({ page: 1, count: 10000, status: true }));
  }, [dispatch]);
  const { list: busList } = useSelector((state) => state.buses);
  const { list: partyList } = useSelector((state) => state.party);
  const { list: siteList } = useSelector((state) => state.sites);
  const { list: driverList } = useSelector((state) => state.drivers);
  const { list: helperList } = useSelector((state) => state.helpers);

  const onFinish = async (values) => {
    try {
      const updatedValues = {
        PartyID: values.PartyID !== initValues.PartyID ? values.PartyID : null,
        SiteID: values.SiteID !== initValues.SiteID ? values.SiteID : null,
        BusID: values.BusID !== initValues.BusID ? values.BusID : null,
        DriverID:
          values.DriverID !== initValues.DriverID ? values.DriverID : null,
        siteClosed:
          values.siteClosed !== initValues.siteClosed
            ? values.siteClosed === "true"
              ? 1
              : 0
            : null,
        helperID:
          values.helperID !== initValues.helperID ? values.helperID : null,

        duty_type:
          values.duty_type !== initValues.duty_type ? values.duty_type : null,
      };
      console.log("value", updatedValues);
      const hasChanges = Object.values(updatedValues).some(
        (val) => val !== null
      );
      if (hasChanges) {
        const res = await dispatch(updateSetup({ id, values: updatedValues }));
        if (res) {
          dispatch(loadAllSetup({ status: true, page: 1, count: 1000 }));
        }
        setInitValues({});
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
    }
  };

  const onFinishFailed = () => {};
  const uniqueDrivers = Array.from(
    new Map(driverList?.map((d) => [d.name, d])).values()
  );

  const uniqueHelpers = Array.from(
    new Map(helperList?.map((h) => [h.name, h])).values()
  );
  return (
    <>
      <div className="">
        <Form
          form={form}
          layout="vertical"
          style={{ marginLeft: "40px", marginRight: "40px" }}
          initialValues={initValues} // Set initial values here
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          labelAlign="left"
        >
          <Form.Item
            style={{ marginBottom: "10px" }}
            label="PARTY"
            name="PartyID"
            rules={[
              {
                required: true,
                message: "Please provide input !",
              },
            ]}
          >
            <Select
              optionFilterProp="children" // Filters options based on the content of the children (party names)
              showSearch
              placeholder="Select party"
            >
              {partyList?.map((party) => (
                <Select.Option key={party.id} value={party.id}>
                  {party.partyName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            style={{ marginBottom: "10px" }}
            label="SITE"
            name="SiteID"
            rules={[
              {
                required: true,
                message: "Please input site!",
              },
            ]}
          >
            <Select
              optionFilterProp="children" // Filters options based on the content of the children (party names)
              showSearch
              placeholder="Select site"
            >
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
            name="BusID"
            rules={[
              {
                required: true,
                message: "Please  provide input !",
              },
            ]}
          >
            <Select
              optionFilterProp="children" // Filters options based on the content of the children (party names)
              showSearch
              placeholder="Select bus"
            >
              {busList?.map((bus) => (
                <Select.Option key={bus.id} value={bus.id}>
                  {bus.busName}/{bus.busNo}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            style={{ marginBottom: "10px" }}
            label="DRIVER "
            name="DriverID"
            rules={[
              {
                required: true,
                message: "Please  provide input !",
              },
            ]}
          >
            <Select
              optionFilterProp="children" // Filters options based on the content of the children (party names)
              showSearch
              placeholder="Select driver"
            >
              {uniqueDrivers?.map((driver) => (
                <Select.Option key={driver.id} value={driver.id}>
                  {driver.name}
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
            <Select
              optionFilterProp="children" // Filters options based on the content of the children (party names)
              showSearch
              placeholder="Select helper"
            >
              {uniqueHelpers?.map((helper) => (
                <Select.Option key={helper.id} value={helper.id}>
                  {helper.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            style={{ marginBottom: "10px" }}
            label="DUTY TYPE "
            name="duty_type"
            rules={[
              {
                required: false,
                message: "Please input status!",
              },
            ]}
          >
            <Select placeholder="Select status">
              <Select.Option value="Day">Day</Select.Option>
              <Select.Option value="Night">Night</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            style={{ marginBottom: "10px" }}
            label="SITE STATUS "
            name="siteClosed"
            rules={[
              {
                required: true,
                message: "Please input status!",
              },
            ]}
          >
            <Select placeholder="Select status">
              <Select.Option value="true">Yes</Select.Option>
              <Select.Option value="false">No</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item style={{ marginTop: "20px", marginBottom: "10px" }}>
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

export default UpdateSetup;
