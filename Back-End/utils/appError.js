class AppError extends Error {
    constructor(message, statusCode) {
        super(typeof message === 'object' ? JSON.stringify(message) : message);
        this.statusCode = statusCode;
        // this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        this.message = message;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;
