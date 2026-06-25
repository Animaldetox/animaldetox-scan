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

    // ⚠️ check image
    if (!req.file) {
      return res.status(400).json({
        type: "ERROR",
        risk: "UNKNOWN",
        explanation: "No image uploaded",
        action: "Send image file"
      });
    }

    // 📸 convert image to base64
    const imageBase64 = fs.readFileSync(req.file.path, {
      encoding: "base64"
    });

    // 🧠 OPENAI VISION CALL
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `
Tu es un expert vétérinaire.

Analyse cette image et détecte si c’est dangereux pour un chien ou un chat.

Réponds UNIQUEMENT en JSON valide :

{
"type": "PLANT | FOOD | HOUSEHOLD | UNKNOWN",
"object": "nom de l'objet",
"risk": "LOW | MEDIUM | HIGH | CRITICAL",
"explanation": "explication simple pour propriétaire d’animal",
"action": "conseil vétérinaire"
}
              `
            },
            {
              type: "input_image",
              image_base64: imageBase64
            }
          ]
        }
      ]
    });

    // 📦 extraction réponse IA
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
        action: "Fix JSON parsing"
      };
    }

    // 🧹 cleanup file
    fs.unlinkSync(req.file.path);

    res.json(parsed);

  } catch (err) {

    console.log("❌ SERVER ERROR:", err);

    res.status(500).json({
      type: "ERROR",
      object: "server_error",
      risk: "UNKNOWN",
      explanation: err?.message || "unknown error",
      action: "check OpenAI key / Render logs"
    });
  }
});

// 🚀 START SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🐾 Animal Detox running on port", PORT);
});
console.log("ENV KEY =", process.env.OPENAI_API_KEY);
