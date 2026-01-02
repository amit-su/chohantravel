import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

// Initialize fonts
if (pdfFonts.pdfMake && pdfFonts.pdfMake.vfs) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
} else if (pdfFonts.default && pdfFonts.default.pdfMake && pdfFonts.default.pdfMake.vfs) {
    pdfMake.vfs = pdfFonts.default.pdfMake.vfs;
}

const STEMP_IMAGE_URL = window.location.origin + "/images/stemp.jpeg";
const COMPANY_LOGO_URL = window.location.origin + "/images/logo-white-new.png";

const getBase64ImageFromURL = (url) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.setAttribute("crossOrigin", "anonymous");
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            const dataURL = canvas.toDataURL("image/png");
            resolve(dataURL);
        };
        img.onerror = (error) => {
            console.error("Error loading image:", error);
            reject(error);
        };
        img.src = url;
    });
};

export const generateInvoiceEntryPDF = async (data) => {
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
        let TollParkingAmt = parseFloat(invoiceData.TollParkingAmt) || 0;

        data.forEach(item => {
            grossAmount += parseFloat(item.Amt) || 0;
        });

        const cgstPer = parseFloat(invoiceData.CGSTPer) || 0;
        const sgstPer = parseFloat(invoiceData.SGSTPer) || 0;
        const igstPer = parseFloat(invoiceData.IGSTPer) || 0;

        const cgstAmt = ((grossAmount + TollParkingAmt) * cgstPer) / 100;
        const sgstAmt = ((grossAmount + TollParkingAmt) * sgstPer) / 100;
        const igstAmt = ((grossAmount + TollParkingAmt) * igstPer) / 100;

        const totalGst = cgstAmt + sgstAmt + igstAmt;
        const netAmountRaw = grossAmount + totalGst + TollParkingAmt;
        const netAmount = Math.ceil(netAmountRaw);
        const roundOff = netAmount - netAmountRaw;

        return { grossAmount, TollParkingAmt, cgstPer, cgstAmt, sgstPer, sgstAmt, igstPer, igstAmt, totalGst, netAmount, roundOff };
    };

    const totals = calculateTotals();
    let stempImageBase64 = null;
    try {
        stempImageBase64 = await getBase64ImageFromURL(STEMP_IMAGE_URL);
    } catch (error) {
        console.error("Could not load signature image", error);
    }

    let companyLogoBase64 = null;
    try {
        companyLogoBase64 = await getBase64ImageFromURL(COMPANY_LOGO_URL);
    } catch (error) {
        console.error("Could not load company logo image", error);
    }

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
        content: [
            // --- FIXED HEADER ---
            {
                canvas: [{
                    type: 'rect',
                    x: -30,
                    y: -5,
                    w: 595,
                    h: 50,
                    color: '#1e3a8a' // Blue Background
                }]
            },
            // Logo (Left Aligned - Absolute Position)
            ...(companyLogoBase64 ? [{
                image: companyLogoBase64,
                width: 120,
                absolutePosition: { x: 10, y: 35 }
            }] : []),
            {
                text: invoiceData.CompanyName || 'CHOHAN TOURS & TRAVELS',
                style: 'compactCompanyName',
                alignment: 'center',
                color: 'white',
                margin: [0, -45, 0, 2]
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
                text: 'INVOICE',
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
                                table: {
                                    widths: ['*'],
                                    body: [
                                        [{
                                            stack: [
                                                { text: invoiceData.partyName || '', style: 'compactPartyName', margin: [0, 2, 0, 2] },
                                                { text: invoiceData.PartyAddr || '', style: 'compactText', margin: [0, 0, 0, 3] },
                                                {
                                                    text: [
                                                        { text: 'Contact: ', style: 'compactLabel' },
                                                        { text: `${invoiceData.ContactPersonName || ''} ${invoiceData.ContactPersonNo ? '- ' + invoiceData.ContactPersonNo : ''}`, style: 'compactText' }
                                                    ],
                                                    margin: [0, 0, 0, 2]
                                                },
                                                {
                                                    text: [
                                                        { text: 'GST: ', style: 'compactLabel' },
                                                        { text: invoiceData.gstNo || 'N/A', style: 'compactText' },
                                                        { text: ' | Order Ref: ', style: 'compactLabel' },
                                                        { text: invoiceData.PartyOrderNo || '', style: 'compactText' }
                                                    ],
                                                    margin: [0, 0, 0, 4]
                                                }
                                            ],
                                            border: [true, true, true, true],
                                            borderColor: ['#e5e7eb', '#e5e7eb', '#e5e7eb', '#e5e7eb'],
                                            padding: [5, 5, 5, 5]
                                        }]
                                    ]
                                },
                                layout: 'noBorders'
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
                                        [{ text: 'Invoice No:', style: 'compactLabel', alignment: 'left', border: [false, false, false, false] }, { text: invoiceData.RefInvoiceNo || '', style: 'compactInvoiceNo', alignment: 'right', border: [false, false, false, false] }],
                                        [{ text: 'Date:', style: 'compactLabel', alignment: 'left', border: [false, false, false, false] }, { text: formatDate(invoiceData.InvDate), style: 'compactText', alignment: 'right', border: [false, false, false, false] }],
                                        [{ text: 'SAC Code:', style: 'compactLabel', alignment: 'left', border: [false, false, false, false] }, { text: invoiceData.BranchSACCode || '', style: 'compactText', alignment: 'right', border: [false, false, false, false] }]
                                    ]
                                },
                                layout: {
                                    hLineWidth: () => 0,
                                    vLineWidth: () => 0,
                                    paddingLeft: () => 5,
                                    paddingRight: () => 5,
                                    paddingTop: () => 3,
                                    paddingBottom: () => 3,
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

            // --- SERVICE DETAILS TABLE ---
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
                    fillColor: function (rowIndex) {
                        return (rowIndex === 0) ? '#1e3a8a' : (rowIndex % 2 === 0 ? '#f9fafb' : null);
                    },
                    hLineWidth: function (i, node) {
                        return (i === 0 || i === 1 || i === node.table.body.length) ? 0.5 : 0;
                    },
                    vLineWidth: () => 0,
                    hLineColor: () => '#cbd5e1',
                    paddingLeft: () => 5,
                    paddingRight: () => 5,
                    paddingTop: () => 4,
                    paddingBottom: () => 4
                },
                margin: [0, 0, 0, 5]
            },

            // --- FIXED SUMMARY/TOTAL & PAYMENT INFO ---
            {
                columns: [
                    // LEFT: Payment Information
                    {
                        width: '*',
                        stack: [
                            { text: 'PAYMENT INFORMATION', style: 'sectionLabel', alignment: 'left', margin: [0, 0, 0, 5] },
                            {
                                table: {
                                    widths: ['*'],
                                    body: [[{
                                        stack: [
                                            { text: [{ text: 'PAN NO: ', style: 'compactLabel' }, { text: invoiceData.BranchPanno || '', style: 'compactText' }] },
                                            { text: [{ text: 'GST No: ', style: 'compactLabel' }, { text: invoiceData.BranchGSTNo || '', style: 'compactText' }], margin: [0, 0, 0, 4] },
                                            { text: 'OUR BANK DETAILS', style: 'compactLabel', decoration: 'underline', margin: [0, 0, 0, 2] },
                                            { text: invoiceData.BankAcName || '', style: 'compactBankName' },
                                            { text: [{ text: 'Bank: ', style: 'compactLabel' }, { text: invoiceData.BankName || '', style: 'compactText' }] },
                                            { text: [{ text: 'Branch: ', style: 'compactLabel' }, { text: invoiceData.BankBranchAddr || '', style: 'compactText' }] },
                                            { text: [{ text: 'A/c No: ', style: 'compactLabel' }, { text: invoiceData.BankAcNo || '', style: 'compactText' }] },
                                            { text: [{ text: 'IFSC: ', style: 'compactLabel' }, { text: invoiceData.BankIFSCode || '', style: 'compactText' }] }
                                        ],
                                        border: [true, true, true, true],
                                        borderColor: ['#e5e7eb', '#e5e7eb', '#e5e7eb', '#e5e7eb'],
                                        fillColor: '#f9fafb',
                                        padding: [8, 5, 8, 5]
                                    }]]
                                },
                                layout: 'noBorders'
                            }
                        ],
                        margin: [0, 0, 10, 0]
                    },
                    // RIGHT: Amount Calculation
                    {
                        width: 200,
                        table: {
                            widths: ['*', 70],
                            body: [
                                [
                                    {
                                        text: [
                                            { text: 'Toll & Parking ' },
                                            ...(invoiceData?.TollExtra
                                                ? [{ text: `(${invoiceData.TollExtra})`, italics: true, fontSize: 9 }]
                                                : [])],
                                        style: 'summaryLabel',
                                        border: [false, true, false, false],
                                        borderColor: ['#e5e7eb', '#cbd5e1', '#e5e7eb', '#e5e7eb']
                                    }, { text: formatCurrency(totals.TollParkingAmt), style: 'summaryValue', alignment: 'right', border: [false, true, false, false], borderColor: ['#e5e7eb', '#cbd5e1', '#e5e7eb', '#e5e7eb'] }
                                ],
                                [
                                    { text: 'Gross Amount', style: 'summaryLabel', border: [false, false, false, false] },
                                    { text: formatCurrency(totals.grossAmount), style: 'summaryValue', alignment: 'right', border: [false, false, false, false] }
                                ],
                                // CGST (Conditional)
                                ...(totals.cgstPer > 0 ? [[
                                    { text: `CGST (${totals.cgstPer}%)`, style: 'summaryLabel', border: [false, false, false, false] },
                                    { text: formatCurrency(totals.cgstAmt), style: 'summaryValue', alignment: 'right', border: [false, false, false, false] }
                                ]] : []),
                                // SGST (Conditional)
                                ...(totals.sgstPer > 0 ? [[
                                    { text: `SGST (${totals.sgstPer}%)`, style: 'summaryLabel', border: [false, false, false, false] },
                                    { text: formatCurrency(totals.sgstAmt), style: 'summaryValue', alignment: 'right', border: [false, false, false, false] }
                                ]] : []),
                                // IGST (Conditional)
                                ...(totals.igstPer > 0 ? [[
                                    { text: `IGST (${totals.igstPer}%)`, style: 'summaryLabel', border: [false, false, false, false] },
                                    { text: formatCurrency(totals.igstAmt), style: 'summaryValue', alignment: 'right', border: [false, false, false, false] }
                                ]] : []),
                                [
                                    { text: 'Total GST', style: 'summaryBold', border: [false, true, false, false], borderColor: ['#e5e7eb', '#cbd5e1', '#e5e7eb', '#e5e7eb'] },
                                    { text: formatCurrency(totals.totalGst), style: 'summaryBold', alignment: 'right', border: [false, true, false, false], borderColor: ['#e5e7eb', '#cbd5e1', '#e5e7eb', '#e5e7eb'] }
                                ],
                                // Round Off
                                [
                                    { text: 'Round Off', style: 'summaryLabel', border: [false, false, false, false] },
                                    { text: formatCurrency(totals.roundOff), style: 'summaryValue', alignment: 'right', border: [false, false, false, false] }
                                ],
                                [
                                    { text: 'Net Amount', style: 'totalLabel', border: [false, false, false, false], fillColor: '#1e3a8a', color: 'white' },
                                    { text: formatCurrency(totals.netAmount), style: 'totalValue', alignment: 'right', border: [false, false, false, false], fillColor: '#1e3a8a', color: 'white' }
                                ]
                            ]
                        },
                        layout: {
                            hLineWidth: () => 0,
                            vLineWidth: () => 0,
                            paddingLeft: () => 5,
                            paddingRight: () => 5,
                            paddingTop: (i, node) => (i === 0 || i === 4) ? 5 : 3,
                            paddingBottom: (i, node) => (i === 0 || i === 4) ? 5 : 3
                        }
                    }
                ],
                margin: [0, 0, 0, 6]
            },

            // --- AMOUNT IN WORDS ---
            {
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
                    { text: `${invoiceData.AmtInWords || ''} Only`, style: 'amountWords' }
                ],
                margin: [6, -20, 6, 10]
            },

            // --- BOTTOM SECTION: TERMS on Left (50%) & SIGNATURE on Right (50%) ---
            {
                columns: [
                    // Left Column: Terms & Conditions
                    {
                        width: '80%',
                        stack: [
                            { text: 'NOTE / T&C:', style: 'sectionLabel', margin: [0, 5, 0, 5] },
                            {
                                table: {
                                    widths: ['*'],
                                    body: [[
                                        {
                                            text:
                                                `1. THIS IS A PROFORMA INVOICE AND NOT A BOOKING CONFIRMATION.
2. BOOKING CONFIRMATION AGAINST ADVANCE ONLY.
3. ALL PAYMENTS HAVE TO BE FULLY CLEARED AT OUR AFORESAID OFFICE.
4. 7 DAYS PRIOR TO COMMENCEMENT OF JOURNEY.
5. NO STANDING ALLOWED, PASSENGERS ALLOWED AS PER SEATING CAPACITY ONLY.
6. NO PASSENGERS ARE ALLOWED TO SIT INTO DRIVING CABIN.
7. ALL ADVANCES OR PAYMENTS MADE ABOVE WHETHER IN PART OR FULL SHALL STAND TOTALLY FORFEITED IN CASE OF CANCELLATION.
8. ANY DAMAGE TO THE BUS INCLUDING ITS FITTINGS AND ACCESSORIES SHALL HAVE TO BE FULLY BORNE BY THE HIRER.
9. IN CASE OF ONE-DAY OR LESS BOOKINGS, EXTRA DETENTION CHARGES @ RS. 1000/- PER HOUR SHALL BE PAYABLE.
10. THE BUS SHALL NOT ENTER ANY LANES; PICKUP AND DROP WILL BE DONE FROM MAIN ROADS ONLY.`,
                                            style: 'tncText',
                                            margin: [8, 6, 8, 6]
                                        }
                                    ]]
                                },
                                layout: {
                                    hLineColor: '#e5e7eb',
                                    vLineColor: '#e5e7eb',
                                    hLineWidth: () => 0.5,
                                    vLineWidth: () => 0.5
                                }
                            }
                        ],
                        margin: [0, 0, 10, 0]
                    },
                    // Right Column: Signature
                    {
                        width: '20%',
                        stack: [
                            {
                                text: 'FOR ' + (invoiceData.CompanyName || 'CHOHAN TOURS & TRAVELS'),
                                style: 'compactLabel',
                                alignment: 'right',
                                margin: [0, 5, 0, 5]
                            },
                            ...(stempImageBase64 ? [{
                                image: stempImageBase64,
                                width: 70,
                                alignment: 'right',
                                margin: [0, 0, 5, 2]
                            }] : []),
                            {
                                table: {
                                    widths: [120],
                                    body: [
                                        [{
                                            height: 60,
                                            text: '',
                                            border: [true, true, true, true],
                                            borderColor: ['#cbd5e1', '#cbd5e1', '#cbd5e1', '#cbd5e1']
                                        }]
                                    ]
                                },
                                layout: 'noBorders',
                                alignment: 'right',
                                margin: [0, 0, 0, 5]
                            },
                            { text: 'Authorized Signatory', style: 'compactLabel', alignment: 'right' },
                            { text: 'E. & O. E.', style: 'compactLabel', italics: true, alignment: 'right', margin: [0, 5, 0, 0] }
                        ]
                    }
                ],
                margin: [0, 10, 0, 10]
            }
        ],

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
            tncText: {
                fontSize: 8,
                lineHeight: 1.4,
                color: '#475569',
                italics: true
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
