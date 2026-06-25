{
  "name": "animaldetox-api",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.5",
    "multer": "^1.4.5",
    "openai": "^4.0.0"
  }
}.post("/analyze", upload.single("image"), (req, res) => {

  const fileName = req.file?.originalname?.toLowerCase() || "";

  let result;

  // 🌿 PLANTES
  if (fileName.includes("lily") || fileName.includes("tulip")) {
    result = {
      type: "PLANT",
      object: "Plant toxic",
      risk: "CRITICAL",
      explanation: "Très toxique pour chats (risque mortel)",
      action: "Vétérinaire urgent"
    };
  }

  // 🍫 ALIMENTS
  else if (fileName.includes("choco") || fileName.includes("chocolate")) {
    result = {
      type: "FOOD",
      object: "Chocolate",
      risk: "HIGH",
      explanation: "Toxique pour chiens (théobromine)",
      action: "Surveillance + vétérinaire si ingestion"
    };
  }

  // 🧴 PRODUITS MÉNAGERS
  else if (fileName.includes("bleach") || fileName.includes("clean")) {
    result = {
      type: "HOUSEHOLD",
      object: "Cleaning product",
      risk: "HIGH",
      explanation: "Produit corrosif dangereux",
      action: "Contact vétérinaire immédiat"
    };
  }

  // DEFAULT
  else {
    result = {
      type: "UNKNOWN",
      object: "Unknown item",
      risk: "MEDIUM",
      explanation: "Objet non identifié, prudence recommandée",
      action: "Surveiller l’animal"
    };
  }

  res.json(result);
});
