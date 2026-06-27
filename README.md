# Stitch Prompt Generator

A clean React + Express dashboard that generates professional, copy-paste-ready Google Stitch website design prompts with the Gemini API.

This app does **not** create websites directly. It only generates a polished prompt that you can paste into Stitch to create a website design.

## What It Does

- Takes only two inputs: company name and preferred website design theme.
- Sends those inputs to a secure Express backend.
- Calls Gemini from the backend only, so the API key is never exposed in the frontend.
- Generates a detailed Stitch prompt with inferred industry direction, design style, color scheme, typography, UI components, responsive rules, and page structure.
- Always includes these default pages: Home, About Us, Products, Career, and Contact Us.
- Saves recent generated prompts in browser `localStorage`.

## Project Structure

```text
/stitch-prompt-generator
  /client
    /src
      App.jsx
      main.jsx
      components/
        InputForm.jsx
        PromptOutput.jsx
        PromptHistory.jsx
      styles/
        global.css
  /server
    index.js
    gemini.js
    promptBuilder.js
    .env.example
  package.json
  README.md
```

## Install Dependencies

From the project root:

```bash
npm install
```

## Add Gemini API Key

Create `server/.env`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
```

## Run Frontend and Backend

```bash
npm run dev
```

Open the dashboard:

```text
http://localhost:5173
```

Backend API:

```text
http://localhost:5000
```

## Deploy To Vercel

Import this GitHub repo into Vercel and use these settings:

```text
Framework Preset: Vite
Root Directory: ./
Install Command: npm install
Build Command: npm run build
Output Directory: dist/client
```

Add this environment variable in Vercel Project Settings:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Apply it to Production, Preview, and Development if you want all deployment types to generate prompts.

The deployed frontend calls the Vercel Function at `/api/generate-stitch-prompt`. The local Express server remains available for `npm run dev`.

## How To Use

1. Enter the company name.
2. Enter the website design theme or color theme.
3. Click **Generate Stitch Prompt**.
4. Copy the generated prompt and paste it into Stitch.
5. Use **Regenerate** to create another version from the same two inputs.
6. Use **Clear** to reset the form and output.
7. Click a recent prompt to reload it from this browser.

## API Endpoint

`POST /api/generate-stitch-prompt`

Request body:

```json
{
  "companyName": "Maa Hydro Engineers",
  "designTheme": "Modern industrial website, blue and grey color palette, professional B2B feel, clean layout, strong trust factor, premium engineering look."
}
```

Successful response:

```json
{
  "success": true,
  "prompt": "Generated Stitch prompt here"
}
```

Error response:

```json
{
  "success": false,
  "error": "Clear error message"
}
```

## Build Frontend

```bash
npm run build
```

## Important Note

The generated prompt asks Stitch to design a professional business website and includes safeguards against fake facts. Gemini is instructed not to invent fake awards, certifications, clients, founders, addresses, years, numbers, or project names. If exact company details are unknown, the prompt uses safe generic wording and placeholders.
