import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

// Initialize fonts
if (pdfFonts.pdfMake && pdfFonts.pdfMake.vfs) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
} else if (pdfFonts.default && pdfFonts.default.pdfMake && pdfFonts.default.pdfMake.vfs) {
    pdfMake.vfs = pdfFonts.default.pdfMake.vfs;
}

export const generateSalarySlipPDF = (data) => {
    if (!data || !data.salarySlipData || data.salarySlipData.length === 0) {
        console.error('No salary slip data provided for PDF generation');
        return;
    }

    const salaryData = data.salarySlipData[0];
    const advancePayments = data.advancePayments || [];
    const busAssignments = data.busAssignments || [];
    const khorakiDetails = data.khorakiDetails || [];
    const openingAdvance = data.openingAdvance || [];

    const formatCurrency = (amount) => {
        if (!amount) return '₹ 0.00';
        return `₹ ${parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // Calculate totals
    const totalEarnings = (parseFloat(salaryData.BASIC) || 0) +
        (parseFloat(salaryData.HRA) || 0) +
        (parseFloat(salaryData.MedicalAllowance) || 0) +
        (parseFloat(salaryData.WashingAllowance) || 0) +
        (parseFloat(salaryData.TA) || 0) +
        (parseFloat(salaryData.KhurakiTotalAmt) || 0);

    const totalDeductions = (parseFloat(salaryData.ESIC) || 0) +
        (parseFloat(salaryData.PF) || 0) +
        (parseFloat(salaryData.PTAX) || 0) +
        (parseFloat(salaryData.AdvanceAdjusted) || 0) +
        (parseFloat(salaryData.totaldeduction) || 0);

    // Build Khoraki details rows
    const khorakiRows = khorakiDetails.map((item, index) => [
        { text: index + 1, alignment: 'center', style: 'tableCell' },
        { text: item.SiteShortName || '', style: 'tableCell' },
        { text: item.DayCount || 0, alignment: 'center', style: 'tableCell' },
        { text: formatCurrency(item.TotalKhurakiAmount), alignment: 'right', style: 'tableCell' }
    ]);

    // Build advance payment rows
    const advanceRows = advancePayments.map((item, index) => [
        { text: index + 1, alignment: 'center', style: 'tableCell' },
        { text: formatDate(item.created_at), style: 'tableCell' },
        { text: item.remark || '', style: 'tableCell' },
        { text: formatCurrency(item.advanceAmount), alignment: 'right', style: 'tableCell' }
    ]);

    // Calculate opening advance balance
    const openingAdvanceTotal = openingAdvance.reduce((sum, item) => sum + (parseFloat(item.OpAdvAmt) || 0), 0);

    // Build bus assignments text
    const busAssignmentText = busAssignments.map(item => {
        if (item.DriverBusNo) return `Driver: ${item.DriverBusNo}`;
        if (item.HelperBusNo) return `Helper: ${item.HelperBusNo}`;
        return '';
    }).filter(text => text).join(', ') || 'N/A';

    const docDefinition = {
        pageSize: 'A4',
        pageMargins: [30, 30, 30, 40],

        content: [
            // Company Header with Green Background
            {
                canvas: [{
                    type: 'rect',
                    x: -30,
                    y: -5,
                    w: 595,
                    h: 60,
                    color: '#047857'
                }]
            },
            {
                text: 'CHOHAN TOURS AND TRAVELS',
                style: 'companyName',
                alignment: 'center',
                color: 'white',
                margin: [0, -55, 0, 2]
            },
            {
                text: 'FLAT 3A, 2, GREEN ACRES, NAZAR ALI LANE, KOLKATA, 700019, WEST BENGAL',
                style: 'companyAddress',
                alignment: 'center',
                color: 'white',
                margin: [0, 0, 0, 2]
            },
            {
                text: `Phone: ${salaryData.CompPhone || 'N/A'} | Email: ${salaryData.CompEMail || 'N/A'}`,
                style: 'companyDetails',
                alignment: 'center',
                color: 'white',
                margin: [0, 0, 0, 2]
            },
            {
                text: 'GST: 19AKTPC8877A1ZP | PAN: AKTPC8877A',
                style: 'companyDetails',
                alignment: 'center',
                color: 'white',
                margin: [0, 0, 0, 8]
            },

            // Title
            {
                text: 'SALARY SLIP',
                style: 'title',
                alignment: 'center',
                margin: [0, 10, 0, 10]
            },

            // Employee Details Section
            {
                columns: [
                    {
                        width: '50%',
                        stack: [
                            { text: 'EMPLOYEE DETAILS', style: 'sectionHeader', margin: [0, 0, 0, 5] },
                            {
                                table: {
                                    widths: [100, '*'],
                                    body: [
                                        [{ text: 'Name:', style: 'label' }, { text: salaryData.name || '', style: 'value' }],
                                        [{ text: 'Employee No:', style: 'label' }, { text: salaryData.EmployeeNo || '', style: 'value' }],
                                        [{ text: 'Employee Type:', style: 'label' }, { text: salaryData.empType || '', style: 'value' }],
                                        [{ text: 'Date of Joining:', style: 'label' }, { text: salaryData.Dateofjoin || '', style: 'value' }],
                                        [{ text: 'PF No:', style: 'label' }, { text: salaryData.pfNo || '', style: 'value' }],
                                        [{ text: 'ESI No:', style: 'label' }, { text: salaryData.esiNo || '', style: 'value' }],
                                        [{ text: 'Bank A/c No:', style: 'label' }, { text: salaryData.bankAcNo || '', style: 'value' }],
                                        [{ text: 'Bus Assignment:', style: 'label' }, { text: busAssignmentText, style: 'value' }]
                                    ]
                                },
                                layout: 'noBorders'
                            }
                        ]
                    },
                    {
                        width: '50%',
                        stack: [
                            { text: 'SALARY PERIOD', style: 'sectionHeader', margin: [0, 0, 0, 5] },
                            {
                                table: {
                                    widths: [100, '*'],
                                    body: [
                                        [{ text: 'Month:', style: 'label' }, { text: salaryData.MonthName || '', style: 'value' }],
                                        [{ text: 'Year:', style: 'label' }, { text: salaryData.SalaryYear || '', style: 'value' }],
                                        [{ text: 'Days Worked:', style: 'label' }, { text: salaryData.DaysWorked || '', style: 'value' }],
                                        [{ text: 'Days in Month:', style: 'label' }, { text: salaryData.DaysInMonth || '', style: 'value' }]
                                    ]
                                },
                                layout: 'noBorders'
                            }
                        ]
                    }
                ],
                margin: [0, 0, 0, 10]
            },

            // Earnings and Deductions
            {
                columns: [
                    // Earnings
                    {
                        width: '50%',
                        stack: [
                            { text: 'EARNINGS', style: 'sectionHeader', margin: [0, 0, 0, 5] },
                            {
                                table: {
                                    widths: ['*', 80],
                                    body: [
                                        [{ text: 'Basic Salary', style: 'label' }, { text: formatCurrency(salaryData.BASIC), alignment: 'right', style: 'value' }],
                                        [{ text: 'HRA', style: 'label' }, { text: formatCurrency(salaryData.HRA), alignment: 'right', style: 'value' }],
                                        [{ text: 'Medical Allowance', style: 'label' }, { text: formatCurrency(salaryData.MedicalAllowance), alignment: 'right', style: 'value' }],
                                        [{ text: 'Washing Allowance', style: 'label' }, { text: formatCurrency(salaryData.WashingAllowance), alignment: 'right', style: 'value' }],
                                        [{ text: 'TA', style: 'label' }, { text: formatCurrency(salaryData.TA), alignment: 'right', style: 'value' }],
                                        [{ text: 'Khuraki', style: 'label' }, { text: formatCurrency(salaryData.KhurakiTotalAmt), alignment: 'right', style: 'value' }],
                                        [{ text: 'Gross Salary', style: 'totalLabel', fillColor: '#d1fae5' }, { text: formatCurrency(salaryData.GrossSalary), alignment: 'right', style: 'totalValue', fillColor: '#d1fae5' }]
                                    ]
                                },
                                layout: {
                                    hLineWidth: () => 0.5,
                                    vLineWidth: () => 0,
                                    hLineColor: () => '#e0e0e0'
                                }
                            }
                        ]
                    },
                    // Deductions
                    {
                        width: '50%',
                        stack: [
                            { text: 'DEDUCTIONS', style: 'sectionHeader', margin: [0, 0, 0, 5] },
                            {
                                table: {
                                    widths: ['*', 80],
                                    body: [
                                        [{ text: 'ESIC', style: 'label' }, { text: formatCurrency(salaryData.ESIC), alignment: 'right', style: 'value' }],
                                        [{ text: 'PF', style: 'label' }, { text: formatCurrency(salaryData.PF), alignment: 'right', style: 'value' }],
                                        [{ text: 'P-Tax', style: 'label' }, { text: formatCurrency(salaryData.PTAX), alignment: 'right', style: 'value' }],
                                        [{ text: 'Advance Adjusted', style: 'label' }, { text: formatCurrency(salaryData.AdvanceAdjusted), alignment: 'right', style: 'value' }],
                                        [{ text: 'Other Deductions', style: 'label' }, { text: formatCurrency(salaryData.totaldeduction), alignment: 'right', style: 'value' }],
                                        [{ text: '', style: 'label' }, { text: '', alignment: 'right', style: 'value' }],
                                        [{ text: 'Total Deductions', style: 'totalLabel', fillColor: '#fee2e2' }, { text: formatCurrency(totalDeductions), alignment: 'right', style: 'totalValue', fillColor: '#fee2e2' }]
                                    ]
                                },
                                layout: {
                                    hLineWidth: () => 0.5,
                                    vLineWidth: () => 0,
                                    hLineColor: () => '#e0e0e0'
                                }
                            }
                        ]
                    }
                ],
                margin: [0, 0, 0, 10]
            },

            // Net Salary
            {
                table: {
                    widths: ['*', 100],
                    body: [
                        [
                            { text: 'NET SALARY', style: 'netSalaryLabel', fillColor: '#047857', color: 'white' },
                            { text: formatCurrency(salaryData.NetSalary), alignment: 'right', style: 'netSalaryValue', fillColor: '#047857', color: 'white' }
                        ]
                    ]
                },
                layout: 'noBorders',
                margin: [0, 0, 0, 15]
            },

            // Khuraki Details (if available)
            ...(khorakiRows.length > 0 ? [
                { text: 'KHURAKI DETAILS', style: 'sectionHeader', margin: [0, 5, 0, 5] },
                {
                    table: {
                        headerRows: 1,
                        widths: [30, '*', 60, 80],
                        body: [
                            [
                                { text: 'S.No', style: 'tableHeader', alignment: 'center' },
                                { text: 'Site', style: 'tableHeader' },
                                { text: 'Days', style: 'tableHeader', alignment: 'center' },
                                { text: 'Amount', style: 'tableHeader', alignment: 'right' }
                            ],
                            ...khorakiRows
                        ]
                    },
                    layout: {
                        fillColor: (rowIndex) => (rowIndex === 0) ? '#047857' : (rowIndex % 2 === 0 ? '#f5f5f5' : null),
                        hLineWidth: () => 0.5,
                        vLineWidth: () => 0,
                        hLineColor: () => '#e0e0e0'
                    },
                    margin: [0, 0, 0, 10]
                }
            ] : []),

            // Advance Payments (if available)
            ...(advanceRows.length > 0 ? [
                { text: 'ADVANCE PAYMENTS (THIS MONTH)', style: 'sectionHeader', margin: [0, 5, 0, 5] },
                {
                    table: {
                        headerRows: 1,
                        widths: [30, 80, '*', 80],
                        body: [
                            [
                                { text: 'S.No', style: 'tableHeader', alignment: 'center' },
                                { text: 'Date', style: 'tableHeader' },
                                { text: 'Remark', style: 'tableHeader' },
                                { text: 'Amount', style: 'tableHeader', alignment: 'right' }
                            ],
                            ...advanceRows
                        ]
                    },
                    layout: {
                        fillColor: (rowIndex) => (rowIndex === 0) ? '#047857' : (rowIndex % 2 === 0 ? '#f5f5f5' : null),
                        hLineWidth: () => 0.5,
                        vLineWidth: () => 0,
                        hLineColor: () => '#e0e0e0'
                    },
                    margin: [0, 0, 0, 10]
                }
            ] : []),

            // Opening Advance Balance
            ...(openingAdvanceTotal !== 0 ? [
                {
                    text: [
                        { text: 'Opening Advance Balance: ', style: 'label' },
                        { text: formatCurrency(openingAdvanceTotal), style: 'totalValue', bold: true }
                    ],
                    margin: [0, 5, 0, 10]
                }
            ] : []),

            // Footer
            {
                columns: [
                    {
                        width: '50%',
                        text: 'Employee Signature\n\n_________________',
                        style: 'signature',
                        margin: [0, 20, 0, 0]
                    },
                    {
                        width: '50%',
                        text: 'Authorized Signatory\n\n_________________',
                        style: 'signature',
                        alignment: 'right',
                        margin: [0, 20, 0, 0]
                    }
                ]
            }
        ],

        styles: {
            companyName: {
                fontSize: 16,
                bold: true,
                letterSpacing: 0.5
            },
            companyAddress: {
                fontSize: 8,
                lineHeight: 1.2
            },
            companyDetails: {
                fontSize: 7
            },
            title: {
                fontSize: 14,
                bold: true,
                color: '#047857',
                letterSpacing: 1.5
            },
            sectionHeader: {
                fontSize: 9,
                bold: true,
                color: '#047857',
                decoration: 'underline'
            },
            label: {
                fontSize: 8,
                color: '#666'
            },
            value: {
                fontSize: 8,
                color: '#000',
                bold: true
            },
            totalLabel: {
                fontSize: 9,
                bold: true,
                color: '#000'
            },
            totalValue: {
                fontSize: 9,
                bold: true,
                color: '#000'
            },
            netSalaryLabel: {
                fontSize: 11,
                bold: true
            },
            netSalaryValue: {
                fontSize: 11,
                bold: true
            },
            tableHeader: {
                fontSize: 8,
                bold: true,
                color: 'white'
            },
            tableCell: {
                fontSize: 7.5,
                color: '#333'
            },
            signature: {
                fontSize: 8,
                color: '#666'
            }
        },

        defaultStyle: {
            font: 'Roboto'
        }
    };

    pdfMake.createPdf(docDefinition).open();
};
