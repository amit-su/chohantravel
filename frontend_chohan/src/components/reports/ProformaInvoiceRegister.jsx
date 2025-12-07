import React, { useState } from "react";
import { DatePicker, Button, Table, Card, message, Input } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const ProformaInvoiceRegister = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    StartDate: dayjs().startOf("month"),
    EndDate: dayjs().endOf("month"),
    PartyName: "",
  });

  const columns = [
    {
      title: "SL No",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Proforma Inv No",
      dataIndex: "RefInvoiceNo",
      key: "RefInvoiceNo",
    },
    {
      title: "Date",
      dataIndex: "ProformaInvdate",
      key: "ProformaInvdate",
      render: (text) => dayjs(text).format("YYYY-MM-DD"),
    },
    {
      title: "Party",
      dataIndex: "Party",
      key: "Party",
    },
    {
      title: "Gross Amount",
      dataIndex: "GrossAmount",
      key: "GrossAmount",
    },
    {
      title: "Net Amount",
      dataIndex: "NetAmount",
      key: "NetAmount",
    },
  ];

  const fetchData = async () => {
    if (!filters.StartDate || !filters.EndDate) {
      message.error("Please select Start Date and End Date");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API}/report/proforma-invoice-register`,
        {
          StartDate: filters.StartDate.format("YYYY-MM-DD"),
          EndDate: filters.EndDate.format("YYYY-MM-DD"),
          PartyName: filters.PartyName,
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
    doc.text("Proforma Invoice Register", 14, 15);
    doc.text(
      `From: ${filters.StartDate.format("YYYY-MM-DD")} To: ${filters.EndDate.format(
        "YYYY-MM-DD"
      )}`,
      14,
      22
    );

    const tableColumn = columns.map((col) => col.title);
    const tableRows = [];

    data.forEach((row, index) => {
      const rowData = [
        index + 1,
        row.RefInvoiceNo,
        dayjs(row.ProformaInvdate).format("YYYY-MM-DD"),
        row.Party,
        row.GrossAmount,
        row.NetAmount,
      ];
      tableRows.push(rowData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });

    doc.save("ProformaInvoiceRegister.pdf");
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((row, index) => ({
        "SL No": index + 1,
        ...row,
        ProformaInvdate: dayjs(row.ProformaInvdate).format("YYYY-MM-DD"),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    XLSX.writeFile(workbook, "ProformaInvoiceRegister.xlsx");
  };

  return (
    <div className="p-4">
      <Card title="Proforma Invoice Register">
        <div className="flex gap-4 mb-4 flex-wrap">
          <div>
            <label className="block mb-1">Start Date</label>
            <DatePicker
              value={filters.StartDate}
              onChange={(date) => setFilters({ ...filters, StartDate: date })}
            />
          </div>
          <div>
            <label className="block mb-1">End Date</label>
            <DatePicker
              value={filters.EndDate}
              onChange={(date) => setFilters({ ...filters, EndDate: date })}
            />
          </div>
          <div>
            <label className="block mb-1">Party Name</label>
            <Input
              value={filters.PartyName}
              onChange={(e) => setFilters({ ...filters, PartyName: e.target.value })}
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
          rowKey="ID"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: true }}
        />
      </Card>
    </div>
  );
};

export default ProformaInvoiceRegister;
