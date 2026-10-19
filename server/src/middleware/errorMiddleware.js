// Runs when no route matched the request
export const notFound = (req, res, next) => {
  const error = new Error(`Not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

// Catches every error and sends it back as JSON
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong on the server';

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  }

  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid id';
  }

  if (err.code === 11000) {
    statusCode = 400;
    message = 'That value already exists';
  }

  res.status(statusCode).json({
    message,
    // Only show the stack trace while developing
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};
