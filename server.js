const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const OpenAI = require("openai");

const app = express();
app.use(cors());

const upload = multer({ dest: "uploads/" });

// 🔐 OpenAI (clé via Render ENV)
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.get("/", (req, res) => {
  res.send("Animal Detox AI OK");
});

// 🧠 ANALYSE IMAGE IA
app.post("/analyze", upload.single("image"), async (req, res) => {

  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No image uploaded"
      });
    }

    const imageBase64 = fs.readFileSync(req.file.path, {
      encoding: "base64"
    });

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

Analyse cette image et détecte si c'est :
- plante toxique
- aliment dangereux
- produit ménager
- objet inconnu

Réponds UNIQUEMENT en JSON :
{
"type": "PLANT | FOOD | HOUSEHOLD | UNKNOWN",
"object": "nom",
"risk": "LOW | MEDIUM | HIGH | CRITICAL",
"explanation": "explication simple pour propriétaire d'animal",
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

    const text = response.output[0].content[0].text;

    res.json(JSON.parse(text));

    fs.unlinkSync(req.file.path);

  } catch (err) {
    console.log(err);

    res.status(500).json({
      type: "ERROR",
      object: "error",
      risk: "UNKNOWN",
      explanation: "Erreur analyse IA",
      action: "Réessayer"
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Running on port " + PORT));

const response = await client.responses.create({
  model: "gpt-4.1-mini",
  input: [
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: `
Analyse cette image pour un animal (chien/chat).

Retourne UNIQUEMENT du JSON valide :
{
"type": "PLANT | FOOD | HOUSEHOLD | UNKNOWN",
"object": "nom de l'objet",
"risk": "LOW | MEDIUM | HIGH | CRITICAL",
"explanation": "explication simple",
"action": "conseil pour propriétaire d'animal"
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
