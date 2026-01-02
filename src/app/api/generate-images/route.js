import { generateImages } from '@/lib/vertex-ai';

/**
 * POST /api/generate-images
 * Generate image variations using Imagen-4
 */
export async function POST(request) {
  try {
    const { imagenPrompt, count = 4, templateId = 1 } = await request.json();

    // Validate input
    if (!imagenPrompt?.trim()) {
      return Response.json(
        { error: 'Imagen prompt is required' },
        { status: 400 }
      );
    }

    // Limit count to max 4
    const imageCount = Math.min(Math.max(parseInt(count) || 4, 1), 4);

    // Generate images with Imagen-4
    const result = await generateImages(imagenPrompt, imageCount);

    if (!result.success) {
      console.error('Image generation failed:', result.error);
      // Return mock data for development
      return Response.json({
        success: true,
        status: 'mock',
        message: 'Using mock images for development',
        variants: Array.from({ length: imageCount }, (_, i) => ({
          id: `variant-${i}`,
          imageUrl: `https://picsum.photos/1080/1350?random=${i}`,
          base64Data: null,
          prompt: imagenPrompt,
          width: 1080,
          height: 1350,
          templateId,
          index: i + 1,
          stored: false,
        })),
        prompt: imagenPrompt,
        count: imageCount,
        timestamp: new Date().toISOString(),
      });
    }

    // Process variants and prepare for storage
    // Note: Base64 storage happens client-side to avoid large payloads
    const variants = (result.variants || []).map((variant) => ({
      id: variant.id,
      base64Data: variant.base64Data,
      mimeType: variant.mimeType,
      prompt: variant.prompt,
      width: variant.width,
      height: variant.height,
      templateId,
      index: variant.index,
      stored: false,
    }));

    return Response.json({
      success: true,
      variants,
      prompt: imagenPrompt,
      count: variants.length,
      templateId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Generate images API error:', error);
    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/generate-images
 * Health check endpoint
 */
export async function GET(request) {
  return Response.json({
    status: 'ready',
    message: 'POST with imagenPrompt, count (1-4), and optional templateId',
  });
}
