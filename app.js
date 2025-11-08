const rateLimit = require("express-rate-limit");
require("dotenv").config();
const compression = require("compression");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const rolePermissionRoutes = require("./routes/hr/rolePermission/rolePermission.routes");
const permissionRoutes = require("./routes/hr/permission/permission.routes");
const userRoutes = require("./routes/user/user.routes");
const roleRoutes = require("./routes/hr/role/role.routes");
const { partyRoutes } = require("./routes/master/party/party.routes");
const cityRoutes = require("./routes/master/city/city.routes");
const stateRoutes = require("./routes/master/state/state.routes");
const { vendorRoutes } = require("./routes/master/vendor/vendor.routes");
const busRoutes = require("./routes/master/bus/bus.routes");
const branchRoutes = require("./routes/master/branch/branch.routes");
const driverRoutes = require("./routes/master/driver/driver.routes");
const siteRoutes = require("./routes/master/site/site.routes");
const busCategoryRoutes = require("./routes/master/busCategory/busCategory.routes");
const { setupRoutes } = require("./routes/master/setup/setup.routes");
const bookingRoutes = require("./routes/entry/booking/booking.routes");
const companyRoutes = require("./routes/master/company/company.routes");
const bookingTranRoutes = require("./routes/entry/booking/bookingTransaction/bookingTran.routes");
const fuelRoutes = require("./routes/master/fuel/fuel.routes");
const bookingEntryRoutes = require("./routes/bookingEntry/bookingEntry.Routes");
const helperRoutes = require("./routes/master/helper/helper.routes");
const bookingBusAllotmentRoutes = require("./routes/bookingBusAllotment/bookingBusAllotment.Routes");
const bookingHeadRoutes = require("./routes/bookingHead/bookingHead.Routes");
const proformaInvoiceRoutes = require("./routes/proformaInvoice/proformaInvoice.Routes");
const dailyExecutionRoutes = require("./routes/dailyExecution/dailyExecution.Routes");
const attendanceRoutes = require("./routes/driverHelperAttendance/attendance.Routes");
const advanceToStaffEntryRoutes = require("./routes/advanceToStaffEntry/advanceToStaffEntry.routes");
const salarysetupRoutes = require("./routes/Salarysetup/salarysetup.routes");
const invoicetranferRoutes = require("./routes/Invoicetransfer/invoicetransfer.Routes");
const InvoiceRoutes = require("./routes/Invoiceentry/invoiceentry.Rotes");
const RepairRoutes = require("./routes/Busrepair/busrepair.Routes");
const BuspartsRoutes = require("./routes/BusParts/busparts.Routes");
const StaffRoutes = require("./routes/staff/staff.routes");
const attendancestaffRoutes = require("./routes/staffattendence/staffattendence.routes");
const salarydetailssetupRoutes = require("./routes/SalaryProcess/salaryprocess.routes");
const BusdocRouter = require("./routes/BusDocuments/busdocuments.routes");
const salaryadjustRoutes = require("./routes/Salaryadjust/salaryadjust.routes");
const UsersRoutes = require("./routes/Usersadd/users.routes");
const Dashboard = require("./routes/dashboard/dashboard.routes");

/* variables */
// express app instance
const app = express();

// holds all the allowed origins for cors access
let allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5000",
  "http://103.171.180.91",
  "http://chohanui.etechnie.com",
  "https://app.chohantoursandtravels.com",
  "http://localhost:4200",
];

// limit the number of requests from a single IP address
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per `window` (here, per 15 minutes)
  standardHeaders: false, // Disable rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/* Middleware */
// for compressing the response body
app.use(compression());
// helmet: secure express app by setting various HTTP headers. And serve cross origin resources.
//app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
// morgan: log requests to console in dev environment
//app.use(morgan("dev"));
// allows cors access from allowedOrigins array
app.use(
  cors({
    origin: true, // reflect the request origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "*",
    credentials: true, // if needed for cookies or auth headers
  })
);

// Trust the first proxy in front of the app
app.set("trust proxy", 1);

// parse requests of content-type - application/json
app.use(express.json({ extended: true }));

/* Authentication and Authorization Routes */

app.use("/v1/user", limiter, userRoutes);
app.use("/v1/role", roleRoutes);
app.use("/v1/role-permission", rolePermissionRoutes);
app.use("/v1/permission", permissionRoutes);

// -------------- MASTER ROUTES --------------

app.use("/v1/party", partyRoutes);
app.use("/v1/city", cityRoutes);
app.use("/v1/state", stateRoutes);
app.use("/v1/vendor", vendorRoutes);
app.use("/v1/bus", busRoutes);
app.use("/v1/branch", branchRoutes);
app.use("/v1/driver", driverRoutes);
app.use("/v1/site", siteRoutes);
app.use("/v1/busCategory", busCategoryRoutes);
app.use("/v1/setup", setupRoutes);
app.use("/v1/company", companyRoutes);
app.use("/v1/fuel", fuelRoutes);
app.use("/v1/helper", helperRoutes);

// -------- ENTRY ROUTES ------------
app.use("/v1/dashboard", Dashboard);
app.use("/v1/bookingTran", bookingTranRoutes);
app.use("/v1/booking", bookingRoutes);
app.use("/v1/bookingEntry", bookingEntryRoutes);
app.use("/v1/bookingHead", bookingHeadRoutes);
app.use("/v1/bookingBusAllotment", bookingBusAllotmentRoutes);
app.use("/v1/proformaInvoice", proformaInvoiceRoutes);
app.use("/v1/dailyExecution", dailyExecutionRoutes);
app.use("/v1/driverHelperAttendance", attendanceRoutes);
app.use("/v1/advanceToStaffEntry", advanceToStaffEntryRoutes);
app.use("/v1/salarysetup", salarysetupRoutes);
app.use("/v1/invoicetransfer", invoicetranferRoutes);
app.use("/v1/invoiceentry", InvoiceRoutes);
app.use("/v1/busrepair", RepairRoutes);
app.use("/v1/busparts", BuspartsRoutes);
app.use("/v1/staff", StaffRoutes);
app.use("/v1/staffatten", attendancestaffRoutes);
app.use("/v1/salarydetails", salarydetailssetupRoutes);
app.use("/v1/busdocuments", BusdocRouter);
app.use("/v1/salaryadjust", salaryadjustRoutes);
app.use("/v1/users", UsersRoutes);

module.exports = app;
