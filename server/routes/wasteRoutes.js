const express = require("express");
const router = express.Router();

const WasteReport =
require("../models/WasteReport");

router.get("/", async (req,res)=>{
  const reports =
  await WasteReport.find();

  res.json(reports);
});

module.exports = router;