import { VertexAI } from '@google-cloud/vertexai';

/**
 * Initialize Vertex AI SDK
 * @returns {VertexAI} Vertex AI instance
 */
export const initializeVertexAI = () => {
  const projectId = process.env.NEXT_PUBLIC_GOOGLE_CLOUD_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT_ID;
  const location = process.env.NEXT_PUBLIC_GOOGLE_CLOUD_REGION || process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';

  if (!projectId) {
    throw new Error('Google Cloud Project ID is not configured');
  }

  return new VertexAI({
    project: projectId,
    location,
  });
};

/**
 * Gemini System Prompt - "The Secret Sauce"
 * Role: World-class Visual Designer & Prompt Engineer for Imagen-4
 */
const GEMINI_SYSTEM_PROMPT = `You are a world-class Visual Designer and Prompt Engineer specializing in creating lethal Imagen-4 image generation prompts.

Your Role:
- Convert user requests into stunning, detailed visual descriptions for Imagen-4
- Account for brand colors, vibes, and aesthetic preferences
- Engineer prompts that generate professional social media content
- Leave NEGATIVE SPACE in compositions when specified (for text overlays)

Your Constraints:
1. Imagen-4 specifics:
   - Be extremely detailed and specific about visual elements
   - Include lighting, mood, composition, texture details
   - Specify camera angle, depth of field, perspective, focal length
   - Use professional photography/design terminology
   - Target 4K quality, photorealistic or artistic as needed

2. Negative Space Strategy:
   - For Templates 2-4: Include explicit "leave significant negative space at [position] for text overlay"
   - Specify area dimensions (e.g., "top 15% of image with solid background for headline")
   - Ensure reserved areas have HIGH CONTRAST for readability
   - Background in negative space should complement brand colors

3. Brand Alignment:
   - Incorporate brand colors naturally and tastefully
   - Match the specified "vibe" exactly (modern, minimalist, bold, luxury, playful, natural)
   - Use brand fonts as design inspiration in composition context
   - Maintain consistent aesthetic throughout

4. Quality Standards:
   - Professional photography/design quality (stock photo level or better)
   - Suitable for social media (1080px minimum width)
   - NO watermarks, artist signatures, or visible text
   - Consistency with brand guidelines
   - Clear focal point with intentional composition

5. Output Format:
Always respond with ONLY a valid JSON object (no markdown, no code blocks):
{
  "imagen_prompt": "Your detailed Imagen-4 prompt (2-3 sentences, specific and actionable)",
  "composition": "Brief layout description (e.g., 'centered subject with top negative space')",
  "color_strategy": "How brand colors are used",
  "vibe_delivered": "The vibe/mood achieved",
  "technical_details": "Camera/lighting specifics"
}`;

/**
 * Generate detailed Imagen prompt using Gemini 1.5 Flash
 * @param {Object} params
 * @param {Array<string>} params.brandColors - Brand hex colors
 * @param {string} params.brandVibe - Brand personality (modern, minimalist, bold, luxury, playful, natural)
 * @param {string} params.userRequest - User's content request
 * @param {number} params.templateId - Selected template ID (1-4)
 * @param {boolean} params.useTextBaking - Enable AI text rendering (default: false)
 * @param {string} params.textBakingContent - Text to render if useTextBaking is true
 * @returns {Promise<Object>} Generated prompt and metadata
 */
