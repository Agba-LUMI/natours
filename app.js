const helmet = require("helmet");
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const bookingRouter = require("./routes/bookingRouter");
const tourRouter = require("./routes/tourRouter");
const userRouter = require("./routes/userRouter");
const AppError = require("./utilities/appError");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xssFilters = require("xss-filters");
const reviewRouter = require("./routes/reviewRouter");
const hpp = require("hpp");
const viewsRouter = require("./routes/viewsRouter");
const cookieParser = require("cookie-parser");
const compression = require("compression");

const globalErrorHandler = require("./controllers/errorHandler");

const app = express();
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Use Helmet to set security-related HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://js.paystack.co",
          "https://checkout.paystack.com",
          "https://www.googletagmanager.com",
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
          "https://paystack.com/public/css/button.min.css",
        ],
        styleSrcElem: [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
          "https://paystack.com/public/css/button.min.css",
        ],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
        connectSrc: [
          "'self'",
          "ws://0.0.0.0:*",
          "wss://*",
          "https://api.paystack.co",
        ],
        frameSrc: ["'self'", "https://checkout.paystack.com"],
        imgSrc: ["'self'", "data:", "https://checkout.paystack.com"],
      },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use((req, res, next) => {
  req.body = JSON.parse(xssFilters.inHTMLData(JSON.stringify(req.body)));
  next();
});
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsAverage",
      "ratingsQuantity",
      "rating",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);
app.use(morgan("dev"));
app.use(compression());

const limit = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 20,
  message: "Too many request from this IP, Please try again after 5mins",
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});
app.use("/api", limit);
app.use("/", viewsRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/bookings", bookingRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} in this server`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
