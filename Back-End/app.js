const express = require("express");
const dbConnect = require("./dbConnect");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
// for secure
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");

const cookieParser = require("cookie-parser");
const errorControllers = require(`${__dirname}/controllers/errorControllers`);

dotenv.config();

if (process.env.NODE_ENV === "development") {
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
}

const userRoutes = require("./routes/userRoutes");
const journeyRoutes = require(`${__dirname}/routes/journeyRoutes`);

dbConnect();
const app = express();
app.use(express.static(path.join(__dirname, "public")));

// Enable CORS with specific options
app.use(cors({
  origin: '*', // Allow all origins (adjust as needed for production)
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware to set security headers
app.use(helmet());

// Middleware to set Referrer-Policy header
app.use((req, res, next) => {
  res.setHeader('Referrer-Policy', 'no-referrer-when-downgrade');
  next();
});

app.use(xss());
app.use(mongoSanitize());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use("/api", limiter);

app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/journeys", journeyRoutes);

app.use(errorControllers);
module.exports = app;
