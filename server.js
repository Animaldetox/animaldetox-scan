const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ROUTE TEST (IMPORTANT)
app.get("/", (req, res) => {
  res.send("✅ Animal Detox API OK");
});

// ROUTE SCANNER
app.post("/analyze", (req, res) => {
  res.json({
    object: "chocolate",
    risk_level: "HIGH",
    explanation: "Toxique pour chiens (théobromine)"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server OK on port " + PORT);
});
{
  "name": "animaldetox",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  }
}
