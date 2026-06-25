const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");

const app = express();
app.use(cors());

const upload = multer({ dest: "uploads/" });

app.get("/", (req, res) => {
  res.send("Animal Detox API OK");
});

// 🧠 IA SIMULÉE (on branchera OpenAI après)
app.post("/analyze", upload.single("image"), (req, res) => {

  const file = req.file;

  if (!file) {
    return res.json({
      error: "no image"
    });
  }

  // simulation intelligente (étape A)
  const fakeResults = [
    {
      object: "Chocolate",
      risk: "HIGH",
      explanation: "Toxique pour chiens"
    },
    {
      object: "Lily",
      risk: "CRITICAL",
      explanation: "Mortel pour chats"
    },
    {
      object: "Plant unknown",
      risk: "MEDIUM",
      explanation: "Plante potentiellement toxique"
    }
  ];

  const result = fakeResults[Math.floor(Math.random() * fakeResults.length)];

  res.json(result);

  fs.unlinkSync(file.path);
});

app.listen(3000, () => console.log("running"));
