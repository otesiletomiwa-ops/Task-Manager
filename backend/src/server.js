const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware (must be before routes)
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug middleware
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  console.log("Body:", req.body);
  next();
});

// Routes
const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

const taskRoutes = require("./routes/task.routes");
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => res.json({ message: "Task Manager API Running" }));

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
