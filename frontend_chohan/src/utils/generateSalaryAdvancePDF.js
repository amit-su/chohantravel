import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

// Initialize fonts
if (pdfFonts.pdfMake && pdfFonts.pdfMake.vfs) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
} else if (pdfFonts.default && pdfFonts.default.pdfMake && pdfFonts.default.pdfMake.vfs) {
    pdfMake.vfs = pdfFonts.default.pdfMake.vfs;
}

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

export const generateSalaryAdvancePDF = async (data) => {
    if (!data || data.length === 0) {
        console.error('No data provided for PDF generation');
        return;
    }

    const firstRecord = data[0];
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const formatCurrency = (amount) => {
        if (!amount && amount !== 0) return '0.00';
        return parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    let companyLogoBase64 = null;
    try {
        companyLogoBase64 = await getBase64ImageFromURL(COMPANY_LOGO_URL);
    } catch (error) {
        console.error("Could not load company logo image", error);
    }

    const tableRows = data.map((item, index) => [
        { text: index + 1, alignment: 'center', style: 'tableCell' },
        { text: item.EmpName || '', style: 'tableCell' },
        { text: item.EmpType || '', style: 'tableCell' },
        { text: item.SiteShortName || '', style: 'tableCell' },
        { text: formatCurrency(item.advanceAmount), alignment: 'right', style: 'tableCell' },
        { text: item.Remark || '', style: 'tableCell' },
        { text: '', style: 'tableCell' } // Signature column
    ]);

    // Calculate Grand Total for the report
    const totalAmount = data.reduce((sum, item) => sum + (parseFloat(item.advanceAmount) || 0), 0);

    const docDefinition = {
        pageSize: 'A4',
        pageMargins: [30, 30, 30, 40],
        content: [
            // --- HEADER ---
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
            ...(companyLogoBase64 ? [{
                image: companyLogoBase64,
                width: 120,
                absolutePosition: { x: 10, y: 35 }
            }] : []),
            {
                text: firstRecord.CompanyName || 'CHOHAN TOURS & TRAVELS',
                style: 'headerTitle',
                alignment: 'center',
                color: 'white',
                margin: [0, -45, 0, 2]
            },
            {
                text: 'FLAT 3A, 2, GREEN ACRES, NAZAR ALI LANE, KOLKATA, 700019, WEST BENGAL',
                style: 'headerSubtitle',
                alignment: 'center',
                color: 'white'
            },
            {
                text: 'GST: 19AKTPC8877A1ZP | PAN: AKTPC8877A',
                style: 'headerDetails',
                alignment: 'center',
                color: 'white',
                margin: [0, 2, 0, 0]
            },

            // --- REPORT TITLE & INFO ---
            {
                text: 'ADVANCE TO STAFF REPORT',
                style: 'reportTitle',
                alignment: 'center',
                margin: [0, 15, 0, 10]
            },
            {
                columns: [
                    {
                        width: 'auto',
                        stack: [
                            { text: [{ text: 'Advance No: ', bold: true }, firstRecord.AdvanceNo || 'N/A'], style: 'infoText' },
                            { text: [{ text: 'Date: ', bold: true }, formatDate(firstRecord.AdvancedDate)], style: 'infoText', margin: [0, 2, 0, 0] }
                        ]
                    }
                ],
                margin: [0, 0, 0, 10]
            },

            // --- DATA TABLE ---
            {
                table: {
                    headerRows: 1,
                    widths: [25, '*', 70, 60, 60, '*', 50],
                    body: [
                        [
                            { text: 'Sl No', style: 'tableHeader', alignment: 'center' },
                            { text: 'Employee Name', style: 'tableHeader' },
                            { text: 'Emp Type', style: 'tableHeader' },
                            { text: 'Sort Name', style: 'tableHeader' },
                            { text: 'Amount', style: 'tableHeader', alignment: 'right' },
                            { text: 'Remark', style: 'tableHeader' },
                            { text: 'Signature', style: 'tableHeader', alignment: 'center' }
                        ],
                        ...tableRows,
                        // --- TOTAL ROW ---
                        [
                            {
                                text: 'Total Amount',
                                colSpan: 4,
                                style: 'totalLabel',
                                alignment: 'right'
                            },
                            {}, {}, {},
                            {
                                text: formatCurrency(totalAmount),
                                style: 'totalValue',
                                alignment: 'right'
                            },
                            {
                                text: '',
                                colSpan: 2,
                                style: 'totalLabel'
                            },
                            {}
                        ]
                    ]
                },
                layout: {
                    fillColor: function (rowIndex, node, columnIndex) {
                        if (rowIndex === 0) return '#1e3a8a';
                        if (rowIndex === node.table.body.length - 1) return '#f1f5f9'; // Total row background
                        return (rowIndex % 2 === 0 ? '#f9fafb' : null);
                    },
                    hLineWidth: (i, node) => (i === 0 || i === 1 || i === node.table.body.length - 1 || i === node.table.body.length) ? 0.5 : 0,
                    vLineWidth: () => 0.1,
                    hLineColor: () => '#cbd5e1',
                    vLineColor: () => '#e5e7eb',
                    paddingLeft: () => 5,
                    paddingRight: () => 5,
                    paddingTop: () => 6,
                    paddingBottom: () => 6
                }
            }
        ],

        styles: {
            headerTitle: {
                fontSize: 16,
                bold: true,
                letterSpacing: 1
            },
            headerSubtitle: {
                fontSize: 8,
                lineHeight: 1.2
            },
            headerDetails: {
                fontSize: 7.5
            },
            reportTitle: {
                fontSize: 14,
                bold: true,
                color: '#1e3a8a',
                decoration: 'underline'
            },
            infoText: {
                fontSize: 9,
                color: '#334155'
            },
            tableHeader: {
                fontSize: 9,
                bold: true,
                color: 'white',
                margin: [0, 2, 0, 2]
            },
            tableCell: {
                fontSize: 8.5,
                color: '#334155',
                margin: [0, 2, 0, 2]
            },
            totalLabel: {
                fontSize: 10,
                bold: true,
                color: '#1e3a8a',
                margin: [0, 4, 0, 4]
            },
            totalValue: {
                fontSize: 10,
                bold: true,
                color: '#1e3a8a',
                margin: [0, 4, 0, 4]
            }
        },
        defaultStyle: {
            font: 'Roboto'
        }
    };

    pdfMake.createPdf(docDefinition).open();
};
