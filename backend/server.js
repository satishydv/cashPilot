import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

// Import Routes
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import vendorRoutes from "./routes/vendor.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";
import webhookRoutes from "./routes/webhook.routes.js";

// Import Error Middleware
import { notFound, errorHandler } from "./middleware/error.middleware.js";

import cors from "cors";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors({ origin: true, credentials: true }));

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/webhooks", webhookRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Connect to Database and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});