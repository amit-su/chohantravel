import { configureStore } from "@reduxjs/toolkit";
import siteReducer from "../features/site/siteSlice";
import PurchaseReturnListSlice from "../features/PurchaseReturnList/PurchaseReturnListSlice";
import SaleReturnListSlice from "../features/SaleReturnList/SaleReturnListSlice";
import accountReducer from "../features/account/accountSlice";
import stateReducer from "../features/state/stateSlice";
import vendorReducer from "../features/vendor/vendorSlice";
import partyReducer from "../features/party/partySlice";
import setupReducer from "../features/setup/setupSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";
import designationReducer from "../features/designation/designationSlice";
import roleSlice from "../features/hr/role/roleSlice";
import branchReducer from "../features/branch/branchSlice";
import cityReducer from "../features/city/citySlice";
import busReducer from "../features/bus/busSlice";
import busCategoryReducer from "../features/busCategory/busCategorySlice";
import ProductSortListSlice from "../features/branch/branchSlice";
import fuelReducer from "../features/fuel/fuelSlice";
import settingReducer from "../features/setting/settingSlice";
import supplierReducer from "../features/supplier/supplierSlice";
import supplierPaymentReducer from "../features/supplierPayment/supplierPaymentSlice";
import userReducer from "../features/user/userSlice";
import printPageSlice from "../features/printPage/printPageSlice";
import quoteSlice from "../features/quote/quoteSlice";
import driverReducer from "../features/driver/driverSlice";
import bookingReducer from "../features/booking/bookingSlice";
import localBookingReducer from "../features/localBusBooking/localBusBookingSlice";
import companyReducer from "../features/company/comapnySlice";
import bookingTranReducer from "../features/booking/bookingTran.Slice";
import bookingEntryReducer from "../features/bookingEntry/bookingsEntrySlice";
import bookingHeadReducer from "../features/booking/bookingHeadSlice";
import helperReducer from "../features/helper/helperSlice";
import bookingBusAllotmentReducer from "../features/bookingBusAllotment/bookingBusAllotmentSlice";
import proformaInvoiceReducer from "../features/proformaInvoice/proformaInvoiceSlice";
import localProformaSlice from "../features/localProformaInvoice/localProformaSlice";
import dailyExecutionReducer from "../features/dailyExecution/dailyExecutionSlice";
import powerbiInvoiceReducer from "../features/powerBi/powerBiInvoiceSlice";
import powerbiBookingRegisterReducer from "../features/powerBi/powerBiBookingRegisterSlice";
import powerbiFuelRegisterReducer from "../features/powerBi/powerBiBookingRegisterSlice";
import driverhelperAttendanceReducer from "../features/driverHelperAttendance/driverHelperAttendanceSlice";
import powerbiAdvanceToStaffReducer from "../features/powerBi/powerBiAdvanceToStaffRegisterSlice";
import powerbiSalaryRegisterReducer from "../features/powerBi/powerBiSalaryRegisterSlice";
import powerbiESIPFRegisterReducer from "../features/powerBi/powerBiESPFRegisterSlice";
import advanceToStaffEntryReducer from "../features/advanceToStaffEntry/advanceToStaffEntrySlice";
import salarysetupEntryReducer from "../features/Salarysetupslice/salarysetslice";
import staffslice from "../features/staff/staffslice";
import staffattendenceslice from "../features/staffatendence/staffattendenceslice";
const store = configureStore({
  reducer: {
    suppliers: supplierReducer,
    proformaInvoices: proformaInvoiceReducer,
    dailyExecutions: dailyExecutionReducer,
    branches: branchReducer,
    companies: companyReducer,
    fuels: fuelReducer,
    purchaseReturn: PurchaseReturnListSlice,
    setups: setupReducer,
    saleReturn: SaleReturnListSlice,
    users: userReducer,
    supplierPayments: supplierPaymentReducer,
    accounts: accountReducer,
    dashboard: dashboardReducer,
    buses: busReducer,
    busCategories: busCategoryReducer,
    city: cityReducer,
    designations: designationReducer,
    StateNames: stateReducer,
    vendors: vendorReducer,
    bookings: bookingReducer,
    bookingTrans: bookingTranReducer,
    bookingHead: bookingHeadReducer,
    drivers: driverReducer,
    helpers: helperReducer,
    role: roleSlice,
    localBookingsData: localBookingReducer,
    localProforma: localProformaSlice,
    bookingEntry: bookingEntryReducer,
    setting: settingReducer,
    productSortList: ProductSortListSlice,
    sites: siteReducer,
    print: printPageSlice,
    quote: quoteSlice,
    party: partyReducer,
    advanceToStaffEntry: advanceToStaffEntryReducer,
    bookingBusAllotments: bookingBusAllotmentReducer,
    powerbiInvoice: powerbiInvoiceReducer,
    powerbiBookingRegister: powerbiBookingRegisterReducer,
    powerbiFuelRegister: powerbiFuelRegisterReducer,
    powerbiAdvanceToStaffRegister: powerbiAdvanceToStaffReducer,
    powerbiSalaryRegister: powerbiSalaryRegisterReducer,
    powerbiESIPFRegister: powerbiESIPFRegisterReducer,
    driverHelperAttendance: driverhelperAttendanceReducer,
    salarysetup:salarysetupEntryReducer,
    staff:staffslice,
    staffatten:staffattendenceslice

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          "product/loadSingleProduct/fulfilled",
          "vatTax/loadVatTaxStatement/fulfilled",
          "transaction/deleteStaff/fulfilled",
          "productCategory/loadSingleProductCategory/fulfilled",
          "productSubCategory/loadSingleProductSubCategory/fulfilled",
          "productBrand/loadSingleProductBrand/fulfilled",
          "supplier/loadSupplier/fulfilled",
          "customer/loadSingleCustomer/fulfilled",
          "sale/loadSingleSale/fulfilled",
          "user/loadSingleStaff/fulfilled",
          "designation/loadSingleDesignation/fulfilled",
          "user/loadSingleStaff/fulfilled",
        ],
      },
    }).concat(),
});

export default store;
