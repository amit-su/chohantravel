import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Card,
  Form,
  Select,
  DatePicker,
  Button,
  InputNumber,
  Input,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  loadsalarysetupPaginated,
  updateSalarysetup,
} from "../../redux/rtk/features/Salarysetupslice/salarysetslice";
import { loadAllBus } from "../../redux/rtk/features/bus/busSlice";
import dayjs from "dayjs";
import TextArea from "antd/es/input/TextArea";
import { useNavigate } from "react-router-dom";

let selectedsalary = [];
let gid = null;

const AddParts = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Initialize the navigate function

  console.log(id, "876");
  const [form1] = Form.useForm();
  const dispatch = useDispatch();
  const { list: busList } = useSelector((state) => state.buses);
  useEffect(() => {
    dispatch(loadAllBus({ page: 1, count: 10000, status: true }));

    console.log("useEffect");
  }, [dispatch]);

  const handleBusSelect = (busId) => {
    // Find the selected bus object from busList

    const selectedBus = busList?.find((bus) => bus.id === busId);

    // Set default ""values"" for driver and helper based on the selected bus
    // setInitValues({
    //   allotedDriver: parseInt(selectedBus?.driverID),
    //   allotedHelper: parseInt(selectedBus?.helperID),
    // });
    // form.setFieldsValue(initValues);
  };
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const handleDateChange = useCallback((date) => {
    const newDate = dayjs(date, "YYYY-MM-DD");
    setSelectedDate(newDate.isValid() ? newDate : dayjs());
  }, []);

  //----------API GET------------//
  const apiUrl = import.meta.env.VITE_APP_API;

  const [loading2, setLoading2] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/salarysetup/byid/${id}`);

        console.log(response.data.data[0], "data");
        selectedsalary = response.data.data[0];
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading2(false);
      }
    };

    // Call the function
    fetchData();
  }, []);
  //------end-----------------//
  //API CALL//
  const [Partlist, setPartlist] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/busparts`);
        setPartlist(response.data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading2(false);
      }
    };

    // Call the function
    fetchData();
  }, [setLoading2]);
  //END//
  console.log(Partlist, "787878");
  const [parts1, setpartsid] = useState();
  const handlePartSelect = (partId) => {
    console.log(partId, "6767");
    const matchingPart = Partlist.find((part) => part.id === partId.toString());
    if (matchingPart) {
      // Retrieve the GroupID
      const groupId = matchingPart.GroupID;
      gid = partId;
      console.log(`GroupID for partId ${partId}:`, groupId);
    } else {
      console.log(`No matching part found for partId ${partId}`);
    }

    setpartsid(gid);
  };
  const [initValues1, setInitValues1] = useState({
    basic: selectedsalary?.BASIC,
    medicalAllowance: selectedsalary?.MedicalAllowance,
    hra: selectedsalary?.HRA,
    ta: selectedsalary?.TA,
    Month: selectedsalary?.Month,
    washingAllowance: selectedsalary?.WashingAllowance,
    esic: selectedsalary?.ESIC,
    advance: selectedsalary?.Advance,
    pf: selectedsalary?.PF,
    ptax: selectedsalary?.PTAX,
    absent: selectedsalary?.absent,
    Year: selectedsalary?.Year,
  });
  useEffect(() => {
    const newValues = {
      basic: selectedsalary?.BASIC,
      medicalAllowance: selectedsalary?.MedicalAllowance,
      hra: selectedsalary?.HRA,
      ta: selectedsalary?.TA,
      Month: selectedsalary?.Month,

      washingAllowance: selectedsalary?.WashingAllowance,
      esic: selectedsalary?.ESIC,
      advance: selectedsalary?.Advance,
      pf: selectedsalary?.PF,
      ptax: selectedsalary?.PTAX,
      absent: selectedsalary?.absent,
      Year: selectedsalary?.Year,
    };
    setInitValues1(newValues);
    form1.setFieldsValue(newValues);
  }, [selectedsalary, form1]);
  console.log(selectedsalary, "676767");
  const onFinish = async (value) => {
    try {
      console.log(value, "676");
      const response = await axios.post(`${apiUrl}/busparts`, {
        id: value.id,
        EntryDate: selectedDate.isValid()
          ? selectedDate.format("YYYY-MM-DD")
          : "",
        GroupID: parts1 || 0,
        PartName: value.PartName,
      });
      if (response.status === 200 || response.status === 201) {
        // Check if the response status is successful
        console.log("Response:", response.data);
        navigate("/admin/partsmaster"); // Navigate to the desired route
      } else {
        console.error("Failed to post data:", response);
      }

      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const [input1, setInput1] = useState(initValues1.basic || 0);
  const [input2, setInput2] = useState(initValues1.hra || 0);

  const [input5, setInput5] = useState(initValues1.medicalAllowance || 0);
  const [input3, setInput3] = useState(initValues1.washingAllowance || 0);
  const [input6, setInput6] = useState(initValues1.pf || 0);
  const [input8, setInput8] = useState(initValues1.esic || 0);

  const [input4, setInput4] = useState(initValues1.ta || 0);
  const [input7, setInput7] = useState(initValues1.ptax || 0);

  const handleInput1Change = (e) => {
    setInput1(e.target.value);
  };

  const handleInput2Change = (e) => {
    setInput2(e.target.value);
  };
  const handleInput3Change = (e) => {
    setInput3(e.target.value);
  };
  const handleInput4Change = (e) => {
    setInput4(e.target.value);
  };
  const handleInput5Change = (e) => {
    setInput5(e.target.value);
  };
  const handleInput6Change = (e) => {
    setInput6(e.target.value);
  };
  const handleInput7Change = (e) => {
    setInput7(e.target.value);
  };
  const handleInput8Change = (e) => {
    setInput8(e.target.value);
  };
  const calculateSum = () => {
    const sum =
      parseFloat(input1 || initValues1.basic) +
      parseFloat(input2 || initValues1.hra) +
      parseFloat(input4 || initValues1.ta) +
      +parseFloat(input3 || initValues1.washingAllowance) +
      parseFloat(input5 || initValues1.medicalAllowance);

    console.log(sum, "sum");
    return isNaN(sum) ? 0 : sum;
  };
  const calculatetax = () => {
    const sum =
      parseFloat(input6 || initValues1.pf || 0) +
      parseFloat(input7 || initValues1.ptax || 0) +
      +parseFloat(input8 || initValues1.esic || 0);

    // console.log(sum,"sum")
    return isNaN(sum) ? 0 : calculateSum() - sum || 0;
  };
  const [selectedmonth, setSelectedmonth] = useState(initValues1.Month);
  let monthname = selectedmonth;
  const handleSelectChangemonth = useCallback((value) => {
    monthname = value;

    setSelectedmonth(value);

    // useEffect(() => {
    //   dispatch(loadsalarysetupPaginated(selectedEmpType));
    // }, [dispatch, selectedEmpType]);
  }, []);

  return (
    <>
      <div>
        <Form
          form={form1}
          name="dynamic_form_nest_item"
          onFinish={onFinish}
          layout="vertical"
          initialValues={initValues1}
          //   onFinishFailed={() => {
          //     setLoader(false);
          //   }}
          size="medium"
          autoComplete="off"
        >
          <div className="flex gap-20  ml-4 ">
            <div className=" ml-4 w-1/3.3">
              <Form.Item
                style={{ marginBottom: "20px" }}
                label="Parts Name"
                name="PartName"
                className="w-80"
              >
                <Input placeholder="" onChange={handleInput3Change} />
              </Form.Item>
              <Form.Item className="w-80" label="Group Name" name="GroupID">
                <Select
                  optionFilterProp="children" // Filters options based on the content of the children (party names)
                  showSearch
                  onSelect={handlePartSelect}
                  placeholder="Select Group"
                >
                  {Partlist?.filter((parts) => parts.GroupID === "0").map(
                    (parts) => (
                      <Select.Option key={parts.id} value={parts.id}>
                        {parts.PartName}
                      </Select.Option>
                    )
                  )}
                  {/* {Partlist?.map((parts) => (
                <Select.Option key={parts.id} value={parts.id}>
                  {parts.PartName}
                </Select.Option>
              ))} */}
                </Select>
              </Form.Item>
            </div>
            <div className="w-2/2 float-right"></div>
          </div>
          <div className="flex gap-2">
            <Form.Item
              style={{
                marginTop: "10px",
                marginRight: "100px",
                width: "200px",
                marginLeft: "30px",
              }}
              className=""
            >
              <Button
                block
                type="primary"
                htmlType="submit"

                // loading={loader}
                // onClick={() => setLoader(true)}
              >
                Submit
              </Button>
            </Form.Item>
          </div>
          <div className="w-1/2 float-right mx-5">
            {/* <div className="py-2">
          <div className="p-1 flex justify-between">
            <strong>Gross Salary: </strong>
            <strong>{      <div>{calculateSum().toFixed(2)}</div>
} </strong>
          </div>
          <div className="p-1 flex justify-between">
            <strong>Net Salary:</strong>
            <strong>
              {calculatetax()}
            </strong>
            
         
{/* //hello// */}
            {/* </div> */}

            {/* </div>  */}
          </div>

          <div className="w-80 my-4 float-right m-2">
            <Form.Item
              // hidden={confirmBookings}
              style={{ marginTop: "15px" }}
              className="w-72"
            >
              {/* <Button
            block
            type="primary"
            htmlType="submit"
            // onClick={handleConfirm}
            // loading={loader}
          >
            Create Booking Entry
          </Button> */}
            </Form.Item>
          </div>
        </Form>
      </div>
    </>
  );
};

export default AddParts;
