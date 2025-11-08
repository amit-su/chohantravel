// Import necessary modules from React, Ant Design, and Redux
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DatePicker, Form, Select } from "antd";
import UserPrivateComponent from "../PrivacyComponent/UserPrivateComponent";
import CreateDrawer from "../CommonUi/CreateDrawer";
import ReportDrawer from "./reportdrawer";
import { Card, Button } from "antd";
import { loadAllDriver } from "../../redux/rtk/features/driver/driverSlice";
import { loadAllHelper } from "../../redux/rtk/features/helper/helperSlice";
import { DeleteOutlined } from "@ant-design/icons";
import TableComponent from "../CommonUi/TableComponent";
import dayjs from "dayjs";
import axios from "axios";
import { loadAllDailyExecution } from "../../redux/rtk/features/dailyExecution/dailyExecutionSlice";
import { updateDailyExecution } from "../../redux/rtk/features/dailyExecution/dailyExecutionSlice";
let helperarray=[];
let driverarray=[];
let Busnoarray=[];
const DailyExecution = () => {
  //----------------API CALL HELPER-------------------//
  let [list2, setList] = useState([]);
const  [dailylist, setDailyList] = useState([]);
  const [loading2, setLoading2] = useState(true);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_APP_API;



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/helper`);
       setList(response.data.data);
       helperarray=response.data.data;
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading2(false);
      }
    };

    // Call the function
    fetchData();
  }, []); 

  //-------------END---------------------------//
  //----------------API CALL HELPER-------------------//
  let [list3, setList3] = useState([]);




  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/driver`);
       setList(response.data.data);
       driverarray=response.data.data;
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading2(false);
      }
    };

    // Call the function
    fetchData();
  }, []); 


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`dailyExecution/${selectedDate?.format("YYYY-MM-DD")}`);
        setDailyList(response.data.data);
       //driverarray=response.data.data;
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading2(false);
      }
    };

    // Call the function
    fetchData();
  }, []); 
  //-------------END---------------------------//
  //--------busno-----------------//
  let [list4, setList4] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/bus`);
        setList4(response.data.data);
       Busnoarray=response.data.data;
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading2(false);
      }
    };

    // Call the function
    fetchData();
  }, []); 
  //END//
  console.log(Busnoarray,"787")
  

  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedDriver, setSelectedDriver] = useState({});
  const [selectedHelper, setSelectedHelper] = useState("");
  const [loading1, setLoading] = useState(false);

  const dispatch = useDispatch();

  // const { list, total, loading } = useSelector(
  //   (state) => state.dailyExecutions
  // );
  const { list: driverList } = useSelector((state) => state.drivers);
  // const { list: helperList } = useSelector((state) => state.helpers);
  const helperList=list2;
  console.log(helperList,"75656")


  const handleDateChange = useCallback((date) => {
    setSelectedDate(date || dayjs());
  }, []);

  
  useEffect(() => {
   console.log("selectedDate",selectedDate);


   const fetchData = async () => {
    try {
      const response = await axios.get(`dailyExecution/${selectedDate?.format("YYYY-MM-DD")}`);
      setDailyList(response.data.data);
     //driverarray=response.data.data;
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading2(false);
    }
  };


  // Call the function
  fetchData();
  }, [dispatch, selectedDate]);

  // Function to handle deletion of a record
  const onDelete = async (id) => {
  };

 

  // Function to handle driver change
  let newdriver="";
  
  const handleDriverChange = (value) => {
    setSelectedDriver(value);
   
  };
  const handleSelectChange1 =  useCallback((value) => {
    
    newdriver = value;
    console.log(newdriver,"78")
    
  }, []);
  let newhelper="";
  const handleSelectChange2 =  useCallback((value) => {
    newhelper = value;
  }, []);
  let busno="";
  const handleSelectChange3 =  useCallback((value) => {
    busno = value;
  }, []);
  
  // useEffect(() => {
  //   console.log("Selected Driver:", selectedDriver);
  // }, [selectedDriver]);
   
  
  const handleHelperChange = (value) => {
    
    setSelectedHelper(value);
  };
 
  const onSave = async (record) => {
    try {
      console.log(record,"6767")
      record.HelperID=newhelper !="" ? newhelper:record.HelperID;
      record.DriverID=newdriver != "" ? newdriver : record.DriverID;
      const helperID = record.HelperID;
      const driverID=record.DriverID;
      const foundHelper = helperarray.find(helper => helper.id === helperID);
      const foundDriver = driverarray.find(driver => driver.id === driverID);
      const helperName = foundHelper ? foundHelper.name : "Helper not found";
      const driverName = foundDriver ? foundDriver.name : "Driver not found";
      record.DriverName=driverName;
      record.HelperName=helperName;
      record.busNo=busno != "" ? busno : record.busNo;




      

      // const updatedRecord = {
      //   ...record,
      //    driverID : newdriver,
      //   helperID:newhelper,
      // };

      const resp = await dispatch(updateDailyExecution({ id: record.id, values: record }));
      

    } catch (error) {
      setLoading(false);
    }
  };
  
  

  const columns = [
    {
      title: "Party Name",
      dataIndex: "PartyName",
      key: "PartyName",
      width: 200,
    },
    {
      title: "Site Name",
      dataIndex: "SiteName",
      key: "SiteName",
      width: 200,
    },
    {
      title: "Bus No",
      dataIndex: "busNo",
      key: "busNo",
      width: 150,
      render: (text, record) => (
        <Select 
        optionFilterProp="children" // Filters options based on the content of the children (party names)
        showSearch 
          defaultValue={text} 
          style={{ width: 150 }}
          onChange={handleSelectChange3}

        >
          {Busnoarray?.map(busno => (
          <Select.Option key={busno.id} value={busno.busNo}>
          {busno.busNo}
        </Select.Option>
          ))} 
        </Select>
      ),
    },
    {
      title: "Bus Type",
      dataIndex: "busType",
      key: "busType",
      width: 150,
    },
    {
      title: "Driver Name",
      dataIndex: "DriverName",
      key: "DriverName",
      width: 150,
      render: (text, record) => (
        <Select 
        optionFilterProp="children" // Filters options based on the content of the children (party names)
        showSearch 
          defaultValue={record.DriverID} 
          style={{ width: 150 }}
          onChange={handleSelectChange1}

        >
          {driverarray?.map(driver => (
          <Select.Option key={driver.id} value={driver.id}>
          {driver.name}
        </Select.Option>
          ))} 
        </Select>
      ),
    },
    {
      title: "Helper Name",
      dataIndex: "HelperName",
      key: "HelperName",
      
      width: 150,
      render: (text, record) => (
        <Select 
        optionFilterProp="children" // Filters options based on the content of the children (party names)
        showSearch 
        onChange={handleSelectChange2}
        defaultValue={record.HelperID} 
          style={{ width: 150 }}
        >
          {helperarray?.map(helper => (
          <Select.Option key={helper.id} value={helper.id}>
          {helper.name}
        </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Created On",
      dataIndex: "CreatedOn",
      key: "CreatedOn",
      render: (date) => dayjs(date).format("DD-MM-YYYY"),
      width: 150,
    },
    {
      title: "Action",
      key: "action",
      width: 60,
      render: (_, record) => (
        <>
        
       <div className="flex-initial flex items-center space-x-2">
       {/* <UserPrivateComponent permission="update-bookingEntry">
            <CreateDrawer
              update={1}
              permission={"update-bookingEntry"}
              title={"Report"}
              width={30}
              color={
                restData?.BusAllotmentStatus != null
                  ? "bg-green-500"
                  : "bg-red-500"
              }
            >
              {console.log("restData", restData)}
              <ReportDrawer
                data={record}
                id={ID}
                formattedBookingID={formattedBookingID}
                decodedBookingID={decodedBookingID}
              />
            </CreateDrawer>
          </UserPrivateComponent> */}
  {/* <span onClick={() => onDelete(record.id)}>
    <DeleteOutlined />
  </span> */}
  <Button
    type="primary"
    className="bg-green-600 text-white rounded-md flex text-center"
    style={{ width: "60px" }}
    loading={loading1}

    onClick={() => onSave(record)}
  >
    Save
  </Button>
</div></>
      ),
    },
  ];

  return (
    <Card
      className="border-0 md:border md:p-6 bg-transparent md:bg-[#fafafa]"
      bodyStyle={{ padding: 0 }}
    >
      <Form.Item
        style={{
          marginBottom: "10px",
          width: "21%",
        }}
        label="Date"
        name="date"
        rules={[{ required: false, message: "Please select a date" }]}
      >
        <DatePicker
          picker="date"
          defaultValue={dayjs()}
          format={"YYYY-MM-DD"}
          onChange={handleDateChange}
          className="custom-date-picker"
        />
      </Form.Item>
      <div className="lg:flex items-center justify-between pb-3">
        <h1 className="text-lg font-bold">Daily Execution</h1>
        {/* Your AddPartyBusListDrawer component */}
      </div>
      <UserPrivateComponent permission={"readAll-dailyExecution"}>

      <TableComponent
        list={dailylist}
        csvFileName={"dailyExecution"}
        total={total}
        loading={loading2}
        columns={columns}
        
        paginatedThunk={loadAllDailyExecution}
        paginationStatus={selectedDate}
        scrollX={1700}
      />
                  </UserPrivateComponent>

    </Card>
  );
};

export default DailyExecution;
