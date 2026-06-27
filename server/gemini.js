import { GoogleGenAI } from '@google/genai';

const DEFAULT_MODEL = 'gemini-2.5-flash';
const DEFAULT_FALLBACK_MODELS = ['gemini-2.5-flash-lite'];
const DEFAULT_RETRY_ATTEMPTS = 2;

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

function parseModelList() {
  const primaryModel = process.env.GEMINI_MODEL || DEFAULT_MODEL;
  const configuredFallbacks = process.env.GEMINI_FALLBACK_MODELS
    ? process.env.GEMINI_FALLBACK_MODELS.split(',').map((model) => model.trim()).filter(Boolean)
    : DEFAULT_FALLBACK_MODELS;

  return [...new Set([primaryModel, ...configuredFallbacks])];
}

function getRetryAttempts() {
  const value = Number(process.env.GEMINI_RETRY_ATTEMPTS || DEFAULT_RETRY_ATTEMPTS);
  return Number.isFinite(value) && value > 0 ? Math.min(Math.floor(value), 4) : DEFAULT_RETRY_ATTEMPTS;
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function getErrorText(error) {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return 'Unknown Gemini API error.';
  }
}

function isRetryableGeminiError(error) {
  const message = getErrorText(error).toLowerCase();
  const status = error?.status || error?.code || error?.error?.status || error?.error?.code;

  return (
    status === 429 ||
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504 ||
    message.includes('429') ||
    message.includes('500') ||
    message.includes('502') ||
    message.includes('503') ||
    message.includes('504') ||
    message.includes('unavailable') ||
    message.includes('resource_exhausted') ||
    message.includes('high demand') ||
    message.includes('overloaded') ||
    message.includes('try again later')
  );
}

async function generateWithModel(ai, model, promptInstruction) {
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
    throw new Error(`Gemini returned an empty response from ${model}. Please try again.`);
  }

  return text;
}

export async function generateStitchPromptWithGemini(promptInstruction) {
  const ai = getGeminiClient();
  const models = parseModelList();
  const retryAttempts = getRetryAttempts();
  let lastError;

  for (const model of models) {
    for (let attempt = 1; attempt <= retryAttempts; attempt += 1) {
      try {
        return await generateWithModel(ai, model, promptInstruction);
      } catch (error) {
        lastError = error;

        if (!isRetryableGeminiError(error)) {
          throw error;
        }

        if (attempt < retryAttempts) {
          await wait(700 * attempt);
        }
      }
    }
  }

  const message = getErrorText(lastError);

  throw new Error(
    `Gemini is temporarily unavailable or experiencing high demand. Please try again in a minute. Last error: ${message}`
  );
}
