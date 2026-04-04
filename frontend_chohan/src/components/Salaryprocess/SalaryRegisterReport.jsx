import React, { useState, useMemo, useEffect } from "react";
import { Button, DatePicker, Spin, Alert, Select, Space, Tooltip, Divider } from "antd";
import { 
    FilePdfOutlined, 
    FileExcelOutlined, 
    SearchOutlined, 
    PrinterOutlined,
    DownloadOutlined,
    ClearOutlined
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { loadAllCompany } from "../../redux/rtk/features/company/comapnySlice";
import { loadAllSite } from "../../redux/rtk/features/site/siteSlice";
import { generateSalaryRegisterPDF } from "../../utils/generateSalaryRegisterPDF";
import { generateSalaryRegisterExcel } from "../../utils/generateSalaryRegisterExcel";
import { generateBankTransferExcel } from "../../utils/generateBankTransferExcel";
import { message } from "antd"; // Ensure message is imported correctly

function SalaryRegisterReport() {
    const dispatch = useDispatch();
    const { list: companyList } = useSelector((state) => state.companies);
    const { list: siteList } = useSelector((state) => state.sites);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [paymentMode, setPaymentMode] = useState("ALL");
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [selectedSite, setSelectedSite] = useState(null);
    const [salaryData, setSalaryData] = useState(null);
    const [pdfBlobUrl, setPdfBlobUrl] = useState(null);

    const filteredSalaryData = useMemo(() => {
        if (!salaryData) return null;
        if (paymentMode === "ALL") return salaryData;
        return salaryData.filter((item) => {
            const mode = item.bankAcNo ? "BANK" : "CASH";
            return mode === paymentMode;
        });
    }, [salaryData, paymentMode]);

    const reportTitleLabel = useMemo(() => {
        const monthYear = selectedDate.format('MMMM YYYY');
        if (selectedSite) {
            const site = siteList?.find(s => s.siteID === selectedSite);
            if (site) {
                return `${monthYear} for ${site.siteName}`;
            }
        }
        return monthYear;
    }, [selectedDate, selectedSite, siteList]);

    // Update PDF when filtered data changes
    useEffect(() => {
        const updatePDF = async () => {
            if (filteredSalaryData && filteredSalaryData.length > 0) {
                try {
                    const matchCompany = companyList?.find(c => c.Id === selectedCompany) || companyList?.[0];
                    const blobUrl = await generateSalaryRegisterPDF(
                        filteredSalaryData,
                        reportTitleLabel,
                        matchCompany
                    );
                    setPdfBlobUrl(blobUrl);
                } catch (err) {
                    setError('Failed to generate PDF');
                }
            } else {
                setPdfBlobUrl(null);
            }
        };
        updatePDF();
    }, [filteredSalaryData, selectedDate, selectedCompany, companyList]);

    const apiUrl = import.meta.env.VITE_APP_API;

    useEffect(() => {
        dispatch(loadAllCompany({ page: 1, count: 1000, status: true }));
        dispatch(loadAllSite({ page: 1, count: 1000, status: true }));
    }, [dispatch]);

    const fetchSalaryRegister = async () => {
        setLoading(true);
        setError(null);
        setPdfBlobUrl(null); // Clear previous PDF
        try {
            const response = await axios.post(
                `${apiUrl}/salarydetails/register-report`,
                {
                    sDate: selectedDate.format('YYYY-MM-DD'),
                    CompanyID: selectedCompany,
                    SiteID: selectedSite || 0
                }
            );

            setSalaryData(response.data.data);

            if (!response.data.data || response.data.data.length === 0) {
                setError('No salary data found for the selected month');
            }
        } catch (err) {
            setError(err.response?.data?.error || err.message || "Failed to fetch salary register");
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setSalaryData(null);
        setError(null);
        setPdfBlobUrl(null);
        setSelectedCompany(null);
        setSelectedSite(null);
        setPaymentMode("ALL");
    };

    const handleGeneratePDF = async () => {
        if (filteredSalaryData && filteredSalaryData.length > 0) {
            try {
                const matchCompany = companyList?.find(c => c.Id === selectedCompany) || companyList?.[0];
                const blobUrl = await generateSalaryRegisterPDF(
                    filteredSalaryData,
                    reportTitleLabel,
                    matchCompany
                );
                setPdfBlobUrl(blobUrl);
            } catch (err) {
                setError('Failed to generate PDF');
            }
        }
    };

    const handleOpenPDF = () => {
        if (pdfBlobUrl) {
            window.open(pdfBlobUrl, '_blank');
        }
    };

    const handleGenerateExcel = () => {
        if (filteredSalaryData && filteredSalaryData.length > 0) {
            const matchCompany = companyList?.find(c => c.Id === selectedCompany) || companyList?.[0];
            generateSalaryRegisterExcel(
                filteredSalaryData,
                reportTitleLabel,
                matchCompany
            );
        }
    };

    const handleExportToBank = () => {
        if (filteredSalaryData && filteredSalaryData.length > 0) {
            // Only export employees with bank account numbers
            const bankData = filteredSalaryData.filter(item => item.bankAcNo);
            if (bankData.length === 0) {
                message.warning("No employees with bank account numbers found for this selection");
                return;
            }
            const matchCompany = companyList?.find(c => c.Id === selectedCompany) || companyList?.[0];
            generateBankTransferExcel(
                bankData,
                matchCompany,
                reportTitleLabel
            );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-8xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">
                        Salary Register Report
                    </h1>

                    <div className="flex items-center gap-4 flex-wrap">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Month & Year
                            </label>
                            <DatePicker
                                picker="month"
                                value={selectedDate}
                                onChange={(date) => setSelectedDate(date)}
                                format="MMMM YYYY"
                                className="w-64"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Company
                            </label>
                            <Select
                                placeholder="All Companies"
                                allowClear
                                showSearch
                                optionFilterProp="children"
                                value={selectedCompany}
                                onChange={(val) => setSelectedCompany(val)}
                                className="w-80"
                            >
                                {companyList?.map((comp) => (
                                    <Select.Option key={comp.Id} value={comp.Id}>{comp.Name}</Select.Option>
                                ))}
                            </Select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Site
                            </label>
                            <Select
                                placeholder="All Sites"
                                allowClear
                                showSearch
                                optionFilterProp="children"
                                value={selectedSite}
                                onChange={(val) => setSelectedSite(val)}
                                className="w-48"
                            >
                                {siteList?.map((site) => (
                                    <Select.Option key={site.siteID} value={site.siteID}>{site.siteName}</Select.Option>
                                ))}
                            </Select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Payment Mode
                            </label>
                            <Select
                                value={paymentMode}
                                onChange={(value) => setPaymentMode(value)}
                                className="w-48"
                                placeholder="Select Payment Mode"
                            >
                                <Select.Option value="ALL">All Modes</Select.Option>
                                <Select.Option value="CASH">Cash</Select.Option>
                                <Select.Option value="BANK">Bank Transfer</Select.Option>
                            </Select>
                        </div>

                        <div className="flex items-center gap-3 mt-6 w-full justify-between">
                            <Space size="middle">
                                <Button
                                    type="primary"
                                    icon={<SearchOutlined />}
                                    onClick={fetchSalaryRegister}
                                    loading={loading}
                                    size="large"
                                    className="bg-blue-600 hover:bg-blue-700 min-w-[150px]"
                                >
                                    Fetch Data
                                </Button>
                                
                                <Button
                                    icon={<ClearOutlined />}
                                    onClick={handleClear}
                                    size="large"
                                    disabled={loading}
                                >
                                    Clear
                                </Button>
                            </Space>

                            {filteredSalaryData && filteredSalaryData.length > 0 && (
                                <Space size="middle" className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                                    <span className="text-gray-500 font-medium mr-2">Export Options:</span>
                                    
                                    {pdfBlobUrl && (
                                        <Tooltip title="Print/View as PDF">
                                            <Button
                                                type="primary"
                                                icon={<PrinterOutlined />}
                                                onClick={handleOpenPDF}
                                                size="large"
                                                className="bg-indigo-600 hover:bg-indigo-700"
                                            >
                                                Print PDF
                                            </Button>
                                        </Tooltip>
                                    )}

                                    <Tooltip title="Download Salary Register (Excel)">
                                        <Button
                                            type="default"
                                            icon={<FileExcelOutlined />}
                                            onClick={handleGenerateExcel}
                                            size="large"
                                            className="bg-green-600 hover:bg-green-700 text-white border-green-600"
                                        >
                                            Excel List
                                        </Button>
                                    </Tooltip>

                                    <Tooltip title="Export for Bank Transfer (NEFT)">
                                        <Button
                                            type="default"
                                            icon={<DownloadOutlined />}
                                            onClick={handleExportToBank}
                                            size="large"
                                            className="bg-emerald-700 hover:bg-emerald-800 text-white border-emerald-700"
                                        >
                                            Bank NEFT
                                        </Button>
                                    </Tooltip>
                                </Space>
                            )}
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <Spin size="large" />
                        <p className="mt-4 text-gray-600">Loading salary register...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <Alert
                        message="Error"
                        description={error}
                        type="error"
                        showIcon
                        closable
                        onClose={() => setError(null)}
                    />
                )}

                {/* Success State */}
                {!loading && !error && filteredSalaryData && (
                    <div className="bg-white rounded-lg shadow-md p-8">
                        {filteredSalaryData.length > 0 ? (
                            <>
                                <div className="text-center mb-6">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                                        <FilePdfOutlined className="text-3xl text-green-600" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                        Salary Register Ready
                                    </h2>
                                    <p className="text-gray-600">
                                        {filteredSalaryData.length} employees found
                                        {paymentMode !== 'ALL' && ` (${paymentMode === 'BANK' ? 'Bank Transfer' : 'Cash'})`}
                                        for {reportTitleLabel}
                                    </p>
                                </div>

                                {/* Summary Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                                        <p className="text-sm text-gray-600 mb-1">Total Employees</p>
                                        <p className="text-2xl font-bold text-blue-600">
                                            {filteredSalaryData.length}
                                        </p>
                                    </div>
                                    <div className="bg-green-50 rounded-lg p-4 text-center">
                                        <p className="text-sm text-gray-600 mb-1">Total Gross Salary</p>
                                        <p className="text-2xl font-bold text-green-600">
                                            ₹ {filteredSalaryData.reduce((sum, item) => sum + (parseFloat(item.GrossSalary) || 0), 0).toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                    <div className="bg-red-50 rounded-lg p-4 text-center">
                                        <p className="text-sm text-gray-600 mb-1">Total Deductions</p>
                                        <p className="text-2xl font-bold text-red-600">
                                            ₹ {filteredSalaryData.reduce((sum, item) =>
                                                sum + (parseFloat(item.ESIC) || 0) +
                                                (parseFloat(item.PF) || 0) +
                                                (parseFloat(item.PTAX) || 0) +
                                                (parseFloat(item.AdvanceAdjusted) || 0) +
                                                (parseFloat(item.Totaldecution) || 0), 0
                                            ).toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                    <div className="bg-purple-50 rounded-lg p-4 text-center">
                                        <p className="text-sm text-gray-600 mb-1">Total Net Salary</p>
                                        <p className="text-2xl font-bold text-purple-600">
                                            ₹ {filteredSalaryData.reduce((sum, item) => sum + (parseFloat(item.NetSalary) || 0), 0).toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                </div>

                                {/* Employee List Preview */}
                                <div className="border-t border-gray-200 pt-6">
                                    <h3 className="text-lg font-semibold mb-4">Employees Included:</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {filteredSalaryData.slice(0, 12).map((emp, index) => (
                                            <div key={index} className="text-sm text-gray-600">
                                                • {emp.name} ({emp.empType})
                                            </div>
                                        ))}
                                        {filteredSalaryData.length > 12 && (
                                            <div className="text-sm text-gray-500 italic">
                                                ... and {filteredSalaryData.length - 12} more
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center p-12">
                                <p className="text-gray-500">No employees found for the selected criteria.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SalaryRegisterReport;