export const generateImagePrompt = async ({
  brandColors = [],
  brandVibe = 'modern',
  userRequest = '',
  templateId = 1,
  useTextBaking = false,
  textBakingContent = '',
}) => {
  try {
    if (!userRequest.trim()) {
      throw new Error('User request cannot be empty');
    }


    // Get negative space instruction based on template
    const negativeSpaceInstructions = getNegativeSpaceInstructions(templateId);
    const platformName = getPlatformName(templateId);

    // Build text baking instruction if enabled
    let textBakingInstruction = '';
    if (useTextBaking && textBakingContent) {
      textBakingInstruction = `
\nTEXT BAKING (AI Rendered Text):
- Render the text: "${textBakingContent}" directly in the image
- Use brand colors for the text
- Make text prominent and readable
- Use creative styling: smoke effects, neon, hand-painted, 3D, shadow, etc.
- Position text strategically in the composition for maximum impact
WARNING: This text will be BAKED into the image and cannot be edited later.`;
    }

    // Build user message
    const userMessage = `Generate an Imagen-4 prompt for social media content.

Brand Context:
- Colors: ${brandColors.length > 0 ? brandColors.join(', ') : 'Neutral tones (black, white, gray)'}
- Vibe: ${brandVibe}
- Platform: ${platformName}

Content Request: "${userRequest}"${textBakingInstruction}

Layout Requirement:
${negativeSpaceInstructions}

Create a detailed, actionable Imagen-4 prompt that:
1. Matches the specified brand vibe exactly
2. Incorporates brand colors naturally
3. Follows the layout requirements above
4. Generates professional, social-media-ready content
5. Uses specific, technical photography terminology

Return ONLY valid JSON (no explanation, no markdown).`;

    // Initialize Vertex AI
    const vertexAI = initializeVertexAI();

    // Create generative model with system prompt
    const generativeModel = vertexAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: GEMINI_SYSTEM_PROMPT,
    });

    // Generate content
    const response = await generativeModel.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: userMessage,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 600,
      },
    });

    // Extract response text
    const responseText =
      response.response.candidates[0]?.content?.parts[0]?.text?.trim() || '';

    if (!responseText) {
      throw new Error('Empty response from Gemini');
    }

    // Parse JSON response
    let parsedResponse;
    try {
      // Extract JSON from response (handles markdown wrapping)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
        parsedResponse = JSON.parse(responseText);
      }
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', responseText);
      // Return structured fallback
      parsedResponse = {
        imagen_prompt: responseText,
        composition: 'Professional composition for ' + platformName,
        color_strategy: 'Brand colors incorporated naturally',
        vibe_delivered: brandVibe,
        technical_details: 'Professional photography quality',
      };
    }

    return {
      success: true,
      data: parsedResponse,
      templateId,
      userRequest,
      brandVibe,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Prompt generation error:', error);
    return {
      success: false,
      error: error.message,
      templateId,
    };
  }
};

/**
 * Get negative space instructions based on template
 * @param {number} templateId
 * @returns {string} Instructions for prompt
 */
function getNegativeSpaceInstructions(templateId) {
  const instructions = {
    1: 'Full Bleed Image (1080x1350): Image covers entire canvas with no reserved space. Strong focal point and composition-focused.',
    2: 'Image + Top Text (1080x1350): Image occupies bottom 85% (left: 0, top: 150). Reserve TOP 15% with solid, high-contrast background. Ensure text area background complements brand colors.',
    3: 'Split Layout (1080x1350): Image fills right 50% (left: 540, top: 0). Left 50% is text area (left: 0, top: 0). Ensure colors support text overlay on left side.',
    4: 'Center Text Overlay (1080x1350): Full image with CENTER 30% (vertically centered, horizontally centered) reserved for text. Use dark/light gradient or solid background in center. High contrast for white text.',
  };
  return instructions[templateId] || instructions[1];
}

/**
 * Get platform name from template ID
 * @param {number} templateId
 * @returns {string}
 */
function getPlatformName(templateId) {
  const platforms = {
    1: 'Instagram Feed (1080x1350px)',
    2: 'Instagram Story (1080x1920px)',
    3: 'LinkedIn / Twitter (1200x675px)',
    4: 'Pinterest / Facebook (1080x1350px)',
  };
  return platforms[templateId] || 'Social Media';
}

/**
 * Generate multiple image variations using Imagen-4
 * @param {string} prompt - Imagen prompt
 * @param {number} count - Number of variations (1-4)
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Generation result with image data
 */
