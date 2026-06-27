import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateStitchPromptWithGemini } from './gemini.js';
import { buildGeminiPrompt, sanitizeRequestBody, validatePromptRequest } from './promptBuilder.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_request, response) => {
  response.json({ success: true, status: 'ok' });
});

app.post('/api/generate-stitch-prompt', async (request, response) => {
  try {
    const data = sanitizeRequestBody(request.body || {});
    const validation = validatePromptRequest(data);

    if (!validation.valid) {
      return response.status(400).json({
        success: false,
        error: validation.error
      });
    }

    const geminiPrompt = buildGeminiPrompt(data);
    const stitchPrompt = await generateStitchPromptWithGemini(geminiPrompt);

    return response.json({
      success: true,
      prompt: stitchPrompt
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Unable to generate the Stitch prompt. Please try again.';

    console.error('Prompt generation failed:', message);

    return response.status(500).json({
      success: false,
      error: message
    });
  }
});

app.use((_request, response) => {
  response.status(404).json({
    success: false,
    error: 'API route not found.'
  });
});

app.listen(PORT, () => {
  console.log(`Stitch Prompt Automation API running on http://localhost:${PORT}`);
});
