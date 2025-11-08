import { Button, DatePicker, Form, Input, Select, TimePicker } from "antd";
import React, { useBusCategory, useState,useCallback,useEffect } from "react";
import { PowerBIEmbed } from "powerbi-client-react";
import moment from "moment";
import dayjs from "dayjs";
import { loadPowerbiToken } from "../../redux/rtk/features/powerBi/powerBiBookingRegisterSlice";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
function SalaryProcessPrintdrawer() {
  // console.log(invoiceNo,"iv")
  const { id } = useParams();

  // const invoiceNo=invoiceNo;


  //Date issue//s
  const dispatch = useDispatch();
  const { data, loading } = useSelector(
    (state) => state.powerbiBookingRegister
  );
  const convertToISO = (date) => {
    if (moment(date, moment.ISO_8601, true).isValid()) {
      return date;
    }
    
    if (moment(date, 'DD-MM-YYYY', true).isValid()) {
      return moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD');
    }

    return null;
  };
  //END//

 
 
  const [reportInfo, setReportInfo] = useState(null);

  useEffect(() => {
    if (!data) {
      dispatch(
        loadPowerbiToken({ reportId: "42b4c521-cd8f-4648-8f67-5c16daac33e2" })
      );
    }
    if (data) {
      setReportInfo(data);
      console.log("report data",reportInfo);
    }
  }, [dispatch, data, reportInfo]);
  
 
 
 
  

  return (
    <>
      <div className="text-center">
        <div className="">
         <h1><strong>Salary </strong></h1>
        </div>
        <div>
      {reportInfo && data && reportInfo.embedUrl ? (
        <PowerBIEmbed
          embedConfig={{
            type: "report",
            id: reportInfo.id,
            embedUrl: reportInfo.embedUrl+"&rp:id="+id,
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
           
          </div>
        </>
      )}
    </div>
      </div>
    </>
  );
}

export default SalaryProcessPrintdrawer;