export const generateImages = async (prompt, count = 4, options = {}) => {
  try {
    if (!prompt.trim()) {
      throw new Error('Prompt cannot be empty');
    }

    const vertexAI = initializeVertexAI();
    const projectId = process.env.NEXT_PUBLIC_GOOGLE_CLOUD_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT_ID;
    const location = process.env.NEXT_PUBLIC_GOOGLE_CLOUD_REGION || 'us-central1';

    if (!projectId) {
      throw new Error('Project ID not configured');
    }

    // Use Imagen-3.0 model for image generation
    const generativeModel = vertexAI.getGenerativeModel({
      model: 'imagen-3.0-generate',
    });

    const response = await generativeModel.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        maxOutputTokens: 2048,
      },
    });

    // Extract images from response
    const images = [];
    const candidates = response.response.candidates || [];

    for (const candidate of candidates) {
      const imageParts = candidate.content?.parts || [];
      for (const part of imageParts) {
        if (part.inlineData?.mimeType?.startsWith('image/')) {
          // Store base64 data
          const base64Data = part.inlineData.data;
          const mimeType = part.inlineData.mimeType || 'image/jpeg';
          images.push({
            base64: base64Data,
            mimeType: mimeType,
          });
        }
      }
    }

    if (images.length === 0) {
      throw new Error('No images generated');
    }

    // Return image variants with base64 data
    const variants = images.slice(0, count).map((img, idx) => ({
      id: `variant-${idx}`,
      base64Data: img.base64,
      mimeType: img.mimeType,
      prompt,
      width: 1080,
      height: 1350,
      index: idx + 1,
    }));

    return {
      success: true,
      variants,
      count: variants.length,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Image generation error:', error);
    return {
      success: false,
      error: error.message,
      status: 'error',
    };
  }
};

/**
 * Generate text with Gemini
 * @param {string} prompt
 * @param {Object} options
 * @returns {Promise<string>}
 */
export const generateWithGemini = async (prompt, options = {}) => {
  try {
    const vertexAI = initializeVertexAI();
    
    const generativeModel = vertexAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      ...options,
    });

    const response = await generativeModel.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const content = response.response.candidates?.[0]?.content;
    const textPart = content?.parts?.[0]?.text;
    return textPart || '';
  } catch (error) {
    console.error('Gemini generation error:', error);
    throw error;
  }
};

/**
 * Stream text generation
 * @param {string} prompt
 * @returns {AsyncGenerator<string>}
 */
export const streamGemini = async function* (prompt) {
  const vertexAI = initializeVertexAI();
  
  const generativeModel = vertexAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
  });

  const response = await generativeModel.generateContentStream({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
  });

  for await (const chunk of response.stream) {
    const text = chunk.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) {
      yield text;
    }
  }
};

/**
 * Count tokens
 * @param {string} text
 * @returns {Promise<number>}
 */
export const countTokens = async (text) => {
  const vertexAI = initializeVertexAI();
  
  const generativeModel = vertexAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
  });

  const response = await generativeModel.countTokens({
    contents: [{ role: 'user', parts: [{ text }] }],
  });

  return response.totalTokens || 0;
};

/**
 * Regenerate headline/text without changing the image
 * Use Gemini to create alternative text variations
 * @param {Object} params
 * @param {string} params.currentText - Current headline text
 * @param {string} params.userRequest - Original user request context
 * @param {Array<string>} params.brandColors - Brand colors for context
 * @param {string} params.brandVibe - Brand personality
 * @param {string} params.purpose - Purpose of text (headline, subheadline, cta)
 * @returns {Promise<Object>} Alternative text suggestions
 */
