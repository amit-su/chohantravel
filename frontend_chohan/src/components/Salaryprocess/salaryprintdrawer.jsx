import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Spin, Alert } from "antd";
import { FilePdfOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import axios from "axios";
import { generateSalarySlipPDF } from "../../utils/generateSalarySlipPDF";

function SalaryProcessPrintdrawer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [salaryData, setSalaryData] = useState(null);

  const apiUrl = import.meta.env.VITE_APP_API;

  const fetchSalarySlipData = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching salary slip for ID:', id);
      console.log('API URL:', `${apiUrl}/salarydetails/slip-report`);

      const response = await axios.post(
        `${apiUrl}/salarydetails/slip-report`,
        { id: parseInt(id) }
      );

      console.log('API Response:', response.data);
      setSalaryData(response.data);

      // Automatically generate PDF when data is loaded
      if (response.data) {
        generateSalarySlipPDF(response.data);
      }
    } catch (err) {
      console.error('Full error object:', err);
      console.error('Error response:', err.response);
      console.error('Error message:', err.message);
      console.error('Error config:', err.config);

      const errorMessage = err.response?.data?.error || err.message || "Failed to fetch salary slip data";
      setError(errorMessage);
      console.error("Error fetching salary slip:", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchSalarySlipData();
    }
  }, [id]);

  const handleGeneratePDF = () => {
    if (salaryData) {
      generateSalarySlipPDF(salaryData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate("/admin/salary")}
                className="flex items-center"
              >
                Back to Salary List
              </Button>
              <h1 className="text-2xl font-bold text-gray-800">
                Salary Slip
              </h1>
            </div>
            {salaryData && (
              <Button
                type="primary"
                icon={<FilePdfOutlined />}
                onClick={handleGeneratePDF}
                size="large"
                className="bg-blue-600 hover:bg-blue-700"
              >
                Generate PDF
              </Button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Spin size="large" />
            <p className="mt-4 text-gray-600">Loading salary slip data...</p>
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
        {!loading && !error && salaryData && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <FilePdfOutlined className="text-3xl text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Salary Slip Ready
              </h2>
              <p className="text-gray-600">
                {salaryData.salarySlipData?.[0]?.name || "Employee"}'s salary slip for{" "}
                {salaryData.salarySlipData?.[0]?.MonthName || ""}{" "}
                {salaryData.salarySlipData?.[0]?.SalaryYear || ""}
              </p>
            </div>

            {/* Salary Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Gross Salary</p>
                <p className="text-2xl font-bold text-blue-600">
                  ₹ {parseFloat(salaryData.salarySlipData?.[0]?.GrossSalary || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Total Deductions</p>
                <p className="text-2xl font-bold text-red-600">
                  ₹ {(
                    parseFloat(salaryData.salarySlipData?.[0]?.ESIC || 0) +
                    parseFloat(salaryData.salarySlipData?.[0]?.PF || 0) +
                    parseFloat(salaryData.salarySlipData?.[0]?.PTAX || 0) +
                    parseFloat(salaryData.salarySlipData?.[0]?.AdvanceAdjusted || 0) +
                    parseFloat(salaryData.salarySlipData?.[0]?.totaldeduction || 0)
                  ).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Net Salary</p>
                <p className="text-2xl font-bold text-green-600">
                  ₹ {parseFloat(salaryData.salarySlipData?.[0]?.NetSalary || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <Button
                type="primary"
                icon={<FilePdfOutlined />}
                onClick={handleGeneratePDF}
                size="large"
                className="bg-blue-600 hover:bg-blue-700"
              >
                View/Download PDF
              </Button>
              <Button
                onClick={() => navigate("/admin/salary")}
                size="large"
              >
                Close
              </Button>
            </div>

            {/* Additional Info */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Employee Type</p>
                  <p className="font-semibold">{salaryData.salarySlipData?.[0]?.empType || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-600">Days Worked</p>
                  <p className="font-semibold">{salaryData.salarySlipData?.[0]?.DaysWorked || "0"}</p>
                </div>
                <div>
                  <p className="text-gray-600">Advance Adjusted</p>
                  <p className="font-semibold">₹ {parseFloat(salaryData.salarySlipData?.[0]?.AdvanceAdjusted || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                </div>
                <div>
                  <p className="text-gray-600">Khuraki Amount</p>
                  <p className="font-semibold">₹ {parseFloat(salaryData.salarySlipData?.[0]?.KhurakiTotalAmt || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SalaryProcessPrintdrawer;
