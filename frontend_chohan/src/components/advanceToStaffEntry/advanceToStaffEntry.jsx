import React, { useState, useEffect } from "react";
import { Card } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import SimpleButton from "../Buttons/SimpleButton";
import axios from "axios";
import CreateDrawer from "../CommonUi/CreateDrawer";
import UpdateAdvanceToStaffEntryDrawer from "./updateAdvanceToStaffEntryDrawer";
import { Button } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Advancetostaffdrawer from "./advancetostaffprintdrawer";

import TableComponent from "../CommonUi/TableComponent";
import UserPrivateComponent from "../PrivacyComponent/UserPrivateComponent";
import { loadAdvanceToStaffEntryPaginated } from "../../redux/rtk/features/advanceToStaffEntry/advanceToStaffEntrySlice";

const AdvanceToStaffEntry = (props) => {
  const dispatch = useDispatch();
  const [data, setList] = useState([]);
  const [loading2, setLoading2] = useState(true);
  const onDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_APP_API}/advanceToStaffEntry/${id}`
        );
        if (response.status === 200) {
          toast.success("Deleted......");
          window.location.reload();
        }
      } catch (error) {
        console.error("There was an error deleting the Advancetosatff:", error);
      }
    } else {
      console.log("Delete action canceled by user.");
    }
  };
  const companyId = 3; // Assuming this is a static or derived value in your case

  const handleNavigation = (AdvanceNo, companyId) => {
    navigate(`/admin/advancetostaffprint/${companyId}/${AdvanceNo}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      setList([]);

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API}/advanceToStaffEntry`
        );
        const updatedData = response.data.data.map((item) => ({
          ...item,
          transactions: item.transactions ? JSON.parse(item.transactions) : [],
        }));

        setList(updatedData);
      } catch (error) {
      } finally {
        setLoading2(false);
      }
    };

    fetchData();
  }, [dispatch]);
  //Total amount calculation//
  const totalAdvanceAmount = data.reduce((total, item) => {
    if (item.transactions && item.transactions.length > 0) {
      return (
        total +
        item.transactions.reduce((sum, transaction) => {
          const advanceAmount = parseFloat(transaction.advanceAmount);
          return sum + (isNaN(advanceAmount) ? 0 : advanceAmount);
        }, 0)
      );
    }
    return total;
  }, 0);
  //End//
  const navigate = useNavigate();

  const handleNavigate = (AdvanceNo, restData) => {
    navigate(`/admin/UpdateAdvanceToStaffEntryDrawer?AdvanceNo=${AdvanceNo}`);
  };

  let totamt = 0;
  const columns = [
    {
      id: 1,
      title: "Advance No",
      dataIndex: "AdvanceNo",
      key: "AdvanceNo",
      width: 90,
    },
    {
      id: 2,
      title: "Data of Advance",
      dataIndex: "AdvancedDate",
      key: "AdvancedDate",
      width: 80,
      render: (text) => {
        const date = new Date(text);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      },
    },
    {
      id: 3,
      title: "Type",
      dataIndex: "Type",
      key: "Type",
      width: 80,
    },
    {
      id: 5,
      title: "Remark",
      dataIndex: "transactions",
      key: "remark",
      width: 150,
      render: (transactions) => {
        if (!transactions || transactions.length === 0) return null;

        return (
          <div>
            {transactions
              .map((transaction) => transaction.remark || "")
              .join(", ")}
          </div>
        );
      },
    },
    {
      id: 4,
      title: "Advance Amount",
      dataIndex: "transactions",
      key: "advanceAmount",
      width: 80,
      render: (transactions) => {
        if (!transactions || transactions.length === 0) return null;

        const totalAdvanceAmount = transactions.reduce(
          (sum, transaction) => sum + transaction.advanceAmount,
          0
        );
        totamt = totalAdvanceAmount;
        return <div>{`${totalAdvanceAmount}`}</div>;
      },
    },
    {
      id: 5,
      title: "Action",
      dataIndex: "",
      key: "action",
      fixed: "right",
      width: 120,
      render: ({ AdvanceNo, COMPANY_ID, ...restData }) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button
            onClick={() => handleNavigate(AdvanceNo, restData)}
            style={{ marginRight: "10px" }}
          >
            Edit
          </Button>
          <button
            className="px-4 py-2 font-bold text-white transition duration-300 bg-blue-500 rounded hover:bg-blue-700"
            onClick={() =>
              window.open(
                `/admin/advancetostaffprint/${2}/${AdvanceNo}`,
                "_blank"
              )
            }
          >
            Print Page
          </button>
          <UserPrivateComponent permission={"delete-proformaInvoice"}>
            <DeleteOutlined
              onClick={() => onDelete(AdvanceNo)}
              className="p-2 text-white bg-red-600 rounded-md"
            />
          </UserPrivateComponent>
        </div>
      ),
    },
  ];

  return (
    <div className="mt-2 card card-custom">
      <div className="card-body">
        <Card
          className="border-0 md:border md:p-6 bg-transparent md:bg-[#fafafa]"
          bodyStyle={{ padding: 0 }}
        >
          <div className="items-center justify-between pb-3 md:flex">
            <h1 className="text-lg font-bold">Advance To Staff</h1>
            <div className="flex items-center justify-between gap-1 md:justify-start md:gap-3">
              <div className="flex xxs:w-1/2 md:w-full xxs:flex-col md:flex-row xxs:gap-1 md:gap-5">
                <UserPrivateComponent permission={"create-proformaInvoice"}>
                  <Link to={`/admin/advanceToStaffRegister/`}>
                    <SimpleButton title={"Add New Advance "} />
                  </Link>
                </UserPrivateComponent>
              </div>
            </div>
          </div>

          <UserPrivateComponent permission={"readAll-proformaInvoice"}>
            <TableComponent
              list={data}
              columns={columns}
              paginatedThunk={loadAdvanceToStaffEntryPaginated}
              csvFileName={"Booking List"}
            />
          </UserPrivateComponent>
        </Card>
        <div className="flex justify-between p-1">
          <strong>
            Total:<span>{totalAdvanceAmount}</span>
          </strong>
        </div>
      </div>
    </div>
  );
};

export default AdvanceToStaffEntry;