export const regenerateText = async ({
  currentText = '',
  userRequest = '',
  brandColors = [],
  brandVibe = 'modern',
  purpose = 'headline',
}) => {
  try {
    const vertexAI = initializeVertexAI();
    const generativeModel = vertexAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
    });

    const textPurposeGuide = {
      headline: 'Main attention-grabbing headline (1-3 words, punchy and powerful)',
      subheadline: 'Supporting text that adds context (5-10 words, complements headline)',
      cta: 'Call-to-action button text (2-4 words, action-oriented)',
      tagline: 'Brand tagline or slogan (short, memorable, 3-5 words)',
    };

    const prompt = `You are a copywriting expert creating ${purpose} text for visual designs.

Current Context:
- Current Text: "${currentText}"
- User Request: "${userRequest}"
- Brand Vibe: ${brandVibe}
- Purpose: ${textPurposeGuide[purpose] || 'compelling text'}

Task: Generate 5 alternative variations of the ${purpose} that:
1. Match the brand vibe (${brandVibe})
2. Work with the context (${userRequest})
3. Are suitable for visual overlay (clear, short, impactful)
4. Vary in tone and approach
5. Don't repeat the current text unless it's excellent

Return ONLY a valid JSON object (no markdown):
{
  "variations": [
    "Option 1",
    "Option 2",
    "Option 3",
    "Option 4",
    "Option 5"
  ],
  "recommendations": "Brief note on what works best",
  "tips": "Tips for using these in design overlay"
}`;

    const response = await generativeModel.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const responseText = response.response.candidates[0]?.content.parts[0]?.text || '';
    
    // Parse JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from Gemini');
    }

    const parsedResponse = JSON.parse(jsonMatch[0]);

    return {
      success: true,
      data: {
        variations: parsedResponse.variations || [],
        recommendations: parsedResponse.recommendations || '',
        tips: parsedResponse.tips || '',
      },
      purpose,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Text regeneration failed:', error);
    throw new Error(`Failed to regenerate text: ${error.message}`);
  }
};

/**
 * Generate copy suggestions for various design elements
 * Batch operation to generate headline + subheadline + CTA
 * @param {Object} params
 * @param {string} params.userRequest - Original request
 * @param {Array<string>} params.brandColors - Brand colors
 * @param {string} params.brandVibe - Brand vibe
 * @returns {Promise<Object>} Copy suggestions for all elements
 */
export const generateCopySuggestions = async ({
  userRequest = '',
  brandColors = [],
  brandVibe = 'modern',
}) => {
  try {
    const vertexAI = initializeVertexAI();
    const generativeModel = vertexAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
    });

    const prompt = `You are an expert copywriter and brand strategist. Generate compelling copy suggestions for a visual design.

Context:
- Request: "${userRequest}"
- Brand Vibe: ${brandVibe}
- Brand Colors: ${brandColors.join(', ')}

Create suggestions for:
1. Headline: Main text (1-4 words, powerful and attention-grabbing)
2. Subheadline: Supporting text (5-12 words, adds context/emotion)
3. CTA: Call-to-action (2-4 words, action-oriented)

All text should:
- Match the brand vibe
- Be suitable for visual overlay (clear and readable)
- Work together as a cohesive message
- Be professional and engaging

Return ONLY valid JSON (no markdown):
{
  "headlines": ["Option 1", "Option 2", "Option 3"],
  "subheadlines": ["Option 1", "Option 2", "Option 3"],
  "ctas": ["Option 1", "Option 2", "Option 3"],
  "recommended_combo": {
    "headline": "Best headline option",
    "subheadline": "Best subheadline option",
    "cta": "Best CTA option"
  },
  "strategy": "Brief explanation of the copy strategy"
}`;

    const response = await generativeModel.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const responseText = response.response.candidates[0]?.content.parts[0]?.text || '';
    
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from Gemini');
    }

    const parsedResponse = JSON.parse(jsonMatch[0]);

    return {
      success: true,
      data: parsedResponse,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Copy generation failed:', error);
    throw new Error(`Failed to generate copy suggestions: ${error.message}`);
  }
};
