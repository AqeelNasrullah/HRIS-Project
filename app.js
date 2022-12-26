//importing packages
const express = require("express");
const cors = require("cors");

//importing files
const uncaughtException = require("./api/middlewares/errors/uncaughtException");

//importing routes
const TwilioRoute=require("./api/routes/twilio.routes")
const UsersRoute = require("./api/routes/users.routes");
const EmployeesRoute = require("./api/routes/employees.routes");
const JobsRoutes = require("./api/routes/jobs.routes");
const AssetsRoutes = require("./api/routes/assets.routes");
const OnboardingRoutes = require("./api/routes/onboarding.routes");
const OffboardingRoutes = require("./api/routes/offboarding.routes");
const TimeoffRoutes = require("./api/routes/timeoffs.routes");
const BenefitsRoutes = require("./api/routes/benefits.routes");
const ReportsRoutes=require("./api/routes/reports.routes");
const AnalyticsRoutes=require("./api/routes/analytics.routes")

//importing db
const { connectDB } = require("./config/database");

//importing middlewarers
const errorMiddleware = require("./api/middlewares/errors/error");
const checkAuth = require("./api/middlewares/Auth/checkAuth");

uncaughtException();

//initiating app
const app = express();

//handling bady parsers
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));

//handling cors
app.options("", cors()); // enable pre-flight request for ALL requests
app.use(cors());

//header middleware
app.use(function (req, res, next) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Content-Security-Policy", "default-src *");
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );
  next();
});

connectDB();

app.use("/api/twilio",TwilioRoute)

app.use("/api/users", UsersRoute);

app.use("/api/reports",ReportsRoutes);

app.use("/api/analytics",AnalyticsRoutes)

//authentication
app.use(checkAuth);

app.use("/api/employees", EmployeesRoute);

app.use("/api/jobs", JobsRoutes);

app.use("/api/assets", AssetsRoutes);

app.use("/api/onboardings", OnboardingRoutes);

app.use("/api/offboardings", OffboardingRoutes);

app.use("/api/timeoffs", TimeoffRoutes);

app.use("/api/benefits", BenefitsRoutes);


//middleware
app.use(errorMiddleware);

module.exports = app;
