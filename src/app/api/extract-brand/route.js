import { extractBrandFromWebsite } from '@/lib/brand-extractor';

/**
 * POST /api/extract-brand
 * Extract brand information from URL
 */
export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return Response.json({ error: 'URL is required' }, { status: 400 });
    }

    const brandData = await extractBrandFromWebsite(url);

    return Response.json({
      success: true,
      data: brandData,
    });
  } catch (error) {
    console.error('Extract brand error:', error);
    return Response.json(
      {
        error: error.message || 'Failed to extract brand information',
      },
      { status: 500 }
    );
  }
}
