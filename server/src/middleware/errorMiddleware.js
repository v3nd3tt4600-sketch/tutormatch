// Runs when no route matched the request
export const notFound = (req, res, next) => {
  const error = new Error(`Not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

// Catches every error and sends it back as JSON
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    message: err.message || 'Something went wrong on the server',
    // Only show the stack trace while developing
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};
