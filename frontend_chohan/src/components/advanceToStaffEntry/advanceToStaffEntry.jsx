import React, { useState, useEffect } from "react";
import { Card, DatePicker, Modal, Select, Button } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import SimpleButton from "../Buttons/SimpleButton";
import axios from "axios";
import CreateDrawer from "../CommonUi/CreateDrawer";
import UpdateAdvanceToStaffEntryDrawer from "./updateAdvanceToStaffEntryDrawer";
import { DeleteOutlined, EditOutlined, PrinterOutlined } from "@ant-design/icons";
import Advancetostaffdrawer from "./advancetostaffprintdrawer";

import TableComponent from "../CommonUi/TableComponent";
import UserPrivateComponent from "../PrivacyComponent/UserPrivateComponent";
import { loadAdvanceToStaffEntryPaginated } from "../../redux/rtk/features/advanceToStaffEntry/advanceToStaffEntrySlice";
import { generateSalaryAdvancePDF } from "../../utils/generateSalaryAdvancePDF";
import { generateBankTransferExcel } from "../../utils/generateBankTransferExcel";
import { loadAllCompany } from "../../redux/rtk/features/company/comapnySlice";

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
        toast.error("There was an error deleting the advance to staff!");
      }
    }
  };
  const companyId = 3; // Assuming this is a static or derived value in your case

  const handleNavigation = (AdvanceNo, companyId) => {
    navigate(`/admin/advancetostaffprint/${companyId}/${AdvanceNo}`);
  };

  const [printModalVisible, setPrintModalVisible] = useState(false);
  const [printAdvanceNo, setPrintAdvanceNo] = useState(null);
  const [selectedPrintCompany, setSelectedPrintCompany] = useState(null);
  const [selectedPrintPaymentMode, setSelectedPrintPaymentMode] = useState("");
  const [isPrinting, setIsPrinting] = useState(false);

  const { list: companyList } = useSelector((state) => state.companies);

  useEffect(() => {
    dispatch(loadAllCompany({ page: 1, count: 100, status: true }));
  }, [dispatch]);

  const handleGenerateReportClick = (AdvanceNo) => {
    setPrintAdvanceNo(AdvanceNo);
    setPrintModalVisible(true);
    setSelectedPrintCompany(null);
    setSelectedPrintPaymentMode("");
  };
  
  const [reportType, setReportType] = useState('PDF');

  const handleGenerateReportModal = async (type = 'PDF') => {
    if (!selectedPrintCompany) {
      toast.warning("Please select a company first");
      return;
    }
    const matchCompany = companyList?.find(c => c.Id === selectedPrintCompany);

    setIsPrinting(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API}/advanceToStaffEntry/report`,
        { AdvanceNo: printAdvanceNo, CompanyID: selectedPrintCompany }
      );

      if (response.data.status === 1 && response.data.data.length > 0) {
        let printData = response.data.data;

        // Filter by payment mode
        if (selectedPrintPaymentMode !== "ALL") {
          const wantBank = selectedPrintPaymentMode === "BANK";
          printData = printData.filter(item => {
            const hasBank = !!item.bankAcNo;
            return wantBank ? hasBank : !hasBank;
          });
        }

        if (printData.length === 0) {
          toast.warning("No data matches the selected payment mode.");
          setIsPrinting(false);
          return;
        }

        if (type === 'PDF') {
          toast.success("PDF generated successfully");
          generateSalaryAdvancePDF(printData, matchCompany);
        } else {
          // Map advance data to match bank transfer format
          const bankData = printData.map(item => ({
            ...item,
            NetSalary: item.advanceAmount, // Amount field for advances
            name: item.EmpName,            // Name field
            bankAcNo: item.bankAcNo,
            bankIFSC: item.bankIFSC
          }));
          
          toast.success("Excel generated successfully");
          generateBankTransferExcel(bankData, matchCompany, `Advance_${printAdvanceNo}`, 'Advance');
        }
      } else {
        toast.error("No data found for this report");
      }
    } catch (error) {
      toast.error("Failed to generate report");
    } finally {
      setIsPrinting(false);
    }
  };

  const [query, setQuery] = useState({ page: 1, count: 10, status: true });

  const { list: reduxList, total, loading } = useSelector(
    (state) => state.advanceToStaffEntry
  );

  useEffect(() => {
    dispatch(loadAdvanceToStaffEntryPaginated(query));
  }, [dispatch, query]);

  useEffect(() => {
    if (reduxList) {
      const updatedData = reduxList.map((item) => ({
        ...item,
        transactions: item.transactions ? JSON.parse(item.transactions) : [],
      }));
      setList(updatedData);
      setLoading2(false);
    }
  }, [reduxList]);

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
            onClick={() => handleGenerateReportClick(AdvanceNo)}
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
                    <SimpleButton title={"New Advance "} />
                  </Link>
                </UserPrivateComponent>
                <div className="flex gap-2 w-full max-w-lg">
                  <DatePicker.RangePicker
                    format={"DD-MM-YYYY"}
                    onChange={(date) => {
                      if (date && date.length === 2) {
                        const fromDate = date[0].format("YYYY-MM-DD");
                        const toDate = date[1].format("YYYY-MM-DD");
                        setQuery((prev) => ({
                          ...prev,
                          page: 1,
                          FromDate: fromDate,
                          ToDate: toDate,
                        }));
                      } else {
                        setQuery({ page: 1, count: 10, status: true });
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <UserPrivateComponent permission={"readAll-proformaInvoice"}>
            <TableComponent
              list={data}
              columns={columns}
              total={total}
              loading={loading}
              query={query}
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

      <Modal
        title="Generate Advance to Staff Report"
        visible={printModalVisible}
        onCancel={() => setPrintModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setPrintModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="excel"
            className="bg-green-600 hover:bg-green-700 text-white border-green-600"
            loading={isPrinting}
            onClick={() => handleGenerateReportModal('EXCEL')}
          >
            Bank NEFT (Excel)
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={isPrinting}
            onClick={() => handleGenerateReportModal('PDF')}
          >
            Generate PDF
          </Button>,
        ]}
      >
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Company</label>
            <Select
              showSearch
              placeholder="Select a company"
              optionFilterProp="children"
              value={selectedPrintCompany}
              onChange={(val) => setSelectedPrintCompany(val)}
              className="w-full"
            >
              {companyList?.map((company) => (
                <Select.Option key={company.Id} value={company.Id}>
                  {company.Name}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Payment Mode</label>
            <Select
              className="w-full"
              value={selectedPrintPaymentMode}
              onChange={(val) => setSelectedPrintPaymentMode(val)}
            >
              <Select.Option value="BANK">Bank Transfer</Select.Option>
              <Select.Option value="CASH">Cash</Select.Option>
            </Select>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdvanceToStaffEntry;
