const AppError = require(`${__dirname}/../utils/appError`);
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  return new AppError(
    {
      english: "Duplicate field value Please use another email!",
      arabic: "قيمة الحقل المكررة:يرجى استخدام قيمة مختلفة!",
    },
    400
  );
};

const handleJWTError = () =>
  new AppError(
    {
      english: "Invalid token. Please log in again!",
      arabic: "رمز غير صالح. يرجى تسجيل الدخول مرة اخرى!",
    },
    401
  );

const handleJWTExpiredError = () =>
  new AppError(
    {
      english: "Your token has expired! Please log in again.",
      arabic: "انتهت صلاحية رمزك. يرجى تسجيل الدخول مرة اخرى!",
    },
    401
  );

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const sendErrorProd = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith("/api")) {
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    return res.status(500).json({
      status: "error",
      message: {
        english: "Something went wrong!",
        arabic: "حدث خطأ ما",
      },
    });
  }

  // B) RENDERED WEBSITE
  // A) Operational, trusted error: send message to client
  if (err.isOperational) {
    console.log(err);
    return res.status(err.statusCode).render("error", {
      title: "Something went wrong!",
      msg: err.message,
    });
  }
  // B) Programming or other unknown error: don't leak error details
  // 1) Log error
  console.error("ERROR 💥", err);
  // 2) Send generic message
  return res.status(err.statusCode).render("error", {
    title: "Something went wrong!",
    msg: "Please try again later.",
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  let error = { ...err };
  error.message = err.message;

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => ({
      messages: e.message, // Assuming the message is an object with english and arabic properties
    }));
    console.log(errors[0].messages.english);
    console.log(errors[0].messages.arabic);
    return res.status(400).json({ messages: errors[0].messages });
  }
  if (error.name === "CastError") error = handleCastErrorDB(error);
  if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  if (error.name === "JsonWebTokenError") error = handleJWTError();
  if (error.name === "ValidationError") error = handleValidationErrorDB(error);
  if (error.name === "TokenExpiredError") error = handleJWTExpiredError();
  sendErrorProd(error, req, res);
};
