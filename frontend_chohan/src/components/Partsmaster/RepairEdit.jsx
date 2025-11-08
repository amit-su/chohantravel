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
  AutoComplete,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  loadsalarysetupPaginated,
  updateSalarysetup,
} from "../../redux/rtk/features/Salarysetupslice/salarysetslice";
import { loadAllBus } from "../../redux/rtk/features/bus/busSlice";
import dayjs from "dayjs";
import TextArea from "antd/es/input/TextArea";
import { toast } from "react-toastify";
import { Group } from "antd/es/avatar";

import { Link, useNavigate } from "react-router-dom";

let selectedsalary = [];
let busid = 0;
let partw = [];
let garageName1 = [];

const RepairEdit = () => {
  const { id } = useParams();
  console.log(id, "876");

  const [form1] = Form.useForm();
  const dispatch = useDispatch();
  const [editData, seteditData] = useState({});
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

  const navigate = useNavigate();
  const handleDateChange = useCallback((date) => {
    const newDate = dayjs(date, "YYYY-MM-DD");
    setSelectedDate(newDate.isValid() ? newDate : dayjs());
  }, []);
  ////
  const [loading3, setLoading3] = useState(true);
  const [error3, setError3] = useState(null);
  const [garageName, setGarageName] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [pastEntries, setPastEntries] = useState([]);
  const [repairedBy, setRepairedBy] = useState("");
  const [repairedBySuggestions, setRepairedBySuggestions] = useState([]);
  const [repairedByEntries, setRepairedByEntries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/busrepair/edit/${id}`);
        if (response.data) {
          seteditData(response.data[0]);
          selectedsalary = response.data.data[0];
          console.log("selectedsalary", response.data);
          busid = selectedsalary.BusID;
          const newValues = {
            GarageName: selectedsalary.GarageName,
            RepairDesc: selectedsalary.RepairDesc,
            UnitName: selectedsalary.UnitName,
            RepairedBy: selectedsalary.RepairedBy,
            GroupID: selectedsalary.partsname,
            Qty: selectedsalary.Qty,
            Rate: selectedsalary.Rate,
            Amt: selectedsalary.Amt,
          };
          setInitValues1(newValues);
          form1.setFieldsValue(newValues);
        }
      } catch (error) {
        setError3(error.message);
      } finally {
        setLoading3(false);
      }
    };

    // Call the function
    fetchData();
  }, [setLoading3]);
  console.log(pastEntries, "gg");

  const handleInput7Change = (value) => {
    setGarageName(value);
    setSuggestions(pastEntries);
  };
  const handleRepairedByInputChange = (value) => {
    setRepairedBy(value);
    setRepairedBySuggestions(repairedByEntries);
  };
  ////
  const [parts1, setpartsid] = useState();
  const [gid, setgid] = useState();
  const handlePartSelect = (partId) => {
    console.log(partId, "56565");
    const partgp = partsname?.find((part) => part.id === partId);
    console.log(partgp.Children, "4333", partgp.GroupID);
    partw = JSON.parse(partgp.Children);
    setgid(partgp.GroupID);
    console.log(partw, "partsw");

    setpartsid(partId);
  };
  const [partsid, setpartsid1] = useState();

  const handlePart = (partId) => {
    console.log(partId, "56565");
    setpartsid1(partId);
    // const partgp=partsname?.find((part)=>part.id===partId);
    // console.log(partgp.Children,"4333")
    // partw= JSON.parse(partgp.Children);
    // console.log(partw,"partsw")

    // setpartsid(partId);
  };

  //----------API GET------------//
  const apiUrl = import.meta.env.VITE_APP_API;

  const [loading2, setLoading2] = useState(true);
  const [error, setError] = useState(null);
  const [partsname, setpartsname] = useState([]);
  const [partsname1, setpartsname1] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/busparts`);
        setpartsname(response.data.data);
        console.log(partsname, "77676");
        const data = response.data.data;

        // Filter the data to include only items where GroupID contains '0'
        const filteredData = data.filter((item) => item.GroupID.includes("0"));

        setpartsname1(filteredData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading2(false);
      }
      try {
        const response = await axios.get(`${apiUrl}/busrepair`);
        const names = response.data.data.map((item) => item.GarageName);
        setPastEntries(names);
        const names1 = response.data.data.map((item) => item.RepairedBy);
        setRepairedByEntries(names1);
      } catch (error) {
        setError3(error.message);
      } finally {
        setLoading3(false);
      }
    };

    // Call the function
    fetchData();
  }, [setLoading2]);
  console.log(partsname, "76");
  // const filteredParts = partsname.filter(part =>  Number(part.GroupID[0]) !== 0);
  // partw=filteredParts;

  // console.log(filteredParts, "7699");
  //------end-----------------//
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
  useEffect(() => {}, [selectedsalary, form1]);
  console.log(selectedsalary, "676767");
  const onFinish = async (value) => {
    try {
      const response = await axios.post(`${apiUrl}/busrepair`, {
        id: id,
        RepDate: selectedDate.isValid()
          ? selectedDate.format("YYYY-MM-DD")
          : "",
        BusID: busid,
        PartsID: value.GroupID,
        RepairDesc: value.RepairDesc,
        Qty: value.Qty,
        UnitName: unit,
        Rate: value.Rate,
        Amt: amount,
        GarageName: value.GarageName,
        RepairedBy: value.RepairedBy,
        UserID: value.UserID,
        GroupID: gid,
      });

      console.log("Response:", response.data);
      toast.success("Add successful!");
      navigate(`/admin/selectrepairentry`);
    } catch (error) {
      console.error("Error:", error);
    }
  }; //calculation//
  const [quantity, setQuantity] = useState(0);
  const [rate, setRate] = useState(0);
  const [amount, setAmount] = useState(0);

  const handleQuantityChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    console.log(value, "56");
    setQuantity(value);
    setAmount(value * rate);
    form1.setFieldsValue({
      Amt: value * rate,
    });
  };

  const handleRateChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    console.log(value, "656");
    setRate(value);
    setAmount(quantity * value);
    form1.setFieldsValue({
      Amt: quantity * value,
    });
  };
  console.log(amount, "amt");
  //end//
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
  // const handleInput7Change = (e) => {
  //   setInput7(e.target.value);
  // };
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
  const [unit, setunit] = useState("PCS");
  const handleSelectUNIT = useCallback((value) => {
    setunit(value);

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
          // initialValues={initValues1}
          //   onFinishFailed={() => {
          //     setLoader(false);
          //   }}
          size="medium"
          autoComplete="off"
        >
          <div className="flex gap-20  ml-4 ">
            <div className=" ml-4 w-1/3.3">
              {/* <Form.Item
          style={{ marginBottom: "10px" }}
          label="Bus No:"
          name="BusID"
          rules={[
            {
              required: false,
              message: "Please fill input !",
            },
          ]}
        >
          <Select onChange={handleBusSelect} placeholder="Select bus type">
            {busList?.map((bus) => (
                <Select.Option key={bus.busName} value={bus.id}>
                  {bus.busNo}
                </Select.Option>
              ))}
          </Select>
        </Form.Item> */}
              <Form.Item
                style={{ marginBottom: "10px" }}
                label="Repair date"
                name="RepDate"
                rules={[
                  {
                    required: false,
                    message: "Please fill input !",
                  },
                ]}
              >
                <DatePicker
                  picker="date"
                  defaultValue={dayjs()}
                  onChange={(value) => handleDateChange(value)}
                  format={"DD-MM-YYYY"}
                />
              </Form.Item>
              <Form.Item
                style={{ marginBottom: "5px" }}
                label="Part Name"
                name="GroupID"
                className="w-80 mb-4"
                rules={[
                  {
                    required: true,
                    message: "Please provide input !",
                  },
                ]}
              >
                {/* <Select
              optionFilterProp="children" // Filters options based on the content of the children (party names)
              showSearch 
              onSelect={handlePartSelect}
            
              placeholder="Select group"
            >
               {partsname1?.map((parts) => (
                <Select.Option key={parts.id} value={parts.id}>
                  {parts.PartName}
                </Select.Option>
              ))}
            </Select> */}
                <Input placeholder="" onChange={handleQuantityChange} />
              </Form.Item>
              {/* <Form.Item
            style={{ marginBottom: "5px" }}
            label="Part Name"
            name="PartyID"
            className="w-80 mb-4"
            rules={[
              {
                required: true,
                message: "Please provide input !",
              },
            ]}
          >
            <Select
               onSelect={handlePart}
            
              placeholder="Select part"
            >
              {partw?.map((parts) => (
                <Select.Option key={parts.id} value={parts.id}>
                  {parts.PartName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item> */}
              <Form.Item className="w-80" label="Quantity" name="Qty">
                <Input
                  placeholder=""
                  type="number"
                  onChange={handleQuantityChange}
                />
              </Form.Item>
              <Form.Item
                style={{ marginBottom: "10px", width: "100%" }}
                label="Unit"
                name="UnitName"
                // rules={[{ required: true, message: "Driver / Helper" }]}
              >
                <Select
                  onChange={handleSelectUNIT}
                  placeholder="Select Unit"
                  defaultValue={"PCS"}
                >
                  <Select.Option value={"PCS"}>PCS</Select.Option>
                  <Select.Option value={"KGS"}>KGS</Select.Option>
                  <Select.Option value={"ROLL"}>ROLL</Select.Option>
                  <Select.Option value={"LTR"}>MTR</Select.Option>
                  <Select.Option value={"May"}>BOX</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Rate"
                className="w-80"
                name="Rate"
                rules={[
                  {
                    required: false,
                    message: "Please input Date!",
                  },
                ]}
              >
                <Input
                  placeholder=""
                  type="number"
                  onChange={handleRateChange}
                />
              </Form.Item>
              <Form.Item
                style={{ marginBottom: "10px" }}
                label="Amount"
                name="Amt"
                className="w-80"
                defaultValue={"878676"}
              >
                <Input placeholder={amount} readOnly />
              </Form.Item>
            </div>
            <div className="w-2/2 float-right">
              <Form.Item
                style={{ width: "30rem" }}
                label="Garage name"
                className="w-80"
                name="GarageName"
              >
                <AutoComplete
                  value={garageName}
                  onChange={handleInput7Change}
                  options={suggestions.map((suggestion, index) => ({
                    value: suggestion,
                    key: index,
                  }))}
                >
                  <Input />
                </AutoComplete>
              </Form.Item>
              <Form.Item className="w-80" label="Repaired by" name="RepairedBy">
                <AutoComplete
                  value={repairedBy}
                  onChange={handleRepairedByInputChange}
                  options={repairedBySuggestions.map((suggestion, index) => ({
                    value: suggestion,
                    key: index,
                  }))}
                >
                  <Input size="small" />
                </AutoComplete>
              </Form.Item>
              <Form.Item
                style={{ width: "30rem" }}
                label="Repaired Description "
                name="RepairDesc"
                rules={[
                  {
                    required: true,
                    message: "Please provide input !",
                  },
                ]}
              >
                <TextArea rows={4} placeholder="Enter Party address" />
              </Form.Item>
            </div>
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
            <div className="flex gap-2">
              <Form.Item
                style={{ marginTop: "10px", marginRight: "100px" }}
                className="w-full"
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

export default RepairEdit;
