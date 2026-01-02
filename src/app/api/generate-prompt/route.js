import { generateImagePrompt } from '@/lib/vertex-ai';

/**
 * POST /api/generate-prompt
 * Generate detailed Imagen prompt from user request
 */
export async function POST(request) {
  try {
    const body = await request.json();
    
    const {
      brandColors = [],
      brandVibe = 'modern',
      userRequest = '',
      templateId = 1,
      styleChip = null,
      useTextBaking = false,
      textBakingContent = '',
    } = body;

    // Validate input
    if (!userRequest.trim()) {
      return Response.json(
        { error: 'User request is required' },
        { status: 400 }
      );
    }

    // Combine style chip with user request if available
    let finalRequest = userRequest;
    if (styleChip?.prompt) {
      finalRequest = `${userRequest} Style: ${styleChip.prompt}`;
    }

    // Generate prompt using Gemini with text baking options
    const result = await generateImagePrompt({
      brandColors,
      brandVibe,
      userRequest: finalRequest,
      templateId: parseInt(templateId) || 1,
      useTextBaking,
      textBakingContent: useTextBaking ? textBakingContent : '',
    });

    if (!result.success) {
      return Response.json(
        { error: result.error || 'Failed to generate prompt' },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      data: result.data,
      metadata: {
        templateId: result.templateId,
        userRequest: result.userRequest,
        brandVibe: result.brandVibe,
        useTextBaking,
        textBakingContent: useTextBaking ? textBakingContent : '',
        timestamp: result.timestamp,
      },
    });
  } catch (error) {
    console.error('API Error:', error);
    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/generate-prompt
 * Health check endpoint
 */
export async function GET(request) {
  return Response.json({
    status: 'ready',
    message: 'POST with brandColors, brandVibe, userRequest, templateId, and optional styleChip',
  });
}
