import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";
import DetailsSup from "./components/suppliers/detailsSup";
import Suppliers from "./components/suppliers/suppliers";
import UpdateSup from "./components/suppliers/updateSup";
import UserPrivateRoute from "./components/PrivacyComponent/UserPrivateRoute";
import Login from "./components/user/Login";
import Logout from "./components/user/Logout";
import UserList from "./components/user/user";
import "./assets/styles/main.css";
import Page404 from "./components/404/404Page";
import Dashboard from "./components/Dashboard/Graph/Dashboard";
import { useDispatch } from "react-redux";
import Account from "./components/account/account";
import BalanceSheet from "./components/account/balanceSheet";
import DetailAccount from "./components/account/detailAccount";
import IncomeStatement from "./components/account/incomeStatement";
import TrialBalance from "./components/account/trialBalance";
import Designation from "./components/designation/designation";
import DetailDesignation from "./components/designation/detailDesignation";
import UpdateDesignation from "./components/designation/updateDesignation";
import Main from "./components/layouts/Main";
import AddPermission from "./components/role/AddPermission";
import DetailRole from "./components/role/DetailsRole";
import RoleList from "./components/role/role";
import GetAllPrintPage from "./components/printPageSettings/GetAllPrintPage";
import Party from "./components/Party/Party";
import City from "./components/city/City";
import UpdateCity from "./components/city/updateCity";
import StateComponent from "./components/state/State";
import UpdateState from "./components/state/updateState";
import Vendor from "./components/vendor/Vendor";
import Bus from "./components/bus/Bus";
import Branch from "./components/branch/Branch";
import Driver from "./components/driver/Driver";
import GetAllSite from "./components/site/getAllSite";
import BusCategory from "./components/busCategory/busCategory";
import Setup from "./components/setup/Setup";
import Company from "./components/company/Company";
import Fuel from "./components/fuel/Fuel";
import GetAllBookingEntry from "./components/entry/bookingEntry/getAllBookingEntry";
import AddBookingEntry from "./components/entry/bookingEntry/addBookingEntry";
import UpdateBookingEntry from "./components/entry/bookingEntry/updateBookingEntry";
import Helper from "./components/helper/Helper";
import GetAllBusAllotmentToBooking from "./components/busAllotmentBooking/GetAllAllotmentToBooking";
import AllotBus from "./components/busAllotmentBooking/AllotBus";
import GetAllAllotedButUnClosed from "./components/closeDuty/GetAllAllotedButUnClosed";
import GetAllAllotedAndClosed from "./components/closedDuty/GetAllAllotedAndClosed";
import GetAllAllotmentToBookingToClose from "./components/closeDuty/GetAllAllotmentToBookingToClose";
import GetAllSalarySet from "./components/salarysetup/salarysetupmodule";
import GetAllAllotmentToBookingClosed from "./components/closedDuty/GetAllAllotmentToBookingClosed";
import GetAllProformaInvoice from "./components/entry/proformaInvoice/getAllProformaInvoice";
import AddProformaInvoice from "./components/entry/proformaInvoice/addProformaInvoice";
import DetailProformaInvoice from "./components/entry/proformaInvoice/detailProformaInvoice";
import DetailBookingEntry from "./components/entry/bookingEntry/detailBookingEntry";
import UpdateProformaInvoice from "./components/entry/proformaInvoice/updateProformaInvoice";
import DailyExecution from "./components/dailyExecution/dailyExecution";
import GetAllDriverHelperAttendance from "./components/driverHelperAttendance/GetAllDriverHelperAttendance";
import BookingRegister from "./components/bookingRegister/bookingRegister";
import InvoiceRegister from "./components/invoiceRegister/invoiceRegister";
import FuelRegister from "./components/fuelRegister/fuelRegister";
import AdvanceToStaffRegister from "./components/advanceToStaffRegister/advanceToStaffregister";
import ESIPFRegister from "./components/ESIPFRegister/ESIPFRegister";
import AdvanceToStaffEntry from "./components/advanceToStaffEntry/advanceToStaffEntry";
import AddAdvanceToStaffEntryDrawer from "./components/advanceToStaffEntry/addAdvanceToStaffEntryDrawer";
import UpdateAdvanceToStaffEntryDrawer from "./components/advanceToStaffEntry/updateAdvanceToStaffEntryDrawer";
import Salarysetuptable from "./components/salarysetup/salarysetuptable";
import HelperKhuraki from "./components/HelperKhuraki/helperkhuraki";
import Updatesalarysetup from "./components/salarysetup/updatesalarysetup";
import Invoiceentry from "./components/Invoiceentry/invoiceentry";
import AddInvoice from "./components/Invoiceentry/addinvoice";
import UpdateInvoice from "./components/Invoiceentry/updateinvoice";
import Partsmaster from "./components/Partsmaster/partsmaster";
import Repairentry from "./components/Partsmaster/Repairentry";
import RepairEdit from "./components/Partsmaster/RepairEdit";
import Selectbusrepair from "./components/Partsmaster/selectbusreapir";
import RepairPrintdrawer from "./components/Partsmaster/repairprintdrawer";
import KhorakiPrint from "./components/reports/khorakiPrint";
import BusRegisterPrint from "./components/reports/busRegisterPrint";
import RepairRegisterPrint from "./components/reports/repairRegisterPrint";
import AddParts from "./components/Partsmaster/addparts";
import Staff from "./components/Staff/staff";
import StaffAttendence from "./components/staffattendance/staffattendence";
import Addsalaryprocess from "./components/Salaryprocess/addSalaryprocess";
import GetSalaryDetails from "./components/Salaryprocess/Getallsalaryprocess";
import SalaryProcessPrintdrawer from "./components/Salaryprocess/salaryprintdrawer";
import Updatesalaryprocess from "./components/Salaryprocess/updateSalaryprocess";
import GetBusDocumentsDetails from "./components/BusDocuments/GetAllBusDocuments";
import Performainvoicedrawer from "./components/entry/proformaInvoice/performainvoiceprintdrawer";
import Advancetostaffprintdrawer from "./components/advanceToStaffEntry/advancetostaffprintdrawer";
import ReportInvoiceRegister from "./components/reports/ReportInvoiceRegister";
import ProformaInvoiceRegister from "./components/reports/ProformaInvoiceRegister";
import FuelSummeryPrint from "./components/reports/fuelSummery";
import FuelReportPrint from "./components/reports/fuelReport";

