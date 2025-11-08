import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Row,
  Select,
  Typography,
  InputNumber,
  Input,
} from "antd";
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

const ReportDrawer = () => {
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
      <Form.Item className="mb-0" name="advAmount">
        <Input
          style={{ width: "90%" }}
          onChange={(e) =>
            handleAdvanceAmountChange(e.target.value, record.key)
          }
          // Add any other props you need for Input
        />
      </Form.Item>
      <Form.Item className="flex justify-center mt-[24px]">
        <Button
          type="primary"
          htmlType="submit"
          shape="round"
          loading={loading}
        >
          Submit
        </Button>
      </Form.Item>
    </>
  );
};

export default ReportDrawer;
