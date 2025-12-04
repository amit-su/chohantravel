import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

// Initialize fonts
if (pdfFonts.pdfMake && pdfFonts.pdfMake.vfs) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
} else if (pdfFonts.default && pdfFonts.default.pdfMake && pdfFonts.default.pdfMake.vfs) {
    pdfMake.vfs = pdfFonts.default.pdfMake.vfs;
}

export const generateProformaInvoicePDF = (data) => {
    if (!data || data.length === 0) {
        console.error('No data provided for PDF generation');
        return;
    }

    const invoiceData = data[0];

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const formatCurrency = (amount) => {
        if (!amount) return '₹ 0.00';
        return `₹ ${parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const calculateTotals = () => {
        let grossAmount = 0;
        let tollExtra = parseFloat(invoiceData.TollExtra) || 0;

        data.forEach(item => {
            grossAmount += parseFloat(item.Amt) || 0;
        });

        const cgstPer = 2.5;
        const sgstPer = 2.5;
        const cgstAmt = (grossAmount * cgstPer) / 100;
        const sgstAmt = (grossAmount * sgstPer) / 100;
        const totalGst = cgstAmt + sgstAmt;
        const netAmount = grossAmount + totalGst + tollExtra;

        return { grossAmount, tollExtra, cgstPer, cgstAmt, sgstPer, sgstAmt, totalGst, netAmount };
    };

    // ... inside export const generateProformaInvoicePDF = (data) => { ...
    // ... (Your setup, formatDate, formatCurrency, calculateTotals functions) ...

    const totals = calculateTotals();

    const tripDetailsRows = data.map((item, index) => {
        return [
            { text: index + 1, alignment: 'center', style: 'tableCell' },
            { text: item.TripDesc || '', style: 'tableCell' },
            { text: formatCurrency(item.Rate), alignment: 'right', style: 'tableCell' },
            { text: formatCurrency(item.Amt), alignment: 'right', style: 'tableCell' }
        ];
    });

    const docDefinition = {
        pageSize: 'A4',
        pageMargins: [30, 30, 30, 40],
        // ... (Footer remains the same) ...

        content: [
            // --- FIXED HEADER ---
            {
                // Background block for the header
                canvas: [{
                    type: 'rect',
                    x: -30,
                    y: -5,
                    w: 595, // Wider than page width to ensure full bleed
                    h: 50,
                    color: '#1e3a8a'
                }]
            },
            {
                text: invoiceData.CompanyName || 'CHOHAN TOURS AND TRAVELS',
                style: 'compactCompanyName',
                alignment: 'center',
                color: 'white',
                margin: [0, -45, 0, 2] // Adjusting Y-margin to place text over canvas
            },
            {
                text: `${invoiceData.BranchAddr || ''}, ${invoiceData.BranchCity || ''}, ${invoiceData.BranchPinCode || ''}, ${invoiceData.BranchState || ''}`,
                style: 'compactAddress',
                alignment: 'center',
                color: 'white',
                margin: [0, 0, 0, 2]
            },
            {
                text: `GST: ${invoiceData.BranchGSTNo || ''} | PAN: ${invoiceData.BranchPanno || ''}`,
                style: 'compactDetails',
                alignment: 'center',
                color: 'white',
                margin: [0, 0, 0, 8]
            },

            // Title
            {
                text: 'PROFORMA INVOICE',
                style: 'compactTitle',
                alignment: 'center',
                margin: [0, 8, 0, 8]
            },

            // --- FIXED INVOICE DETAILS ---
            {
                columns: [
                    // BILL TO
                    {
                        width: '55%',
                        stack: [
                            { text: 'BILL TO', style: 'sectionLabel', margin: [0, 0, 0, 3] },
                            {
                                // Use a simple table for the bill-to box content for better border control
                                table: {
                                    widths: ['*'],
                                    body: [
                                        [{
                                            stack: [
                                                { text: invoiceData.partyName, style: 'compactPartyName', margin: [0, 2, 0, 2] },
                                                { text: invoiceData.PartyAddr, style: 'compactText', margin: [0, 0, 0, 3] },
                                                {
                                                    text: [
                                                        { text: 'Contact: ', style: 'compactLabel' },
                                                        { text: `${invoiceData.ContactPersonName} - ${invoiceData.ContactPersonNo}`, style: 'compactText' }
                                                    ],
                                                    margin: [0, 0, 0, 2]
                                                },
                                                {
                                                    text: [
                                                        { text: 'GST: ', style: 'compactLabel' },
                                                        { text: invoiceData.gstNo, style: 'compactText' },
                                                        { text: ' | Order Ref: ', style: 'compactLabel' },
                                                        { text: invoiceData.PartyOrderNo, style: 'compactText' }
                                                    ],
                                                    margin: [0, 0, 0, 4]
                                                }
                                            ],
                                            // The whole stack is the content of a single table cell
                                            border: [true, true, true, true],
                                            borderColor: ['#e5e7eb', '#e5e7eb', '#e5e7eb', '#e5e7eb'],
                                            padding: [5, 5, 5, 5]
                                        }]
                                    ]
                                },
                                layout: 'noBorders' // Use noBorders since border is defined on the cell
                            }
                        ]
                    },
                    // INVOICE DETAILS
                    {
                        width: '45%',
                        stack: [
                            { text: 'INVOICE DETAILS', style: 'sectionLabel', alignment: 'right', margin: [0, 0, 0, 3] },
                            {
                                table: {
                                    widths: ['*', 'auto'],
                                    body: [
                                        [{ text: 'Invoice No:', style: 'compactLabel', alignment: 'left', border: [false, false, false, false] }, { text: invoiceData.RefInvoiceNo, style: 'compactInvoiceNo', alignment: 'right', border: [false, false, false, false] }],
                                        [{ text: 'Date:', style: 'compactLabel', alignment: 'left', border: [false, false, false, false] }, { text: formatDate(invoiceData.ProformaInvDate), style: 'compactText', alignment: 'right', border: [false, false, false, false] }],
                                        [{ text: 'SAC Code:', style: 'compactLabel', alignment: 'left', border: [false, false, false, false] }, { text: invoiceData.BranchSACCode, style: 'compactText', alignment: 'right', border: [false, false, false, false] }]
                                    ]
                                },
                                layout: {
                                    hLineWidth: () => 0,
                                    vLineWidth: () => 0,
                                    paddingLeft: () => 5,
                                    paddingRight: () => 5,
                                    paddingTop: () => 3,
                                    paddingBottom: () => 3,
                                    // Custom borders for the box look
                                    lightHorizontalLines: () => false,
                                    lightVerticalLines: () => false,
                                    box: (i, node) => {
                                        if (i === 0) return true;
                                        return false;
                                    },
                                    boxBorderColor: () => '#e5e7eb',
                                    fillColor: () => '#f9fafb'
                                }
                            }
                        ]
                    }
                ],
                margin: [0, 0, 0, 8]
            },

            // --- SERVICE DETAILS TABLE (Minor Fixes) ---
            {
                text: 'SERVICE DETAILS',
                style: 'sectionLabel',
                margin: [0, 0, 0, 3]
            },
            {
                table: {
                    headerRows: 1,
                    widths: [25, '*', 70, 70],
                    body: [
                        [
                            { text: 'S.No', style: 'compactTableHeader', alignment: 'center' },
                            { text: 'Description', style: 'compactTableHeader' },
                            { text: 'Rate', style: 'compactTableHeader', alignment: 'right' },
                            { text: 'Amount', style: 'compactTableHeader', alignment: 'right' }
                        ],
                        ...tripDetailsRows
                    ]
                },
                layout: {
                    // Use standard borders and fill color for header
                    fillColor: function (rowIndex) {
                        return (rowIndex === 0) ? '#1e3a8a' : (rowIndex % 2 === 0 ? '#f9fafb' : null);
                    },
                    hLineWidth: function (i, node) {
                        // Top, header bottom, and final bottom borders
                        return (i === 0 || i === 1 || i === node.table.body.length) ? 0.5 : 0;
                    },
                    vLineWidth: () => 0, // No vertical lines
                    hLineColor: () => '#cbd5e1',
                    paddingLeft: () => 5,
                    paddingRight: () => 5,
                    paddingTop: () => 4,
                    paddingBottom: () => 4
                },
                margin: [0, 0, 0, 5]
            },

            // --- FIXED SUMMARY/TOTAL ---
            {
                columns: [
                    { width: '*', text: '' }, // Spacer column
                    {
                        width: 200,
                        table: {
                            widths: ['*', 70],
                            body: [
                                [
                                    // Toll & Parking
                                    { text: 'Toll & Parking', style: 'summaryLabel', border: [false, true, false, false], borderColor: ['#e5e7eb', '#cbd5e1', '#e5e7eb', '#e5e7eb'] },
                                    { text: formatCurrency(totals.tollExtra), style: 'summaryValue', alignment: 'right', border: [false, true, false, false], borderColor: ['#e5e7eb', '#cbd5e1', '#e5e7eb', '#e5e7eb'] }
                                ],
                                // Gross Amount
                                [
                                    { text: 'Gross Amount', style: 'summaryLabel', border: [false, false, false, false] },
                                    { text: formatCurrency(totals.grossAmount), style: 'summaryValue', alignment: 'right', border: [false, false, false, false] }
                                ],
                                // CGST
                                [
                                    { text: `CGST (${totals.cgstPer}%)`, style: 'summaryLabel', border: [false, false, false, false] },
                                    { text: formatCurrency(totals.cgstAmt), style: 'summaryValue', alignment: 'right', border: [false, false, false, false] }
                                ],
                                // SGST
                                [
                                    { text: `SGST (${totals.sgstPer}%)`, style: 'summaryLabel', border: [false, false, false, false] },
                                    { text: formatCurrency(totals.sgstAmt), style: 'summaryValue', alignment: 'right', border: [false, false, false, false] }
                                ],
                                // Total GST
                                [
                                    { text: 'Total GST', style: 'summaryBold', border: [false, true, false, false], borderColor: ['#e5e7eb', '#cbd5e1', '#e5e7eb', '#e5e7eb'] },
                                    { text: formatCurrency(totals.totalGst), style: 'summaryBold', alignment: 'right', border: [false, true, false, false], borderColor: ['#e5e7eb', '#cbd5e1', '#e5e7eb', '#e5e7eb'] }
                                ],
                                // Net Amount (Blue Bar)
                                [
                                    { text: 'Net Amount', style: 'totalLabel', border: [false, false, false, false], fillColor: '#1e3a8a', color: 'white' },
                                    { text: formatCurrency(totals.netAmount), style: 'totalValue', alignment: 'right', border: [false, false, false, false], fillColor: '#1e3a8a', color: 'white' }
                                ]
                            ]
                        },
                        // Removed layout properties and used cell-level borders for better control
                        layout: {
                            hLineWidth: () => 0,
                            vLineWidth: () => 0,
                            paddingLeft: () => 5,
                            paddingRight: () => 5,
                            paddingTop: (i, node) => (i === 0 || i === 4) ? 5 : 3, // Add extra padding around horizontal lines
                            paddingBottom: (i, node) => (i === 0 || i === 4) ? 5 : 3
                        }
                    }
                ],
                margin: [0, 0, 0, 6]
            },

            // --- AMOUNT IN WORDS ---
            {
                // This block is for the light blue background
                canvas: [{
                    type: 'rect',
                    x: 0, y: 0, w: 535, h: 20,
                    r: 3,
                    color: '#eff6ff'
                }],
                margin: [0, 0, 0, 5]
            },
            {
                text: [
                    { text: 'Amount in Words: ', style: 'compactLabel' },
                    { text: `${invoiceData.AmtInWords} Only`, style: 'amountWords' }
                ],
                margin: [6, -20, 6, 10] // Adjusted Y-margin to place text over canvas
            },

            // --- FIXED BOTTOM SECTION (Signature & Payment) ---
            {
                columns: [
                    // Signature Block
                    {
                        width: '50%',
                        stack: [
                            {
                                text: 'FOR ' + (invoiceData.CompanyName || 'CHOHAN TOURS AND TRAVELS'),
                                style: 'compactLabel',
                                margin: [0, 15, 0, 50] // Increased margin for space before signature
                            },
                            {
                                text: 'Authorized Signatory',
                                style: 'compactText',
                                margin: [0, 0, 0, 5]
                            },
                            {
                                text: 'E. & O. E.',
                                style: 'compactLabel',
                                italics: true,
                                margin: [0, 5, 0, 0]
                            }
                        ]
                    },
                    // Payment Information (Bank Details)
                    {
                        width: '50%',
                        stack: [
                            {
                                text: 'PAYMENT INFORMATION',
                                style: 'sectionLabel',
                                alignment: 'right',
                                margin: [0, 0, 0, 5]
                            },
                            {
                                // Use a simple table for the bank details box for better border control
                                table: {
                                    widths: ['*'],
                                    body: [
                                        [{
                                            stack: [
                                                {
                                                    text: [
                                                        { text: 'PAN NO: ', style: 'compactLabel' },
                                                        { text: invoiceData.BranchPanno, style: 'compactText' }
                                                    ],
                                                    margin: [0, 2, 0, 2]
                                                },
                                                {
                                                    text: [
                                                        { text: 'GST No: ', style: 'compactLabel' },
                                                        { text: invoiceData.BranchGSTNo, style: 'compactText' }
                                                    ],
                                                    margin: [0, 0, 0, 5]
                                                },
                                                {
                                                    text: 'OUR BANK DETAILS',
                                                    style: 'compactLabel',
                                                    decoration: 'underline',
                                                    margin: [0, 0, 0, 3]
                                                },
                                                {
                                                    text: invoiceData.BankAcName,
                                                    style: 'compactBankName',
                                                    margin: [0, 0, 0, 2]
                                                },
                                                {
                                                    text: [
                                                        { text: 'Bank: ', style: 'compactLabel' },
                                                        { text: invoiceData.BankName, style: 'compactText' }
                                                    ],
                                                    margin: [0, 0, 0, 2]
                                                },
                                                {
                                                    text: [
                                                        { text: 'Branch: ', style: 'compactLabel' },
                                                        { text: invoiceData.BankBranchAddr, style: 'compactText' }
                                                    ],
                                                    margin: [0, 0, 0, 2]
                                                },
                                                {
                                                    text: [
                                                        { text: 'A/c No: ', style: 'compactLabel' },
                                                        { text: invoiceData.BankAcNo, style: 'compactText' }
                                                    ],
                                                    margin: [0, 0, 0, 2]
                                                },
                                                {
                                                    text: [
                                                        { text: 'IFSC: ', style: 'compactLabel' },
                                                        { text: invoiceData.BankIFSCode, style: 'compactText' }
                                                    ],
                                                    margin: [0, 0, 0, 5]
                                                }
                                            ],
                                            // The whole stack is the content of a single table cell
                                            border: [true, true, true, true],
                                            borderColor: ['#e5e7eb', '#e5e7eb', '#e5e7eb', '#e5e7eb'],
                                            fillColor: '#f9fafb',
                                            padding: [8, 8, 8, 8]
                                        }]
                                    ]
                                },
                                layout: 'noBorders'
                            }
                        ]
                    }
                ],
                margin: [0, 0, 0, 0]
            }
        ],

        // --- STYLES (Minor Tweaks for Spacing) ---
        styles: {
            compactCompanyName: {
                fontSize: 14,
                bold: true,
                letterSpacing: 0.5
            },
            compactAddress: {
                fontSize: 7,
                lineHeight: 1.2
            },
            compactDetails: {
                fontSize: 6.5
            },
            compactTitle: {
                fontSize: 13,
                bold: true,
                color: '#1e3a8a',
                letterSpacing: 1.5
            },
            sectionLabel: {
                fontSize: 7.5,
                bold: true,
                color: '#64748b',
                letterSpacing: 0.5
            },
            compactPartyName: {
                fontSize: 9,
                bold: true,
                color: '#1e293b'
            },
            compactLabel: {
                fontSize: 7,
                bold: true,
                color: '#64748b'
            },
            compactText: {
                fontSize: 7.5,
                color: '#334155'
            },
            compactInvoiceNo: {
                fontSize: 9,
                bold: true,
                color: '#1e3a8a'
            },
            compactTableHeader: {
                fontSize: 8,
                bold: true,
                color: 'white'
            },
            tableCell: {
                fontSize: 7.5,
                color: '#334155',
                lineHeight: 1.3
            },
            summaryLabel: {
                fontSize: 7.5,
                color: '#64748b'
            },
            summaryValue: {
                fontSize: 7.5,
                color: '#334155'
            },
            summaryBold: {
                fontSize: 8,
                bold: true,
                color: '#1e293b'
            },
            totalLabel: {
                fontSize: 9,
                bold: true
            },
            totalValue: {
                fontSize: 9,
                bold: true
            },
            amountWords: {
                fontSize: 8,
                bold: true,
                color: '#1e3a8a',
                italics: true
            },
            compactBankName: {
                fontSize: 8,
                bold: true,
                color: '#1e293b'
            },
            footer: {
                fontSize: 7,
                color: '#94a3b8',
                italics: true
            }
        },

        defaultStyle: {
            font: 'Roboto'
        }
    };

    pdfMake.createPdf(docDefinition).open();
};