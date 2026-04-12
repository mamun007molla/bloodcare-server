const errorHandler = (err, req, res, next) => {
  const status  = err.status  || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    error: true,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

const notFound = (req, res) => {
  res.status(404).json({ error: true, message: `Route ${req.originalUrl} not found` });
};

module.exports = { errorHandler, notFound };
