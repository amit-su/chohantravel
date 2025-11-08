import { Button, DatePicker, Form, Input, Select, TimePicker } from "antd";
import React, { useBusCategory, useState, useCallback, useEffect } from "react";
import { PowerBIEmbed } from "powerbi-client-react";
import moment from "moment";
import dayjs from "dayjs";
import { loadPowerbiToken } from "../../redux/rtk/features/powerBi/powerBiBookingRegisterSlice";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
function FuelReportPrint() {
 
  // const invoiceNo=invoiceNo;

  //Date issue//s
  const dispatch = useDispatch();
  const { data, loading } = useSelector(
    (state) => state.powerbiBookingRegister
  );
 
  const [reportInfo, setReportInfo] = useState(null);

  useEffect(() => {
    if (!data) {
      dispatch(
        loadPowerbiToken({ reportId: "4ae2c6f0-e088-4b35-8ab9-d1bb40bbb423" })
      );
    }
    if (data) {
      setReportInfo(data);
      console.log("report data", reportInfo);
    }
  }, [dispatch, data, reportInfo]);

  return (
    <>
      <div className="text-center">
        <div className="">
          <h1>
            <strong>Daily Fuel Register </strong>
          </h1>
        </div>
        <div>
          {reportInfo && data && reportInfo.embedUrl ? (
            <PowerBIEmbed
              embedConfig={{
                type: "report",
                id: reportInfo.id,
                embedUrl: reportInfo.embedUrl,
                accessToken: reportInfo.token,
                settings: {
                  panes: {
                    filters: {
                      expanded: false,
                      visible: true,
                    },
                  },
                },
              }}
              cssClassName={"Embed-container"}
              getEmbeddedComponent={(embeddedReport) => {
                window.report = embeddedReport;
              }}
            />
          ) : (
            <>
              <div className="flex justify-center items-center col-lg-2"></div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default FuelReportPrint;
