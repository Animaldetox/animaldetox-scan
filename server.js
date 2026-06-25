const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({ origin: "*" }));

// IMPORTANT : permet recevoir fichiers
app.use(express.json());

// 🧠 FAKE AI (version intelligente simple)
function analyzeImage(fileName) {

  const name = (fileName || "").toLowerCase();

  if (name.includes("choco")) {
    return {
      object: "Chocolate",
      risk_level: "HIGH",
      explanation: "Toxique pour chiens (théobromine)"
    };
  }

  if (name.includes("lily")) {
    return {
      object: "Lily",
      risk_level: "CRITICAL",
      explanation: "Mortel pour chats"
    };
  }

  if (name.includes("onion")) {
    return {
      object: "Onion",
      risk_level: "HIGH",
      explanation: "Dangereux pour chiens et chats"
    };
  }

  return {
    object: "Unknown",
    risk_level: "MEDIUM",
    explanation: "Objet non identifié, prudence recommandée"
  };
}

// TEST
app.get("/", (req, res) => {
  res.send("OK");
});

// ANALYSE IMAGE (simplifiée)
app.post("/analyze", (req, res) => {

  // on simule un fichier (plus tard vraie IA)
  const fakeFileName = req.body?.fileName || "unknown.jpg";

  res.json(analyzeImage(fakeFileName));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log("Running"));