import InvoicePrintdrawer from "./components/Invoiceentry/invoiceprintdrawer";
import User from "./components/Useradd/users";
import UpdateUser from "./components/Useradd/updateuser";
import AddProformaInvoiceEntry from "./components/proformaInvoiceEntry/AddProformaInvoiceEntry";
import SalaryRegisterPrint from "./components/reports/salaryRegisterPrint";
import DriverLicenseExpirePrint from "./components/reports/driverLisanceExpirePrint";
import GetAllSalary from "./components/Salaryprocess/GetAllSalary";

function App() {
  const dispatch = useDispatch();
  const userAgent = navigator.userAgent;
  const platform = navigator.platform;
  const language = navigator.language;
  console.log("userAgent", userAgent);
  console.log("platform", platform);
  console.log("language", language);
  return (
    <div className="App container-fluid">
      <BrowserRouter>
        <Main>
          <ToastContainer
            closeButton
            position="bottom-left"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            pauseOnHover
            theme="colored"
          />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/admin/dashboard" element={<Dashboard />}></Route>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="*" element={<Page404 />} />

            {/* ====================================================
                          Supplier Permeation add here 
            ========================================================*/}
            <Route
              element={<UserPrivateRoute permission={"readAll-supplier"} />}
            >
              <Route path="/admin/supplier" exact element={<Suppliers />} />
            </Route>
            <Route
              element={<UserPrivateRoute permission={"readSingle-supplier"} />}
            >
              <Route path="/admin/supplier/:id" element={<DetailsSup />} />
            </Route>
            <Route
              element={<UserPrivateRoute permission={"update-supplier"} />}
            >
              <Route
                path="/admin/supplier/:id/update"
                element={<UpdateSup />}
              />
            </Route>
            {/*================================================
                      proformaInvoice ENtry Permeation add here
               ================================================*/}
            <Route
              path="/admin/proforma-invoice"
              exact
              element={<GetAllProformaInvoice />}
            />
            <Route path="/admin/partsmaster" exact element={<Partsmaster />} />
            <Route path="/admin/partsentry" exact element={<AddParts />} />
            <Route path="/admin/staff" element={<Staff />} />

            <Route
              path="/admin/repairentry/:id"
              exact
              element={<Repairentry />}
            />
            <Route
              path="/admin/repairEdit/:id"
              exact
              element={<RepairEdit />}
            />
            <Route
              path="/admin/selectrepairentry"
              exact
              element={<Selectbusrepair />}
            />
            <Route
              path="/admin/Detailproforma-invoice/:id"
              exact
              element={<DetailProformaInvoice />}
            />
            <Route
              path="/admin/invoiceentry"
              exact
              element={<Invoiceentry />}
            />
            <Route
              path="/admin/performainvoiceprint/:companyId/:invoiceNo"
              element={<Performainvoicedrawer />}
            />
            <Route
              path="/admin/salaryprint/:id"
              element={<SalaryProcessPrintdrawer />}
            />
            <Route
              path="/admin/invoiceprint/:companyId/:invoiceNo"
              element={<InvoicePrintdrawer />}
            />
            <Route path="/admin/repairprint" element={<RepairPrintdrawer />} />
            <Route path="/admin/DailyFuelReg" element={<FuelReportPrint />} />
            <Route path="/admin/FuelRegSumm" element={<FuelSummeryPrint />} />
            <Route
              path="/admin/ProformaInvoiceReg"
              element={<ProformaInvoiceRegister />}
            />
            <Route
              path="/admin/InvoiceReportRegister"
              element={<ReportInvoiceRegister />}
            />
            <Route
              path="/admin/salaryRegister"
              element={<SalaryRegisterPrint />}
            />
            <Route
              path="/admin/DriverLicenseExpirePrint"
              element={<DriverLicenseExpirePrint />}
            />
            <Route path="/admin/khorakiPrint" element={<KhorakiPrint />} />
            <Route
              path="/admin/BusRegisterPrint"
              element={<BusRegisterPrint />}
            />
            <Route
              path="/admin/repairprint"
              element={<RepairRegisterPrint />}
            />
            <Route
              path="/admin/advancetostaffprint/:companyId/:AdvanceNo"
              element={<Advancetostaffprintdrawer />}
            />
            <Route
              path="/admin/staffatten"
              exact
              element={<StaffAttendence />}
            />
            <Route
              path="/admin/slaryprocess"
              exact
              element={<Addsalaryprocess />}
            />

            <Route
              path="/admin/updateslaryprocess/:type/:id2"
              exact
              element={<Updatesalaryprocess />}
            />
            <Route
              path="/admin/slarydetails"
              exact
              element={<GetSalaryDetails />}
            />

            <Route path="/admin/salary" exact element={<GetAllSalary />} />

            <Route
              exact
              path="/admin/Busdocument"
              element={<GetBusDocumentsDetails />}
            />

            <Route
              element={
                <UserPrivateRoute permission={"create-proformaInvoice"} />
              }
            >
              <Route
                path="/admin/add-proformaInvoice/:id"
                element={<AddProformaInvoice />}
              />

              {/* Add Route Extra ProformaInvoice Entry */}
              <Route
                path="/admin/add-proformaInvoiceEntry/"
                element={<AddProformaInvoiceEntry />}
              />

              <Route path="/admin/add-Invoice/:id" element={<AddInvoice />} />
            </Route>
            <Route
              element={
                <UserPrivateRoute permission={"update-proformaInvoice"} />
              }
            >
              <Route
                path="/admin/update-proformaInvoice/:id"
                element={<UpdateProformaInvoice />}
              />
              <Route
                path="/admin/update-Invoice/:id"
                element={<UpdateInvoice />}
              />
            </Route>
            {/*================================================
                     Daily Execution Entry Permeation add here
               ================================================*/}
            <Route
              element={
                <UserPrivateRoute permission={"readAll-dailyExecution"} />
              }
            >
              <Route
                path="/admin/dailyExecution"
                element={<DailyExecution />}
              />
            </Route>
            {/*================================================
                     Daily Driver/Helper Attendance Entry Permeation add here
               ================================================*/}
            <Route
              element={
                <UserPrivateRoute
                  permission={"readAll-driverHelperAttendance"}
                />
              }
            >
              <Route
                path="/admin/driverHelperAttendance"
                element={<GetAllDriverHelperAttendance />}
              />
            </Route>
            {/*================================================
                      BusAllotmentToBooking ENtry Permeation add here
               ================================================*/}
            <Route
              path="/admin/booking-busAllotment"
              exact
              element={<GetAllBusAllotmentToBooking />}
            />
            <Route
              element={
                <UserPrivateRoute permission={"create-bookingBusAllotment"} />
              }
            >
              <Route
                path="/admin/booking-busAllotment/:id"
                element={<AllotBus />}
              />
            </Route>

            {/*================================================
                      BOOKING ENtry Permeation add here
               ================================================*/}
            <Route
              path="/admin/booking-entry"
              exact
              element={<GetAllBookingEntry />}
            />
            <Route
              path="/admin/Detailbooking-entry/:id"
              exact
              element={<DetailBookingEntry />}
            />
            <Route
              element={<UserPrivateRoute permission={"create-bookingEntry"} />}
            >
              <Route
                path="/admin/add-bookingEntry/:id"
                element={<AddBookingEntry />}
              />
            </Route>

            <Route
              element={<UserPrivateRoute permission={"update-bookingEntry"} />}
            >
              <Route
                path="/admin/update-bookingEntry/:id"
                element={<UpdateBookingEntry />}
              />
            </Route>
            {/*================================================
                     DUTY CLOSE Permeation add here
               ================================================*/}
            <Route
              path="/admin/salarysetup"
              exact
              element={<GetAllSalarySet />}
            />
            <Route
              path="/admin/salarysetuptable"
              exact
              element={<Salarysetuptable />}
            />
            <Route
              path="/admin/updatesalarysetup/:id"
              exact
              element={<Updatesalarysetup />}
            />
            <Route
              path="/admin/closeDuty/:id"
              element={<GetAllAllotedButUnClosed />}
            />

            <Route
              path="/admin/closedDuty"
              exact
              element={<GetAllAllotmentToBookingClosed />}
            />
            <Route
              path="/admin/closedDuty/:id"
              element={<GetAllAllotedAndClosed />}
            />
            {/*================================================
                     Advance to Staff Entry Permeation add here
               ================================================*/}
            <Route
              element={
                <UserPrivateRoute permission={"readAll-advanceToStaffEntry"} />
              }
            >
              <Route
                path="/admin/advanceToStaffEntry"
                element={<AdvanceToStaffEntry />}
              />
            </Route>
            {/*================================================
                       Fuel Permeation add here
               ================================================*/}
            <Route path="/admin/fuel" exact element={<Fuel />} />
            {/* 
            <Route element={<UserPrivateRoute permission={"create-fuel"} />}>
              <Route path="/admin/add-booking" element={<AddBooking />} />
            </Route> */}

            {/*================================================
                        Bus Permeation add here
               ================================================*/}
            <Route path="/admin/bus" exact element={<Bus />} />
            {/*================================================
                        Company Permeation add here
               ================================================*/}
            <Route path="/admin/company" exact element={<Company />} />
            {/*================================================
                        Bus category Permeation add here
               ================================================*/}
            <Route path="/admin/bus-category" exact element={<BusCategory />} />
            {/*================================================
                        Booking Entry Permeation add here
               ================================================*/}
            {/* <Route path="/admin/booking-entry" exact element={< />} /> */}
            {/*================================================
                       Product City Permeation add here
               ================================================*/}
            <Route element={<UserPrivateRoute permission={"readAll-city"} />}>
              <Route path="/admin/city" exact element={<City />} />
            </Route>
            <Route element={<UserPrivateRoute permission={"update-city"} />}>
              <Route path="/admin/city/:id/update" element={<UpdateCity />} />
            </Route>
            <Route element={<UserPrivateRoute permission={"readAll-city"} />}>
              <Route path="/admin/user" exact element={<User />} />
            </Route>
            <Route element={<UserPrivateRoute permission={"update-city"} />}>
              <Route path="/admin/user/:id/update" element={<UpdateUser />} />
            </Route>
            {/*================================================
                       Vendor Permeation add here
               ================================================*/}
            <Route element={<UserPrivateRoute permission={"readAll-vendor"} />}>
              <Route path="/admin/vendor" exact element={<Vendor />} />
            </Route>
            <Route
              element={<UserPrivateRoute permission={"readSingle-vendor"} />}
            ></Route>
            <Route
              element={<UserPrivateRoute permission={"update-vendor"} />}
            ></Route>
            {/*================================================
                       Party Permeation add here
               ================================================*/}
            <Route element={<UserPrivateRoute permission={"readAll-party"} />}>
              <Route path="/admin/party" exact element={<Party />} />
            </Route>
            <Route
              element={<UserPrivateRoute permission={"readSingle-party"} />}
            ></Route>
            <Route
              element={<UserPrivateRoute permission={"update-party"} />}
            ></Route>
            {/*================================================
                       Setup  Permeation add here
               ================================================*/}
            <Route element={<UserPrivateRoute permission={"readAll-setup"} />}>
              <Route path="/admin/setup" exact element={<Setup />} />
            </Route>
            <Route
              element={<UserPrivateRoute permission={"readSingle-setup"} />}
            ></Route>
            <Route
              element={<UserPrivateRoute permission={"update-setup"} />}
            ></Route>
            {/*================================================
                       Product Product StateNames Permeation add here
               ================================================*/}
            <Route path="/admin/state" element={<StateComponent />} />
            <Route path="/admin/state/:id/update" element={<UpdateState />} />
            {/*================================================
                      Driver  Permeation add here
               ================================================*/}
            <Route path="/admin/driver" element={<Driver />} />

            {/*================================================
                      Helper  Permeation add here
               ================================================*/}
            <Route element={<UserPrivateRoute permission={"readAll-helper"} />}>
              <Route path="/admin/helper" exact element={<Helper />} />
              <Route
                path="/admin/HelperKhuraki"
                exact
                element={<HelperKhuraki />}
              />
            </Route>
            {/* ==============================================================
                ======================= Branch permiation here ==================== 
                ==============================================================*/}
            <Route path="/admin/branch" element={<Branch />} />
            {/* ==============================================================
                ======================= booking Register permiation here ==================== 
                ==============================================================*/}
            <Route
              element={
                <UserPrivateRoute permission={"readAll-bookingRegister"} />
              }
            ></Route>
            <Route
              path="/admin/bookingRegister"
              element={<BookingRegister />}
            />

            {/* ==============================================================
                ======================= Invoice Register permiation here ==================== 
                ==============================================================*/}
            <Route
              element={
                <UserPrivateRoute permission={"readAll-invoiceRegister"} />
              }
            >
              <Route
                path="/admin/invoiceRegister"
                element={<InvoiceRegister />}
              />
            </Route>

            {/* ==============================================================
                ======================= Fuel Register permiation here ==================== 
                ==============================================================*/}
            <Route
              element={<UserPrivateRoute permission={"readAll-fuelRegister"} />}
            >
              <Route
                path="/admin/fuelRegister"
                exact
                element={<FuelRegister />}
              />
            </Route>
            {/* ==============================================================
                ======================= Advance TO Staff Register permiation here ==================== 
                ==============================================================*/}
            <Route
              element={
                <UserPrivateRoute
                  permission={"readAll-advanceToStaffRegister"}
                />
              }
            >
              <Route
                path="/admin/advanceToStaffRegister"
                exact
                element={<AddAdvanceToStaffEntryDrawer />}
              />
            </Route>
            <Route
              element={
                <UserPrivateRoute
                  permission={"readAll-advanceToStaffRegister"}
                />
              }
            >
              <Route
                path="/admin/UpdateAdvanceToStaffEntryDrawer"
                exact
                element={<UpdateAdvanceToStaffEntryDrawer />}
              />
            </Route>

            {/* ==============================================================
                ======================= Salary  Register permiation here ==================== 
                ==============================================================*/}

            {/* ==============================================================
                ======================= ESIPF  Register permiation here ==================== 
                ==============================================================*/}

            {/*================================================
                     Transaction Permeation add here
               ================================================*/}

            <Route path="/admin/auth/login" exact element={<Login />} />
            <Route path="/admin/auth/logout" exact element={<Logout />} />
            <Route path="/admin/hr/staffs" exact element={<UserList />} />

            <Route path="/admin/role" exact element={<RoleList />} />
            <Route path="/admin/role/:id" element={<DetailRole />} />
            <Route path="/admin/role/permit/:id" element={<AddPermission />} />
            {/*================================================
                       Account Permeation add here
               ================================================*/}
            <Route path="/admin/account" exact element={<Account />} />
            <Route path="/admin/account/:id" element={<DetailAccount />} />
            <Route
              path="/admin/account/trial-balance"
              exact
              element={<TrialBalance />}
            />
            <Route
              path="/admin/account/balance-sheet"
              exact
              element={<BalanceSheet />}
            />
            <Route
              path="/admin/account/income"
              exact
              element={<IncomeStatement />}
            />
            <Route path="/admin/designation" exact element={<Designation />} />
            <Route
              path="/admin/designation/:id"
              element={<DetailDesignation />}
            />
            <Route
              path="/admin/designation/:id/update"
              element={<UpdateDesignation />}
            />
            {/* <Route
              path="/admin/invoice-setting"
              exact
              element={<InvoiceSetting />}
            /> */}
            <Route
              path="/admin/print-page-setting"
              exact
              element={<GetAllPrintPage />}
            />

            {/*================================================
                       Account Permeation add here
               ================================================*/}
            <Route path="/admin/site" element={<GetAllSite />} />
            {/* <Route path="/admin/site/:id" element={<DetailCoupon />} /> */}
          </Routes>
        </Main>
      </BrowserRouter>
    </div>
  );
}

export default App;
