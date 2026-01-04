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
import { DeleteOutlined, EditOutlined, PrinterOutlined } from "@ant-design/icons";
import Advancetostaffdrawer from "./advancetostaffprintdrawer";

import TableComponent from "../CommonUi/TableComponent";
import UserPrivateComponent from "../PrivacyComponent/UserPrivateComponent";
import { loadAdvanceToStaffEntryPaginated } from "../../redux/rtk/features/advanceToStaffEntry/advanceToStaffEntrySlice";

import jsPDF from "jspdf";
import "jspdf-autotable";

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

  const handleGenerateReport = async (AdvanceNo) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API}/advanceToStaffEntry/report`,
        { AdvanceNo }
      );

      if (response.data.status === 1 && response.data.data.length > 0) {
        const reportData = response.data.data;
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const centerX = pageWidth / 2;

        // Company Header
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text("CHOHAN TOURS & TRAVELS", centerX, 15, { align: "center" });

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(
          "FLAT 3A, 2, GREEN ACRES, NAZAR ALI LANE, KOLKATA, 700019, WEST BENGAL",
          centerX,
          22,
          { align: "center" }
        );
        doc.text("GST: 19AKTPC8877A1ZP | PAN: AKTPC8877A", centerX, 28, {
          align: "center",
        });

        // Horizontal Line
        doc.setLineWidth(0.5);
        doc.line(14, 32, pageWidth - 14, 32);

        // Report Title
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Advance To Staff Report", 14, 40);

        // Advance Details Header (using the first record for common details)
        const firstRecord = reportData[0];
        const date = new Date(firstRecord.AdvancedDate);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Advance No: ${firstRecord.AdvanceNo}`, 14, 48);
        doc.text(
          `Date: ${formattedDate}`,
          14,
          54
        );
        doc.text(`Total Amount: ${firstRecord.TotalAmount}`, 14, 60);

        // Table
        const tableColumn = [
          "Sl No",
          "Employee Name",
          "Employee Type",
          "Sort Name",
          "Amount",
          "Remark",
          "Signature",
        ];
        const tableRows = [];

        reportData.forEach((ticket, index) => {
          const ticketData = [
            index + 1,
            ticket.EmpName,
            ticket.EmpType,
            ticket.SiteShortName || "",
            ticket.advanceAmount,
            ticket.Remark || "",
            "", // Signature column
          ];
          tableRows.push(ticketData);
        });

        doc.autoTable({
          startY: 65,
          head: [tableColumn],
          body: tableRows,
          theme: "grid",
          columnStyles: {
            6: { minCellWidth: 30 }, // Make Signature column wider
          },
        });

        doc.save(`AdvanceReport_${AdvanceNo}.pdf`);
        toast.success("PDF generated successfully");
      } else {
        toast.error("No data found for this report");
      }
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate report");
    }
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
        return `${day}/${month}/${year}`;
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
          <Button
            type="primary"
            icon={<PrinterOutlined />}
            onClick={() => handleGenerateReport(AdvanceNo)}
            style={{ marginRight: "10px", backgroundColor: "#4b5563", borderColor: "#4b5563" }}
          >
            Print
          </Button>
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
