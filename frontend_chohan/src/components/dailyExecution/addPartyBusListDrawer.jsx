import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, DatePicker, Form, Row, Select, Typography } from "antd";
import {
  addDailyExecution,
  loadAllDailyExecution,
} from "../../redux/rtk/features/dailyExecution/dailyExecutionSlice";
import { loadAllSetup } from "../../redux/rtk/features/setup/setupSlice";
import { loadAllSite } from "../../redux/rtk/features/site/siteSlice";
import TableComponent from "../CommonUi/TableComponent";
import { loadAllDriver } from "../../redux/rtk/features/driver/driverSlice";
import { loadAllHelper } from "../../redux/rtk/features/helper/helperSlice";
import dayjs from "dayjs";

const { Title } = Typography;

const AddPartyBusListDrawer = () => {
  const dispatch = useDispatch();

  const { list: setupList, loading: setupLoading } = useSelector(
    (state) => state.setups
  );

  const { list: driverList, loading: driverLoading } = useSelector(
    (state) => state.drivers
  );
  const { list: helperList, loading: helperLoading } = useSelector(
    (state) => state.helpers
  );
  const { list: partyList } = useSelector((state) => state.party);
  const { list: siteList } = useSelector((state) => state.sites);

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [filteredBuses, setFilteredBuses] = useState([]);

  const handlePartyAndSiteSelect = (partyName, siteName) => {
    const filteredBuses = setupList?.filter(
      (setup) =>
        Number(setup.PartyID) === partyName && Number(setup.SiteID) === siteID
    );
    setFilteredBuses(filteredBuses);
    console.log("filteredBuses", filteredBuses);
  };

  const onFinish = async () => {
    try {
      const { partyName, siteID } = form.getFieldsValue();
      console.log("siteName , party", siteID, partyName);
      const filteredBuses = setupList?.filter(
        (setup) =>
          Number(setup.PartyID) === partyName && Number(setup.SiteID) === siteID
      );
      const selectedParty = setupList.find(
        (setup) => Number(setup.PartyID) === partyName
      );
      const selectedSite = setupList.find(
        (setup) => Number(setup.SiteID) === siteID
      );
      console.log("selectedSite", filteredBuses);
      const dataToSend = filteredBuses.map((bus) => ({
        PartyID: selectedParty.PartyID,
        SiteID: selectedSite.SiteID,
        DriverID: bus.DriverID,
        HelperID: bus.HelperID,
        UserID: 1, // You need to define userId or get it from somewhere
        CreatedOn: new Date(),
        BusID: bus.BusID,
      }));

      const resp = await Promise.all(
        dataToSend.map((data) =>
          dispatch(addDailyExecution({ values: data, dispatch: dispatch }))
        )
      );

      dispatch(
        loadAllDailyExecution({
          status: dayjs().format("YYYY-MM-DD"),
          page: 1,
          count: 1000,
        })
      );

      setLoading(false);
      form.resetFields();
    } catch (error) {
      setLoading(false);
    }
  };

  const onFinishFailed = () => {
    setLoading(false);
  };

  useEffect(() => {
    dispatch(loadAllSetup({ page: 1, count: 10000, status: true }));
    dispatch(loadAllSite({ page: 1, count: 10000, status: true }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(loadAllDriver({ page: 1, count: 10000, status: true }));
    dispatch(loadAllHelper({ page: 1, count: 10000, status: true }));
  }, [dispatch, filteredBuses]);

  const isDriverHelperLoaded = !driverLoading && !helperLoading;

  const uniqueParties = Array.from(
    new Set(setupList?.map((setup) => setup.partyName))
  );
  console.log(uniqueParties);
  const uniqueSites = Array.from(
    new Set(
      setupList
        ?.map((setup) => ({
          siteName: setup.siteName,
          siteId: setup.SiteID,
        }))
        .map((site) => `${site.siteName}-${site.siteId}`)
    )
  ).map((site) => {
    const [siteName, siteId] = site.split("-");
    return { siteName, siteId };
  });
  return (
    <>
      <div className="h-full">
        <Title level={4} className="m-3 text-center">
          Add Party Bus List
        </Title>
        <Form
          form={form}
          className=""
          name="basic"
          layout="vertical"
          style={{ marginLeft: "40px", marginRight: "40px" }}
          initialValues={{
            remember: true,
            date: dayjs(),
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Form.Item
                label="PARTY"
                name="partyName"
                rules={[
                  {
                    required: true,
                    message: "Please provide input!",
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
            </Col>

            <Col span={8}>
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
            </Col>
            <Col span={8}>
              <Form.Item
                label="DATE"
                name="date"
                rules={[
                  {
                    required: true,
                    message: "Please provide input!",
                  },
                ]}
              >
                <DatePicker defaultValue={dayjs()} format={"DD-MM-YYYY"} />
              </Form.Item>
            </Col>
          </Row>

          {isDriverHelperLoaded && (
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <TableComponent
                  loading={setupLoading}
                  list={filteredBuses}
                  columns={[
                    {
                      title: "Bus Name",
                      dataIndex: "busName",
                      key: "busName",
                    },
                    {
                      title: "Bus Number",
                      dataIndex: "busNo",
                      key: "busNo",
                    },
                    {
                      title: "Driver",
                      dataIndex: "driverID",
                      key: "driverID",
                      render: (driverID, record) => (
                        <Select
                          optionFilterProp="children" // Filters options based on the content of the children (party names)
                          showSearch
                          value={record.DriverID}
                          onChange={(value) => {
                            const updatedBuses = filteredBuses?.map((bus) => {
                              if (bus.id === record.id) {
                                return { ...bus, DriverID: value };
                              }
                              return bus;
                            });
                            setFilteredBuses(updatedBuses);
                          }}
                        >
                          {driverList?.map((driver) => (
                            <Select.Option key={driver.id} value={driver.id}>
                              {driver.driverName}
                            </Select.Option>
                          ))}
                        </Select>
                      ),
                    },
                    {
                      title: "Helper",
                      dataIndex: "helperID",
                      key: "helperID",
                      render: (helperID, record) => (
                        <Select
                          optionFilterProp="children" // Filters options based on the content of the children (party names)
                          showSearch
                          value={record.HelperID}
                          onChange={(value) => {
                            const updatedBuses = filteredBuses?.map((bus) => {
                              if (bus.id === record.id) {
                                return { ...bus, HelperID: value };
                              }
                              return bus;
                            });
                            setFilteredBuses(updatedBuses);
                          }}
                        >
                          {helperList?.map((helper) => (
                            <Select.Option key={helper.id} value={helper.id}>
                              {helper.helperName}
                            </Select.Option>
                          ))}
                        </Select>
                      ),
                    },
                  ]}
                />
              </Col>
            </Row>
          )}

          <Form.Item className="flex justify-center mt-[24px]">
            <Button
              type="primary"
              htmlType="submit"
              shape="round"
              loading={loading}
            >
              Add Party Bus List
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default AddPartyBusListDrawer;
