const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

require("dotenv").config();

const WasteReport = require("./models/WasteReport");

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   SERVE UPLOADED IMAGES
========================= */

app.use("/uploads", express.static("uploads"));

/* =========================
   MULTER CONFIGURATION
========================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + path.extname(file.originalname);

    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage
});

/* =========================
   MONGODB CONNECTION
========================= */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.log("❌ MongoDB Error:", err);
  });

/* =========================
   HOME ROUTE
========================= */

app.get("/", (req, res) => {
  res.send("🌱 EcoAudit Backend Running!");
});

/* =========================
   GET ALL REPORTS
========================= */

app.get("/api/waste", async (req, res) => {
  try {
    const reports = await WasteReport
      .find()
      .sort({ createdAt: -1 });

    console.log(`📥 Sent ${reports.length} logs`);

    res.json(reports);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
});

/* =========================
   ADD NEW REPORT
========================= */

app.post(
  "/api/waste",
  upload.single("image"),
  async (req, res) => {

    try {

      console.log("📤 New Data Received");

      const report = new WasteReport({
        category: req.body.category,
        weight: Number(req.body.weight),
        latitude: Number(req.body.latitude),
        longitude: Number(req.body.longitude),

        image: req.file
          ? `http://localhost:5000/uploads/${req.file.filename}`
          : ""
      });

      await report.save();

      console.log("✅ Saved to MongoDB");

      res.status(201).json({
        success: true,
        data: report
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message: error.message
      });

    }

  }
);

/* =========================
   SERVER START
========================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});