import React, { useState } from "react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Card, Form, InputNumber, Button } from "antd";
import { useDispatch } from "react-redux";
import TableNoPagination from "../CommonUi/TableNoPagination";
import UserPrivateComponent from "../PrivacyComponent/UserPrivateComponent";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect ,useCallback} from "react";
let adjustvalue=0;
let cis=0;
let recodsData=[];
const AdvanceSalaryprocess = ({ onBookingClose, list, loading,commonId }) => {
  const dispatch = useDispatch();
  const apiUrl = import.meta.env.VITE_APP_API;
  const [error, setError] = useState(null);
  const [loading2, setLoading2] = useState(false);
  const [adjustedAmounts, setAdjustedAmounts] = useState({}); // Initialize as an empty object
  const [records, setRecords] = useState([]);
  const currentDate = dayjs();
  const formattedDate = currentDate.format('MM/DD/YYYY');
  console.log(commonId,"cis");
   cis=commonId
    recodsData=list;

    useEffect(() => {
      
        setRecords(list);
      
    }, [list]);

  const handleAdvanceAmountChange = (value, record) => {
    if (record.adjAmount < value) {
      toast.error('Please enter an amount less than the Advance amount!');
      
    } else {

      setRecords(prevRecords => {
        // Map over the previous records to update the specific record
        const updatedRecords = prevRecords.map(r =>
          r.AdvanceNo === record.AdvanceNo ? { ...r, advanceAdjusted: value } : r
        );
        
        // Return the updated records array
        return updatedRecords;
      });

      setAdjustedAmounts(prev => {
        const updatedAmounts = {
          ...prev,
          [record.AdvanceNo]: value // Use the AdvanceNo as a key to store the adjusted amount
        };
  
        // Calculate the total sum of all adjusted amounts
        const totalSum = Object.values(updatedAmounts).reduce((sum, curr) => sum + curr, 0);
  
        // Call onBookingClose with the total sum of all rows
        
  
        return updatedAmounts;
      });
  
      adjustvalue = value;
      onBookingClose({value,record});
    }
  };
  

  const handleSubmit = async (record) => {
    console.log(record,"7667676776")

    const adjustedAmount = adjustedAmounts[record.AdvanceNo] || record.advAmount; // Get adjusted amount or default to original
    const obj = {
      SalaryDetl_ID: cis,
      AdvanceID: record.AdvanceNo,
      // date: formattedDate,
      AdvanceAmt:record.advAmount,
      advAmount: adjustvalue,
      
    };
    console.log(obj,"7667676776")

    try {
      setLoading2(true);
      const response = await axios.post(`${apiUrl}/salaryadjust`, obj);
      console.log(response);
      toast.success('Submission successful!');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading2(false);
    }
  };

  const columns = [
    {
      id: 2,
      title: "Advance No",
      dataIndex: "AdvanceNo",
      key: "AdvanceNo",
    },
    {
      id: 3,
      title: "Adv amount",
      dataIndex: "advAmount",
      key: "advAmount",
    },
    {
      id: 3,
      title: "Pending amount",
      dataIndex: "adjAmount",
      key: "adjAmount",
    },
    {
      id: 4,
      title: "Remark",
      dataIndex: "remark",
      key: "remark",
    },
    {
      id: 5,
      title: "Advance Adjusted",
      dataIndex: "advanceAdjusted",
      key: "advanceAdjusted",
      render: (_, record) => (
        <Form.Item style={{ marginBottom: "10px",width:"90px" }}>
          <InputNumber
            size="small"// Default value if `adjamt` is undefined
            value={record.advanceAdjusted}
            onChange={(value) => handleAdvanceAmountChange(value, record)}
          />
        </Form.Item>
      ),
    },
    // {
    //   id: 6,
    //   title: "Actions",
    //   key: "actions",
    //   render: (_, record) => (
    //     <Button type="primary" onClick={() => handleSubmit(record)}>
    //       Submit
    //     </Button>
    //   ),
    // },
  ];

  return (
    <Card
    className="border-0 md:border md:p-6 bg-transparent md:bg-[#fafafa]"
    bodyStyle={{ padding: 0 }}
  >
    <div className="md:flex items-center justify-between pb-3">
      {/* <h1 className="text-lg font-bold">Party Bus List</h1> */}
      <div className="flex justify-between md:justify-start md:gap-3 gap-1 items-center">
        {/* <CreateDrawer
          permission={"create-bus"}
          title={"Add Bus"}
          width={35}
        
          open={open}
        >
          <AddPartyBusListDrawer onClose={onClose}  />
        </CreateDrawer> */}
      </div>
    </div>
    <UserPrivateComponent permission={"readAll-setup"}>
    <TableNoPagination columns={columns} list={records} loading={loading} scrollX={650}  />
    </UserPrivateComponent>
  </Card>
   
  );
};

export default AdvanceSalaryprocess;
