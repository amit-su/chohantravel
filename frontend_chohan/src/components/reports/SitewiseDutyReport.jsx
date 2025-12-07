import React, { useState } from "react";
import { DatePicker, Select, Input, Button, Table, Card, message } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const { Option } = Select;

const SitewiseDutyReport = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [filters, setFilters] = useState({
        SDate: dayjs().startOf("month"),
        EDate: dayjs().endOf("month"),
        EmpType: "DRIVER",
        EmpName: "",
    });

    const columns = [
        {
            title: "Employee Name",
            dataIndex: "EmpName",
            key: "EmpName",
        },
        {
            title: "Site Name",
            dataIndex: "siteShortName",
            key: "siteShortName",
        },
        {
            title: "Total Khuraki",
            dataIndex: "TotalKhurakiAmount",
            key: "TotalKhurakiAmount",
        },
        {
            title: "No of Duty",
            dataIndex: "NoOfDuty",
            key: "NoOfDuty",
        },
        ...(filters.EmpType === "DRIVER"
            ? [
                {
                    title: "Driver Khuraki",
                    dataIndex: "DriverKhurakiAmt",
                    key: "DriverKhurakiAmt",
                },
            ]
            : []),
        ...(filters.EmpType === "HELPER"
            ? [
                {
                    title: "Helper Khuraki",
                    dataIndex: "HelperKhurakiAmt",
                    key: "HelperKhurakiAmt",
                },
            ]
            : []),
    ];

    const fetchData = async () => {
        if (!filters.SDate || !filters.EDate || !filters.EmpType) {
            message.error("Please select Start Date, End Date and Employee Type");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_APP_API}/report/sitewise-duty`,
                {
                    SDate: filters.SDate.format("YYYY-MM-DD"),
                    EDate: filters.EDate.format("YYYY-MM-DD"),
                    EmpType: filters.EmpType,
                    EmpName: filters.EmpName,
                }
            );

            if (response.data.status === 1) {
                const resultData = response.data.data.data || [];
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

    const exportPDF = () => {
        const doc = new jsPDF();
        doc.text("Khoraki Summary", 14, 15);
        doc.text(
            `From: ${filters.SDate.format("YYYY-MM-DD")} To: ${filters.EDate.format(
                "YYYY-MM-DD"
            )}`,
            14,
            22
        );

        const tableColumn = columns.map((col) => col.title);
        const tableRows = [];

        data.forEach((row) => {
            const rowData = [
                row.EmpName,
                row.siteShortName,
                row.TotalKhurakiAmount,
                row.NoOfDuty,
            ];
            if (filters.EmpType === "DRIVER") {
                rowData.push(row.DriverKhurakiAmt);
            } else if (filters.EmpType === "HELPER") {
                rowData.push(row.HelperKhurakiAmt);
            }
            tableRows.push(rowData);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 30,
        });

        doc.save("SitewiseDutyReport.pdf");
    };

    const exportExcel = () => {
        const excelData = data.map((row) => {
            const rowData = {
                "Employee Name": row.EmpName,
                "Site Name": row.siteShortName,
                "Total Khuraki": row.TotalKhurakiAmount,
                "No of Duty": row.NoOfDuty,
            };
            if (filters.EmpType === "DRIVER") {
                rowData["Driver Khuraki"] = row.DriverKhurakiAmt;
            } else if (filters.EmpType === "HELPER") {
                rowData["Helper Khuraki"] = row.HelperKhurakiAmt;
            }
            return rowData;
        });

        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
        XLSX.writeFile(workbook, "SitewiseDutyReport.xlsx");
    };

    return (
        <div className="p-4">
            <Card title="Khoraki Summary">
                <div className="flex gap-4 mb-4 flex-wrap">
                    <div>
                        <label className="block mb-1">Start Date</label>
                        <DatePicker
                            value={filters.SDate}
                            onChange={(date) => setFilters({ ...filters, SDate: date })}
                        />
                    </div>
                    <div>
                        <label className="block mb-1">End Date</label>
                        <DatePicker
                            value={filters.EDate}
                            onChange={(date) => setFilters({ ...filters, EDate: date })}
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Employee Type</label>
                        <Select
                            value={filters.EmpType}
                            onChange={(value) => setFilters({ ...filters, EmpType: value })}
                            style={{ width: 120 }}
                        >
                            <Option value="DRIVER">Driver</Option>
                            <Option value="HELPER">Helper</Option>
                        </Select>
                    </div>
                    <div>
                        <label className="block mb-1">Employee Name</label>
                        <Input
                            value={filters.EmpName}
                            onChange={(e) =>
                                setFilters({ ...filters, EmpName: e.target.value })
                            }
                            placeholder="Optional"
                        />
                    </div>
                    <div className="flex items-end">
                        <Button type="primary" onClick={fetchData} loading={loading}>
                            Search
                        </Button>
                    </div>
                </div>

                <div className="mb-4 flex gap-2">
                    <Button onClick={exportPDF} disabled={data.length === 0}>
                        Export PDF
                    </Button>
                    <Button onClick={exportExcel} disabled={data.length === 0}>
                        Export Excel
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey={(record) =>
                        `${record.EmpName}-${record.siteShortName}-${record.DriverID}-${record.HelperID}`
                    }
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                />
            </Card>
        </div>
    );
};

export default SitewiseDutyReport;
