import { useState, useEffect, useCallback } from "react";
import {
  Card,
  Form,
  Select,
  DatePicker,
  Button,
  InputNumber,
  Input,
} from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import axios from "axios";
import TextArea from "antd/es/input/TextArea";

import {
  loadAdvanceToStaffEntryPaginated,
  deleteAdvanceToStaffEntry,
} from "../../redux/rtk/features/advanceToStaffEntry/advanceToStaffEntrySlice";
import { loadAllDriver } from "../../redux/rtk/features/driver/driverSlice";
import { loadAllHelper } from "../../redux/rtk/features/helper/helperSlice";
import TableComponent from "../CommonUi/TableComponent";
import UserPrivateComponent from "../PrivacyComponent/UserPrivateComponent";
import {
  loadsalarysetupPaginated,
  updateSalarysetup,
} from "../../redux/rtk/features/Salarysetupslice/salarysetslice";
let editedRows = [];
let empdetailsarray = [];
let selectedemp = [];
let slartysetdeil = [];
let selectedsalary = [];
const { Option } = Select;

const GetAllSalarySet = () => {
  //date//
  const convertToISO = (date) => {
    if (moment(date, moment.ISO_8601, true).isValid()) {
      return date;
    }

    if (moment(date, "DD-MM-YYYY", true).isValid()) {
      return moment(date, "DD-MM-YYYY").format("YYYY-MM-DD");
    }

    return null;
  };
  ///
  //form//
  const [form] = Form.useForm();
  const [form1] = Form.useForm();

  //end//
  //call Api//
  const [helperData, setHelperData] = useState([]);
  const [driverData, setDriverData] = useState([]);
  const [data, setList] = useState([]);
  const [empdetails, setempdetails] = useState([]);

  const [loading2, setLoading2] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmpType, setSelectedEmpType] = useState("HELPER");
  const [selectedmonth, setSelectedmonth] = useState("January");
  const [selectedempname, setSelectedempname] = useState();

  const apiUrl = import.meta.env.VITE_APP_API;

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get(`${apiUrl}/salarysetup//${selectedEmpType}`);
  //       if (selectedEmpType === "HELPER") {
  //         setHelperData(response.data.data);
  //         setList(response.data.data);
  //       } else if (selectedEmpType === "DRIVER") {
  //         setDriverData(response.data.data);
  //         setList(response.data.data);
  //       }
  //     } catch (error) {
  //       setError(error.message);
  //     } finally {
  //       setLoading2(false);
  //     }
  //   };

  //   // Call the function
  //   fetchData();
  // }, [selectedEmpType]);
  // console.log("hfg",data)
  // const list1 = selectedEmpType === "HELPER" ? helperData : driverData;
  // slartysetdeil=list1;
  // console.log(list1,"6775",slartysetdeil)
  //End Api
  //FOR Details API//
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (selectedEmpType === "HELPER") {
          const response = await axios.get(`${apiUrl}/helper`);
          setempdetails(response.data.data);
          empdetailsarray = response.data.data;
        } else if (selectedEmpType === "DRIVER") {
          const response = await axios.get(`${apiUrl}/driver`);
          setempdetails(response.data.data);
          empdetailsarray = response.data.data;
        } else if (selectedEmpType === "STAFF") {
          const response = await axios.get(`${apiUrl}/staff`);
          setempdetails(response.data.data);
          empdetailsarray = response.data.data;
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading2(false);
      }
    };

    // Call the function
    fetchData();
  }, [selectedEmpType]);
  console.log(empdetails, "766767676");

  //END//
  //year//

  const years = [];
  for (let year = 1999; year <= 2095; year++) {
    years.push(year);
  }
  const [selectedyear, setSelectyear] = useState(2024);
  let year = selectedyear;

  const handleSelectChangeyear1 = useCallback(
    (value) => {
      console.log("Selected year:", value);
      setSelectyear(value);

      year = selectedyear;
    },
    [selectedEmpType]
  );
  //-------//

  let newtype = selectedEmpType;

  const [loading1, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { list, total, loading } = useSelector((state) => state.salarysetup);
  const handleSelectChange = useCallback((value) => {
    newtype = value;
    console.log(value, "878");

    setSelectedEmpType(value);
    // useEffect(() => {
    //   dispatch(loadsalarysetupPaginated(selectedEmpType));
    // }, [dispatch, selectedEmpType]);
  }, []);
  let monthname = selectedmonth;
  const handleSelectChangemonth = useCallback((value) => {
    monthname = value;

    setSelectedmonth(value);

    // useEffect(() => {
    //   dispatch(loadsalarysetupPaginated(selectedEmpType));
    // }, [dispatch, selectedEmpType]);
  }, []);
  let empname = null;
  const handleSelectChangename = useCallback((value) => {
    console.log(value, "value");
    setSelectedempname(value);
    empname = value;
    // console.log(slartysetdeil,"878")
    // const selected = empdetailsarray.find(emp => emp.id === value);
    // const salary=slartysetdeil.find(sal=>sal.id===value
    // );

    // selectedemp=selected;
    // selectedsalary=salary;

    // console.log(value, selected, "empnam",selectedemp.id,salary)
    // empname = value;

    // setSelectedempname(value);
    // useEffect(() => {
    //   dispatch(loadsalarysetupPaginated(selectedEmpType));
    // }, [dispatch, selectedEmpType]);
  }, []);
  console.log(selectedemp.cityName, "wdx");
  let employeeno1 = selectedemp.cityName;
  //init value//
  const [initValues, setInitValues] = useState({
    employeeno: selectedemp.EmployeeNo,
    designation: "",
    Dateofjoin: moment(convertToISO(selectedemp?.Dateofjoin)),
    pfNo: selectedemp.pfNo,
    esiNo: selectedemp.esiNo,
    bankAcNo: selectedemp.bankAcNo,
  });
  useEffect(() => {
    setInitValues({
      employeeno: selectedemp.EmployeeNo,
      designation: "",
      Dateofjoin: moment(convertToISO(selectedemp?.Dateofjoin)),
      pfNo: selectedemp.pfNo,
      esiNo: selectedemp.esiNo,
      bankAcNo: selectedemp.bankAcNo,
    });
    form.setFieldsValue({
      employeeno: selectedemp.EmployeeNo,
      designation: "",
      Dateofjoin: moment(convertToISO(selectedemp?.Dateofjoin)),
      pfNo: selectedemp.pfNo,
      esiNo: selectedemp.esiNo,
      bankAcNo: selectedemp.bankAcNo,
    });
  }, [selectedemp, form]);

  // useEffect(() => {
  //   dispatch(loadsalarysetupPaginated(selectedEmpType));
  // }, [dispatch, selectedEmpType]);

  //----------------submit process---------------------//
  console.log(selectedsalary, "salaty");

  const [initValues1, setInitValues1] = useState({
    // basic: selectedsalary?.BASIC,
    // medicalAllowance: selectedsalary?.MedicalAllowance,
    // hra: selectedsalary?.HRA,
    // ta: selectedsalary?.TA,
    // washingAllowance: selectedsalary?.WashingAllowance,
    // esic: selectedsalary?.ESIC
    // ,
    // advance: selectedsalary?.Advance,
    // pf: selectedsalary?.PF,
    // ptax: selectedsalary?.PTAX,
    // absent: selectedsalary?.absent,
    // Year:selectedsalary?.Year
  });
  useEffect(() => {
    const newValues = {
      // basic: selectedsalary?.BASIC,
      // medicalAllowance: selectedsalary?.MedicalAllowance,
      // hra: selectedsalary?.HRA,
      // ta: selectedsalary?.TA,
      // washingAllowance: selectedsalary?.WashingAllowance,
      // esic: selectedsalary?.ESIC
      // ,
      // advance: selectedsalary?.Advance,
      // pf: selectedsalary?.PF,
      // ptax: selectedsalary?.PTAX,
      // absent: selectedsalary?.absent,
      // Year:selectedsalary?.Year
    };
    setInitValues1(newValues);
    form1.setFieldsValue(newValues);
  }, [selectedsalary, form1]);

  const onFinish = async (value) => {
    console.log("Form values:", value);
    console.log(selectedempname, "765");
    const key = selectedempname;
    console.log(key, "key");
    const id2 = selectedsalary?.id2;
    // const Amount=selectedsalary?.Amount;
    // const Allowance=selectedsalary?.Allowance;
    // const Deduction=selectedsalary?.Deduction;
    const date = monthname;
    const empType = newtype;
    const basic = value.basic;
    const medicalAllowance = value.medicalAllowance;
    const hra = value.hra;
    const ta = value.ta;
    const washingAllowance = value.washingAllowance;
    const esic = value.esic;
    const advance = value.advance;
    const pf = value.pf;
    const ptax = value.ptax;
    const Year = year;

    const resp = await dispatch(
      updateSalarysetup({
        key: key,
        values: {
          key,
          date,
          empType,
          id2,
          basic,
          medicalAllowance,
          hra,
          ta,
          washingAllowance,
          esic,
          advance,
          pf,
          ptax,
          Year,
        },
        dispatch,
      })
    );
    // Handle form submission here
  };

  // useEffect(() => {
  //   console.log("Updated amount:", amount);
  // }, [amount]);
  const handleAllowanceChange = useCallback((newValue, recordId) => {
    const existingRowIndex = editedRows.findIndex((row) => row.id === recordId);

    // If recordId exists, update the corresponding row, else insert a new row
    if (existingRowIndex !== -1) {
      // Update the existing row
      editedRows = editedRows.map((row, index) => {
        if (index === existingRowIndex) {
          return {
            ...row,
            Allowance: newValue,
          };
        }
        return row;
      });
    } else {
      // Insert a new row
      editedRows.push({
        id: recordId,
        Allowance: newValue,
      });
    }
  }, []);
  const handleAmountChange = useCallback((newValue, recordId) => {
    const existingRowIndex = editedRows.findIndex((row) => row.id === recordId);

    // If recordId exists, update the corresponding row, else insert a new row
    if (existingRowIndex !== -1) {
      // Update the existing row
      editedRows = editedRows.map((row, index) => {
        if (index === existingRowIndex) {
          return {
            ...row,
            Amt: newValue,
          };
        }
        return row;
      });
    } else {
      // Insert a new row
      editedRows.push({
        id: recordId,
        Amt: newValue,
      });
    }
  }, []);

  const handleDeductionChange = useCallback((newValue, recordId) => {
    const existingRowIndex = editedRows.findIndex((row) => row.id === recordId);

    // If recordId exists, update the corresponding row, else insert a new row
    if (existingRowIndex !== -1) {
      // Update the existing row
      editedRows = editedRows.map((row, index) => {
        if (index === existingRowIndex) {
          return {
            ...row,
            Deduction: newValue,
          };
        }
        return row;
      });
    } else {
      // Insert a new row
      editedRows.push({
        id: recordId,
        Deduction: newValue,
      });
    }
  }, []);

  const [selectedDate, setSelectedDate] = useState(dayjs());
  let newDate = selectedDate;

  const handleDateChange = useCallback((date) => {
    newDate = date;
    setSelectedDate(date || dayjs());
  }, []);
  //--------------------calculator----------------//
  console.log(initValues1.basic, "8989");

  const [input1, setInput1] = useState(initValues1.basic || 0);
  const [input2, setInput2] = useState(initValues1.hra || 0);

  const [input5, setInput5] = useState(initValues1.medicalAllowance || 0);
  const [input3, setInput3] = useState(initValues1.washingAllowance || 0);
  const [input6, setInput6] = useState(initValues1.pf || 0);
  const [input8, setInput8] = useState(initValues1.esic || 0);

  const [input4, setInput4] = useState(initValues1.ta || 0);
  const [input7, setInput7] = useState(initValues1.ptax || 0);

  console.log(input1, "0");
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
      parseFloat(input7 || initValues1.ptax || 0) +
      +parseFloat(input8 || initValues1.esic || 0) +
      parseFloat(input6 || initValues1.pf || 0);

    // console.log(sum,"sum")
    return isNaN(sum) ? 0 : calculateSum() - sum || 0;
  };
  //--------------------------------//

  const onclick = useCallback(
    async (recordId) => {
      const { key, id2 } = recordId;
      console.log(recordId.Amount, "yrtrtr");

      const empType = newtype;
      console.log(empType, "type");
      console.log(recordId, "record/id");
      const date = newDate?.format("YYYY-MM-DD");
      const Amount =
        editedRows.find((row) => row.id === recordId.key).Amt ??
        recordId.Amount;
      const Allowance =
        editedRows.find((row) => row.id === recordId.key).Allowance ??
        recordId.Allowance;
      const Deduction =
        editedRows.find((row) => row.id === recordId.key).Deduction ??
        recordId.Deduction;

      const resp = await dispatch(
        updateSalarysetup({
          key: key,
          values: { key, Amount, Allowance, Deduction, date, empType, id2 },
          dispatch,
        })
      );
    },
    [editedRows, selectedDate]
  );

  const columns = [
    {
      id: 1,
      title: "Employee No",
      dataIndex: "id",
      key: "id",
    },
    // selectedEmpType === "DRIVER"
    //   ? null
    {
      id: 2,
      title: "Employee Name",
      dataIndex: "Name",
      key: "Name",
    },
    {
      id: 3,
      title: "Allowance",
      dataIndex: "Allowance",
      key: "Allowance",
      render: (Allowance, record) => (
        <Form.Item style={{ marginBottom: "10px" }} name="Allowance">
          <InputNumber
            size="small"
            defaultValue={Allowance}
            onChange={(value) => handleAllowanceChange(value, record.id)}
          />
        </Form.Item>
      ),
    },
    {
      id: 4,
      title: "Amount",
      dataIndex: "Amount",
      key: "Amount",
      render: (Amount, record) => (
        <Form.Item style={{ marginBottom: "10px" }} name="Amount">
          <InputNumber
            size="small"
            defaultValue={Amount}
            onChange={(value) => handleAmountChange(value, record.id)}
          />
        </Form.Item>
      ),
    },
    {
      id: 5,
      title: "Deduction",
      dataIndex: "Deduction",
      key: "Deduction",
      render: (Deduction, record) => (
        <Form.Item style={{ marginBottom: "10px" }} name="Deduction">
          <InputNumber
            size="small"
            defaultValue={Deduction}
            onChange={(value) => handleDeductionChange(value, record.id)}
          />
        </Form.Item>
      ),
    },
    {
      id: 6,
      title: "Action",
      dataIndex: "",
      key: "action",
      fixed: "right",
      width: 90,
      render: ({ id, ...restData }) => (
        <div className="flex items-center gap-2">
          <UserPrivateComponent permission="update-advanceToStaffEntry">
            <Button
              type="primary"
              htmlType="submit"
              shape="round"
              loading={loading}
              onClick={() => onclick(restData)}
            >
              Add
            </Button>
          </UserPrivateComponent>
          {/* <UserPrivateComponent permission="delete-advanceToStaffEntry">
            <DeleteOutlined
              onClick={() => onDelete(id)}
              className="p-2 text-white bg-red-600 rounded-md"
            />
          </UserPrivateComponent> */}
        </div>
      ),
    },
  ];

  // useEffect(() => {
  //   dispatch(
  //     loadAdvanceToStaffEntryPaginated({ page: 1, count: 1000, status: true })
  //   );
  // }, [dispatch]);

  const onDelete = async (id) => {
    const res = await dispatch(deleteAdvanceToStaffEntry(id));
    if (res) {
      dispatch(
        loadAdvanceToStaffEntryPaginated({ status: true, page: 1, count: 1000 })
      );
    }
  };
  // let yeardef=selectedsalary.Year;
  // console.log(yeardef,"yw")
  // const [defaultYear, setDefaultYear] = useState(2024);

  // useEffect(() => {
  //   // Simulate fetching data from a database
  //   if (selectedsalary.Year) {
  //     setDefaultYear(yeardef);
  //   }
  // }, [selectedsalary,selectedempname]);
  // console.log(defaultYear,"year")

  return (
    <Card
      className="border-0 md:border md:p-6 bg-transparent md:bg-[#fafafa]"
      bodyStyle={{ padding: 0 }}
    >
      <div className="items-center justify-between pb-3 md:flex">
        <h1 className="text-lg font-bold">Salary Set-Up</h1>
        <div className="flex items-center ">
          <Form.Item
            style={{ marginBottom: "10px", width: "80%" }}
            label="Year"
            name="Year"
            rules={[{ required: true, message: "Driver / Helper" }]}
          >
            <Select
              onChange={handleSelectChangeyear1}
              placeholder="Select Year"
              defaultValue={2024}
            >
              {years.map((year) => (
                <Option key={year} value={year}>
                  {year}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>
        <div className="flex items-center ">
          <Form.Item
            style={{ marginBottom: "10px", width: "80%" }}
            label="Month"
            name="driverHelper"
            rules={[{ required: true, message: "" }]}
          >
            <Select
              onChange={handleSelectChangemonth}
              placeholder="Select Month"
              defaultValue={"January"}
            >
              <Select.Option value={"January"}>January</Select.Option>
              <Select.Option value={"February"}>February</Select.Option>
              <Select.Option value={"March"}>March</Select.Option>
              <Select.Option value={"April"}>April</Select.Option>
              <Select.Option value={"May"}>May</Select.Option>
              <Select.Option value={"June"}>June</Select.Option>
              <Select.Option value={"July"}>July</Select.Option>
              <Select.Option value={"August"}>August</Select.Option>
              <Select.Option value={"September"}>September</Select.Option>
              <Select.Option value={"October"}>October</Select.Option>
              <Select.Option value={"November"}>November</Select.Option>
              <Select.Option value={"December"}>December</Select.Option>
            </Select>
          </Form.Item>
        </div>
        <div className="flex items-center ">
          <Form.Item
            style={{ marginBottom: "10px", width: "80%" }}
            label="Driver / Helper / Staff"
            name="driverHelper"
            rules={[{ required: true, message: "Driver / Helper / Staff" }]}
          >
            <Select
              onChange={handleSelectChange}
              placeholder="Select Driver/Helper/Staff"
              defaultValue={"HELPER"}
            >
              <Select.Option value={"DRIVER"}>Driver</Select.Option>
              <Select.Option value={"HELPER"}>Helper</Select.Option>
              <Select.Option value={"STAFF"}>Staff</Select.Option>
            </Select>
          </Form.Item>
        </div>
        <div className="flex items-center ">
          <Form.Item
            style={{ marginBottom: "10px", width: "80%" }}
            label="Name"
            name="driverHelper"
            rules={[{ required: true, message: "Driver / Helper" }]}
          >
            <Select
              optionFilterProp="children"
              showSearch
              onChange={handleSelectChangename}
              placeholder="Select Driver/Helper"
              defaultValue={"select the Employee"}
            >
              {[
                ...new Map(
                  empdetailsarray.map((item) => [item.name, item])
                ).values(),
              ].map((item, index) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>
        <div className="flex items-center justify-between gap-1 md:justify-start md:gap-3">
          {/* <Form.Item className="mb-0" name="date">
        
        <DatePicker
          picker="date"
          defaultValue={dayjs()}
          format="MMMM"
          onChange={(value)=>handleDateChange(value)}
          className="custom-date-picker"
        />

        </Form.Item> */}
          {/* <CreateDrawer
            permission={"create-advanceToStaffEntry"}
            title={"Add Entry"}
            width={35}
          >
            <AddAdvanceToStaffEntryDrawer />
          </CreateDrawer> */}
        </div>
      </div>
      <div></div>

      {/* <Form
      form={form}
      name="dynamic_form_nest_item"
      // onFinish={onFinish}
      layout="vertical"
      initialValues={initValues}
      onFinishFailed={() => {
        setLoader(false);
      }}
      size="medium"
      autoComplete="off"
    >
      <div className="flex gap-20 ml-4 ">
        <div className="w-1/2 ml-4 ">
          <Form.Item
            className="w-80"
            label="Employee No"
            name="employeeno"
            
         
          >
            <Input placeholder="   " readOnly  />
          </Form.Item>
          <Form.Item
            label="Designation"
            className="w-80"
            name="designation"
          
          >
                        <Input placeholder="   " readOnly />

          
          </Form.Item>
          

          <Form.Item
            style={{ marginBottom: "5px" }}
            label="Date of Joining"
            name="Dateofjoin"
            className="mb-4 w-80"
          
          >
            <DatePicker
              style={{ marginBottom: "5px", width: "100%" }}
              label="date"
              format={"DD-MM-YYYY"}
              readOnly
              // value={dayjs(initValues.date, "DD-MM-YYYY")}
            />
          </Form.Item>

          <Form.Item
            className="w-80"
            label="No of Days Present"
            name=""
           
          >
            <Input placeholder="" readOnly />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: "10px" }}
            label=" No of Days absent"
            name=""
            className="w-80"
           
          >
                                  <Input placeholder="" readOnly />

          </Form.Item>
          <Form.Item
            style={{ marginBottom: "10px" }}
            label="Bus no -"
            name="includeGST"
            className="w-80"
           
          >
                                  <Input readOnly  />

          </Form.Item>
        </div>
        <div className="float-right w-2/2">
          <Form.Item
            className="w-80"
            label="PAN:"
            name=""
           
          >
            <Input
              className=""
              size={"small"}
              type="number"
              readOnly
            />
          </Form.Item>
          <Form.Item
            className="w-80"
            label="PF No:"
            name="pfNo"
           
          >
            <Input
              className=""
              size={"small"}
              readOnly
            />
          </Form.Item>

          <Form.Item
            style={{ width: "30rem" }}
            label="ESI No"
            className="w-80"
            name="esiNo"
           
          >
            <Input readOnly/>
          </Form.Item>
          <Form.Item
            style={{ width: "30rem" }}
            label="Bank Ac."
            className="w-80"
            name="bankAcNo"
          
          >
            <Input
              className=""
              placeholder=""
              size={"small"}
              readOnly
            />
          </Form.Item>
          <Form.Item
            style={{ width: "30rem" }}
            label="No deduction ."
            className="w-80"
            name=""
          
          >
            <Input
              className=""
              placeholder=""
              size={"small"}
              readOnly
            />
          </Form.Item>
        </div>
      </div>

     

      {/* <div className="float-right m-2 my-4 w-80">
        <Form.Item
          // hidden={confirmBookings}
          style={{ marginTop: "15px" }}
          className="w-72"
        >
          <Button
            block
            type="primary"
            htmlType="submit"
            // onClick={handleConfirm}
            // loading={loader}
          >
            Create Booking Entry
          </Button>
        </Form.Item>
      </div> */}
      {/* </Form>  */}
      <div></div>

      <UserPrivateComponent permission={"readAll-advanceToStaffEntry"}>
        {/* <TableComponent
          columns={columns.filter(Boolean)}
          csvFileName={"advanceToStaffEntry"}
          paginatedThunk={loadAdvanceToStaffEntryPaginated}
          list={list1}
          total={total}
          loading={loading2}
        /> */}
      </UserPrivateComponent>
      {/* submit form */}
      <div>
        <Form
          form={form1}
          name="dynamic_form_nest_item"
          onFinish={onFinish}
          layout="vertical"
          initialValues={initValues1}
          onFinishFailed={() => {
            setLoader(false);
          }}
          size="medium"
          autoComplete="off"
        >
          <div className="flex gap-20 ml-4 ">
            <div className="w-1/2 ml-4 ">
              <Form.Item className="w-80" label="Basic" name="basic">
                <Input
                  placeholder="   "
                  defaultValue={selectedemp.id}
                  onChange={handleInput1Change}
                />
              </Form.Item>
              <Form.Item
                style={{ marginBottom: "5px" }}
                label="H.R.A."
                name="hra"
                className="mb-4 w-80"
              >
                <Input
                  placeholder="   "
                  defaultValue={selectedemp.id}
                  onChange={handleInput2Change}
                />
              </Form.Item>
              <Form.Item
                style={{ marginBottom: "10px" }}
                label="Washing Allowance"
                name="washingAllowance"
                className="w-80"
              >
                <Input placeholder="" onChange={handleInput3Change} />
              </Form.Item>
              <Form.Item className="w-80" label="T.A." name="ta">
                <Input placeholder="" onChange={handleInput4Change} />
              </Form.Item>
              <Form.Item
                label="Medical Allowance"
                className="w-80"
                name="medicalAllowance"
                rules={[
                  {
                    required: false,
                    message: "Please input Date!",
                  },
                ]}
              >
                <Input placeholder="   " onChange={handleInput5Change} />
              </Form.Item>
            </div>
            <div className="float-right w-2/2">
              <Form.Item
                style={{ marginBottom: "10px" }}
                label="PF"
                name="pf"
                className="w-80"
              >
                <Input onChange={handleInput6Change} />
              </Form.Item>
              <Form.Item
                style={{ width: "30rem" }}
                label="P Tax"
                className="w-80"
                name="ptax"
              >
                <Input onChange={handleInput7Change} />
              </Form.Item>
              <Form.Item className="w-80" label="ESIC" name="esic">
                <Input
                  className=""
                  size={"small"}
                  onChange={handleInput8Change}
                />
              </Form.Item>
            </div>
          </div>
          <div className="float-right w-1/2 mx-5">
            <div className="py-2">
              <div className="flex justify-between p-1">
                <strong>Gross Salary: </strong>
                <strong>{<div>{calculateSum().toFixed(2)}</div>} </strong>
              </div>
              <div className="flex justify-between p-1">
                <strong>Net Salary:</strong>
                <strong>{calculatetax()}</strong>
                {/* //hello// */}
              </div>
            </div>
            <div className="flex gap-2">
              <Form.Item style={{ marginTop: "10px" }} className="w-full">
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

          <div className="float-right m-2 my-4 w-80">
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
    </Card>
  );
};

export default GetAllSalarySet;
