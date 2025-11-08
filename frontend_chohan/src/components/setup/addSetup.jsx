import { Button, Form, Select, Typography } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addSetup,
  loadAllSetup,
} from "../../redux/rtk/features/setup/setupSlice";
import { loadPartyPaginated } from "../../redux/rtk/features/party/partySlice";
import { loadAllSite } from "../../redux/rtk/features/site/siteSlice";
import { loadAllBus } from "../../redux/rtk/features/bus/busSlice";
import { loadAllDriver } from "../../redux/rtk/features/driver/driverSlice";
import { loadAllHelper } from "../../redux/rtk/features/helper/helperSlice";

const AddSetup = ({ drawer }) => {
  const dispatch = useDispatch();
  const { Title } = Typography;

  const { list: busList } = useSelector((state) => state.buses);
  const { list: partyList } = useSelector((state) => state.party);
  const { list: siteList } = useSelector((state) => state.sites);
  const { list: driverList } = useSelector((state) => state.drivers);
  const { list: helperList } = useSelector((state) => state.helpers);

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      const uppercaseValues = Object.keys(values).reduce((acc, key) => {
        let val = values[key];

        // Convert siteClosed: "true" → 0, "false" → 1
        if (key === "siteClosed") {
          acc[key] = val === "true" ? 1 : val === "false" ? 0 : val;
        } else {
          acc[key] = typeof val === "string" ? val.toUpperCase() : val;
        }

        return acc;
      }, {});

      const resp = await dispatch(addSetup(uppercaseValues, dispatch));

      if (resp.payload.message === "success") {
        dispatch(loadAllSetup({ status: true, page: 1, count: 1000 }));
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
    dispatch(loadPartyPaginated({ page: 1, count: 10000, status: true }));
    dispatch(loadAllSite({ page: 1, count: 10000, status: true }));
    dispatch(loadAllBus({ page: 1, count: 10000, status: true }));
    dispatch(loadAllDriver({ page: 1, count: 10000, status: true }));
    dispatch(loadAllHelper({ page: 1, count: 10000, status: true }));
  }, []);

  const uniqueDrivers = Array.from(
    new Map(driverList?.map((d) => [d.name, d])).values()
  );

  const uniqueHelpers = Array.from(
    new Map(helperList?.map((h) => [h.name, h])).values()
  );

  return (
    <>
      <div className="h-full">
        <Title level={4} className="m-3 text-center">
          Add Setup
        </Title>
        <Form
          form={form}
          className=""
          name="basic"
          layout="vertical"
          style={{ marginLeft: "40px", marginRight: "40px" }}
          initialValues={{
            remember: true,
            duty_type: "Day",
          }}
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
            name="siteID"
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
            name="busID"
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
            label="DRIVER"
            name="driverID"
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
              {uniqueDrivers.map((driver) => (
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
              {uniqueHelpers.map((helper) => (
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
              Add Setup
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default AddSetup;
