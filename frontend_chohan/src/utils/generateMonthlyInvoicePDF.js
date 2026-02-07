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

const bufferToBase64 = (buffer) => {
    if (!buffer) return null;
    if (typeof buffer === 'string') {
        if (buffer.startsWith('data:image')) return buffer;
        return `data:image/png;base64,${buffer}`;
    }
    const byteData = buffer.data || buffer;
    if (!byteData || (!Array.isArray(byteData) && !ArrayBuffer.isView(byteData))) {
        return null;
    }
    try {
        const bytes = new Uint8Array(byteData);
        let binary = '';
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return `data:image/png;base64,${window.btoa(binary)}`;
    } catch (error) {
        console.error("Error converting buffer to base64:", error);
        return null;
    }
};

export const generateMonthlyInvoicePDF = async (data) => {
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

    const paymentQrBase64 = bufferToBase64(invoiceData.payment_qr);

    const tripDetailsRows = data.map((item, index) => {
        const routeDate = item.RouteNo ? formatDate(item.RouteNo) : '';
        const billMonth = item.BillMonth ? new Date(item.BillMonth).toLocaleString('default', { month: 'long', year: 'numeric' }) : '';

        return [
            { text: index + 1, alignment: 'center', style: 'tableCell' },
            {
                stack: [
                    { text: item.TripDesc || '', bold: true },
                    { text: `${item.BusCategoryName || ''} - ${item.SittingCapacity || ''} Seater`, fontSize: 6, color: '#64748b' },
                    { text: `Date: ${routeDate} | Month: ${billMonth}`, fontSize: 6, color: '#64748b' }
                ],
                style: 'tableCell'
            },
            { text: item.BusQty || '0', alignment: 'center', style: 'tableCell' },
            { text: formatCurrency(item.Rate), alignment: 'right', style: 'tableCell' },
            { text: formatCurrency(item.Amt), alignment: 'right', style: 'tableCell' }
        ];
    });

    const docDefinition = {
        pageSize: 'A4',
        pageMargins: [30, 30, 30, 40],
        content: [
            {
                canvas: [{
                    type: 'rect',
                    x: -30,
                    y: -5,
                    w: 595,
                    h: 50,
                    color: '#0891b2' // Cyan Blue for Monthly Invoice
                }]
            },
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
            {
                text: 'MONTHLY INVOICE',
                style: 'compactTitle',
                alignment: 'center',
                margin: [0, 8, 0, 8]
            },
            {
                columns: [
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
                                                        { text: invoiceData.gstNo, style: 'compactText' }
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
                    {
                        width: '45%',
                        stack: [
                            { text: 'INVOICE DETAILS', style: 'sectionLabel', alignment: 'right', margin: [0, 0, 0, 3] },
                            {
                                table: {
                                    widths: ['*', 'auto'],
                                    body: [
                                        [{ text: 'Invoice No:', style: 'compactLabel', alignment: 'left', border: [false, false, false, false] }, { text: invoiceData.RefInvoiceNo, style: 'compactInvoiceNo', alignment: 'right', border: [false, false, false, false] }],
                                        [{ text: 'Date:', style: 'compactLabel', alignment: 'left', border: [false, false, false, false] }, { text: formatDate(invoiceData.MonthlyInvDate), style: 'compactText', alignment: 'right', border: [false, false, false, false] }],
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
                                    lightHorizontalLines: () => false,
                                    lightVerticalLines: () => false,
                                    fillColor: () => '#f9fafb'
                                }
                            }
                        ]
                    }
                ],
                margin: [0, 0, 0, 8]
            },
            {
                text: 'SERVICE DETAILS',
                style: 'sectionLabel',
                margin: [0, 0, 0, 3]
            },
            {
                table: {
                    headerRows: 1,
                    widths: [25, '*', 30, 70, 70],
                    body: [
                        [
                            { text: 'S.No', style: 'compactTableHeader', alignment: 'center' },
                            { text: 'Description', style: 'compactTableHeader' },
                            { text: 'Qty', style: 'compactTableHeader', alignment: 'center' },
                            { text: 'Rate', style: 'compactTableHeader', alignment: 'right' },
                            { text: 'Amount', style: 'compactTableHeader', alignment: 'right' }
                        ],
                        ...tripDetailsRows
                    ]
                },
                layout: {
                    fillColor: function (rowIndex) {
                        return (rowIndex === 0) ? '#0891b2' : (rowIndex % 2 === 0 ? '#f9fafb' : null);
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
            {
                columns: [
                    {
                        width: '*',
                        stack: [
                            { text: 'PAYMENT INFORMATION', style: 'sectionLabel', alignment: 'left', margin: [0, 0, 0, 5] },
                            {
                                table: {
                                    widths: ['*'],
                                    body: [[{
                                        columns: [
                                            {
                                                width: '60%',
                                                stack: [
                                                    { text: [{ text: 'PAN NO: ', style: 'compactLabel' }, { text: invoiceData.BranchPanno, style: 'compactText' }] },
                                                    { text: [{ text: 'GST No: ', style: 'compactLabel' }, { text: invoiceData.BranchGSTNo, style: 'compactText' }], margin: [0, 0, 0, 4] },
                                                    { text: 'OUR BANK DETAILS', style: 'compactLabel', decoration: 'underline', margin: [0, 0, 0, 2] },
                                                    { text: invoiceData.BankAcName, style: 'compactBankName' },
                                                    { text: [{ text: 'Bank: ', style: 'compactLabel' }, { text: invoiceData.BankName, style: 'compactText' }] },
                                                    { text: [{ text: 'A/c No: ', style: 'compactLabel' }, { text: invoiceData.BankAcNo, style: 'compactText' }] },
                                                    { text: [{ text: 'IFSC: ', style: 'compactLabel' }, { text: invoiceData.BankIFSCode, style: 'compactText' }] }
                                                ]
                                            },
                                            {
                                                width: '40%',
                                                stack: [
                                                    ...(paymentQrBase64 ? [
                                                        { text: 'Scan to Pay', fontSize: 8, bold: true, color: '#64748b', alignment: 'center', margin: [0, 0, 0, 5] },
                                                        { image: paymentQrBase64, width: 120, height: 80, alignment: 'center' }
                                                    ] : [])
                                                ],
                                                alignment: 'center'
                                            }
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
                    {
                        width: 200,
                        table: {
                            widths: ['*', 70],
                            body: [
                                [
                                    { text: 'Gross Total', style: 'summaryLabel', border: [false, true, false, false], borderColor: ['#e5e7eb', '#cbd5e1', '#e5e7eb', '#e5e7eb'] },
                                    { text: formatCurrency(totals.grossAmount), style: 'summaryValue', alignment: 'right', border: [false, true, false, false], borderColor: ['#e5e7eb', '#cbd5e1', '#e5e7eb', '#e5e7eb'] }
                                ],
                                [
                                    { text: 'Toll & Parking', style: 'summaryLabel', border: [false, false, false, false] },
                                    { text: formatCurrency(totals.TollParkingAmt), style: 'summaryValue', alignment: 'right', border: [false, false, false, false] }
                                ],
                                ...(totals.cgstPer > 0 ? [[
                                    { text: `CGST (${totals.cgstPer}%)`, style: 'summaryLabel', border: [false, false, false, false] },
                                    { text: formatCurrency(totals.cgstAmt), style: 'summaryValue', alignment: 'right', border: [false, false, false, false] }
                                ]] : []),
                                ...(totals.sgstPer > 0 ? [[
                                    { text: `SGST (${totals.sgstPer}%)`, style: 'summaryLabel', border: [false, false, false, false] },
                                    { text: formatCurrency(totals.sgstAmt), style: 'summaryValue', alignment: 'right', border: [false, false, false, false] }
                                ]] : []),
                                ...(totals.igstPer > 0 ? [[
                                    { text: `IGST (${totals.igstPer}%)`, style: 'summaryLabel', border: [false, false, false, false] },
                                    { text: formatCurrency(totals.igstAmt), style: 'summaryValue', alignment: 'right', border: [false, false, false, false] }
                                ]] : []),
                                [
                                    { text: 'Round Off', style: 'summaryLabel', border: [false, false, false, false] },
                                    { text: formatCurrency(totals.roundOff), style: 'summaryValue', alignment: 'right', border: [false, false, false, false] }
                                ],
                                [
                                    { text: 'Net Payable', style: 'totalLabel', border: [false, false, false, false], fillColor: '#0891b2', color: 'white' },
                                    { text: formatCurrency(totals.netAmount), style: 'totalValue', alignment: 'right', border: [false, false, false, false], fillColor: '#0891b2', color: 'white' }
                                ]
                            ]
                        }
                    }
                ],
                margin: [0, 0, 0, 6]
            },
            {
                text: [
                    { text: 'Amount in Words: ', style: 'compactLabel' },
                    { text: `${invoiceData.AmtInWords || ''} Only`, style: 'amountWords' }
                ],
                margin: [0, 5, 0, 10]
            },
            {
                columns: [
                    {
                        width: '60%',
                        stack: [
                            { text: 'TERMS & CONDITIONS:', style: 'sectionLabel', margin: [0, 5, 0, 5] },
                            {
                                text: `1. Payment should be made by Cheque/DD in favor of ${invoiceData.CompanyName}.\n2. Any discrepancy found in this invoice should be reported within 24 hours.\n3. Subject to jurisdiction of local courts.`,
                                style: 'tncText'
                            }
                        ]
                    },
                    {
                        width: '40%',
                        stack: [
                            { text: 'FOR ' + (invoiceData.CompanyName || 'CHOHAN TOURS & TRAVELS'), style: 'compactLabel', alignment: 'right', margin: [0, 0, 0, 30] },
                            { text: 'Authorized Signatory', style: 'compactLabel', alignment: 'right' }
                        ]
                    }
                ]
            }
        ],
        styles: {
            compactCompanyName: { fontSize: 14, bold: true },
            compactAddress: { fontSize: 7, lineHeight: 1.2 },
            compactDetails: { fontSize: 6.5 },
            compactTitle: { fontSize: 13, bold: true, color: '#0891b2', letterSpacing: 1.5 },
            sectionLabel: { fontSize: 7.5, bold: true, color: '#64748b' },
            compactPartyName: { fontSize: 9, bold: true, color: '#1e293b' },
            compactLabel: { fontSize: 7, bold: true, color: '#64748b' },
            compactText: { fontSize: 7, color: '#334155' },
            compactInvoiceNo: { fontSize: 9, bold: true, color: '#0891b2' },
            compactTableHeader: { fontSize: 8, bold: true, color: 'white' },
            tableCell: { fontSize: 7, color: '#334155' },
            summaryLabel: { fontSize: 7, color: '#64748b' },
            summaryValue: { fontSize: 7, color: '#334155' },
            totalLabel: { fontSize: 9, bold: true },
            totalValue: { fontSize: 9, bold: true },
            amountWords: { fontSize: 7.5, bold: true, color: '#0891b2', italics: true },
            compactBankName: { fontSize: 8, bold: true },
            tncText: { fontSize: 6.5, color: '#475569' }
        },
        defaultStyle: { font: 'Roboto' }
    };

    pdfMake.createPdf(docDefinition).open();
};
