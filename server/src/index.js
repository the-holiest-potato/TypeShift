import express from "express";
import cors from "cors";
import "dotenv/config";
import authRoutes from "./routes/authRoutes.js";
import testRoutes from "./routes/testRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration for production
const corsOptions = {
  origin: [
    process.env.FRONTEND_URL || "http://localhost:5173",
    "https://type-shift-gamma.vercel.app" // Allow Vercel deployment
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tests", testRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "TypeShift Backend is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
