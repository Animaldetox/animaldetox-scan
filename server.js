const express = require("express");
const cors = require("cors");

const app = express();

// 🔥 CORS ULTRA OPEN (important pour CodePen)
app.use(cors({ origin: "*" }));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("OK");
});

app.post("/analyze", (req, res) => {
  res.json({
    risk_level: "HIGH",
    explanation: "Toxique pour chiens (test OK)"
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("running"));
