import { GoogleGenAI } from '@google/genai';

const DEFAULT_MODEL = 'gemini-2.5-flash';

let client;

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Add GEMINI_API_KEY to server/.env.');
  }

  if (!client) {
    client = new GoogleGenAI({ apiKey });
  }

  return client;
}

export async function generateStitchPromptWithGemini(promptInstruction) {
  const ai = getGeminiClient();
  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;

  const response = await ai.models.generateContent({
    model,
    contents: promptInstruction,
    config: {
      temperature: 0.45,
      topP: 0.9,
      maxOutputTokens: 7000
    }
  });

  const text = response.text?.trim();

  if (!text) {
    throw new Error('Gemini returned an empty response. Please try again.');
  }

  return text;
}
