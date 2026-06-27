import { generateStitchPromptWithGemini } from '../server/gemini.js';
import { buildGeminiPrompt, sanitizeRequestBody, validatePromptRequest } from '../server/promptBuilder.js';

export default async function handler(request, response) {
  if (request.method === 'OPTIONS') {
    response.status(204).end();
    return;
  }

  if (request.method !== 'POST') {
    response.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.'
    });
    return;
  }

  try {
    const data = sanitizeRequestBody(request.body || {});
    const validation = validatePromptRequest(data);

    if (!validation.valid) {
      response.status(400).json({
        success: false,
        error: validation.error
      });
      return;
    }

    const geminiPrompt = buildGeminiPrompt(data);
    const stitchPrompt = await generateStitchPromptWithGemini(geminiPrompt);

    response.status(200).json({
      success: true,
      prompt: stitchPrompt
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Unable to generate the Stitch prompt. Please try again.';

    response.status(500).json({
      success: false,
      error: message
    });
  }
}
