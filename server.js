const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// test
app.get("/", (req, res) => {
  res.send("Animal Detox API OK");
});

// API scan (simulation IA)
app.post("/analyze", (req, res) => {
  res.json({
    object: "chocolate",
    risk_level: "HIGH",
    explanation: "Toxique pour chiens (théobromine)"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running");
});
