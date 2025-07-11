const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth.route");
const messageRoutes = require("./routes/message.route");
const { connectDB } = require("./lib/db");
const { app, server } = require("./lib/socket");

dotenv.config();

const __basedir = path.join(__dirname, "..");

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// ✅ Catch-all only after real API routes
if (process.env.NODE_ENV === "production") {
  const frontendDistPath = path.join(__basedir, "../frontend", "dist");
  app.use(express.static(frontendDistPath));

  app.get("/{*splat}", (req, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
  connectDB();
});
