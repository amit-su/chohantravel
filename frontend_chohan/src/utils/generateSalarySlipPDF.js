import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

// Initialize fonts
if (pdfFonts.pdfMake && pdfFonts.pdfMake.vfs) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
} else if (pdfFonts.default && pdfFonts.default.pdfMake && pdfFonts.default.pdfMake.vfs) {
    pdfMake.vfs = pdfFonts.default.pdfMake.vfs;
}



export const generateSalarySlipPDF = async (data) => {
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

    // --- CALCULATIONS ---

    // 1. Salary Components (Earnings)
    const basic = parseFloat(salaryData.BASIC) || 0;
    const hra = parseFloat(salaryData.HRA) || 0;
    const medical = parseFloat(salaryData.MedicalAllowance) || 0;
    const washing = parseFloat(salaryData.WashingAllowance) || 0;
    const ta = parseFloat(salaryData.TA) || 0;
    const others = 0;

    // Salary Gross (Excluding Khoraki)
    const salaryGross = basic + hra + medical + washing + ta + others;

    // 2. Khoraki Components
    const khorakiGross = parseFloat(salaryData.KhurakiTotalAmt) || 0;
    const advanceAdjustedTotal = parseFloat(salaryData.AdvanceAdjusted) || 0;

    // Split Advance Adjustment logic:
    // First deduct from Khoraki, then from Salary if remaining.
    const khorakiAdjustment = Math.min(advanceAdjustedTotal, khorakiGross);
    const salaryAdjustment = Math.max(0, advanceAdjustedTotal - khorakiAdjustment);

    // 3. Salary Deductions (Standard + Advance Split)
    const pf = parseFloat(salaryData.PF) || 0;
    const esic = parseFloat(salaryData.ESIC) || 0;
    const ptax = parseFloat(salaryData.PTAX) || 0;

    const salaryDeductionsTotal = pf + esic + ptax + salaryAdjustment;

    // 4. Net Amounts
    const netSalaryOnly = salaryGross - salaryDeductionsTotal;
    const netKhorakiPayable = khorakiGross - khorakiAdjustment;

    // 5. Final Payable
    const totalPayable = netSalaryOnly + netKhorakiPayable;

    // 6. Advance Details (CB Calculation)
    const openingAdvanceTotal = openingAdvance.reduce((sum, item) => sum + (parseFloat(item.OpAdvAmt) || 0), 0);
    const totalWeeklyAdvanceReceived = advancePayments.reduce((sum, item) => sum + (parseFloat(item.advanceAmount) || 0), 0);
    const advanceCB = (openingAdvanceTotal + totalWeeklyAdvanceReceived) - advanceAdjustedTotal;

    // Build bus assignments text
    const busAssignmentText = busAssignments.map(item => {
        if (item.DriverBusNo) return `Driver: ${item.DriverBusNo}`;
        if (item.HelperBusNo) return `Helper: ${item.HelperBusNo}`;
        return '';
    }).filter(text => text).join(', ') || 'N/A';



    const docDefinition = {
        pageSize: 'A4',
        pageOrientation: 'landscape',
        pageMargins: [20, 20, 20, 20],

        content: [
            {
                columns: [
                    // LEFT COLUMN: SALARY DETAILS
                    {
                        width: '49%',
                        stack: [
                            // Company Header
                            {
                                table: {
                                    widths: ['*'],
                                    body: [
                                        [{
                                            stack: [
                                                { text: 'CHOHAN TOURS & TRAVELS', style: 'companyName', alignment: 'center' },
                                                { text: '70/1 Hazra Road, Kolkata - 700019', style: 'companyAddress', alignment: 'center' },
                                                { text: `Pay Slip for the Month of ${salaryData.MonthName || ''}' ${salaryData.SalaryYear || ''}`, style: 'companyDetails', alignment: 'center' }
                                            ],
                                            fillColor: '#047857',
                                            color: 'white'
                                        }]
                                    ]
                                },
                                layout: 'noBorders',
                                margin: [0, 0, 0, 10]
                            },

                            // Name Highlight
                            { text: salaryData.name || '', style: 'value', alignment: 'center', fillColor: '#ffff00', margin: [0, 0, 0, 5] },

                            // Employee Details Table
                            {
                                table: {
                                    widths: [80, '*', 80, '*'],
                                    body: [
                                        [
                                            { text: 'Employee No:', style: 'label' }, { text: salaryData.EmployeeNo || '', style: 'value' },
                                            { text: 'PAN:', style: 'label' }, { text: salaryData.panNo || '', style: 'value' }
                                        ],
                                        [
                                            { text: 'Designation:', style: 'label' }, { text: salaryData.empType || '', style: 'value' },
                                            { text: 'PF No:', style: 'label' }, { text: salaryData.pfNo || '', style: 'value' }
                                        ],
                                        [
                                            { text: 'Date of Joining:', style: 'label' }, { text: salaryData.Dateofjoin || '', style: 'value' },
                                            { text: 'ESI No:', style: 'label' }, { text: salaryData.esiNo || '', style: 'value' }
                                        ],
                                        [
                                            { text: 'No of Days Present:', style: 'label' }, { text: salaryData.DaysWorked || '', style: 'value' },
                                            { text: 'Bank Ac. No:', style: 'label' }, { text: salaryData.bankAcNo || '', style: 'value' }
                                        ],
                                        [
                                            { text: 'No of Days absent:', style: 'label' }, { text: (parseFloat(salaryData.DaysInMonth) - parseFloat(salaryData.DaysWorked)) || 0, style: 'value' },
                                            { text: '', style: 'label' }, { text: '', style: 'value' }
                                        ],
                                        [
                                            { text: 'Bus no -:', style: 'label' }, { text: busAssignmentText, style: 'value', colSpan: 3 },
                                            {}, {}
                                        ]
                                    ]
                                },
                                layout: {
                                    hLineWidth: () => 1,
                                    vLineWidth: () => 1,
                                    hLineColor: () => '#000',
                                    vLineColor: () => '#000'
                                },
                                margin: [0, 0, 0, 10]
                            },

                            // Earnings and Deductions Table
                            {
                                table: {
                                    widths: ['*', 70, '*', 70],
                                    body: [
                                        [
                                            { text: 'Earning', style: 'totalLabel', fillColor: '#047857', color: 'white' },
                                            { text: 'Amount', style: 'totalLabel', alignment: 'right', fillColor: '#047857', color: 'white' },
                                            { text: 'Deduction', style: 'totalLabel', fillColor: '#047857', color: 'white' },
                                            { text: 'Amount', style: 'totalLabel', alignment: 'right', fillColor: '#047857', color: 'white' }
                                        ],
                                        [
                                            { text: 'Basic', style: 'tableCell' },
                                            { text: basic.toFixed(2), style: 'tableCell', alignment: 'right' },
                                            { text: 'PF', style: 'tableCell' },
                                            { text: pf.toFixed(2), style: 'tableCell', alignment: 'right' }
                                        ],
                                        [
                                            { text: 'Medical Allowance', style: 'tableCell' },
                                            { text: medical.toFixed(2), style: 'tableCell', alignment: 'right' },
                                            { text: 'ESIC', style: 'tableCell' },
                                            { text: esic.toFixed(2), style: 'tableCell', alignment: 'right' }
                                        ],
                                        [
                                            { text: 'H.R.A.', style: 'tableCell' },
                                            { text: hra.toFixed(2), style: 'tableCell', alignment: 'right' },
                                            { text: 'Advance', style: 'tableCell', bold: true },
                                            { text: salaryAdjustment.toFixed(2), style: 'tableCell', alignment: 'right', bold: true }
                                        ],
                                        [
                                            { text: 'T.A.', style: 'tableCell' },
                                            { text: ta.toFixed(2), style: 'tableCell', alignment: 'right' },
                                            { text: 'P Tax', style: 'tableCell' },
                                            { text: ptax.toFixed(2), style: 'tableCell', alignment: 'right' }
                                        ],
                                        [
                                            { text: 'Washing Allowance', style: 'tableCell' },
                                            { text: washing.toFixed(2), style: 'tableCell', alignment: 'right' },
                                            { text: '', style: 'tableCell' },
                                            { text: '', style: 'tableCell', alignment: 'right' }
                                        ],
                                        [
                                            { text: 'Others', style: 'tableCell' },
                                            { text: others.toFixed(2), style: 'tableCell', alignment: 'right' },
                                            { text: '', style: 'tableCell' },
                                            { text: '', style: 'tableCell' }
                                        ],
                                        [
                                            { text: 'Gross Salary', style: 'totalLabel', fillColor: '#d1fae5' },
                                            { text: salaryGross.toFixed(2), style: 'totalValue', alignment: 'right', fillColor: '#d1fae5' },
                                            { text: 'Net Salary', style: 'totalLabel', fillColor: '#fee2e2' },
                                            { text: netSalaryOnly.toFixed(2), style: 'totalValue', alignment: 'right', fillColor: '#fee2e2' }
                                        ]
                                    ]
                                },
                                layout: {
                                    hLineWidth: () => 1,
                                    vLineWidth: () => 1,
                                    hLineColor: () => '#000',
                                    vLineColor: () => '#000'
                                }
                            },

                            // Signatures Left
                            {
                                margin: [0, 25, 0, 0],
                                table: {
                                    widths: ['*', '*', '*'],
                                    body: [
                                        [
                                            { text: 'Accounting Signature', style: 'signature', alignment: 'center' },
                                            { text: 'Partner', style: 'signature', alignment: 'center' },
                                            { text: 'Receiver Signature', style: 'signature', alignment: 'center' }
                                        ],
                                        [
                                            { text: '________________', style: 'signature', alignment: 'center', margin: [0, 5, 0, 0] },
                                            { text: '________________', style: 'signature', alignment: 'center', margin: [0, 5, 0, 0] },
                                            { text: '________________', style: 'signature', alignment: 'center', margin: [0, 5, 0, 0] }
                                        ]
                                    ]
                                },
                                layout: 'noBorders'
                            }
                        ]
                    },

                    // MIDDLE DIVIDER
                    {
                        width: '2%',
                        stack: [
                            {
                                canvas: [
                                    {
                                        type: 'line',
                                        x1: 5, y1: 0,
                                        x2: 5, y2: 450,
                                        lineWidth: 1,
                                        dash: { length: 5 }
                                    }
                                ]
                            }
                        ]
                    },

                    // RIGHT COLUMN: KHORAKI, ADVANCE, AND SUMMARY
                    {
                        width: '49%',
                        stack: [
                            { text: 'KHORAKI', style: 'title', alignment: 'center', margin: [0, 0, 0, 5], decoration: 'underline' },
                            { text: `FOR THE MONTH OF ${salaryData.MonthName || ''}' ${salaryData.SalaryYear || ''}`, style: 'companyDetails', alignment: 'left', margin: [0, 0, 0, 2] },
                            {
                                columns: [
                                    { text: `Name: ${salaryData.name || ''}`, style: 'value' },
                                    { text: `Desig: ${salaryData.empType || ''}`, style: 'value', alignment: 'right' }
                                ],
                                margin: [0, 0, 0, 5]
                            },

                            // Khoraki Table
                            {
                                table: {
                                    widths: ['*', 30, 40, 60],
                                    body: [
                                        [
                                            { text: 'Duty Details', style: 'tableHeader', alignment: 'center', fillColor: '#047857' },
                                            { text: 'No.', style: 'tableHeader', alignment: 'center', fillColor: '#047857' },
                                            { text: 'Rate', style: 'tableHeader', alignment: 'center', fillColor: '#047857' },
                                            { text: 'Total', style: 'tableHeader', alignment: 'center', fillColor: '#047857' }
                                        ],
                                        ...khorakiDetails.map(item => [
                                            { text: item.SiteShortName || 'Duty', style: 'tableCell' },
                                            { text: item.DayCount || 0, style: 'tableCell', alignment: 'center' },
                                            { text: (item.KhurakiRate || 0).toFixed(0), style: 'tableCell', alignment: 'center' },
                                            { text: (item.TotalKhurakiAmount || 0).toFixed(0), style: 'tableCell', alignment: 'right' }
                                        ]),
                                        [
                                            { text: 'TOTAL', style: 'totalLabel', colSpan: 3 },
                                            {}, {},
                                            { text: khorakiGross.toFixed(0), style: 'totalValue', alignment: 'right' }
                                        ],
                                        [
                                            { text: 'Less Weekly Advance', style: 'tableCell', colSpan: 3 },
                                            {}, {},
                                            { text: khorakiAdjustment.toFixed(0), style: 'tableCell', alignment: 'right' }
                                        ],
                                        [
                                            { text: 'Net Khoraki Payable', style: 'totalLabel', colSpan: 3 },
                                            {}, {},
                                            { text: netKhorakiPayable.toFixed(0), style: 'totalValue', alignment: 'right' }
                                        ]
                                    ]
                                },
                                layout: { hLineWidth: () => 1, vLineWidth: () => 1 },
                                margin: [0, 0, 0, 10]
                            },

                            // Advance Details Table
                            {
                                table: {
                                    widths: ['*', 40, 70, 60],
                                    body: [
                                        [
                                            { text: 'Advance Details', style: 'tableHeader', colSpan: 4, alignment: 'center', fillColor: '#047857' },
                                            {}, {}, {}
                                        ],
                                        [
                                            { text: 'Advance (OB)', style: 'tableCell', colSpan: 3, alignment: 'right' },
                                            {}, {},
                                            { text: openingAdvanceTotal.toLocaleString(), style: 'tableCell', alignment: 'right' }
                                        ],
                                        [
                                            { text: 'Sl', style: 'tableHeader', alignment: 'center', fillColor: '#047857' },
                                            { text: 'Date', style: 'tableHeader', colSpan: 2, alignment: 'center', fillColor: '#047857' },
                                            {},
                                            { text: 'Amt', style: 'tableHeader', alignment: 'center', fillColor: '#047857' }
                                        ],
                                        ...advancePayments.map((p, i) => [
                                            { text: i + 1, style: 'tableCell', alignment: 'center' },
                                            { text: formatDate(p.created_at), style: 'tableCell', colSpan: 2, alignment: 'center' },
                                            {},
                                            { text: (parseFloat(p.advanceAmount) || 0).toLocaleString(), style: 'tableCell', alignment: 'right' }
                                        ]),
                                        [
                                            { text: 'Total Weekly Adv', style: 'totalLabel', colSpan: 3, alignment: 'right' },
                                            {}, {},
                                            { text: totalWeeklyAdvanceReceived.toLocaleString(), style: 'totalValue', alignment: 'right' }
                                        ],
                                        [
                                            { text: 'Total Adv (Weekly+OB)', style: 'totalLabel', colSpan: 3, alignment: 'right' },
                                            {}, {},
                                            { text: (openingAdvanceTotal + totalWeeklyAdvanceReceived).toLocaleString(), style: 'totalValue', alignment: 'right' }
                                        ],
                                        [
                                            { text: 'Less: Adv Deducted', style: 'totalLabel', colSpan: 3, alignment: 'right' },
                                            {}, {},
                                            { text: advanceAdjustedTotal.toLocaleString(), style: 'totalValue', alignment: 'right' }
                                        ],
                                        [
                                            { text: 'Advance (CB)', style: 'totalLabel', colSpan: 3, alignment: 'right' },
                                            {}, {},
                                            { text: advanceCB.toLocaleString(), style: 'totalValue', alignment: 'right' }
                                        ]
                                    ]
                                },
                                layout: { hLineWidth: () => 1, vLineWidth: () => 1 },
                                margin: [0, 0, 0, 10]
                            },

                            // SUMMARY TABLES
                            {
                                table: {
                                    widths: ['*', 100],
                                    body: [
                                        [{ text: 'TOTAL SALARY', style: 'totalLabel' }, { text: salaryGross.toFixed(2), style: 'totalValue', alignment: 'right' }],
                                        [{ text: 'TOTAL KHORAKHI', style: 'totalLabel' }, { text: khorakiGross.toFixed(2), style: 'totalValue', alignment: 'right' }],
                                        [{ text: 'TOTAL', style: 'totalLabel', fillColor: '#f3f4f6' }, { text: (salaryGross + khorakiGross).toFixed(2), style: 'totalValue', alignment: 'right', fillColor: '#f3f4f6' }]
                                    ]
                                },
                                layout: { hLineWidth: () => 1, vLineWidth: () => 1 },
                                margin: [0, 0, 0, 5]
                            },
                            {
                                table: {
                                    widths: ['*', 100],
                                    body: [
                                        [{ text: 'NET KHORAKHI', style: 'totalLabel' }, { text: netKhorakiPayable.toFixed(2), style: 'totalValue', alignment: 'right' }],
                                        [{ text: 'NET SALARY', style: 'totalLabel' }, { text: netSalaryOnly.toFixed(2), style: 'totalValue', alignment: 'right' }],
                                        [{ text: 'PAYABLE', style: 'netSalaryLabel', fillColor: '#ffff00' }, { text: totalPayable.toFixed(2), style: 'netSalaryValue', alignment: 'right', fillColor: '#ffff00' }]
                                    ]
                                },
                                layout: { hLineWidth: () => 1, vLineWidth: () => 1 }
                            },

                            // Signatures Right
                            {
                                margin: [0, 25, 0, 0],
                                table: {
                                    widths: ['*', '*', '*'],
                                    body: [
                                        [
                                            { text: 'Accounting Signature', style: 'signature', alignment: 'center' },
                                            { text: 'Partner', style: 'signature', alignment: 'center' },
                                            { text: 'Receiver Signature', style: 'signature', alignment: 'center' }
                                        ],
                                        [
                                            { text: '________________', style: 'signature', alignment: 'center', margin: [0, 5, 0, 0] },
                                            { text: '________________', style: 'signature', alignment: 'center', margin: [0, 5, 0, 0] },
                                            { text: '________________', style: 'signature', alignment: 'center', margin: [0, 5, 0, 0] }
                                        ]
                                    ]
                                },
                                layout: 'noBorders'
                            }
                        ]
                    }
                ]
            },

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
            label: {
                fontSize: 8,
                color: '#666',
                bold: true
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
                color: '#666',
                bold: true
            }
        },

        defaultStyle: {
            font: 'Roboto'
        }
    };

    pdfMake.createPdf(docDefinition).download(`CHOHAN_SALARY_SLIP_${salaryData.name}_${salaryData.MonthName}_${salaryData.SalaryYear}.pdf`);
};
