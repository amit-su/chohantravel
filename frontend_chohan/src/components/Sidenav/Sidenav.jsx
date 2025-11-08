import {
  CodeSandboxOutlined,
  PartitionOutlined,
  HomeOutlined,
  MenuUnfoldOutlined,
  PushpinOutlined,
} from "@ant-design/icons";
import {
  FaAddressCard,
  FaBusSimple,
  FaCity,
  FaFileInvoice,
  FaHandHoldingHand,
  FaPeopleGroup,
} from "react-icons/fa6";
import { Menu } from "antd";
import React from "react";
import {
  GiArchiveRegister,
  GiFuelTank,
  GiTakeMyMoney,
  GiTicket,
} from "react-icons/gi";
import { NavLink } from "react-router-dom";
import getPermissions from "../../utils/getPermissions";
import { FaMapMarkedAlt, FaCodeBranch } from "react-icons/fa";
import { MdBusAlert } from "react-icons/md";
import { SlOrganization } from "react-icons/sl";
import { MdInsertChart } from "react-icons/md";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { FaTicket } from "react-icons/fa6";
import { BsFillFuelPumpFill } from "react-icons/bs";
import { IoDocumentTextOutline } from "react-icons/io5";
import { HiViewGridAdd } from "react-icons/hi";
import { FaHandsHelping } from "react-icons/fa";
import { MdAssignmentTurnedIn } from "react-icons/md";
import { TbReportMoney, TbTruckReturn } from "react-icons/tb";
import { RiCalendarCloseFill } from "react-icons/ri";
import { IoTodayOutline } from "react-icons/io5";
import { FaUserNurse } from "react-icons/fa";
import { GiMoneyStack } from "react-icons/gi";
import { BsCash } from "react-icons/bs";

