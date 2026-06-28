// src/middleware/errorHandler.middleware.js
// Global error handler — catches all unhandled errors

export const errorHandler = (err, req, res, next) => {
  console.error("❌ Global Error:", err.message);
  console.error(err.stack);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

// ── 404 Handler ───────────────────────────────────────────────────────
export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};