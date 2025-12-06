import React, { useState } from "react";
import { Button, DatePicker, Spin, Alert } from "antd";
import { FilePdfOutlined, FileExcelOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import { generateSalaryRegisterPDF } from "../../utils/generateSalaryRegisterPDF";
import { generateSalaryRegisterExcel } from "../../utils/generateSalaryRegisterExcel";

function SalaryRegisterReport() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [salaryData, setSalaryData] = useState(null);
    const [pdfBlobUrl, setPdfBlobUrl] = useState(null);

    const apiUrl = import.meta.env.VITE_APP_API;

    const fetchSalaryRegister = async () => {
        setLoading(true);
        setError(null);
        setPdfBlobUrl(null); // Clear previous PDF
        try {
            const response = await axios.post(
                `${apiUrl}/salarydetails/register-report`,
                {
                    sDate: selectedDate.format('YYYY-MM-DD')
                }
            );

            setSalaryData(response.data.data);

            // Generate PDF and get blob URL
            if (response.data.data && response.data.data.length > 0) {
                const blobUrl = await generateSalaryRegisterPDF(
                    response.data.data,
                    selectedDate.format('MMMM YYYY')
                );
                setPdfBlobUrl(blobUrl);
            } else {
                setError('No salary data found for the selected month');
            }
        } catch (err) {
            setError(err.response?.data?.error || err.message || "Failed to fetch salary register");
            console.error("Error fetching salary register:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleGeneratePDF = async () => {
        if (salaryData && salaryData.length > 0) {
            try {
                const blobUrl = await generateSalaryRegisterPDF(
                    salaryData,
                    selectedDate.format('MMMM YYYY')
                );
                setPdfBlobUrl(blobUrl);
            } catch (err) {
                setError('Failed to generate PDF');
                console.error('PDF generation error:', err);
            }
        }
    };

    const handleOpenPDF = () => {
        if (pdfBlobUrl) {
            window.open(pdfBlobUrl, '_blank');
        }
    };

    const handleGenerateExcel = () => {
        if (salaryData && salaryData.length > 0) {
            generateSalaryRegisterExcel(
                salaryData,
                selectedDate.format('MMMM YYYY')
            );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">
                        Salary Register Report
                    </h1>

                    <div className="flex items-center gap-4">
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

                        <Button
                            type="primary"
                            icon={<FilePdfOutlined />}
                            onClick={fetchSalaryRegister}
                            loading={loading}
                            size="large"
                            className="bg-green-600 hover:bg-green-700 mt-6"
                        >
                            Generate PDF
                        </Button>

                        {salaryData && salaryData.length > 0 && (
                            <>
                                {pdfBlobUrl && (
                                    <Button
                                        type="primary"
                                        icon={<FilePdfOutlined />}
                                        onClick={handleOpenPDF}
                                        size="large"
                                        className="bg-blue-600 hover:bg-blue-700 mt-6"
                                    >
                                        Open PDF
                                    </Button>
                                )}
                                <Button
                                    type="default"
                                    icon={<FileExcelOutlined />}
                                    onClick={handleGenerateExcel}
                                    size="large"
                                    className="bg-green-600 hover:bg-green-700 text-white mt-6"
                                >
                                    Export to Excel
                                </Button>
                            </>
                        )}
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
                {!loading && !error && salaryData && salaryData.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-8">
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                                <FilePdfOutlined className="text-3xl text-green-600" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                Salary Register Ready
                            </h2>
                            <p className="text-gray-600">
                                {salaryData.length} employees for {selectedDate.format('MMMM YYYY')}
                            </p>
                        </div>

                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-blue-50 rounded-lg p-4 text-center">
                                <p className="text-sm text-gray-600 mb-1">Total Employees</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {salaryData.length}
                                </p>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4 text-center">
                                <p className="text-sm text-gray-600 mb-1">Total Gross Salary</p>
                                <p className="text-2xl font-bold text-green-600">
                                    ₹ {salaryData.reduce((sum, item) => sum + (parseFloat(item.GrossSalary) || 0), 0).toLocaleString('en-IN')}
                                </p>
                            </div>
                            <div className="bg-red-50 rounded-lg p-4 text-center">
                                <p className="text-sm text-gray-600 mb-1">Total Deductions</p>
                                <p className="text-2xl font-bold text-red-600">
                                    ₹ {salaryData.reduce((sum, item) =>
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
                                    ₹ {salaryData.reduce((sum, item) => sum + (parseFloat(item.NetSalary) || 0), 0).toLocaleString('en-IN')}
                                </p>
                            </div>
                        </div>

                        {/* Employee List Preview */}
                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-lg font-semibold mb-4">Employees Included:</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {salaryData.slice(0, 12).map((emp, index) => (
                                    <div key={index} className="text-sm text-gray-600">
                                        • {emp.name} ({emp.empType})
                                    </div>
                                ))}
                                {salaryData.length > 12 && (
                                    <div className="text-sm text-gray-500 italic">
                                        ... and {salaryData.length - 12} more
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SalaryRegisterReport;
