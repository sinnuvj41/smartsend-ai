import { GoogleGenAI } from "@google/genai";

export const improveMessage = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || message.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: "Please enter a message to improve."
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "Gemini API key is not configured."
      });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Improve this contact form message professionally. Keep it clear, polite and concise:\n\n${message}`
    });

    res.status(200).json({
      success: true,
      improvedMessage: response.text
    });
  } catch (error) {
    next(error);
  }
};