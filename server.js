const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("OK");
});

app.post("/analyze", (req, res) => {

  const fileName = (req.body.fileName || "").toLowerCase();

  let result;

  if (fileName.includes("choco")) {
    result = {
      object: "Chocolate",
      risk_level: "HIGH",
      explanation: "Toxique pour chiens"
    };
  }
  else if (fileName.includes("lily")) {
    result = {
      object: "Lily",
      risk_level: "CRITICAL",
      explanation: "Mortel pour chats"
    };
  }
  else if (fileName.includes("onion")) {
    result = {
      object: "Onion",
      risk_level: "HIGH",
      explanation: "Dangereux pour chiens et chats"
    };
  }
  else {
    result = {
      object: "Unknown",
      risk_level: "LOW",
      explanation: "Pas de danger détecté (simulation)"
    };
  }

  res.json(result);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log("running"));
