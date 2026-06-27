const DEFAULT_PAGES = ['Home', 'About Us', 'Products', 'Career', 'Contact Us'];

function cleanText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export function sanitizeRequestBody(body) {
  return {
    companyName: cleanText(body.companyName),
    designTheme: cleanText(body.designTheme)
  };
}

export function validatePromptRequest(data) {
  const missingFields = [];

  if (!data.companyName) {
    missingFields.push('Company Name');
  }

  if (!data.designTheme) {
    missingFields.push('Website Design Theme / Color Theme');
  }

  if (missingFields.length > 0) {
    return {
      valid: false,
      error: `Please provide: ${missingFields.join(', ')}.`
    };
  }

  return { valid: true };
}

export function buildGeminiPrompt(data) {
  return `
You are a professional website strategist, UI/UX designer, and Stitch prompt engineer. Generate a complete, copy-paste-ready Stitch prompt for a business website. The user will only provide the company name and preferred design theme. Based on the company name, infer the likely industry, products/services, target customers, and suitable website structure. Do not invent fake facts, fake awards, fake certifications, fake clients, fake founder names, fake addresses, or fake years. If exact details are unknown, use professional generic language and section placeholders that Stitch can design around. The output must be a polished Stitch prompt, written in a professional format.

User inputs:
- Company Name: ${data.companyName}
- Website Design Theme / Color Theme: ${data.designTheme}

Core output rules:
- Output only the final polished Stitch prompt.
- Do not include explanations like "Here is your prompt".
- Do not include markdown code fences.
- Do not include backend notes, research notes, or analysis.
- The app does not build a website. The output is only a prompt for Stitch.
- Always include these pages: ${DEFAULT_PAGES.join(', ')}.
- Use the user's design theme exactly as the main creative direction.
- You may infer a likely business category from the company name, but phrase uncertain information safely.
- Do not present inferred details as verified facts.
- Do not invent fake certifications, fake awards, fake client names, fake numbers, fake addresses, fake founders, fake years, or fake projects.
- If exact details are unknown, use safe phrases such as "highlight the company's core services", "showcase product categories", "include trust-building business sections", "use industry-relevant imagery", and "mention experience only if provided or publicly known".

Generated Stitch Prompt Must Include:

1. Website Design Request
Start with exactly:
"Create a professional business website design for ${data.companyName}."

2. Company / Industry Understanding
Briefly describe the likely business category based on the company name. Use safe wording if exact information is unknown.

3. Design Theme
Use this design theme exactly as the main creative direction:
"${data.designTheme}"

4. Color Scheme
Generate a proper color palette based on the theme. Include:
- Primary color
- Secondary color
- Accent color
- Background color
- Text color

5. Typography
Mention:
- Bold professional headings
- Clean readable body text
- Modern sans-serif font style
- Strong spacing and hierarchy

6. Visual Style
Mention:
- Professional layout
- Business-focused design
- Clean sections
- Industry-relevant visuals
- Trust-building design
- Product/service-focused cards
- Strong CTA sections

7. Pages to Design

Always include these pages with detailed sections:

Home Page:
- Hero section with strong headline
- Short intro about the company using safe wording
- CTA buttons: View Products, Contact Us
- Product/service category section
- Why Choose Us section
- Industry trust section
- Enquiry CTA section

About Us Page:
- Company overview
- Business values
- Mission and vision
- Quality and trust section
- Experience section using safe wording
- Professional company image/visual area

Products Page:
- Product or service category grid
- Product/service cards
- Detail sections
- Enquiry CTA for each item
- No cart, no checkout, no payment gateway unless specifically requested

Career Page:
- Hiring introduction
- Why work with us section
- Open positions layout
- Application form section
- HR/contact block

Contact Us Page:
- Contact form
- Phone/email/WhatsApp blocks as placeholders unless exact details are known or provided
- Address section as a placeholder unless exact address is known or provided
- Google Map placeholder
- Business enquiry CTA

8. UI Components
Tell Stitch to include:
- Modern navbar
- Sticky header if suitable
- Professional footer
- CTA buttons
- Product/service cards
- Trust badges with generic trust statements only
- Contact forms
- Responsive sections
- Clean icons
- Subtle patterns or background shapes related to the likely industry

9. Responsive Design
Mention that the design must work perfectly on desktop, tablet, and mobile.

10. Important Rules for Stitch
Add these rules clearly:
- Do not create a childish design.
- Do not create random colorful sections.
- Do not add fake awards, fake certifications, fake clients, or fake numbers.
- Do not create cart, checkout, or payment gateway.
- Keep the website professional, clean, conversion-focused, and suitable for a real business.
- Focus on enquiries, products/services, trust, and business credibility.

Final Output Format:
The generated result should be only the final Stitch prompt, ready to paste into Stitch.
`.trim();
}

export { DEFAULT_PAGES };
