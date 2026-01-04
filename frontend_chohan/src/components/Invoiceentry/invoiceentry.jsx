import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateDrawer from "../CommonUi/CreateDrawer";
import axios from "axios";

import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  CalendarOutlined,
  TeamOutlined,
  ReloadOutlined,
  FileTextOutlined,
  BankOutlined,
  FilterOutlined,
  PlusOutlined,
  PrinterOutlined
} from "@ant-design/icons";
import { Card, Button, Select, DatePicker, Table, Input, Tag, Tooltip, Row, Col, Space, Typography } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserPrivateComponent from "../PrivacyComponent/UserPrivateComponent";
import { loadAllCompany } from "../../redux/rtk/features/company/comapnySlice";
import { loadPartyPaginated } from "../../redux/rtk/features/party/partySlice";
import dayjs from "dayjs";
import { generateInvoiceEntryPDF } from "../../utils/generateInvoiceEntryPDF";
import { loadAllInvoiceEntry } from "../../redux/rtk/features/invoiceEntry/invoiceEntrySlice";

const { Title, Text, Paragraph } = Typography;

const Invoiceentry = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { list, total, loading } = useSelector((state) => state.invoiceEntries);
  const { list: companyList } = useSelector((state) => state.companies);
  const { list: partyList } = useSelector((state) => state.party);

  // Filter State
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedParty, setSelectedParty] = useState(null);
  const [dateFilter, setDateFilter] = useState(null);
  const [searchFilter, setSearchFilter] = useState("");
  const [maxId, setMaxId] = useState(0);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    if (list) {
      const ids = list.map((item) => parseInt(item.ID));
      const max = ids.length === 0 ? 0 : Math.max(...ids);
      setMaxId(max);
    }
  }, [list]);

  useEffect(() => {
    dispatch(loadAllCompany({ page: 1, count: 10000, status: true }));
    dispatch(loadPartyPaginated({ page: 1, count: 10000 }));
  }, [dispatch]);

  const fetchData = (page, limit) => {
    dispatch(loadAllInvoiceEntry({
      page,
      count: limit,
      ...(selectedCompany && { companyId: selectedCompany }),
      ...(selectedParty && { partyId: selectedParty }),
      ...(dateFilter && { date: dayjs(dateFilter).format("YYYY-MM-DD") }),
      ...(searchFilter && { search: searchFilter }),
    }));
  };

  useEffect(() => {
    fetchData(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage, selectedCompany, selectedParty, dateFilter, searchFilter]);

  const handleLinkClick = (invoiceNo) => {
    navigate(`/admin/update-Invoice/${invoiceNo}`);
  };

  const onDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        const apiUrl = import.meta.env.VITE_APP_API;
        const response = await axios.delete(`${apiUrl}/invoiceentry/${id}`);
        if (response.status === 200) {
          fetchData(currentPage, itemsPerPage);
          toast.success("Invoice deleted successfully");
        }
      } catch (error) {
        toast.error("Failed to delete the invoice.");
      }
    }
  };

  const handlePrintPDF = async (invoiceNo) => {
    try {
      const apiUrl = import.meta.env.VITE_APP_API;
      const response = await axios.post(`${apiUrl}/invoiceentry/report`, {
        InvoiceId: invoiceNo,
      });
      if (response.data && response.data.status === 1) {
        await generateInvoiceEntryPDF(response.data.data);
      } else {
        toast.error("Failed to fetch invoice data for printing");
      }
    } catch (error) {
      toast.error("Error generating PDF");
    }
  };

  const columns = [
    {
      title: "Sl No",
      key: "slno",
      width: 70,
      fixed: "left",
      render: (text, record, index) => (currentPage - 1) * itemsPerPage + index + 1,
    },
    {
      title: "Invoice No.",
      dataIndex: "RefInvoiceNo",
      key: "RefInvoiceNo",
      width: 120,
      render: (text) => <Text strong style={{ color: '#0891b2' }}>{text}</Text>
    },
    {
      title: "Invoice Date",
      dataIndex: "invoiceDate",
      key: "invoiceDate",
      width: 110,
      render: (date) => (
        <span className="text-gray-600">
          {moment(date).format("DD/MM/YYYY")}
        </span>
      ),
    },
    {
      title: "Company",
      dataIndex: "companyname",
      key: "companyname",
      width: 180,
      hidden: !selectedCompany,
      render: (text) => <span className="font-medium text-gray-800">{text}</span>
    },
    {
      title: "Party",
      dataIndex: "partyName",
      key: "partyName",
      width: 200,
      render: (text) => <span className="font-medium text-gray-800">{text}</span>
    },
    {
      title: "Contact Person",
      key: "contact",
      width: 180,
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ color: '#1e293b' }}>{record.contactPersonName}</Text>
          <Text style={{ color: '#64748b', fontSize: '12px' }}>{record.contactPersonNo}</Text>
        </Space>
      )
    },
    {
      title: "Gross Amount",
      dataIndex: "grossAmount",
      key: "grossAmount",
      align: "right",
      width: 120,
      render: (amount) => <Text strong className="text-gray-700">{amount}</Text>
    },
    {
      title: "Net Amount",
      dataIndex: "netAmount",
      key: "netAmount",
      align: "right",
      width: 120,
      render: (amount) => <Text strong className="text-emerald-600">{amount}</Text>
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 140,
      render: (record) => {
        const { invoiceNo, InvNo, RefInvoiceNo } = record;
        const idToUse = invoiceNo || InvNo || RefInvoiceNo;

        return (
          <div className="flex items-center gap-2">
            <UserPrivateComponent permission="update-proformaInvoice">
              <Tooltip title="Edit">
                <Button
                  icon={<EditOutlined />}
                  onClick={() => handleLinkClick(idToUse)}
                  className="text-blue-600 border-blue-100 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 hover:border-blue-200 flex items-center justify-center"
                  shape="circle"
                  size="middle"
                />
              </Tooltip>
            </UserPrivateComponent>
            <UserPrivateComponent permission={"delete-proformaInvoice"}>
              <Tooltip title="Delete">
                <Button
                  icon={<DeleteOutlined />}
                  onClick={() => onDelete(idToUse)}
                  className="text-red-500 border-red-100 bg-red-50 hover:bg-red-100 hover:text-red-600 hover:border-red-200 flex items-center justify-center"
                  shape="circle"
                  size="middle"
                />
              </Tooltip>
            </UserPrivateComponent>
            <Tooltip title="Print">
              <Button
                icon={<PrinterOutlined />}
                size="middle"
                className="text-emerald-600 border-emerald-100 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-700 hover:border-emerald-200 flex items-center justify-center"
                shape="circle"
                onClick={() => handlePrintPDF(idToUse)}
              />
            </Tooltip>
          </div>
        );
      },
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      <Card bordered={false} className="shadow-none bg-transparent">
        {/* Header Section */}
        <Row justify="space-between" align="middle" className="mb-10">
          <Col>
            <Space align="center" size="large">
              <div style={{
                background: 'linear-gradient(135deg, #0891b2 0%, #0d9488 100%)',
                padding: '16px',
                borderRadius: '20px',
                boxShadow: '0 10px 25px rgba(8, 145, 178, 0.25)'
              }}>
                <FileTextOutlined className="text-white text-4xl" />
              </div>
              <div>
                <Title level={2} style={{ margin: 0, color: '#0f172a', fontWeight: 800, letterSpacing: '-0.5px' }}>Invoice Entry</Title>
                <Paragraph style={{ color: '#64748b', fontSize: '16px', margin: 0, marginTop: '2px' }}>
                  Manage your invoices and payments
                </Paragraph>
              </div>
            </Space>
          </Col>
          <Col>
            <UserPrivateComponent permission={"create-proformaInvoice"}>
              <Link to={`/admin/add-Invoice/${maxId + 1}`}>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  size="large"
                  style={{
                    background: 'linear-gradient(135deg, #0891b2 0%, #0d9488 100%)',
                    border: 'none',
                    height: '52px',
                    padding: '0 32px',
                    fontSize: '16px',
                    fontWeight: 700,
                    borderRadius: '14px',
                    boxShadow: '0 6px 15px rgba(8, 145, 178, 0.3)'
                  }}
                  className="hover:scale-105 transition-all transform active:scale-95"
                >
                  Add Invoice
                </Button>
              </Link>
            </UserPrivateComponent>
          </Col>
        </Row>

        {/* Filters Section */}
        <Card className="mb-6 shadow-md border-0 border-t-4 border-blue-500 rounded-xl bg-white/80 backdrop-blur-sm" bordered={false}>
          <Row gutter={[24, 24]} align="bottom">
            <Col xs={24} sm={12} md={6}>
              <Text strong className="block mb-2" style={{ color: '#334155', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <SearchOutlined className="mr-2" style={{ color: '#0891b2' }} />Search
              </Text>
              <Input
                placeholder="Search Invoice..."
                prefix={<SearchOutlined className="text-gray-400" />}
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="rounded-lg w-full"
                size="large"
                allowClear
              />
            </Col>

            <Col xs={24} sm={12} md={5}>
              <Text strong className="block mb-2" style={{ color: '#334155', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <BankOutlined className="mr-2" style={{ color: '#0891b2' }} />Company
              </Text>
              <Select
                placeholder="Filter by Company"
                allowClear
                showSearch
                optionFilterProp="children"
                value={selectedCompany}
                onChange={setSelectedCompany}
                className="w-full"
                size="large"
                style={{ borderRadius: '10px' }}
              >
                {companyList?.map((comp) => (
                  <Select.Option key={comp.Id} value={comp.Id}>{comp.Name}</Select.Option>
                ))}
              </Select>
            </Col>

            <Col xs={24} sm={12} md={5}>
              <Text strong className="block mb-2" style={{ color: '#334155', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <TeamOutlined className="mr-2" style={{ color: '#0891b2' }} />Party
              </Text>
              <Select
                placeholder="Filter by Party"
                allowClear
                showSearch
                optionFilterProp="children"
                value={selectedParty}
                onChange={setSelectedParty}
                className="w-full"
                size="large"
              >
                {partyList?.map((party) => (
                  <Select.Option key={party.id} value={party.id}>{party.partyName}</Select.Option>
                ))}
              </Select>
            </Col>

            <Col xs={24} sm={12} md={5}>
              <Text strong className="block mb-2" style={{ color: '#334155', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <CalendarOutlined className="mr-2" style={{ color: '#0891b2' }} />Date
              </Text>
              <DatePicker
                placeholder="Filter by Date"
                format="DD/MM/YYYY"
                value={dateFilter}
                onChange={setDateFilter}
                className="w-full rounded-lg"
                size="large"
              />
            </Col>

            <Col xs={24} sm={24} md={3} className="flex justify-start md:justify-end">
              <Button
                icon={<ReloadOutlined />}
                onClick={() => {
                  setSelectedCompany(null);
                  setSelectedParty(null);
                  setDateFilter(null);
                  setSearchFilter("");
                  setCurrentPage(1);
                  fetchData(1, itemsPerPage);
                }}
                size="large"
                className="hover:text-blue-600 hover:border-blue-600 w-full md:w-auto"
              >
                Reset
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Table Section */}
        <Card className="shadow-lg border-0 border-t-4 border-purple-500 rounded-xl overflow-hidden bg-white/90 backdrop-blur-sm" bordered={false} bodyStyle={{ padding: 0 }}>
          <Table
            columns={columns}
            dataSource={list || []}
            loading={loading}
            rowKey={(record) => record.id || record.ID || record.ReviewId || Math.random()}
            pagination={{
              current: currentPage,
              pageSize: itemsPerPage,
              total: total,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50"],
              onChange: (page, pageSize) => {
                setCurrentPage(page);
                setItemsPerPage(pageSize);
              },
              showTotal: (total) => `Total ${total} entries`,
              className: "px-6 pb-4 pt-4"
            }}
            scroll={{ x: 1200 }}
            className="overflow-hidden"
            rowClassName="hover:bg-slate-50 transition-colors"
          />
        </Card>
      </Card>
    </div>
  );
};

export default Invoiceentry;
