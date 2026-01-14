import * as XLSX from 'xlsx';

/**
 * Generate Excel file for Salary Register
 * @param {Array} data - Array of salary data objects
 * @param {string} monthYear - Month and year string (e.g., "December 2024")
 */
export const generateSalaryRegisterExcel = (data, monthYear) => {
    if (!data || data.length === 0) {
        console.error('No data provided for Excel generation');
        return;
    }

    // Prepare the data for Excel
    // DEBUG: Check data structure
    if (data && data.length > 0) {
        console.log("EXCEL GENERATION DEBUG - Data[0]:", data[0]);
        console.log("EXCEL GENERATION DEBUG - Keys:", Object.keys(data[0]));
    }

    // Prepare the data for Excel
    const excelData = data.map((item, index) => {
        // Safe parsing helper
        const parse = (val) => parseFloat(val) || 0;

        return {
            'Sr. No.': index + 1,
            'Employee Name': item.name || '',
            'Employee Type': item.empType || '',
            'Basic Salary': parse(item.Basic),
            'HRA': parse(item.Hra),
            'Conveyance': parse(item.TA),
            'Medical': parse(item.MedicalAllowance),
            'Special Allowance': parse(item.WashingAllowance),
            'Other Allowance': parse(item.KhurakiTotalAmt),
            'Gross Salary': parse(item.GrossSalary),
            'ESIC': parse(item.ESIC),
            'PF': parse(item.PF),
            'PTAX': parse(item.PTAX),
            'Advance Adjusted': parse(item.AdvanceAdjusted),
            'Other Deduction': parse(item.Totaldecution),
            'Total Deduction': (
                parse(item.ESIC) +
                parse(item.PF) +
                parse(item.PTAX) +
                parse(item.AdvanceAdjusted) +
                parse(item.Totaldecution)
            ),
            'Net Salary': parse(item.NetSalary),
        };
    });

    // Calculate totals
    const totals = {
        'Sr. No.': '',
        'Employee Name': 'TOTAL',
        'Employee Type': '',
        'Basic Salary': data.reduce((sum, item) => sum + (parseFloat(item.Basic) || 0), 0),
        'HRA': data.reduce((sum, item) => sum + (parseFloat(item.Hra) || 0), 0),
        'Conveyance': data.reduce((sum, item) => sum + (parseFloat(item.TA) || 0), 0),
        'Medical': data.reduce((sum, item) => sum + (parseFloat(item.MedicalAllowance) || 0), 0),
        'Special Allowance': data.reduce((sum, item) => sum + (parseFloat(item.WashingAllowance) || 0), 0),
        'Other Allowance': data.reduce((sum, item) => sum + (parseFloat(item.KhurakiTotalAmt) || 0), 0),
        'Gross Salary': data.reduce((sum, item) => sum + (parseFloat(item.GrossSalary) || 0), 0),
        'ESIC': data.reduce((sum, item) => sum + (parseFloat(item.ESIC) || 0), 0),
        'PF': data.reduce((sum, item) => sum + (parseFloat(item.PF) || 0), 0),
        'PTAX': data.reduce((sum, item) => sum + (parseFloat(item.PTAX) || 0), 0),
        'Advance Adjusted': data.reduce((sum, item) => sum + (parseFloat(item.AdvanceAdjusted) || 0), 0),
        'Other Deduction': data.reduce((sum, item) => sum + (parseFloat(item.Totaldecution) || 0), 0),
        'Total Deduction': data.reduce((sum, item) =>
            sum + (parseFloat(item.ESIC) || 0) +
            (parseFloat(item.PF) || 0) +
            (parseFloat(item.PTAX) || 0) +
            (parseFloat(item.AdvanceAdjusted) || 0) +
            (parseFloat(item.Totaldecution) || 0), 0
        ),
        'Net Salary': data.reduce((sum, item) => sum + (parseFloat(item.NetSalary) || 0), 0),
    };

    // Add totals row
    excelData.push(totals);

    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Convert data to worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    const columnWidths = [
        { wch: 8 },  // Sr. No.
        { wch: 25 }, // Employee Name
        { wch: 15 }, // Employee Type
        { wch: 12 }, // Basic Salary
        { wch: 12 }, // HRA
        { wch: 12 }, // Conveyance
        { wch: 12 }, // Medical
        { wch: 15 }, // Special Allowance
        { wch: 15 }, // Other Allowance
        { wch: 12 }, // Gross Salary
        { wch: 10 }, // ESIC
        { wch: 10 }, // PF
        { wch: 10 }, // PTAX
        { wch: 15 }, // Advance Adjusted
        { wch: 15 }, // Other Deduction
        { wch: 15 }, // Total Deduction
        { wch: 12 }, // Net Salary
    ];
    ws['!cols'] = columnWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Salary Register');

    // Generate filename
    const filename = `Salary_Register_${monthYear.replace(/\s+/g, '_')}.xlsx`;

    // Write the file
    XLSX.writeFile(wb, filename);

    console.log(`Excel file generated: ${filename}`);
};
