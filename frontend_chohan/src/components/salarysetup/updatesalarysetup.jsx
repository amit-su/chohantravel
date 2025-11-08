import React, { useEffect, useState,useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card, Form, Select ,DatePicker,Button,InputNumber,Input} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { loadsalarysetupPaginated, updateSalarysetup } from "../../redux/rtk/features/Salarysetupslice/salarysetslice";



let selectedsalary=[];

const Updatesalarysetup = () => {
    const {id}=useParams();
    console.log(id,"876")
    const [form1]=Form.useForm();
    const dispatch = useDispatch();


    //----------API GET------------//
    const apiUrl = import.meta.env.VITE_APP_API;

    const [loading2, setLoading2] = useState(true);
  const [error, setError] = useState(null);
     useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(`${apiUrl}/salarysetup/byid/${id}`);
            
              console.log(response.data.data[0],"data")
              selectedsalary=response.data.data[0]
          
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
    const [initValues1, setInitValues1] = useState({
      basic: selectedsalary?.BASIC,
      medicalAllowance: selectedsalary?.MedicalAllowance,
      hra: selectedsalary?.HRA,
      ta: selectedsalary?.TA,
      Month:selectedsalary?.Month,
      washingAllowance: selectedsalary?.WashingAllowance,
      esic: selectedsalary?.ESIC
      ,
      advance: selectedsalary?.Advance,
      pf: selectedsalary?.PF,
      ptax: selectedsalary?.PTAX,
      absent: selectedsalary?.absent,
      Year:selectedsalary?.Year
    });
    useEffect(() => {
      const newValues = {
        basic: selectedsalary?.BASIC,
        medicalAllowance: selectedsalary?.MedicalAllowance,
        hra: selectedsalary?.HRA,
        ta: selectedsalary?.TA,
        Month:selectedsalary?.Month,

        washingAllowance: selectedsalary?.WashingAllowance,
        esic: selectedsalary?.ESIC
        ,
        advance: selectedsalary?.Advance,
        pf: selectedsalary?.PF,
        ptax: selectedsalary?.PTAX,
        absent: selectedsalary?.absent,
        Year:selectedsalary?.Year
  
      };
      setInitValues1(newValues);
      form1.setFieldsValue(newValues);
    }, [selectedsalary, form1]);
    console.log(selectedsalary,"676767")
    const onFinish = async (value) => {
      console.log('Form values:', value);
      const key=selectedsalary.empID;
      console.log(key,"key");
      const id2=selectedsalary.id2;
      const Amount=selectedsalary.Amount;
      const Allowance=selectedsalary.Allowance;
      const Deduction=selectedsalary.Deduction;
      const date=value.Month;
      const empType=selectedsalary.empType;
      const basic=value.basic;
      const medicalAllowance=value.medicalAllowance;
      const hra=value.hra;
      const ta=value.ta;
      const washingAllowance=value.washingAllowance;
      const esic=value.esic;
      const advance=value.advance;
      const pf=value.pf;
      const ptax=value.ptax;
      const Year=value.Year;
  
  
  
      const resp = await dispatch(
        updateSalarysetup({key:key, values: { key, Amount,Allowance,
          Deduction, date,empType,id2,basic,
          medicalAllowance,hra,
          ta,washingAllowance,esic,advance,
          pf,ptax,Year
         },dispatch })
      ); 
      // Handle form submission here
    };
    const [input1, setInput1] = useState(initValues1.basic||0);
    const [input2, setInput2] = useState(initValues1.hra||0);
    
    const [input5, setInput5] = useState(initValues1.medicalAllowance||0);
    const [input3, setInput3] = useState(initValues1.washingAllowance||0);
    const [input6, setInput6] = useState(initValues1.pf||0);
    const [input8, setInput8] = useState(initValues1.esic||0);
  
    const [input4, setInput4] = useState(initValues1.ta||0);
    const [input7, setInput7] = useState(initValues1.ptax||0);
  
  
  
  
  
  
  
  
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
      const sum = parseFloat(input1||initValues1.basic) + parseFloat(input2||initValues1.hra)+parseFloat(input4||initValues1.ta)+
      +parseFloat(input3||initValues1.washingAllowance)+
      parseFloat(input5||initValues1.medicalAllowance);
      
      console.log(sum,"sum")
      return isNaN(sum) ? 0 : sum;
    };
    const calculatetax = () => {
      const sum = parseFloat(input6||initValues1.pf||0) + parseFloat(input7||initValues1.ptax||0)+
      +parseFloat(input8||initValues1.esic||0)
      
      // console.log(sum,"sum")
      return isNaN(sum) ? 0 : calculateSum()-sum||0;
    };
    const [selectedmonth, setSelectedmonth] = useState(initValues1.Month);
    let monthname=selectedmonth;
    const handleSelectChangemonth =  useCallback((value) => {
      monthname = value;
      
      setSelectedmonth(value);
      
  
  
      // useEffect(() => {
      //   dispatch(loadsalarysetupPaginated(selectedEmpType));
      // }, [dispatch, selectedEmpType]);
  
      
    }, []);


  

  return (
    <><h1>update Salary set up</h1>
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
      <div className="flex gap-20  ml-4 ">
        <div className=" ml-4 w-1/2">
        <Form.Item
            className="w-80"
            label="Year"
            name="Year"
         
          >
            <Input placeholder="   " 

                        />
          </Form.Item>
          <Form.Item
            className="w-80"
            label="Basic"
            name="basic"
         
          >
            <Input placeholder="   " 
                    onChange={handleInput1Change}

                        />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: "5px" }}
            label="H.R.A."
            name="hra"
            className="w-80 mb-4"
          
          >
            <Input placeholder="   " 
                    onChange={handleInput2Change}

                        />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: "20px" }}
            label="Washing Allowance"
            name="washingAllowance"
            className="w-80"
           
          >
                                  <Input placeholder=""onChange={handleInput3Change}
 />

          </Form.Item>
          <Form.Item
            className="w-80"
            label="T.A."
            name="ta"
           
          >
            <Input placeholder=""                    
             onChange={handleInput4Change}
/>
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
                        <Input placeholder="   "                     onChange={handleInput5Change}
 />

          
          </Form.Item>
         
         
        
          

         
         
          
        </div>
        <div className="w-2/2 float-right">
        <Form.Item
            style={{  width: "100%" }}
            label="Month"
            name="Month"
            // rules={[{ required: true, message: "Month" }]}
          >
            <Select
  onChange={handleSelectChangemonth}
  placeholder="Select Month"
  // defaultValue={"January"}
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
         
       
          <Form.Item
            style={{ marginBottom: "10px" }}
            label="PF"
            name="pf"
            className="w-80"
           
          >
                                  <Input                     onChange={handleInput6Change}
 />

          </Form.Item>
          <Form.Item
            style={{ width: "30rem" }}
            label="P Tax"
            className="w-80"
            name="ptax"
           
          >
            <Input                     onChange={handleInput7Change}
  />
          </Form.Item>
          <Form.Item
            className="w-80"
            label="ESIC"
            name="esic"
           
          >
            <Input
              className=""
              size={"small"}
              onChange={handleInput8Change}

            />
          </Form.Item>
          
         

         
        

       
         
         
        </div>
      </div>
      <div className="w-1/2 float-right mx-5">
        <div className="py-2">
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

export default Updatesalarysetup;
