import React, { useState, useEffect } from "react";
import { Select, Input, Button, Table, Card, message, Radio, Space } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const { Option } = Select;

const AdvanceDueReport = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [reportType, setReportType] = useState("summary"); // 'summary' or 'detail'
    const [companies, setCompanies] = useState([]);
    const [filters, setFilters] = useState({
        CompanyID: null,
        EmpName: "",
    });

    useEffect(() => {
        fetchCompanies();
        fetchData("summary");
    }, []);

    const fetchCompanies = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_APP_API}/company`);
            if (response.data.status === 1) {
                // response.data is { status, message, count, data: [...] }
                setCompanies(response.data.data || []);
            }
        } catch (error) {
            console.error("Error fetching companies:", error);
        }
    };

    const fetchData = async (type = reportType) => {
        setLoading(true);
        setData([]);
        try {
            const endpoint = type === "summary" ? "/report/advance-due-summary" : "/report/advance-due-detail";
            const response = await axios.post(`${import.meta.env.VITE_APP_API}${endpoint}`, {});

            if (response.data.status === 1) {
                let resultData = response.data.data.data || [];
                setData(resultData);
                message.success("Data fetched successfully");
            } else {
                message.error(response.data.message || "Failed to fetch data");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            message.error("Error fetching data");
        } finally {
            setLoading(false);
        }
    };

    const handleTypeChange = (e) => {
        const type = e.target.value;
        setReportType(type);
        setFilters({ ...filters, CompanyID: null, EmpName: "" });
        fetchData(type);
    };

    const summaryColumns = [
        {
            title: "Employee Name",
            dataIndex: "EmpName",
            key: "EmpName",
            sorter: (a, b) => a.EmpName.localeCompare(b.EmpName),
        },
        {
            title: "Advance Amount",
            dataIndex: "AdvanceAmount",
            key: "AdvanceAmount",
            align: 'right',
            render: (val) => val?.toLocaleString('en-IN', { minimumFractionDigits: 2 })
        },
        {
            title: "Adv Adjusted",
            dataIndex: "AdvAdjuested",
            key: "AdvAdjuested",
            align: 'right',
            render: (val) => val?.toLocaleString('en-IN', { minimumFractionDigits: 2 })
        },
        {
            title: "Due Advance",
            dataIndex: "DueAdvance",
            key: "DueAdvance",
            align: 'right',
            render: (val) => val?.toLocaleString('en-IN', { minimumFractionDigits: 2 })
        },
        { title: "Company ID", dataIndex: "CompanyID", key: "CompanyID" },
    ];

    const detailColumns = [
        { title: "Advance No", dataIndex: "Advanceno", key: "Advanceno" },
        {
            title: "Date",
            dataIndex: "AdvancedDate",
            key: "AdvancedDate",
            render: (text) => text ? dayjs(text).format("YYYY-MM-DD") : 'N/A'
        },
        { title: "Emp ID", dataIndex: "EmpID", key: "EmpID" },
        { title: "Type", dataIndex: "driverHelper", key: "driverHelper" },
        { title: "Employee Name", dataIndex: "EmpName", key: "EmpName", sorter: (a, b) => a.EmpName.localeCompare(b.EmpName) },
        {
            title: "Advance Amount",
            dataIndex: "advanceAmount",
            key: "advanceAmount",
            align: 'right',
            render: (val) => val?.toLocaleString('en-IN', { minimumFractionDigits: 2 })
        },
        {
            title: "Adv Adjusted",
            dataIndex: "AdvAdjusted",
            key: "AdvAdjusted",
            align: 'right',
            render: (val) => val?.toLocaleString('en-IN', { minimumFractionDigits: 2 })
        },
        {
            title: "Due Advance",
            dataIndex: "DueAdvance",
            key: "DueAdvance",
            align: 'right',
            render: (val) => val?.toLocaleString('en-IN', { minimumFractionDigits: 2 })
        },
        { title: "Company ID", dataIndex: "CompanyID", key: "CompanyID" },
    ];

    const exportPDF = () => {
        const doc = new jsPDF(reportType === 'detail' ? 'landscape' : 'portrait');
        const title = reportType === "summary" ? "Advance Due Summary Report" : "Advance Due Detail Report";
        doc.text(title, 14, 15);

        const columns = reportType === "summary" ? summaryColumns : detailColumns;
        const tableColumn = columns.map((col) => col.title);
        const tableRows = [];

        data.forEach((row) => {
            const rowData = columns.map(col => {
                if (col.dataIndex === 'AdvancedDate') {
                    return row[col.dataIndex] ? dayjs(row[col.dataIndex]).format("YYYY-MM-DD") : 'N/A';
                }
                const val = row[col.dataIndex];
                return val !== undefined && val !== null ? val : '';
            });
            tableRows.push(rowData);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 25,
            theme: 'grid',
            styles: { fontSize: 8 },
            headStyles: { fillColor: [66, 66, 66] }
        });

        doc.save(`${title.replace(/\s+/g, '_')}.pdf`);
    };

    const exportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
        XLSX.writeFile(workbook, `AdvanceDue_${reportType}.xlsx`);
    };

    return (
        <div className="p-4">
            <Card title={<span className="text-xl font-bold">Advance Due Report</span>}>
                <Space direction="vertical" size="large" style={{ display: 'flex' }}>
                    <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg flex-wrap gap-4">
                        <Space size="middle">
                            <Radio.Group value={reportType} onChange={handleTypeChange} buttonStyle="solid">
                                <Radio.Button value="summary">Summary View</Radio.Button>
                                <Radio.Button value="detail">Detail View</Radio.Button>
                            </Radio.Group>

                            <div className="flex items-center">
                                <span className="mr-2 font-medium">Company:</span>
                                <Select
                                    placeholder="All Companies"
                                    style={{ width: 250 }}
                                    allowClear
                                    value={filters.CompanyID}
                                    onChange={(value) => {
                                        setFilters({ ...filters, CompanyID: value });
                                    }}
                                >
                                    {companies.map(c => (
                                        <Option key={c.Id} value={c.Id}>{c.Name}</Option>
                                    ))}
                                </Select>
                            </div>

                            <div className="flex items-center">
                                <span className="mr-2 font-medium">Employee:</span>
                                <Input
                                    placeholder="Enter Name"
                                    style={{ width: 180 }}
                                    allowClear
                                    value={filters.EmpName}
                                    onChange={(e) => {
                                        setFilters({ ...filters, EmpName: e.target.value });
                                    }}
                                />
                            </div>
                        </Space>

                        <Space>
                            <Button type="primary" onClick={() => fetchData()} loading={loading}>
                                Refresh Data
                            </Button>
                            <Button type="default" onClick={exportPDF} disabled={data.length === 0} className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100">
                                Export PDF
                            </Button>
                            <Button type="default" onClick={exportExcel} disabled={data.length === 0} className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100">
                                Export Excel
                            </Button>
                        </Space>
                    </div>

                    <Table
                        columns={reportType === "summary" ? summaryColumns : detailColumns}
                        dataSource={data.filter(item => {
                            const matchCompany = !filters.CompanyID || item.CompanyID == filters.CompanyID;
                            const matchName = !filters.EmpName || item.EmpName?.toLowerCase().includes(filters.EmpName.toLowerCase());
                            return matchCompany && matchName;
                        })}
                        rowKey={(record, index) => record.Advanceno || record.EmpName + index}
                        loading={loading}
                        pagination={{
                            pageSize: 15,
                            showSizeChanger: true,
                            pageSizeOptions: ['10', '15', '20', '50', '100']
                        }}
                        bordered
                        size="small"
                        scroll={{ x: 'max-content' }}
                    />
                </Space>
            </Card>
        </div>
    );
};

export default AdvanceDueReport;
