import * as XLSX from 'xlsx';
import dayjs from 'dayjs';

/**
 * Generate NEFT Excel for Bank Transfer (Salary or Advance)
 * @param {Array} data - Array of filtered objects (with NetSalary, bankIFSC, bankAcNo, name)
 * @param {object} companyDetails - Dynamic company data
 * @param {string} dateLabel - Label for the month/year
 * @param {string} remittanceDetails - Description for the transfer (e.g., 'Salary', 'Advance')
 */
export const generateBankTransferExcel = (data, companyDetails, dateLabel = '', remittanceDetails = 'Salary') => {
    if (!data || data.length === 0) {
        console.error('No bank records to export');
        return;
    }

    const excelData = data.map((item, index) => {
        return {
            'Transaction_Ref_No': index + 1,
            'Amount': parseFloat(item.NetSalary || 0),
            'IFSC_Code': item.bankIFSC || '',
            'Debit_Account': companyDetails?.BankAcNo || '',
            'Beneficiary_Account_type': 10,
            'Bank_Account_Number': item.bankAcNo || '',
            'Beneficiary_Name': item.name?.toUpperCase() || '',
            'Remittance_Details': remittanceDetails
        };
    });

    // Add total amount row
    const totalAmount = excelData.reduce((sum, item) => sum + item.Amount, 0);
    excelData.push({
        'Transaction_Ref_No': 'TOTAL',
        'Amount': totalAmount,
        'IFSC_Code': '',
        'Debit_Account': '',
        'Beneficiary_Account_type': '',
        'Bank_Account_Number': '',
        'Beneficiary_Name': '',
        'Remittance_Details': ''
    });

    const wb = XLSX.utils.book_new();

    // Prepare Letter Header Layout (AOA: Array of Arrays)
    const headers = [
        ['Dated:', dayjs().format('MMMM DD, YYYY')],
        [''],
        ['To'],
        ['The Manager,'],
        [companyDetails?.BankName],
        [companyDetails?.BankBranchAddr],
        [companyDetails?.City],
        [''],
        ['Sub: BULK NEFT'],
        [`Current Account No-${companyDetails?.BankAcNo || 'N/A'}`],
        [''],
        ['Dear Sir,'],
        [`Kindly debit our C/Account No.${companyDetails?.BankAcNo || 'N/A'} for transfer Salary to the undermentioned staff given below`],
        [''] // row 14
    ];

    const ws = XLSX.utils.aoa_to_sheet(headers);

    // Add JSON data starting from row 15 (A15)
    XLSX.utils.sheet_add_json(ws, excelData, {
        origin: 'A15',
        skipHeader: false
    });

    // Set column widths for better readability
    ws['!cols'] = [
        { wch: 15 }, // Transaction_Ref_No
        { wch: 12 }, // Amount
        { wch: 15 }, // IFSC_Code
        { wch: 18 }, // Debit_Account
        { wch: 22 }, // Beneficiary_Account_type
        { wch: 22 }, // Bank_Account_Number
        { wch: 30 }, // Beneficiary_Name
        { wch: 18 }  // Remittance_Details
    ];

    XLSX.utils.book_append_sheet(wb, ws, `${remittanceDetails} Export`);

    const filename = `${remittanceDetails}_Bank_Transfer_${dayjs().format('YYYY_MM_DD')}.xlsx`;
    XLSX.writeFile(wb, filename);
};
