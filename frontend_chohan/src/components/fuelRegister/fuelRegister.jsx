import React from "react";
import { useEffect, useState } from "react";
import { PowerBIEmbed } from "powerbi-client-react";
import { loadPowerbiToken } from "../../redux/rtk/features/powerBi/powerBiFuelRegisterSlice";
import { useDispatch, useSelector } from "react-redux";
import { Spin } from "antd";
const FuelRegister = () => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.powerbiFuelRegister);
  const [reportInfo, setReportInfo] = useState(null);

  useEffect(() => {
    if (!loading && !data) {
      dispatch(
        loadPowerbiToken({ reportId: "16eb9194-c437-4b7c-9a9d-a3fc6c5cb4dc" })
      );
    }
    if (data) {
      setReportInfo(data);
      console.log(reportInfo);
    }
  }, [dispatch, data, loading, reportInfo]);

  return (
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
          <div className="flex justify-center items-center col-lg-2">
            <Spin size="large" />
            <span className="mx-2"> Loading Report...</span>
          </div>
        </>
      )}
    </div>
  );
};

export default FuelRegister;
