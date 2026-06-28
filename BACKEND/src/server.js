// src/server.js
// Express app entry point

import express    from "express";
import cors       from "cors";
import morgan     from "morgan";
import helmet     from "helmet";
import dotenv     from "dotenv";
import connectDB  from "./config/db.config.js";
import researchRoutes from "./routes/research.routes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.middleware.js";

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Connect to MongoDB ────────────────────────────────────────────────
connectDB();

// ── Middleware ────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin:      process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health check route ────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AI Investment Research API is running",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes ────────────────────────────────────────────────────────
app.use("/api/research", researchRoutes);

// ── Error Handlers ────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

// ── Start Server ──────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔬 Research API: http://localhost:${PORT}/api/research`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}\n`);
});

export default app;