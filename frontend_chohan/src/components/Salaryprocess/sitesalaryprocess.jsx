import moment from "moment";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { DeleteOutlined,EditOutlined } from "@ant-design/icons";
import { Card } from "antd";
import { useDispatch, useSelector } from "react-redux";
import TableNoPagination from "../CommonUi/TableNoPagination";
import UserPrivateComponent from "../PrivacyComponent/UserPrivateComponent";


const SiteSalaryprocess = ({isIncludeGST,onBookingClose,list,loading }) => {
  const dispatch = useDispatch();
  // const { list, total, loading } = useSelector((state) => state.localProforma);
  const [open, setOpen] = useState(false);
  const [bookingArray, setBookingArray] = useState([]);
  const [childrenDrawer, setChildrenDrawer] = useState(false);

  useEffect(() => {
   
    setBookingArray(list);
  }, [list]);
  console.log(bookingArray,"booking")
  
  
   


//   useEffect(() => {
//      onBookingClose(bookingArray);
//   }, [bookingArray, onBookingClose]);
  console.log(bookingArray,"utyty")
  const columns = [
    // {
    //   id: 1,
    //   title: "SLNO",
    //   dataIndex: "SLNO",
    //   key: "SLNO",
    // },
    {
      id: 2,
      title: "Site Name",
      dataIndex: "siteShortName",
      key: "siteShortName",
    },
    {
      id: 3,
      title: "Count",
      dataIndex: "AppearanceCount",
      key: "AppearanceCount",
    },
    {
      id: 4,
      title: "khuraki Amount",
      dataIndex: "TotalKhurakiAmount",
      key: "TotalKhurakiAmount",
    },
   
  
  
  
  
  ];
  // useEffect(() => {
  //   dispatch(clearLocalProforma());
  // }, [dispatch]);
  const onDelete = async (SLNO) => {
    dispatch(deleteLocalProforma(SLNO));
  };
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
        <TableNoPagination columns={columns} list={bookingArray} loading={loading} scrollX={650} />
      </UserPrivateComponent>
    </Card>
  );
};

export default SiteSalaryprocess;