const Sidenav = () => {
  const permissions = getPermissions();

  const hasPermission = (item) => {
    return permissions?.includes(item ? item : "");
  };
  const menu = [
    {
      label: (
        <NavLink to="/admin/dashboard">
          <span>Dashboard</span>
        </NavLink>
      ),
      key: "dashboard",
      icon: <HomeOutlined style={{ fontSize: "18px" }} />,
    },
    {
      label: "ENTRY",
      key: "entry",
      icon: <MdInsertChart style={{ fontSize: "18px" }} />,
      children: [
        {
          label: (
            <NavLink to="/admin/proforma-invoice">
              <span>Proforma Invoice</span>
            </NavLink>
          ),
          key: "proformaInvoice",
          icon: <FaTicket style={{ fontSize: "18px" }} />,
        },

        {
          label: (
            <NavLink to="/admin/booking-entry">
              <span>Booking Entry</span>
            </NavLink>
          ),
          key: "bookingEntry",
          icon: <HiViewGridAdd style={{ fontSize: "18px" }} />,
        },
        {
          label: (
            <NavLink to="/admin/booking-busAllotment">
              <span>Booking Bus Allotment</span>
            </NavLink>
          ),
          key: "bookingBusAllotment",
          icon: <MdAssignmentTurnedIn style={{ fontSize: "18px" }} />,
        },
        {
          label: (
            <NavLink to="/admin/invoiceentry">
              <span>Invoice Entry</span>
            </NavLink>
          ),
          key: "Invoice",
          icon: <FaAddressCard />,
        },

        // {
        //   label: (
        //     <NavLink to="/admin/closedDuty">
        //       <span>Closed Duty </span>
        //     </NavLink>
        //   ),
        //   key: "closedDuty",
        //   icon: <RiCalendarCloseFill style={{ fontSize: "18px" }} />,
        // },
        {
          label: (
            <NavLink to="/admin/dailyExecution">
              <span>Daily Execution </span>
            </NavLink>
          ),
          key: "dailyExecution",
          icon: <IoTodayOutline style={{ fontSize: "18px" }} />,
        },
        {
          label: (
            <NavLink to="/admin/driverHelperAttendance">
              <span>Driver/Helper Attendance</span>
            </NavLink>
          ),
          key: "driverHelperAttendance",
          icon: <FaUserNurse style={{ fontSize: "18px" }} />,
        },
        {
          label: (
            <NavLink to="/admin/slarydetails">
              <span>Salary Process</span>
            </NavLink>
          ),
          key: "salaryprocess",
          icon: <FaUserNurse style={{ fontSize: "18px" }} />,
        },

        {
          label: (
            <NavLink to="/admin/staffatten">
              <span>Staff Attendance</span>
            </NavLink>
          ),
          key: "StaffAttendance",
          icon: <FaUserNurse style={{ fontSize: "18px" }} />,
        },
        {
          label: (
            <NavLink to="/admin/AdvanceToStaffEntry">
              <span>Advance To Staff Entry</span>
            </NavLink>
          ),
          key: "AdvanceToStaffEntry",
          icon: <GiMoneyStack style={{ fontSize: "21px" }} />,
        },
        {
          label: (
            <NavLink to="/admin/selectrepairentry">
              <span>Reapir Entry </span>
            </NavLink>
          ),
          key: "Repair entry",
          icon: <PushpinOutlined style={{ fontSize: "22px" }} />,
        },
        {
          label: (
            <NavLink to="/admin/fuel">
              <span>Fuel</span>
            </NavLink>
          ),
          key: "fuel",
          icon: <BsFillFuelPumpFill style={{ fontSize: "18px" }} />,
        },
      ],
    },
    {
      label: "REPORTS",
      key: "reports",
      icon: <IoDocumentTextOutline style={{ fontSize: "18px" }} />,
      children: [
        // {
        //   label: (
        //     <NavLink
        //       to="/admin/bookingRegister"
        //       onClick={() => {
        //         window.location.reload(true);
        //         window.location.href = "/admin/bookingRegister";
        //       }}
        //     >
        //       <span>Booking Register</span>
        //     </NavLink>
        //   ),
        //   key: "bookingRegister",
        //   icon: <GiArchiveRegister style={{ fontSize: "20px" }} />,
        // },
        // {
        //   label: (
        //     <NavLink
        //       to="/admin/invoiceRegister"
        //       onClick={() => {
        //         window.location.reload(true);
        //         window.location.href = "/admin/invoiceRegister";
        //       }}
        //     >
        //       <span>Invoice Register</span>
        //     </NavLink>
        //   ),
        //   key: "invoiceRegister",
        //   icon: <FaFileInvoice style={{ fontSize: "18px" }} />,
        // },
        // {
        //   label: (
        //     <NavLink
        //       to="/admin/fuelRegister"
        //       onClick={() => {
        //         window.location.reload(true);
        //         window.location.href = "/admin/fuelRegister";
        //       }}
        //     >
        //       <span>Fuel Register</span>
        //     </NavLink>
        //   ),
        //   key: "fuelRegister",
        //   icon: <GiFuelTank style={{ fontSize: "20px" }} />,
        // },
        // {
        //   label: (
        //     <NavLink
        //       to="/admin/advanceToStaffRegister"
        //       onClick={() => {
        //         window.location.reload(true);
        //         window.location.href = "/admin/advanceToStaffRegister";
        //       }}
        //     >
        //       <span>Advance To Staff Register</span>
        //     </NavLink>
        //   ),
        //   key: "advanceToStaffRegister",
        //   icon: <FaPeopleGroup style={{ fontSize: "20px" }} />,
        // },
        // {
        //   label: (
        //     <NavLink
        //       to="/admin/salaryRegister"
        //       onClick={() => {
        //         window.location.reload(true);
        //         window.location.href = "/admin/salaryRegister";
        //       }}
        //     >
        //       <span>Salary Register</span>
        //     </NavLink>
        //   ),
        //   key: "salaryRegister",
        //   icon: <GiTakeMyMoney style={{ fontSize: "20px" }} />,
        // },
        {
          label: (
            <NavLink
              to="/admin/ESIPFRegister"
              onClick={(e) => {
                e.preventDefault(); // Prevent the default behavior of the NavLink
                window.open("/admin/repairprint", "_blank"); // Open the link in a new tab
              }}
            >
              <span>Repair Register </span>
            </NavLink>
          ),
          key: "ESIPFRegister",
          icon: <TbReportMoney style={{ fontSize: "20px" }} />,
        },
        {
          label: (
            <NavLink
              to="/admin/khorakiPrint"
              onClick={(e) => {
                e.preventDefault(); // Prevent the default behavior of the NavLink
                window.open("/admin/khorakiPrint", "_blank"); // Open the link in a new tab
              }}
            >
              <span>Khoraki Summary </span>
            </NavLink>
          ),
          key: "khorakiPrint",
          icon: <TbReportMoney style={{ fontSize: "20px" }} />,
        },
        {
          label: (
            <NavLink
              to="/admin/BusRegisterPrint"
              onClick={(e) => {
                e.preventDefault(); // Prevent the default behavior of the NavLink
                window.open("/admin/BusRegisterPrint", "_blank"); // Open the link in a new tab
              }}
            >
              <span>Bus Booking </span>
            </NavLink>
          ),
          key: "BusBooking",
          icon: <TbReportMoney style={{ fontSize: "20px" }} />,
        },
        {
          label: (
            <NavLink
              to="/admin/DailyFuelReg"
              onClick={(e) => {
                e.preventDefault(); // Prevent the default behavior of the NavLink
                window.open("/admin/DailyFuelReg", "_blank"); // Open the link in a new tab
              }}
            >
              <span>Daily Fuel Register </span>
            </NavLink>
          ),
          key: "BusBooking",
          icon: <TbReportMoney style={{ fontSize: "20px" }} />,
        },
        {
          label: (
            <NavLink
              to="/admin/FuelRegSumm"
              onClick={(e) => {
                e.preventDefault(); // Prevent the default behavior of the NavLink
                window.open("/admin/FuelRegSumm", "_blank"); // Open the link in a new tab
              }}
            >
              <span>Bus wise Fuel Summary </span>
            </NavLink>
          ),
          key: "BusBooking",
          icon: <TbReportMoney style={{ fontSize: "20px" }} />,
        },
        {
          label: (
            <NavLink
              to="/admin/ProformaInvoiceReg"
              onClick={(e) => {
                e.preventDefault(); // Prevent the default behavior of the NavLink
                window.open("/admin/ProformaInvoiceReg", "_blank"); // Open the link in a new tab
              }}
            >
              <span>Proforma Invoice Register </span>
            </NavLink>
          ),
          key: "BusBooking",
          icon: <TbReportMoney style={{ fontSize: "20px" }} />,
        },
        {
          label: (
            <NavLink
              to="/admin/InvoiceReportRegister"
              onClick={(e) => {
                e.preventDefault(); // Prevent the default behavior of the NavLink
                window.open("/admin/InvoiceReportRegister", "_blank"); // Open the link in a new tab
              }}
            >
              <span>Invoice Register</span>
            </NavLink>
          ),
          key: "BusBooking",
          icon: <TbReportMoney style={{ fontSize: "20px" }} />,
        },
        {
          label: (
            <NavLink
              to="/admin/salaryRegister"
              onClick={(e) => {
                e.preventDefault(); // Prevent the default behavior of the NavLink
                window.open("/admin/salaryRegister", "_blank"); // Open the link in a new tab
              }}
            >
              <span>Salary Register</span>
            </NavLink>
          ),
          key: "SalaryReg",
          icon: <TbReportMoney style={{ fontSize: "20px" }} />,
        },
        {
          label: (
            <NavLink
              to="/admin/DriverLicenseExpirePrint"
              onClick={(e) => {
                e.preventDefault(); // Prevent the default behavior of the NavLink
                window.open("/admin/DriverLicenseExpirePrint", "_blank"); // Open the link in a new tab
              }}
            >
              <span>Driver License Exp</span>
            </NavLink>
          ),
          key: "SalaryReg",
          icon: <TbReportMoney style={{ fontSize: "20px" }} />,
        },
      ],
    },

    {
      label: "MASTER",
      key: "master",
      icon: <CodeSandboxOutlined style={{ fontSize: "18px" }} />,
      children: [
        {
          label: (
            <NavLink to="/admin/bus-category">
              <span>Bus Category</span>
            </NavLink>
          ),
          key: "busCategory",
          icon: <MdBusAlert style={{ fontSize: "18px" }} />,
        },
        {
          label: (
            <NavLink to="/admin/bus">
              <span>Bus</span>
            </NavLink>
          ),
          key: "bus",
          icon: <FaBusSimple />,
        },
        {
          label: (
            <NavLink to="/admin/Busdocument">
              <span>Bus Documents</span>
            </NavLink>
          ),
          key: "busdocuments",
          icon: <FaBusSimple />,
        },
        {
          label: (
            <NavLink to="/admin/party">
              <span>Party</span>
            </NavLink>
          ),
          key: "party",
          icon: <MenuUnfoldOutlined />,
        },
        {
          label: (
            <NavLink to="/admin/salarysetuptable">
              <span>Salary Setup </span>
            </NavLink>
          ),
          key: "salarysetup",
          icon: <BsCash style={{ fontSize: "22px" }} />,
        },
        // {
        //   label: (
        //     <NavLink to="/admin/partsmaster">
        //       <span>Parts Master </span>
        //     </NavLink>
        //   ),
        //   key: "Parts master",
        //   icon: <PartitionOutlined style={{ fontSize: "22px" }} />,
        // },

        {
          label: (
            <NavLink to="/admin/site">
              <span>Site</span>
            </NavLink>
          ),
          key: "site",
          icon: <GiTicket />,
        },
        {
          label: (
            <NavLink to="/admin/driver">
              <span>Driver</span>
            </NavLink>
          ),
          key: "driver",
          icon: <FaAddressCard />,
        },

        {
          label: (
            <NavLink to="/admin/helper">
              <span>Helper</span>
            </NavLink>
          ),
          key: "helper",
          icon: <FaHandsHelping />,
        },
        {
          label: (
            <NavLink to="/admin/staff">
              <span>Staff</span>
            </NavLink>
          ),
          key: "Staff",
          icon: <FaAddressCard />,
        },
        // {
        //   label: (
        //     <NavLink to="/admin/HelperKhuraki">
        //       <span>Helper Khuraki</span>
        //     </NavLink>
        //   ),
        //   key: "HelperKhuraki",
        //   icon: <FaHandsHelping />,
        // },
        {
          label: (
            <NavLink to="/admin/setup">
              <span>Setup</span>
            </NavLink>
          ),
          key: "setup",
          icon: <SlOrganization />,
        },
        {
          label: (
            <NavLink to="/admin/vendor">
              <span>Vendor</span>
            </NavLink>
          ),
          key: "vendor",
          icon: <FaHandHoldingHand />,
        },
        {
          label: (
            <NavLink to="/admin/city">
              <span> City</span>
            </NavLink>
          ),
          key: "city",
          icon: <FaCity />,
        },
        {
          label: (
            <NavLink to="/admin/state">
              <span>State</span>
            </NavLink>
          ),
          key: "state",
          icon: <FaMapMarkedAlt />,
        },
        {
          label: (
            <NavLink to="/admin/company">
              <span>Company</span>
            </NavLink>
          ),
          key: "company",
          icon: <HiBuildingOffice2 />,
        },

        {
          label: (
            <NavLink to="/admin/branch">
              <span>Branch</span>
            </NavLink>
          ),
          key: "branch",
          icon: <FaCodeBranch />,
        },
        {
          label: (
            <NavLink to="/admin/user">
              <span> User</span>
            </NavLink>
          ),
          key: "User",
          icon: <FaCity />,
        },
        {
          label: (
            <NavLink to="/admin/role">
              <span> Role </span>
            </NavLink>
          ),
          key: "role",
          icon: <FaCity />,
        },
      ],
    },

    // (hasPermission("create-saleInvoice") ||
    //   hasPermission("readAll-saleInvoice")) && {
    //   label: "SALE",
    //   key: "sale",
    //   icon: <MinusSquareOutlined />,
    //   children: [
    //     {
    //       label: (
    //         <NavLink to="/admin/sale">
    //           <span>Sale</span>
    //         </NavLink>
    //       ),
    //       key: "sales",
    //       icon: <UnorderedListOutlined />,
    //     },
    //     {
    //       label: (
    //         <NavLink to="/admin/customer">
    //           <span>Customers</span>
    //         </NavLink>
    //       ),
    //       key: "customers",
    //       icon: <UserOutlined />,
    //     },
    //     {
    //       label: (
    //         <NavLink to="/admin/hold-sale">
    //           <span>Draft Sale List</span>
    //         </NavLink>
    //       ),
    //       key: "holdSale",
    //       icon: <OrderedListOutlined />,
    //     },
    //     {
    //       label: (
    //         <NavLink to="/admin/sale-return-list">
    //           <span>Sale Return List</span>
    //         </NavLink>
    //       ),
    //       key: "saleReturn",
    //       icon: <OrderedListOutlined />,
    //     },
    //   ],
    // },
    // (hasPermission("create-vat") || hasPermission("readAll-vat")) && {
    //   label: (
    //     <NavLink to="/admin/vat-tax">
    //       <span>VAT/TAX</span>
    //     </NavLink>
    //   ),
    //   key: "vat/tax",
    //   icon: <MoneyCollectOutlined />,
    // },
    // (hasPermission("create-account") || hasPermission("readAll-account")) && {
    //   label: "ACCOUNTS",
    //   key: "accounts",
    //   icon: <WalletOutlined />,
    //   children: [
    //     {
    //       label: (
    //         <NavLink to="/admin/account/">
    //           <span>Account</span>
    //         </NavLink>
    //       ),
    //       key: "accountList",
    //       icon: <UnorderedListOutlined />,
    //     },
    //     {
    //       label: (
    //         <NavLink to="/admin/transaction/">
    //           <span>Transaction</span>
    //         </NavLink>
    //       ),
    //       key: "transactionList",
    //       icon: <UnorderedListOutlined />,
    //     },
    //   ],
    // },
    // {
    //   label: "REPORT",
    //   key: "report",
    //   icon: <FlagOutlined />,
    //   children: [
    //     {
    //       label: (
    //         <NavLink to="/admin/account/trial-balance">
    //           <span>Trial Balance</span>
    //         </NavLink>
    //       ),
    //       key: "trialBalance",
    //       icon: <FileDoneOutlined />,
    //     },
    //     {
    //       label: (
    //         <NavLink to="/admin/account/balance-sheet">
    //           <span>Balance Sheet</span>
    //         </NavLink>
    //       ),
    //       key: "balanceSheet",
    //       icon: <FileOutlined />,
    //     },
    //     {
    //       label: (
    //         <NavLink to="/admin/account/income">
    //           <span>Income Statement</span>
    //         </NavLink>
    //       ),
    //       key: "incomeStatement",
    //       icon: <FileSyncOutlined />,
    //     },
    //   ],
    // },

    // (hasPermission("create-user") || hasPermission("readAll-user")) && {
    //   label: "HR",
    //   key: "hr",
    //   icon: <TeamOutlined />,
    //   children: [
    //     {
    //       label: (
    //         <NavLink to="/admin/hr/staffs">
    //           <span>Staffs</span>
    //         </NavLink>
    //       ),
    //       key: "staffs",
    //       icon: <UsergroupAddOutlined />,
    //     },
    //     {
    //       label: (
    //         <NavLink to="/admin/role">
    //           <span>Role & Permissions</span>
    //         </NavLink>
    //       ),
    //       key: "roleAndPermissions",
    //       icon: <UserSwitchOutlined />,
    //     },
    //     {
    //       label: (
    //         <NavLink to="/admin/designation/">
    //           <span>Designation</span>
    //         </NavLink>
    //       ),
    //       key: "designation",
    //       icon: <SolutionOutlined />,
    //     },
    //   ],
    // },
    // (hasPermission("create-quote") || hasPermission("readAll-quote")) && {
    //   label: (
    //     <NavLink to="/admin/quote">
    //       <span>QUOTE</span>
    //     </NavLink>
    //   ),
    //   key: "quote",
    //   icon: <BiSolidQuoteLeft />,
    // },
    // {
    //   label: "SETTINGS",
    //   key: "settings",
    //   icon: <SettingOutlined />,
    //   children: [
    //     {
    //       label: (
    //         <NavLink to="/admin/invoice-setting">
    //           <span>Invoice Settings</span>
    //         </NavLink>
    //       ),
    //       key: "invoiceSetting",
    //       icon: <SettingOutlined />,
    //     },
    //     (hasPermission("create-pageSize") ||
    //       hasPermission("readAll-pageSize")) && {
    //       label: (
    //         <NavLink to="/admin/print-page-setting">
    //           <span>Print Page Settings</span>
    //         </NavLink>
    //       ),
    //       key: "printPageSetting",
    //       icon: <SettingOutlined />,
    //     },
    //   ],
    // },
  ];

  return (
    <div className="">
      <Menu theme="dark" mode="inline" items={menu} />
    </div>
  );
};

export default Sidenav;
