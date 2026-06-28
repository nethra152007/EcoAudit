const express = require("express");
const cors = require("cors");
const fs = require("fs");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("EcoAudit Backend Running!");
});

// GET all waste logs
app.get("/api/waste", (req, res) => {

  const reports = JSON.parse(
    fs.readFileSync("./data.json", "utf8")
  );

  res.json(reports);
});

// POST new waste log
app.post("/api/waste", (req, res) => {

  const reports = JSON.parse(
    fs.readFileSync("./data.json", "utf8")
  );

  reports.push(req.body);

  fs.writeFileSync(
    "./data.json",
    JSON.stringify(reports, null, 2)
  );

  res.json({
    success: true,
    data: req.body
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});