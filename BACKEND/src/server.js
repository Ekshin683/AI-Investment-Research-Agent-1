import express   from "express";
import cors      from "cors";
import morgan    from "morgan";
import helmet    from "helmet";
import dotenv    from "dotenv";
import connectDB from "./config/db.config.js";
import researchRoutes from "./routes/research.routes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.middleware.js";

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5000;

// Connect MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://ai-investment-research-agent-1.vercel.app",
    "https://ai-investment-research-agent-1-h4kiiip02.vercel.app",
    process.env.FRONTEND_URL,
  ].filter(Boolean),
  credentials: true,
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    success:   true,
    message:   "AI Investment Research API",
    version:   "1.0.0",
    endpoints: {
      health:   "/api/health",
      research: "/api/research",
    },
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success:   true,
    message:   "AI Investment Research API is running",
    version:   "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes ────────────────────────────────────────────────────────
app.use("/api/research", researchRoutes);  // ← THIS LINE IS CRITICAL

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`\n🚀 Server running on http://0.0.0.0:${PORT}`);
  console.log(`📋 Health check: http://0.0.0.0:${PORT}/api/health`);
  console.log(`🔬 Research API: http://0.0.0.0:${PORT}/api/research`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}\n`);
});

export default app;