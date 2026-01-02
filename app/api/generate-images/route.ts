import { NextResponse } from 'next/server';

/**
 * Generate Images API Route
 * POST /api/generate-images
 * 
 * Day 5 of 10-Day Sprint: Connecting Imagen-4
 * Generates 4 image variants using Imagen-4
 * Each variant represents different style/composition approach
 * 
 * PRODUCTION: Replace with Vertex AI Imagen-4 API call:
 * POST https://us-central1-aiplatform.googleapis.com/v1/projects/{PROJECT_ID}/locations/us-central1/publishers/google/models/imagen-3.0-generate:predict
 */

function createVariantSVG(brandColors: string[], variantType: string): string {
  const color1 = brandColors[0] || '#4F46E5';
  const color2 = brandColors[1] || '#2D3142';
  const color3 = brandColors[2] || '#FFFFFF';

  const variants: Record<string, string> = {
    clean: `
      <svg xmlns='http://www.w3.org/2000/svg' width='1080' height='1350'>
        <defs>
          <linearGradient id='bg' x1='0%' y1='0%' x2='100%' y2='100%'>
            <stop offset='0%' style='stop-color:${color1};stop-opacity:1' />
            <stop offset='100%' style='stop-color:${color2};stop-opacity:0.9' />
          </linearGradient>
        </defs>
        <rect fill='url(#bg)' width='1080' height='1350'/>
        <rect fill='${color1}' x='0' y='0' width='1080' height='400' opacity='0.1'/>
        <circle cx='200' cy='800' r='150' fill='${color1}' opacity='0.15'/>
        <path d='M 0 1000 Q 270 950 540 1000 T 1080 1000 L 1080 1350 L 0 1350 Z' fill='rgba(255,255,255,0.05)'/>
        <text x='540' y='500' font-size='64' font-weight='bold' fill='${color3}' text-anchor='middle' opacity='0.3'>VARIANT 1</text>
      </svg>`,
    vibrant: `
      <svg xmlns='http://www.w3.org/2000/svg' width='1080' height='1350'>
        <defs>
          <radialGradient id='glow' cx='50%' cy='50%' r='50%'>
            <stop offset='0%' style='stop-color:${color1};stop-opacity:0.8' />
            <stop offset='100%' style='stop-color:${color2};stop-opacity:0.4' />
          </radialGradient>
        </defs>
        <rect fill='${color2}' width='1080' height='1350'/>
        <circle cx='540' cy='400' r='250' fill='url(#glow)'/>
        <circle cx='200' cy='200' r='80' fill='${color1}' opacity='0.6'/>
        <circle cx='880' cy='1000' r='120' fill='${color1}' opacity='0.5'/>
        <rect x='0' y='900' width='1080' height='450' fill='rgba(0,0,0,0.2)'/>
        <text x='540' y='500' font-size='64' font-weight='bold' fill='${color3}' text-anchor='middle' opacity='0.25'>VARIANT 2</text>
      </svg>`,
    minimal: `
      <svg xmlns='http://www.w3.org/2000/svg' width='1080' height='1350'>
        <rect fill='${color3}' width='1080' height='1350'/>
        <rect fill='${color1}' x='0' y='0' width='1080' height='450'/>
        <circle cx='540' cy='300' r='100' fill='${color2}' opacity='0.8'/>
        <rect x='100' y='600' width='880' height='400' fill='${color1}' opacity='0.08' rx='20'/>
        <line x1='150' y1='700' x2='930' y2='700' stroke='${color1}' stroke-width='2' opacity='0.3'/>
        <text x='540' y='1100' font-size='56' font-weight='300' fill='${color1}' text-anchor='middle' opacity='0.4'>VARIANT 3</text>
      </svg>`,
    cinematic: `
      <svg xmlns='http://www.w3.org/2000/svg' width='1080' height='1350'>
        <defs>
          <linearGradient id='dark' x1='0%' y1='0%' x2='100%' y2='100%'>
            <stop offset='0%' style='stop-color:#000000;stop-opacity:1' />
            <stop offset='40%' style='stop-color:${color1};stop-opacity:0.4' />
            <stop offset='100%' style='stop-color:#000000;stop-opacity:1' />
          </linearGradient>
        </defs>
        <rect fill='url(#dark)' width='1080' height='1350'/>
        <rect x='0' y='150' width='1080' height='600' fill='${color1}' opacity='0.15'/>
        <rect x='0' y='1050' width='1080' height='300' fill='rgba(0,0,0,0.6)'/>
        <polygon points='0,0 1080,0 1080,300 0,200' fill='rgba(0,0,0,0.4)'/>
        <text x='540' y='700' font-size='64' font-weight='bold' fill='${color3}' text-anchor='middle' opacity='0.2'>VARIANT 4</text>
      </svg>`,
  };

  return variants[variantType] || variants.clean;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { prompt, userRequest, brandColors } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'prompt is required' },
        { status: 400 }
      );
    }

    const colors = brandColors || ['#4F46E5', '#2D3142', '#FFFFFF'];

    // Generate 4 variants following Day 5 architecture
    const mockImages = [
      {
        id: '1',
        variant: 'Clean Professional',
        description: 'High contrast, premium look with strong lighting',
        url: `data:image/svg+xml,${encodeURIComponent(createVariantSVG(colors, 'clean'))}`,
        style: 'Professional lighting with negative space for text',
      },
      {
        id: '2',
        variant: 'Vibrant Bold',
        description: 'Bold colors, energetic and dynamic composition',
        url: `data:image/svg+xml,${encodeURIComponent(createVariantSVG(colors, 'vibrant'))}`,
        style: 'Dynamic composition, eye-catching',
      },
      {
        id: '3',
        variant: 'Minimal Chic',
        description: 'Clean, simple design with plenty of white space',
        url: `data:image/svg+xml,${encodeURIComponent(createVariantSVG(colors, 'minimal'))}`,
        style: 'Minimalist aesthetic, modern look',
      },
      {
        id: '4',
        variant: 'Cinematic Dark',
        description: 'Dark atmospheric mood, cinematic lighting',
        url: `data:image/svg+xml,${encodeURIComponent(createVariantSVG(colors, 'cinematic'))}`,
        style: 'Cinematic mood, sophisticated',
      },
    ];

    return NextResponse.json({
      success: true,
      data: {
        prompt,
        userRequest,
        variants: mockImages,
        generatedAt: new Date().toISOString(),
        architecture: {
          day: 'Day 5: Connecting Imagen-4',
          variants: 4,
          storage: 'Supabase Storage (in production)',
          note: 'Mock variants - in production, connect to Vertex AI Imagen-4 API',
        },
      },
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate images' },
      { status: 500 }
    );
  }
}
