import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

// Initialize fonts
if (pdfFonts.pdfMake && pdfFonts.pdfMake.vfs) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
} else if (pdfFonts.default && pdfFonts.default.pdfMake && pdfFonts.default.pdfMake.vfs) {
    pdfMake.vfs = pdfFonts.default.pdfMake.vfs;
}

export const generateSalaryRegisterPDF = (data, monthYear, companyDetails = null) => {
    if (!data || data.length === 0) {
        console.error('No salary register data provided for PDF generation');
        return;
    }

    const formatCurrency = (amount) => {
        if (!amount) return '₹ 0';
        return `₹ ${parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    };

    // Calculate totals
    const totals = {
        basic: 0,
        hra: 0,
        medical: 0,
        washing: 0,
        ta: 0,
        khuraki: 0,
        gross: 0,
        esic: 0,
        pf: 0,
        ptax: 0,
        advance: 0,
        otherDeductions: 0,
        totalDeductions: 0,
        net: 0
    };

    data.forEach(item => {
        totals.basic += parseFloat(item.Basic) || 0;
        totals.hra += parseFloat(item.Hra) || 0;
        totals.medical += parseFloat(item.MedicalAllowance) || 0;
        totals.washing += parseFloat(item.WashingAllowance) || 0;
        totals.ta += parseFloat(item.TA) || 0;
        totals.khuraki += parseFloat(item.KhurakiTotalAmt) || 0;
        totals.gross += parseFloat(item.GrossSalary) || 0;
        totals.esic += parseFloat(item.ESIC) || 0;
        totals.pf += parseFloat(item.PF) || 0;
        totals.ptax += parseFloat(item.PTAX) || 0;
        totals.advance += parseFloat(item.AdvanceAdjusted) || 0;
        totals.otherDeductions += parseFloat(item.Totaldecution) || 0;
        totals.net += parseFloat(item.NetSalary) || 0;
    });

    totals.totalDeductions = totals.esic + totals.pf + totals.ptax + totals.advance + totals.otherDeductions;

    // Build table rows
    const tableRows = data.map((item, index) => [
        { text: index + 1, alignment: 'center', style: 'tableCell' },
        { text: item.name || '', style: 'tableCell' },
        { text: item.empType || '', alignment: 'center', style: 'tableCell' },
        { text: item.DaysWorked || '', alignment: 'center', style: 'tableCell' },
        { text: formatCurrency(item.Basic), alignment: 'right', style: 'tableCell' },
        { text: formatCurrency(item.Hra), alignment: 'right', style: 'tableCell' },
        { text: formatCurrency(item.MedicalAllowance), alignment: 'right', style: 'tableCell' },
        { text: formatCurrency(item.WashingAllowance), alignment: 'right', style: 'tableCell' },
        { text: formatCurrency(item.TA), alignment: 'right', style: 'tableCell' },
        { text: formatCurrency(item.KhurakiTotalAmt), alignment: 'right', style: 'tableCell' },
        { text: formatCurrency(item.GrossSalary), alignment: 'right', style: 'tableCell', bold: true },
        { text: formatCurrency(item.ESIC), alignment: 'right', style: 'tableCell' },
        { text: formatCurrency(item.PF), alignment: 'right', style: 'tableCell' },
        { text: formatCurrency(item.PTAX), alignment: 'right', style: 'tableCell' },
        { text: formatCurrency(item.AdvanceAdjusted), alignment: 'right', style: 'tableCell' },
        { text: formatCurrency(item.Totaldecution), alignment: 'right', style: 'tableCell' },
        { text: formatCurrency(item.NetSalary), alignment: 'right', style: 'tableCell', bold: true, color: '#047857' }
    ]);

    // Add totals row
    tableRows.push([
        { text: '', colSpan: 3, style: 'totalLabel', fillColor: '#047857', color: 'white', bold: true },
        {},
        {},
        { text: 'TOTAL', alignment: 'center', style: 'totalLabel', fillColor: '#047857', color: 'white', bold: true },
        { text: formatCurrency(totals.basic), alignment: 'right', style: 'totalLabel', fillColor: '#047857', color: 'white', bold: true },
        { text: formatCurrency(totals.hra), alignment: 'right', style: 'totalLabel', fillColor: '#047857', color: 'white', bold: true },
        { text: formatCurrency(totals.medical), alignment: 'right', style: 'totalLabel', fillColor: '#047857', color: 'white', bold: true },
        { text: formatCurrency(totals.washing), alignment: 'right', style: 'totalLabel', fillColor: '#047857', color: 'white', bold: true },
        { text: formatCurrency(totals.ta), alignment: 'right', style: 'totalLabel', fillColor: '#047857', color: 'white', bold: true },
        { text: formatCurrency(totals.khuraki), alignment: 'right', style: 'totalLabel', fillColor: '#047857', color: 'white', bold: true },
        { text: formatCurrency(totals.gross), alignment: 'right', style: 'totalLabel', fillColor: '#047857', color: 'white', bold: true },
        { text: formatCurrency(totals.esic), alignment: 'right', style: 'totalLabel', fillColor: '#047857', color: 'white', bold: true },
        { text: formatCurrency(totals.pf), alignment: 'right', style: 'totalLabel', fillColor: '#047857', color: 'white', bold: true },
        { text: formatCurrency(totals.ptax), alignment: 'right', style: 'totalLabel', fillColor: '#047857', color: 'white', bold: true },
        { text: formatCurrency(totals.advance), alignment: 'right', style: 'totalLabel', fillColor: '#047857', color: 'white', bold: true },
        { text: formatCurrency(totals.otherDeductions), alignment: 'right', style: 'totalLabel', fillColor: '#047857', color: 'white', bold: true },
        { text: formatCurrency(totals.net), alignment: 'right', style: 'totalLabel', fillColor: '#047857', color: 'white', bold: true }
    ]);

    // Basic fallbacks if no dynamic company provided
    const compName = 'CHOHAN TOURS AND TRAVELS';
    let compAddress = companyDetails?.Address || 'FLAT 3A, 2, GREEN ACRES, NAZAR ALI LANE';
    if (companyDetails?.City) compAddress += `, ${companyDetails.City}`;
    if (companyDetails?.Country) compAddress += `, ${companyDetails.Country}`;

    let compReg = '';
    if (companyDetails?.GSTNo) compReg += `GST: ${companyDetails.GSTNo}`;
    if (companyDetails?.PANNo) compReg += (compReg ? ' | ' : '') + `PAN: ${companyDetails.PANNo}`;
    if (!compReg) compReg = 'GST: 19AKTPC8877A1ZP | PAN: AKTPC8877A';

    const docDefinition = {
        pageSize: 'A4',
        pageOrientation: 'landscape',
        pageMargins: [20, 20, 20, 30],

        content: [
            // Company Header
            {
                canvas: [{
                    type: 'rect',
                    x: -20,
                    y: -5,
                    w: 842,
                    h: 50,
                    color: '#047857'
                }]
            },
            {
                text: compName,
                style: 'companyName',
                alignment: 'center',
                color: 'white',
                margin: [0, -45, 0, 2]
            },
            {
                text: compAddress.toUpperCase(),
                style: 'companyAddress',
                alignment: 'center',
                color: 'white',
                margin: [0, 0, 0, 2]
            },
            {
                text: compReg,
                style: 'companyDetails',
                alignment: 'center',
                color: 'white',
                margin: [0, 0, 0, 8]
            },

            // Title
            {
                text: `SALARY REGISTER - ${monthYear || data[0]?.MonthName + ' ' + data[0]?.SalaryYear}`,
                style: 'title',
                alignment: 'center',
                margin: [0, 8, 0, 8]
            },

            // Salary Register Table
            {
                table: {
                    headerRows: 2,
                    widths: [20, 80, 35, 25, 35, 30, 35, 35, 25, 35, 40, 30, 25, 25, 35, 35, 45],
                    body: [
                        // Main header row
                        [
                            { text: 'S.No', rowSpan: 2, alignment: 'center', style: 'tableHeader' },
                            { text: 'Employee Name', rowSpan: 2, alignment: 'center', style: 'tableHeader' },
                            { text: 'Type', rowSpan: 2, alignment: 'center', style: 'tableHeader' },
                            { text: 'Days', rowSpan: 2, alignment: 'center', style: 'tableHeader' },
                            { text: 'EARNINGS', colSpan: 7, alignment: 'center', style: 'tableHeader' },
                            {},
                            {},
                            {},
                            {},
                            {},
                            {},
                            { text: 'DEDUCTIONS', colSpan: 5, alignment: 'center', style: 'tableHeader' },
                            {},
                            {},
                            {},
                            {},
                            { text: 'Net Salary', rowSpan: 2, alignment: 'center', style: 'tableHeader' }
                        ],
                        // Sub header row
                        [
                            {},
                            {},
                            {},
                            {},
                            { text: 'Basic', alignment: 'center', style: 'tableSubHeader' },
                            { text: 'HRA', alignment: 'center', style: 'tableSubHeader' },
                            { text: 'Medical', alignment: 'center', style: 'tableSubHeader' },
                            { text: 'Washing', alignment: 'center', style: 'tableSubHeader' },
                            { text: 'TA', alignment: 'center', style: 'tableSubHeader' },
                            { text: 'Khuraki', alignment: 'center', style: 'tableSubHeader' },
                            { text: 'Gross', alignment: 'center', style: 'tableSubHeader' },
                            { text: 'ESIC', alignment: 'center', style: 'tableSubHeader' },
                            { text: 'PF', alignment: 'center', style: 'tableSubHeader' },
                            { text: 'P-Tax', alignment: 'center', style: 'tableSubHeader' },
                            { text: 'Advance', alignment: 'center', style: 'tableSubHeader' },
                            { text: 'Other', alignment: 'center', style: 'tableSubHeader' },
                            {}
                        ],
                        ...tableRows
                    ]
                },
                layout: {
                    fillColor: (rowIndex) => {
                        if (rowIndex === 0 || rowIndex === 1) return '#047857';
                        if (rowIndex === tableRows.length + 2) return '#047857';
                        return (rowIndex % 2 === 0) ? '#f5f5f5' : null;
                    },
                    hLineWidth: () => 0.5,
                    vLineWidth: () => 0.5,
                    hLineColor: () => '#e0e0e0',
                    vLineColor: () => '#e0e0e0'
                },
                margin: [0, 0, 0, 10]
            },

            // Summary
            {
                columns: [
                    {
                        width: '*',
                        text: `Total Employees: ${data.length}`,
                        style: 'summary'
                    },
                    {
                        width: 'auto',
                        text: `Total Gross: ${formatCurrency(totals.gross)}`,
                        style: 'summary',
                        bold: true
                    },
                    {
                        width: 'auto',
                        text: `Total Deductions: ${formatCurrency(totals.totalDeductions)}`,
                        style: 'summary',
                        bold: true
                    },
                    {
                        width: 'auto',
                        text: `Total Net: ${formatCurrency(totals.net)}`,
                        style: 'summary',
                        bold: true,
                        color: '#047857'
                    }
                ],
                margin: [0, 5, 0, 0]
            }
        ],

        styles: {
            companyName: {
                fontSize: 14,
                bold: true,
                letterSpacing: 0.5
            },
            companyAddress: {
                fontSize: 7,
                lineHeight: 1.2
            },
            companyDetails: {
                fontSize: 6.5
            },
            title: {
                fontSize: 12,
                bold: true,
                color: '#047857',
                letterSpacing: 1
            },
            tableHeader: {
                fontSize: 7,
                bold: true,
                color: 'white',
                fillColor: '#047857'
            },
            tableSubHeader: {
                fontSize: 6.5,
                bold: true,
                color: 'white',
                fillColor: '#047857'
            },
            tableCell: {
                fontSize: 6.5,
                color: '#333'
            },
            totalLabel: {
                fontSize: 7,
                bold: true
            },
            summary: {
                fontSize: 8,
                margin: [5, 0, 5, 0]
            }
        },

        defaultStyle: {
            font: 'Roboto'
        }
    };

    return new Promise((resolve, reject) => {
        try {
            pdfMake.createPdf(docDefinition).getBlob((blob) => {
                const url = URL.createObjectURL(blob);
                resolve(url);
            });
        } catch (error) {
            reject(error);
        }
    });
};
