import { NextResponse } from 'next/server';

/**
 * Generate Prompt API Route
 * POST /api/generate-prompt
 * 
 * Day 4 of 10-Day Sprint: The Brain (Gemini System Prompt)
 * Converts user request + brand data into optimized Imagen-4 prompt
 * Uses the "Secret Sauce" system prompt structure
 */

const GEMINI_SYSTEM_PROMPT = `Role: You are a world-class Visual Designer and Prompt Engineer for Imagen-4.

Context:
- User Brand Colors: [List of Hex Codes]
- User Brand Vibe: [Extracted from site, e.g., "Minimalist Tech"]
- User Request: "[User Input]"
- Template Mode: [Headline / No Text]

Task:
1. Create a detailed image generation prompt for Imagen-4.
2. If Template Mode requires text, ensure the prompt explicitly asks for "clean, empty negative space" in the appropriate area (top/bottom/side) so we can overlay text later.
3. If the user asked for a specific object, style it to match the Brand Vibe.

Output Format (JSON):
{
  "imagen_prompt": "...",
  "headline_suggestion": "...", // Short, punchy copy for the overlay
  "subheadline_suggestion": "..."
}`;

export async function POST(request) {
  try {
    const body = await request.json();
    const { brandColors, brandVibe, userRequest, templateMode } = body;

    if (!userRequest) {
      return NextResponse.json(
        { error: 'userRequest is required' },
        { status: 400 }
      );
    }

    // Build the prompt following the "Secret Sauce" structure
    const systemContext = `
Role: You are a world-class Visual Designer and Prompt Engineer for Imagen-4.

Context:
- User Brand Colors: ${brandColors.join(', ')}
- User Brand Vibe: ${brandVibe}
- User Request: "${userRequest}"
- Template Mode: ${templateMode || 'Headline'}

Task:
1. Create a detailed image generation prompt for Imagen-4.
2. If Template Mode requires text, ensure the prompt explicitly asks for "clean, empty negative space" in the appropriate area (top/bottom/side) so we can overlay text later.
3. Style the content to match the Brand Vibe.

Output MUST be valid JSON with exactly this structure (no markdown, no code blocks):
{
  "imagen_prompt": "detailed prompt for Imagen-4",
  "headline_suggestion": "short punchy headline",
  "subheadline_suggestion": "supporting text"
}`;

    // For now, return a realistic mock response based on the request
    // In production, this would call Gemini Pro API
    const mockResponses: Record<string, any> = {
      coffee: {
        imagen_prompt: `Photorealistic close-up of a freshly brewed espresso in a minimalist ceramic cup, soft steam rising, cinematic lighting, premium aesthetic, shallow depth of field. Color palette: ${brandColors.join(', ')}. ${brandVibe} style. Leave clean, empty negative space at the top center of the image for text overlay. Ultra-high resolution, studio quality, 1080x1350 aspect ratio.`,
        headline_suggestion: 'Start Strong.',
        subheadline_suggestion: 'Coffee that fuels focus.',
      },
      summer: {
        imagen_prompt: `Vibrant summer product showcase with natural sunlight, bright cheerful atmosphere. Style: ${brandVibe}. Colors: ${brandColors.join(', ')}. Modern composition with clean negative space in upper third for text overlay. Beachy, energetic mood. High quality, professional photography, 1080x1350 aspect ratio.`,
        headline_suggestion: 'Summer Collection',
        subheadline_suggestion: 'Refresh your style today.',
      },
      default: {
        imagen_prompt: `Professional product photography showcasing ${userRequest}. Style: ${brandVibe}. Primary colors: ${brandColors.join(', ')}. Cinematic lighting with clean composition. Leave significant empty negative space in the top third for text overlay. Modern, sophisticated design. High resolution, studio quality, 1080x1350 aspect ratio.`,
        headline_suggestion: userRequest.charAt(0).toUpperCase() + userRequest.slice(1),
        subheadline_suggestion: `Designed with ${brandVibe} aesthetic`,
      },
    };

    // Select response based on keywords
    let selectedResponse = mockResponses.default;
    const lowerRequest = userRequest.toLowerCase();
    
    if (lowerRequest.includes('coffee') || lowerRequest.includes('espresso')) {
      selectedResponse = mockResponses.coffee;
    } else if (lowerRequest.includes('summer') || lowerRequest.includes('collection')) {
      selectedResponse = mockResponses.summer;
    }

    return NextResponse.json({
      success: true,
      data: {
        ...selectedResponse,
        systemPrompt: systemContext,
      },
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate prompt' },
      { status: 500 }
    );
  }
}
