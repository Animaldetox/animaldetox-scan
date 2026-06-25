const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const OpenAI = require("openai");

const app = express();

app.use(cors());
app.use(express.json());

// 📁 upload config
const upload = multer({ dest: "uploads/" });

// 🔐 OpenAI client (Render ENV)
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 🟢 test API
app.get("/", (req, res) => {
  res.send("Animal Detox API OK");
});

// 🧠 ANALYSE IMAGE
app.post("/analyze", upload.single("image"), async (req, res) => {

  try {

    // ❌ check image
    if (!req.file) {
      return res.status(400).json({
        type: "ERROR",
        object: "no_file",
        risk: "UNKNOWN",
        explanation: "Aucune image reçue",
        action: "Envoyer une image"
      });
    }

    // 📸 image en base64
    const imageBase64 = fs.readFileSync(req.file.path, {
      encoding: "base64"
    });

    console.log("OPENAI KEY OK =", !!process.env.OPENAI_API_KEY);

    // 🧠 OPENAI CALL (FORMAT CORRIGÉ)
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `
Tu es un vétérinaire expert.

Analyse cette image et dis si c’est dangereux pour un chien ou un chat.

Réponds UNIQUEMENT en JSON valide :

{
"type": "PLANT | FOOD | HOUSEHOLD | UNKNOWN",
"object": "nom de l'objet",
"risk": "LOW | MEDIUM | HIGH | CRITICAL",
"explanation": "explication simple pour un propriétaire d’animal",
"action": "conseil vétérinaire"
}
              `
            },
            {
              type: "input_image",
              image_url: `data:image/jpeg;base64,${imageBase64}`
            }
          ]
        }
      ]
    });

    // 📦 extraction réponse
    const text = response.output[0].content[0].text;

    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch (e) {
      parsed = {
        type: "ERROR",
        object: "invalid_json",
        risk: "UNKNOWN",
        explanation: text,
        action: "Erreur format IA"
      };
    }

    // 🧹 cleanup fichier
    fs.unlinkSync(req.file.path);

    res.json(parsed);

  } catch (err) {

    console.log("❌ SERVER ERROR:", err);

    res.status(500).json({
      type: "ERROR",
      object: "server_error",
      risk: "UNKNOWN",
      explanation: err?.message || "unknown error",
      action: "check OpenAI API key / logs Render"
    });
  }
});

// 🚀 START SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🐾 Animal Detox API running on port", PORT);
});
