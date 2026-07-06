const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { notFound, errorHandler } = require("./middleware/error.middleware");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Debug logging — password redacted
app.use((req, res, next) => {
    console.log(`\n[${req.method}] ${req.url}`);
    console.log("Content-Type:", req.headers['content-type']);
    if (req.body && typeof req.body === 'object') {
        const safeBody = { ...req.body };
        if ('password' in safeBody) safeBody.password = '[REDACTED]';
        console.log("Body:", safeBody);
    }
    next();
});

// Routes
const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => res.json({ message: "Task Manager API Running" }));

const taskRoutes = require("./routes/task.routes");
app.use("/api/tasks", taskRoutes);

// Must come after all routes
app.use(notFound);

// Must be last — Express identifies this as an error handler by its 4 arguments
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});