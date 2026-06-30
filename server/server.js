const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

require("dotenv").config();

const WasteReport = require("./models/WasteReport");

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   CLOUDINARY CONFIGURATION
========================= */

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ecoaudit",
    allowed_formats: ["jpg", "jpeg", "png"]
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
          ? req.file.path
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