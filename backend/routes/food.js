
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

// 1. HARDCODE YOUR KEY DIRECTLY HERE (Just to test)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
router.post("/foodTextAnalysis", async (req, res) => {
  try {
    let { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "No imageBase64 received" });
    }

    // 2. USE THE VERIFIED 2025 MODEL NAME
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", 
    });

    // 3. STRIP THE DATA PREFIX (Very important for Base64)
    // This removes "data:image/jpeg;base64," if it exists
    const cleanBase64 = imageBase64.includes(",") 
      ? imageBase64.split(",")[1] 
      : imageBase64;

    // 4. GENERATE CONTENT
    const result = await model.generateContent([
  "Analyze this food image. Return a JSON object with keys: calories, protein, fat, carbs. Provide only the JSON.",
  {
    inlineData: {
      data: cleanBase64,
      mimeType: "image/jpeg",
    },
  },
]);

    const responseText = result.response.text();
    res.json({ result: responseText });

  } catch (err) {
    console.error("DEBUG ERROR:", err);
    res.status(500).json({ 
      error: err.message,
      details: "Check console for full log" 
    });
  }
});

export default router;