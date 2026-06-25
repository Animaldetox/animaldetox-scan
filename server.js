const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// TEST SÛR
app.get("/", (req, res) => {
  res.send("✅ Animal Detox API OK");
});

// DEBUG SIMPLE (GET)
app.get("/analyze", (req, res) => {
  res.json({ status: "GET OK" });
});

// VRAI ENDPOINT
app.post("/analyze", (req, res) => {
  console.log("POST received");

  res.json({
    object: "chocolate",
    risk_level: "HIGH",
    explanation: "Toxique pour chiens (théobromine)"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on " + PORT);
});
