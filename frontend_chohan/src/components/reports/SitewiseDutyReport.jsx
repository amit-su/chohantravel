import React, { useState } from "react";
import { DatePicker, Select, Input, Button, Table, Card, message, Tabs } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadAllCompany } from "../../redux/rtk/features/company/comapnySlice";
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
    const [detailData, setDetailData] = useState([]);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [detailFilters, setDetailFilters] = useState({
        month: dayjs(),
        empType: "DRIVER",
        companyId: 0,
        siteId: 0,
    });
    const dispatch = useDispatch();
    const { list: companyList } = useSelector((state) => state.Company || state.companies || {});

    useEffect(() => {
        if (!companyList) {
            dispatch(loadAllCompany({ page: 1, count: 1000, status: true }));
        }
    }, [dispatch, companyList]);
    const [sites, setSites] = useState({});
    const [allSites, setAllSites] = useState([]);

    useEffect(() => {
        const fetchSites = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_APP_API}/site`);
                const siteMap = {};
                const siteList = response.data.data || [];
                setAllSites(siteList);
                siteList.forEach(s => {
                    siteMap[s.siteID || s.ID] = s.siteShortName;
                });
                setSites(siteMap);
            } catch (error) {
            }
        };
        fetchSites();
    }, []);

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
            render: (text) => `${text}`,
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

    const fetchDetailData = async () => {
        setLoadingDetails(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_APP_API}/report/driver-helper-attendance`,
                {
                    month: detailFilters.month.format("MM"),
                    year: detailFilters.month.format("YYYY"),
                    empType: detailFilters.empType,
                    companyId: detailFilters.companyId,
                    siteId: detailFilters.siteId,
                }
            );
            setDetailData(response.data.data.data || []);
        } catch (error) {
        } finally {
            setLoadingDetails(false);
        }
    };

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

        const totalKhuraki = data.reduce((acc, curr) => acc + (parseFloat(curr.TotalKhurakiAmount) || 0), 0);
        const totalDuty = data.reduce((acc, curr) => acc + (parseInt(curr.NoOfDuty) || 0), 0);
        const totalTypeKhuraki = data.reduce((acc, curr) => {
            if (filters.EmpType === "DRIVER") return acc + (parseFloat(curr.DriverKhurakiAmt) || 0);
            if (filters.EmpType === "HELPER") return acc + (parseFloat(curr.HelperKhurakiAmt) || 0);
            return acc;
        }, 0);

        const totalRow = ["GRAND TOTAL", "", totalKhuraki.toLocaleString(), totalDuty];
        if (filters.EmpType === "DRIVER" || filters.EmpType === "HELPER") {
            totalRow.push(totalTypeKhuraki.toLocaleString());
        }
        tableRows.push(totalRow);

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 30,
            didDrawPage: (data) => {
                // Ensure the last row is bold
            },
            bodyStyles: {
                lineWidth: 0.1
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245]
            }
        });

        doc.save("SitewiseDutyReport.pdf");
    };

    const exportDetailsPDF = () => {
        const doc = new jsPDF('l', 'mm', 'a3'); // Using A3 landscape for better width coverage
        const daysInMonth = detailFilters.month.daysInMonth();
        const monthYear = detailFilters.month.format("MMMM YYYY");

        doc.setFontSize(16);
        doc.text(`Khuraki Details Report - ${monthYear}`, 14, 15);
        doc.setFontSize(10);
        doc.text(`Employee Type: ${detailFilters.empType} | Generated on: ${dayjs().format("YYYY-MM-DD HH:mm")}`, 14, 22);

        const tableColumn = [
            { title: "Employee Name (ID)", dataKey: "name" },
            ...Array.from({ length: daysInMonth }, (_, i) => ({
                title: (i + 1).toString().padStart(2, "0"),
                dataKey: `day_${i + 1}`,
            })),
            { title: "Site Wise Breakdown", dataKey: "breakdown" },
            { title: "Total Amount", dataKey: "total" },
        ];

        const tableRows = detailData.map((record) => {
            let attendance = [];
            try {
                attendance = typeof record.AttendanceStatus === 'string'
                    ? JSON.parse(record.AttendanceStatus)
                    : (record.AttendanceStatus || []);
            } catch (e) { }

            const dayMap = {};
            attendance.forEach(att => {
                const dayNum = parseInt(att.date, 10);
                const siteName = sites[att.status] || att.status;
                if (!dayMap[dayNum]) dayMap[dayNum] = [];
                dayMap[dayNum].push(siteName);
            });

            const row = {
                name: `${record.EmployeeName}\n(${record.employeeID})`,
                total: `${record.TotalKhorakiAmt}`,
            };

            for (let i = 1; i <= daysInMonth; i++) {
                row[`day_${i}`] = (dayMap[i] || []).join(", ");
            }

            // Format Breakdown
            try {
                const counts = typeof record.SiteWiseCount === 'string' ? JSON.parse(record.SiteWiseCount) : record.SiteWiseCount;
                row.breakdown = (counts || []).map(c => `${sites[c.SiteID] || c.SiteID}: Duty:${c.TotalCount} Amount:${c.TotalKhorakiAmt}`).join("\n");
            } catch (e) {
                row.breakdown = record.SiteWiseCount || "";
            }

            return row;
        });

        const grandTotal = detailData.reduce((acc, curr) => acc + (parseFloat(curr.TotalKhorakiAmt) || 0), 0);
        const totalRow = {
            name: "GRAND TOTAL",
            total: grandTotal.toLocaleString()
        };
        // Fill empty days for formatting
        for (let i = 1; i <= daysInMonth; i++) totalRow[`day_${i}`] = "";
        totalRow.breakdown = "";
        tableRows.push(totalRow);

        doc.autoTable({
            columns: tableColumn,
            body: tableRows,
            startY: 30,
            styles: { fontSize: 7, cellPadding: 1, overflow: 'linebreak' },
            headStyles: { fillColor: [41, 128, 185], textColor: 255, fontSize: 7, fontStyle: 'bold' },
            columnStyles: {
                name: { cellWidth: 35 },
                breakdown: { cellWidth: 50 },
                total: { cellWidth: 20, fontStyle: 'bold' },
            },
            theme: 'grid',
            willDrawCell: (data) => {
                if (data.row.index === tableRows.length - 1) {
                    doc.setFont(undefined, 'bold');
                    if (data.section === 'body') {
                        doc.setFillColor(240, 248, 255);
                    }
                }
            }
        });

        doc.save(`Khuraki_Details_${monthYear}.pdf`);
    };

    const exportDetailsExcel = () => {
        const daysInMonth = detailFilters.month.daysInMonth();
        const excelData = detailData.map((record) => {
            let attendance = [];
            try {
                attendance = typeof record.AttendanceStatus === 'string'
                    ? JSON.parse(record.AttendanceStatus)
                    : (record.AttendanceStatus || []);
            } catch (e) { }

            const dayMap = {};
            attendance.forEach(att => {
                const dayNum = parseInt(att.date, 10);
                const siteName = sites[att.status] || att.status;
                if (!dayMap[dayNum]) dayMap[dayNum] = [];
                dayMap[dayNum].push(siteName);
            });

            const rowData = {
                "Employee Name": record.EmployeeName,
                "Employee ID": record.employeeID,
            };

            for (let i = 1; i <= daysInMonth; i++) {
                rowData[i.toString().padStart(2, "0")] = (dayMap[i] || []).join(", ");
            }

            // Format Breakdown for Excel
            try {
                const counts = typeof record.SiteWiseCount === 'string' ? JSON.parse(record.SiteWiseCount) : record.SiteWiseCount;
                rowData["Site Wise Breakdown"] = (counts || []).map(c => `${sites[c.SiteID] || c.SiteID} (Duty:${c.TotalCount}, Amount:${c.TotalKhorakiAmt})`).join(" | ");
            } catch (e) {
                rowData["Site Wise Breakdown"] = record.SiteWiseCount || "";
            }

            rowData["Total Amount"] = record.TotalKhorakiAmt;
            return rowData;
        });

        // Add Grand Total Row
        const grandTotal = detailData.reduce((acc, curr) => acc + (parseFloat(curr.TotalKhorakiAmt) || 0), 0);
        const totalRow = {
            "Employee Name": "GRAND TOTAL",
            "Total Amount": grandTotal
        };
        excelData.push(totalRow);

        const header = ["Employee Name", "Employee ID", ...Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString().padStart(2, "0")), "Site Wise Breakdown", "Total Amount"];
        const worksheet = XLSX.utils.json_to_sheet(excelData, { header });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Khuraki Details");
        XLSX.writeFile(workbook, `Khuraki_Details_${detailFilters.month.format("MMMM_YYYY")}.xlsx`);
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

        // Add Grand Total Row
        const totalKhuraki = data.reduce((acc, curr) => acc + (parseFloat(curr.TotalKhurakiAmount) || 0), 0);
        const totalDuty = data.reduce((acc, curr) => acc + (parseInt(curr.NoOfDuty) || 0), 0);
        const totalRow = {
            "Employee Name": "GRAND TOTAL",
            "Total Khuraki": totalKhuraki,
            "No of Duty": totalDuty
        };
        if (filters.EmpType === "DRIVER") {
            totalRow["Driver Khuraki"] = data.reduce((acc, curr) => acc + (parseFloat(curr.DriverKhurakiAmt) || 0), 0);
        } else if (filters.EmpType === "HELPER") {
            totalRow["Helper Khuraki"] = data.reduce((acc, curr) => acc + (parseFloat(curr.HelperKhurakiAmt) || 0), 0);
        }
        excelData.push(totalRow);

        const header = ["Employee Name", "Site Name", "Total Khuraki", "No of Duty", "Driver Khuraki", "Helper Khuraki"];
        const worksheet = XLSX.utils.json_to_sheet(excelData, { header });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
        XLSX.writeFile(workbook, "SitewiseDutyReport.xlsx");
    };

    return (
        <div className="p-4">
            <Card title="Khoraki Summary">
                <Tabs
                    defaultActiveKey="1"
                    className="mt-4"
                    onChange={() => {
                        setData([]);
                        setDetailData([]);
                    }}
                >
                    <Tabs.TabPane tab="Summary" key="1">
                        <div className="flex gap-4 mb-4 flex-wrap items-end bg-gray-50 p-3 rounded">
                            <div>
                                <label className="block mb-1 text-sm font-medium">Start Date</label>
                                <DatePicker
                                    value={filters.SDate}
                                    onChange={(date) => setFilters({ ...filters, SDate: date })}
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium">End Date</label>
                                <DatePicker
                                    value={filters.EDate}
                                    onChange={(date) => setFilters({ ...filters, EDate: date })}
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium">Employee Type</label>
                                <Select
                                    value={filters.EmpType}
                                    onChange={(value) => setFilters({ ...filters, EmpType: value })}
                                    style={{ width: 120 }}
                                    allowClear
                                >
                                    <Option value="DRIVER">Driver</Option>
                                    <Option value="HELPER">Helper</Option>
                                </Select>
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium">Employee Name</label>
                                <Input
                                    value={filters.EmpName}
                                    onChange={(e) =>
                                        setFilters({ ...filters, EmpName: e.target.value })
                                    }
                                    placeholder="Optional"
                                    allowClear
                                />
                            </div>
                            <Button type="primary" onClick={fetchData} loading={loading}>
                                Search
                            </Button>
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
                            pagination={{ pageSize: 15 }}
                            bordered
                            size="small"
                            title={() => (
                                <div className="text-xs text-gray-400 italic font-medium">
                                    * Summary of duties and khuraki for the selected period.
                                </div>
                            )}
                            summary={(pageData) => {
                                let totalKhuraki = 0;
                                let totalDuty = 0;
                                let totalTypeKhuraki = 0;

                                pageData.forEach((record) => {
                                    totalKhuraki += parseFloat(record.TotalKhurakiAmount) || 0;
                                    totalDuty += parseInt(record.NoOfDuty) || 0;
                                    if (filters.EmpType === "DRIVER") totalTypeKhuraki += parseFloat(record.DriverKhurakiAmt) || 0;
                                    if (filters.EmpType === "HELPER") totalTypeKhuraki += parseFloat(record.HelperKhurakiAmt) || 0;
                                });

                                return (
                                    <Table.Summary fixed>
                                        <Table.Summary.Row className="bg-blue-50/50 font-bold border-t-2 border-blue-100">
                                            <Table.Summary.Cell index={0} colSpan={2}>
                                                <div className="text-right pr-4 text-blue-800 uppercase text-[10px] tracking-wider">Grand Total</div>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={2}>
                                                <div className="text-blue-700">{totalKhuraki.toLocaleString()}</div>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={3}>
                                                <div className="text-blue-700">{totalDuty}</div>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={4}>
                                                <div className="text-blue-700">{totalTypeKhuraki.toLocaleString()}</div>
                                            </Table.Summary.Cell>
                                        </Table.Summary.Row>
                                    </Table.Summary>
                                );
                            }}
                        />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Khuraki Details" key="2">
                        <div className="flex gap-4 mb-4 flex-wrap items-end bg-gray-50 p-3 rounded">
                            <div>
                                <label className="block mb-1 text-xs font-medium">Month</label>
                                <DatePicker
                                    picker="month"
                                    value={detailFilters.month}
                                    onChange={(date) => setDetailFilters({ ...detailFilters, month: date })}
                                    format="MMMM YYYY"
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-xs font-medium">Employee Type</label>
                                <Select
                                    value={detailFilters.empType}
                                    onChange={(value) => setDetailFilters({ ...detailFilters, empType: value })}
                                    style={{ width: 120 }}
                                    allowClear
                                >
                                    <Option value="DRIVER">Driver</Option>
                                    <Option value="HELPER">Helper</Option>
                                </Select>
                            </div>
                            {/* <div>
                                <label className="block mb-1 text-xs font-medium">Company</label>
                                <Select
                                    value={detailFilters.companyId}
                                    onChange={(value) => setDetailFilters({ ...detailFilters, companyId: value || 0 })}
                                    style={{ width: 180 }}
                                    placeholder="Select Company"
                                    allowClear
                                >
                                    {companyList?.map((c) => (
                                        <Option key={c.Id} value={c.Id}>{c.Name}</Option>
                                    ))}
                                </Select>
                            </div> */}
                            {/* <div>
                                <label className="block mb-1 text-xs font-medium">Site</label>
                                <Select
                                    value={detailFilters.siteId}
                                    onChange={(value) => setDetailFilters({ ...detailFilters, siteId: value || 0 })}
                                    style={{ width: 180 }}
                                    placeholder="Select Site"
                                    showSearch
                                    optionFilterProp="children"
                                    allowClear
                                >
                                    <Option value={0}>All Sites</Option>
                                    {allSites.map((s) => (
                                        <Option key={s.siteID || s.ID} value={s.siteID || s.ID}>{s.siteShortName}</Option>
                                    ))}
                                </Select>
                            </div> */}
                            <Button type="primary" onClick={fetchDetailData} loading={loadingDetails}>
                                Search Details
                            </Button>
                            <Button onClick={exportDetailsPDF} disabled={detailData.length === 0} className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100">
                                Export Details PDF
                            </Button>
                            <Button onClick={exportDetailsExcel} disabled={detailData.length === 0} className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100">
                                Export Details Excel
                            </Button>
                        </div>
                        {detailData.length > 0 && (
                            <div className="mb-3 px-3 py-2 bg-blue-50 border-l-4 border-blue-500 rounded text-blue-800 text-[11px] font-medium shadow-sm flex justify-between items-center flex-wrap gap-y-2">
                                <div className="flex items-center flex-wrap">
                                    <span className="opacity-70">REPORT FOR:</span> <span className="font-bold ml-1">{detailFilters.empType === 'DRIVER' ? 'DRIVERS' : 'HELPERS'}</span>
                                    <span className="mx-2 text-blue-300">|</span>
                                    <span className="opacity-70">MONTH:</span> <span className="font-bold ml-1">{detailFilters.month.format("MMMM YYYY")}</span>
                                    {detailFilters.companyId !== 0 && (
                                        <>
                                            <span className="mx-2 text-blue-300">|</span>
                                            <span className="opacity-70">COMPANY:</span> <span className="font-bold ml-1">{companyList?.find(c => (c.Id || c.ID || c.id) === detailFilters.companyId)?.Name}</span>
                                        </>
                                    )}
                                    {detailFilters.siteId !== 0 && (
                                        <>
                                            <span className="mx-2 text-blue-300">|</span>
                                            <span className="opacity-70">SITE:</span> <span className="font-bold ml-1">{allSites.find(s => (s.siteID || s.ID) === detailFilters.siteId)?.siteShortName}</span>
                                        </>
                                    )}
                                    <span className="mx-3 text-blue-400 font-light text-lg">/</span>
                                    <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full shadow-sm">
                                        GRAND TOTAL: <span className="font-bold ml-1">{detailData.reduce((acc, curr) => acc + (parseFloat(curr.TotalKhorakiAmt) || 0), 0).toLocaleString()}</span>
                                    </span>
                                </div>
                                <div className="text-[10px] opacity-70 bg-white/50 px-2 py-1 rounded border border-blue-100 italic">
                                    Legend: <span className="font-bold text-blue-600 ml-1">Duty = Duties</span>, <span className="font-bold text-emerald-700 ml-1">Amount = Khuraki Amount</span>
                                </div>
                            </div>
                        )}
                        <Table
                            dataSource={detailData.map(record => {
                                let attendance = [];
                                try {
                                    attendance = typeof record.AttendanceStatus === 'string'
                                        ? JSON.parse(record.AttendanceStatus)
                                        : (record.AttendanceStatus || []);
                                } catch (e) {
                                }

                                const dayMap = {};
                                attendance.forEach(att => {
                                    const dayNum = parseInt(att.date, 10);
                                    if (!dayMap[dayNum]) dayMap[dayNum] = [];
                                    const siteName = sites[att.status] || att.status;
                                    dayMap[dayNum].push(siteName);
                                });

                                return {
                                    ...record,
                                    key: record.employeeID,
                                    days: dayMap
                                };
                            })}
                            pagination={false}
                            size="small"
                            bordered
                            loading={loadingDetails}
                            scroll={{ x: 2500, y: "calc(100vh - 450px)" }}
                            columns={[
                                {
                                    title: "Name",
                                    dataIndex: "EmployeeName",
                                    key: "EmployeeName",
                                    width: 200,
                                    fixed: "left",
                                    render: (text, record) => (
                                        <div className="leading-tight">
                                            <div className="font-bold text-gray-800">{text}</div>
                                            <div className="text-[10px] text-gray-400">ID: {record.employeeID}</div>
                                        </div>
                                    ),
                                },
                                ...(() => {
                                    const daysInMonth = detailFilters.month.daysInMonth();
                                    const cols = [];
                                    for (let i = 1; i <= daysInMonth; i++) {
                                        cols.push({
                                            title: i.toString().padStart(2, "0"),
                                            key: `day_${i}`,
                                            width: 80,
                                            align: "center",
                                            render: (_, record) => {
                                                const sites = record.days[i] || [];
                                                return (
                                                    <div className="flex flex-wrap gap-1 justify-center">
                                                        {sites.map((site, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full shadow-sm"
                                                            >
                                                                {site}
                                                            </span>
                                                        ))}
                                                    </div>
                                                );
                                            },
                                        });
                                    }
                                    return cols;
                                })(),
                                {
                                    title: "Site Wise Count (Duty: Duty Count, Amount: Amount)",
                                    dataIndex: "SiteWiseCount",
                                    key: "SiteWiseCount",
                                    width: 180,
                                    fixed: "right",
                                    render: (text) => {
                                        if (!text) return "";
                                        try {
                                            const counts = typeof text === 'string' ? JSON.parse(text) : text;
                                            return (
                                                <div className="text-[11px] leading-tight">
                                                    {counts.map((c, i) => (
                                                        <div key={i} className="mb-1 flex justify-between items-center border-b border-gray-50 pb-0.5 last:border-0 italic">
                                                            <span className="text-amber-800 font-medium">{sites[c.SiteID] || c.SiteID}:</span>
                                                            <div className="flex gap-2 ml-2 text-[10px]">
                                                                <span className="text-blue-600 font-bold"><span className="text-gray-400 font-normal mr-0.5">Duty:</span>{c.TotalCount}</span>
                                                                <span className="text-emerald-700 font-bold whitespace-nowrap"><span className="text-gray-400 font-normal mr-0.5">Amount:</span>{c.TotalKhorakiAmt}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            );
                                        } catch (e) {
                                            return text;
                                        }
                                    }
                                },
                                {
                                    title: "Total Amount",
                                    dataIndex: "TotalKhorakiAmt",
                                    key: "TotalKhorakiAmt",
                                    width: 100,
                                    fixed: "right",
                                    render: (text) => <span className="font-bold text-blue-700">{text}</span>
                                }
                            ]}
                            summary={(pageData) => {
                                let grandTotal = 0;
                                pageData.forEach((record) => {
                                    grandTotal += parseFloat(record.TotalKhorakiAmt) || 0;
                                });

                                return (
                                    <Table.Summary fixed="bottom">
                                        <Table.Summary.Row className="bg-blue-50 font-bold border-t-2 border-blue-200">
                                            <Table.Summary.Cell index={0} colSpan={detailFilters.month.daysInMonth() + 2}>
                                                <div className="text-right pr-10 text-blue-800 uppercase text-[11px] tracking-widest">Report Grand Total</div>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={1} colSpan={2} className="bg-blue-600">
                                                <div className="text-white text-center text-lg drop-shadow-sm">{grandTotal.toLocaleString()}</div>
                                            </Table.Summary.Cell>
                                        </Table.Summary.Row>
                                    </Table.Summary>
                                );
                            }}
                        />
                    </Tabs.TabPane>
                </Tabs>
            </Card>
        </div>
    );
};

export default SitewiseDutyReport;
