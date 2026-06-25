const response = await client.responses.create({
  model: "gpt-4.1-mini",
  input: [
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: `
Analyse cette image pour un chien ou chat.

Retourne uniquement un texte JSON valide :

{
"type": "PLANT | FOOD | HOUSEHOLD | UNKNOWN",
"object": "nom",
"risk": "LOW | MEDIUM | HIGH | CRITICAL",
"explanation": "explication simple",
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
catch (err) {
  console.log("❌ FULL ERROR:");
  console.log(err);
  console.log("❌ MESSAGE:", err?.message);
  console.log("❌ STACK:", err?.stack);

  return res.status(500).json({
    type: "ERROR",
    explanation: err?.message || "unknown error",
    action: "check render logs"
  });
}
