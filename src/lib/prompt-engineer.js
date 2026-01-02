import { generateWithGemini } from './vertex-ai';

/**
 * Prompt templates for different styles
 */
const PROMPT_TEMPLATES = {
  minimalist: `Create a minimalist design prompt with clean lines, plenty of white space, and elegant typography. 
              Focus on simplicity and functionality. Color palette should be subtle.
              User request: {userRequest}
              Brand vibe: {brandVibe}
              Brand colors: {brandColors}`,

  bold: `Create a bold and impactful design prompt with strong typography, high contrast, and dramatic colors.
         Focus on making a statement and grabbing attention.
         User request: {userRequest}
         Brand vibe: {brandVibe}
         Brand colors: {brandColors}`,

  luxury: `Create an elegant luxury design prompt with sophisticated styling, premium materials feel, and exclusive vibes.
           Use refined typography and spacious layouts.
           User request: {userRequest}
           Brand vibe: {brandVibe}
           Brand colors: {brandColors}`,

  playful: `Create a fun and playful design prompt with vibrant colors, quirky typography, and creative elements.
            Focus on engagement and entertainment.
            User request: {userRequest}
            Brand vibe: {brandVibe}
            Brand colors: {brandColors}`,

  natural: `Create an organic and natural design prompt with earthy tones, natural textures, and eco-friendly vibes.
            Use nature-inspired elements and sustainable aesthetics.
            User request: {userRequest}
            Brand vibe: {brandVibe}
            Brand colors: {brandColors}`,
};

/**
 * Generate prompt for image generation
 * @param {Object} params
 * @returns {Promise<Object>}
 */
export const generateImagePrompt = async ({
  userRequest,
  brandColors = [],
  brandVibe = 'modern',
  templateMode = 'minimalist',
}) => {
  const template = PROMPT_TEMPLATES[templateMode] || PROMPT_TEMPLATES.minimalist;

  const formattedPrompt = template
    .replace('{userRequest}', userRequest)
    .replace('{brandVibe}', brandVibe)
    .replace('{brandColors}', brandColors.join(', '));

  const basePrompt = `You are a professional prompt engineer for AI image generation. 
                      Create a detailed, vivid prompt for generating a social media post image.
                      
                      Requirements:
                      - Be specific about composition, colors, lighting, and mood
                      - Use high-quality descriptive language
                      - Ensure it's optimized for social media (Instagram, Twitter, LinkedIn)
                      - Keep it under 200 words
                      
                      ${formattedPrompt}
                      
                      Return only the image generation prompt, nothing else.`;

  try {
    const response = await generateWithGemini(basePrompt);

    return {
      success: true,
      imagen_prompt: response,
      original_request: userRequest,
      brand_vibe: brandVibe,
      template: templateMode,
    };
  } catch (error) {
    console.error('Prompt generation error:', error);
    throw new Error('Failed to generate image prompt');
  }
};

/**
 * Generate variations of a prompt
 * @param {string} prompt
 * @param {number} count
 * @returns {Promise<Array<string>>}
 */
export const generatePromptVariations = async (prompt, count = 3) => {
  const variationPrompt = `Generate ${count} variations of this image generation prompt.
                          Keep the core concept but vary the style, composition, or emphasis.
                          
                          Original prompt: ${prompt}
                          
                          Return ONLY the variations, one per line, numbered.`;

  try {
    const response = await generateWithGemini(variationPrompt);
    const variations = response
      .split('\n')
      .filter((line) => line.trim())
      .map((line) => line.replace(/^\d+\.\s*/, ''));

    return variations;
  } catch (error) {
    console.error('Variation generation error:', error);
    return [prompt]; // Fallback
  }
};

/**
 * Optimize prompt for specific platform
 * @param {string} prompt
 * @param {string} platform - 'instagram', 'twitter', 'linkedin', 'tiktok'
 * @returns {Promise<string>}
 */
export const optimizePromptForPlatform = async (prompt, platform = 'instagram') => {
  const platformGuides = {
    instagram: 'Optimize for square or vertical formats, vibrant colors, visually engaging',
    twitter: 'Optimize for horizontal layouts, text-heavy, conversation-starting',
    linkedin: 'Optimize for professional context, business relevant, polished',
    tiktok: 'Optimize for vertical video format, dynamic, trendy, energetic',
  };

  const optimizationPrompt = `Optimize this image prompt for ${platform}.
                              ${platformGuides[platform]}
                              
                              Original prompt: ${prompt}
                              
                              Return only the optimized prompt.`;

  try {
    const response = await generateWithGemini(optimizationPrompt);
    return response;
  } catch (error) {
    console.error('Optimization error:', error);
    return prompt;
  }
};
