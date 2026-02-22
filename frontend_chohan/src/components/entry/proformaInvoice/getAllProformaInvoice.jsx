import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DeleteOutlined, EditOutlined, SearchOutlined, PlusOutlined, PrinterOutlined, SwapOutlined, FilterOutlined, CalendarOutlined, BankOutlined, MoreOutlined } from "@ant-design/icons";
import { Card, Button, Select, DatePicker, Input, Row, Col, Space, Typography, Tooltip, Tag, Dropdown, Menu } from "antd";
import axios from "axios";
import moment from "moment";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import TableComponent from "../../CommonUi/TableComponent";
import UserPrivateComponent from "../../PrivacyComponent/UserPrivateComponent";
import {
  deleteproformaInvoice,
  loadAllproformaInvoice,
} from "../../../redux/rtk/features/proformaInvoice/proformaInvoiceSlice";
import { loadAllCompany } from "../../../redux/rtk/features/company/comapnySlice";
import { generateProformaInvoicePDF } from "../../../utils/generateProformaInvoicePDF";
import dayjs from "dayjs";
import debounce from "lodash/debounce";

const { Title, Text, Paragraph } = Typography;

const GetAllProformaInvoice = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [dateFilter, setDateFilter] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [maxId, setMaxId] = useState(0);

  const { list, total, loading } = useSelector((state) => state.proformaInvoices);
  const { list: companyList } = useSelector((state) => state.companies);
  const apiUrl = import.meta.env.VITE_APP_API;

  const handleLinkClick = (id) => {
    navigate(`/admin/update-proformaInvoice/${id}`);
  };

  const onDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      const res = await dispatch(deleteproformaInvoice(id));
      if (res) {
        dispatch(loadAllproformaInvoice({ status: true, page: 1, count: 10 }));
      }
    }
  };

  const onTransfer = (invoiceNo, restData) => {
    if (window.confirm("Are you sure you want to transfer this invoice?") && restData.status !== "transfered") {
      axios.post(`${apiUrl}/invoicetransfer`, { invoiceNo })
        .then(() => {
          toast.success("Transfer successful!");
          dispatch(loadAllproformaInvoice({ status: true, page: 1, count: 10 }));
        })
        .catch((error) => {
          toast.error("Transfer failed!");
        });
    } else if (restData.status === "transfered") {
      toast.info("Invoice already transferred!");
    }
  };

  const handlePrintPDF = async (invoiceNo) => {
    try {
      const response = await axios.post(`${apiUrl}/proformaInvoice/report`, { invoiceNo });
      if (response.data?.data?.length > 0) {
        const invoiceData = response.data.data[0];
        const matchCompany = selectedCompany
          ? companyList?.find(c => c.Id === selectedCompany)
          : companyList?.find(c => String(c.Id) === String(invoiceData?.CompanyID || invoiceData?.companyId || invoiceData?.company_id)) || companyList?.[0];

        await generateProformaInvoicePDF(response.data.data, matchCompany);
        toast.success("PDF generated successfully!");
      } else {
        toast.error("No data found for this invoice");
      }
    } catch (error) {
      toast.error("Failed to generate PDF");
    }
  };

  const columns = [
    {
      title: "Invoice No.",
      dataIndex: "RefInvoiceNo",
      key: "RefInvoiceNo",
      width: 120,
      render: (text) => <Text strong style={{ color: '#0891b2' }}>{text}</Text>,
    },
    {
      title: "Date",
      dataIndex: "invoiceDate",
      key: "invoiceDate",
      width: 110,
      render: (date) => moment(date).format("DD/MM/YYYY"),
    },
    {
      title: "Party",
      dataIndex: "partyName",
      key: "partyName",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Contact Person",
      key: "contact",
      width: 200,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ color: '#1e293b' }}>{record.contactPersonName}</Text>
          <Text style={{ color: '#64748b', fontSize: '12px' }}>{record.contactPersonNo}</Text>
        </Space>
      ),
    },
    {
      title: "Buses",
      dataIndex: "busQtyRequired",
      key: "busQtyRequired",
      align: "center",
      width: 80,
      render: (qty) => <Tag color="processing" style={{ borderRadius: '4px' }}>{qty}</Tag>,
    },
    {
      title: "Net Amount",
      dataIndex: "netAmount",
      key: "netAmount",
      align: "right",
      width: 120,
      render: (amt) => <Text strong>₹{parseFloat(amt).toLocaleString()}</Text>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status) => (
        <Tag color={status === "transfered" ? "success" : "warning"} style={{ borderRadius: '4px' }}>
          {status === "transfered" ? "Transferred" : "Pending"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 80,
      render: (record) => {
        const items = [
          {
            key: 'edit',
            icon: <EditOutlined style={{ color: '#0891b2' }} />,
            label: 'Edit',
            onClick: () => handleLinkClick(record.ID),
          },
          {
            key: 'print',
            icon: <PrinterOutlined style={{ color: '#0891b2' }} />,
            label: 'Print PDF',
            onClick: () => handlePrintPDF(record.invoiceNo),
          },
          {
            key: 'transfer',
            icon: <SwapOutlined style={{ color: record.status === "transfered" ? '#cbd5e1' : '#0891b2' }} />,
            label: 'Transfer to Booking',
            disabled: record.status === "transfered",
            onClick: () => onTransfer(record.invoiceNo, record),
          },
          {
            type: 'divider',
          },
          {
            key: 'delete',
            danger: true,
            icon: <DeleteOutlined />,
            label: 'Delete',
            onClick: () => onDelete(record.invoiceNo),
          },
        ];

        return (
          <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
            <MoreOutlined style={{ fontSize: '24px', cursor: 'pointer', color: '#94a3b8', padding: '4px' }} />
          </Dropdown>
        );
      },
    },
  ];

  const fetchData = useCallback((params) => {
    dispatch(loadAllproformaInvoice(params));
  }, [dispatch]);

  const debouncedFetchData = useCallback(
    debounce((params) => fetchData(params), 500),
    [fetchData]
  );

  useEffect(() => {
    const params = {
      status: true,
      page: 1,
      count: 10,
      companyId: selectedCompany,
      invoiceDate: dateFilter ? dayjs(dateFilter).format("YYYY-MM-DD") : null,
      searchText: searchText || null,
    };
    debouncedFetchData(params);
  }, [selectedCompany, dateFilter, searchText, debouncedFetchData]);

  useEffect(() => {
    dispatch(loadAllCompany({ page: 1, count: 10000, status: true }));
  }, [dispatch]);

  useEffect(() => {
    const ids = list?.map((item) => parseInt(item.ID));
    const maxId = ids?.length === 0 ? 0 : ids && Math.max(...ids);
    setMaxId(maxId || 0);
  }, [list]);

  return (
    <div className=" bg-slate-50 min-h-screen">
      <Card bordered={false} className="shadow-none bg-transparent">
        <Row justify="space-between" align="middle" className="mb-10">
          <Col>
            <Space align="center" size="large">
              <div style={{
                background: 'linear-gradient(135deg, #0891b2 0%, #0d9488 100%)',
                padding: '16px',
                borderRadius: '20px',
                boxShadow: '0 10px 25px rgba(8, 145, 178, 0.25)'
              }}>
                <FilterOutlined className="text-white text-4xl" />
              </div>
              <div>
                <Title level={2} style={{ margin: 0, color: '#0f172a', fontWeight: 800, letterSpacing: '-0.5px' }}>Proforma Invoices</Title>
                <Paragraph style={{ color: '#64748b', fontSize: '16px', margin: 0, marginTop: '2px' }}>
                  A comprehensive overview of your pending and transferred proforma invoices.
                </Paragraph>
              </div>
            </Space>
          </Col>
          <Col>
            <UserPrivateComponent permission={"create-proformaInvoice"}>
              <Link to={`/admin/add-proformaInvoice/${maxId + 1}`}>
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
                  Add New Invoice
                </Button>
              </Link>
            </UserPrivateComponent>
          </Col>
        </Row>

        <Card className="mb-6 shadow-md border-0 border-t-4 border-blue-500 rounded-xl bg-white/80 backdrop-blur-sm" bordered={false}>

          <Row gutter={[32, 24]} align="bottom">
            <Col xs={24} sm={12} md={8} lg={7}>
              <Text strong className="block mb-2.5" style={{ color: '#334155', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <BankOutlined className="mr-2" style={{ color: '#0891b2' }} />Company
              </Text>
              <Select
                allowClear
                className="w-full custom-select"
                placeholder="Select Company"
                onChange={(val) => setSelectedCompany(val)}
                showSearch
                optionFilterProp="children"
                size="large"
                style={{ borderRadius: '10px' }}
              >
                {companyList?.map((company) => (
                  <Select.Option key={company.Id} value={company.Id}>
                    {company.Name}
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={8} lg={7}>
              <Text strong className="block mb-2.5" style={{ color: '#334155', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <CalendarOutlined className="mr-2" style={{ color: '#0891b2' }} />Invoice Date
              </Text>
              <DatePicker
                allowClear
                className="w-full"
                placeholder="Select Date"
                onChange={(date) => setDateFilter(date)}
                format="DD/MM/YYYY"
                size="large"
                style={{ borderRadius: '10px' }}
              />
            </Col>
            <Col xs={24} sm={24} md={8} lg={10}>
              <Text strong className="block mb-2.5" style={{ color: '#334155', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <SearchOutlined className="mr-2" style={{ color: '#0891b2' }} />Search
              </Text>
              <Input
                placeholder="Search by Invoice No, Party, Contact..."
                prefix={<SearchOutlined className="text-slate-400" style={{ marginRight: '8px' }} />}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
                className="rounded-lg"
                size="large"
                style={{ borderRadius: '10px' }}
              />
            </Col>
          </Row>
        </Card>

        <UserPrivateComponent permission={"readAll-proformaInvoice"}>
          <Card className="shadow-lg border-0 border-t-4 border-purple-500 rounded-xl overflow-hidden bg-white/90 backdrop-blur-sm" bordered={false} bodyStyle={{ padding: 0 }}>
            <TableComponent
              list={list}
              columns={columns}
              loading={loading}
              total={total}
              paginatedThunk={loadAllproformaInvoice}
              pageSize={10}
              scrollX={1200}
              showColVisibility={false}
              csvFileName={"Proforma_Invoices"}
              extraParams={{
                companyId: selectedCompany,
                invoiceDate: dateFilter ? dayjs(dateFilter).format("YYYY-MM-DD") : null,
                searchText: searchText || null,
              }}
            />
          </Card>
        </UserPrivateComponent>
      </Card>
    </div>
  );
};

export default GetAllProformaInvoice;
