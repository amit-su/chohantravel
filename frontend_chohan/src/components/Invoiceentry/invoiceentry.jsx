import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateDrawer from "../CommonUi/CreateDrawer";
import axios from "axios";

import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Card, Button, Select, DatePicker } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TableComponent from "../CommonUi/TableComponent";
import UserPrivateComponent from "../PrivacyComponent/UserPrivateComponent";
import SimpleButton from "../Buttons/SimpleButton";
import { loadAllCompany } from "../../redux/rtk/features/company/comapnySlice";
import dayjs from "dayjs";
import { generateInvoiceEntryPDF } from "../../utils/generateInvoiceEntryPDF";
import { loadAllInvoiceEntry } from "../../redux/rtk/features/invoiceEntry/invoiceEntrySlice";

const Invoiceentry = () => {
  const onClose = () => { };
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { list, total, loading } = useSelector((state) => state.invoiceEntries);
  const { list: companyList } = useSelector((state) => state.companies);

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [dateFilter, setDateFilter] = useState(null);
  const [maxId, setMaxId] = useState(0);

  useEffect(() => {
    dispatch(loadAllInvoiceEntry({ page: 1, count: 10 }));
    dispatch(loadAllCompany({ page: 1, count: 10000, status: true }));
  }, [dispatch]);

  useEffect(() => {
    if (list) {
      const ids = list.map((item) => parseInt(item.ID));
      const max = ids.length === 0 ? 0 : Math.max(...ids);
      setMaxId(max);
    }
  }, [list]);

  const handleLinkClick = (invoiceNo) => {
    navigate(`/admin/update-Invoice/${invoiceNo}`);
    window.location.reload();
  };

  const onDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        const response = await axios.delete(`${apiUrl}/invoiceentry/${id}`);
        if (response.status === 200) {
          dispatch(loadAllInvoiceEntry({ page: 1, count: 10 }));
          toast.success("Invoice deleted successfully");
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Failed to delete the invoice.");
      }
    }
  };

  const apiUrl = import.meta.env.VITE_APP_API;

  const handlePrintPDF = async (invoiceNo) => {
    try {
      const response = await axios.post(`${apiUrl}/invoiceentry/report`, {
        InvoiceId: invoiceNo,
      });
      if (response.data && response.data.status === 1) {
        await generateInvoiceEntryPDF(response.data.data);
      } else {
        toast.error("Failed to fetch invoice data for printing");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Error generating PDF");
    }
  };

  const columns = [
    {
      id: 1,
      title: "Invoice No.",
      dataIndex: "RefInvoiceNo",
      key: "RefInvoiceNo",
      width: 100,
    },
    {
      id: 2,
      title: "Invoice Date",
      dataIndex: "invoiceDate",
      key: "invoiceDate",
      width: 110,
      render: (date) => moment(date).format("DD-MM-YYYY"),
    },
    {
      id: 8,
      title: "Party",
      dataIndex: "partyName",
      key: "partyName",
      width: 200,
    },
    {
      id: 3,
      title: "Contact Person Name",
      dataIndex: `contactPersonName`,
      key: "contactPersonName",
      width: 170,
    },
    {
      id: 3,
      title: "Contact Person No",
      dataIndex: `contactPersonNo`,
      key: "contactPersonNo",
      width: 170,
    },

    {
      id: 6,
      title: "Gross Amount ",
      dataIndex: "grossAmount",
      key: "grossAmount",
      align: "right",
      width: 140,
    },
    {
      id: 5,
      title: "Net Amount",
      dataIndex: "netAmount",
      key: "netAmount",
      align: "right",
      width: 110,
    },

    {
      id: 3,
      title: "Action",
      dataIndex: "",
      key: "action",
      fixed: "right",
      width: 150,
      render: (record) => {
        const { invoiceNo, InvNo, RefInvoiceNo } = record;
        const idToUse = invoiceNo || InvNo || RefInvoiceNo;

        return (
          <div className="flex items-center gap-2">
            <UserPrivateComponent permission="update-proformaInvoice">
              <Link onClick={() => handleLinkClick(idToUse)}>
                <EditOutlined
                  className="p-2 text-white bg-gray-600 rounded-md"
                  style={{ fontSize: "15px", cursor: "pointer" }}
                />
              </Link>
            </UserPrivateComponent>
            <UserPrivateComponent permission={"delete-proformaInvoice"}>
              <DeleteOutlined
                onClick={() => onDelete(idToUse)}
                className="p-2 text-white bg-red-600 rounded-md"
              />
            </UserPrivateComponent>
            <button
              className="px-4 py-2 font-bold text-white transition duration-300 bg-green-600 rounded hover:bg-green-700"
              style={{ width: "120px" }}
              onClick={() => handlePrintPDF(idToUse)}
            >
              Print Page
            </button>
          </div>
        );
      },
    },
  ];

  const filteredList = list?.filter((item) => {
    const matchesCompany = selectedCompany
      ? item.COMPANY_ID == selectedCompany
      : true;

    const matchesDate = dateFilter
      ? dayjs(item.invoiceDate)
        .startOf("day")
        .isSame(dayjs(dateFilter).startOf("day"))
      : true;

    return matchesCompany && matchesDate;
  });

  return (
    <>
      <div className="mt-2 card card-custom">
        <div className="card-body">
          <Card
            className="border-0 md:border md:p-6 bg-transparent md:bg-[#fafafa]"
            bodyStyle={{ padding: 0 }}
          >
            <div className="items-center justify-between pb-3 md:flex">
              <h1 className="text-lg font-bold">Invoice</h1>
              <div className="flex items-center justify-between gap-1 md:justify-start md:gap-3">
                <div className="flex xxs:w-1/2 md:w-full xxs:flex-col md:flex-row xxs:gap-1 md:gap-5">
                  <UserPrivateComponent permission={"create-proformaInvoice"}>
                    <Link to={`/admin/add-Invoice/${maxId + 1}`}>
                      <SimpleButton title={"Add Invoice"} />
                    </Link>
                  </UserPrivateComponent>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 mb-4 md:flex-row md:items-end">
              {/* Company Select */}
              <div className="w-full md:w-1/3">
                <Select
                  labelInValue
                  allowClear
                  value={
                    selectedCompany
                      ? {
                        value: selectedCompany,
                        label: companyList.find(
                          (c) => c.Id === selectedCompany
                        )?.Name,
                      }
                      : undefined
                  }
                  onChange={(option) => {
                    setSelectedCompany(option ? option.value : null);
                  }}
                  placeholder="Filter by Company"
                  optionFilterProp="children"
                  showSearch
                  style={{ width: "100%" }}
                >
                  {companyList?.map((company) => (
                    <Select.Option key={company.Id} value={company.Id}>
                      {company.Name}
                    </Select.Option>
                  ))}
                </Select>
              </div>

              {/* Date Filter */}
              <div className="w-full md:w-1/4">
                <DatePicker
                  allowClear
                  placeholder="Filter by Date"
                  onChange={(date) => setDateFilter(date)}
                  style={{ width: "100%" }}
                  value={dateFilter}
                  format="DD-MM-YYYY"
                />
              </div>
            </div>
            <UserPrivateComponent permission={"readAll-proformaInvoice"}>
              <TableComponent
                list={filteredList}
                columns={columns}
                loading={loading}
                total={total}
                paginatedThunk={loadAllInvoiceEntry}
                pageSize={10}
                scrollX={1700}
                csvFileName={"Invoice List"}
              />
            </UserPrivateComponent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Invoiceentry;
