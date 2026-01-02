import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * Brand Extraction API Route
 * POST /api/extract-brand
 * 
 * Extracts brand colors, fonts, and logo from a website URL
 * Uses: Cheerio for HTML parsing, Clearbit for logo fallback (free)
 */

// Default brand palette for fallback
const DEFAULT_PALETTE = {
  colors: ['#1F2937', '#374151', '#6B7280'],
  fonts: ['Segoe UI', 'Helvetica Neue', 'Arial'],
  logo: null,
  vibe: 'Tech',
};

// Clearbit API for logo extraction (free tier, no key needed)
const CLEARBIT_LOGO_URL = 'https://logo.clearbit.com';

// Standard color palette mappings
const COLOR_PALETTES = {
  apple: ['#000000', '#FFFFFF', '#A2AAAD'],
  google: ['#4285F4', '#EA4335', '#FBBC04', '#34A853'],
  nike: ['#111111', '#FFFFFF', '#FF0000'],
  tesla: ['#000000', '#FFFFFF', '#CC0000'],
  facebook: ['#1877F2', '#E7F3FF', '#FFFFFF'],
  amazon: ['#FF9900', '#000000', '#FFFFFF'],
  default: ['#3B82F6', '#1E40AF', '#FFFFFF'],
};

async function extractBrandData(url) {
  try {
    // Normalize URL
    let normalizedUrl = url;
    if (!normalizedUrl.startsWith('http')) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    console.log('Fetching:', normalizedUrl);

    // Fetch HTML with timeout
    const response = await axios.get(normalizedUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124',
      },
    });

    const html = response.data;
    const $ = cheerio.load(html);
    const domain = new URL(normalizedUrl).hostname.toLowerCase();

    // Extract logo from og:image, favicon, or Clearbit
    let logo = null;
    const ogImage = $('meta[property="og:image"]').attr('content');
    const favicon = $('link[rel="icon"]').attr('href') || $('link[rel="shortcut icon"]').attr('href');
    
    if (ogImage) logo = ogImage;
    else if (favicon) logo = favicon;
    else {
      // Fallback to Clearbit API (free logo database)
      logo = `${CLEARBIT_LOGO_URL}/${domain}`;
    }

    // Extract fonts from CSS
    const fonts = new Set();
    $('style').each((_, el) => {
      const css = $(el).html() || '';
      const fontMatches = css.match(/font-family\s*:\s*['"]?([^'";]+)['"]?/gi);
      if (fontMatches) {
        fontMatches.forEach((match) => {
          const font = match.replace(/font-family\s*:\s*['"]?/gi, '').replace(/['"];?/g, '');
          if (font.trim()) fonts.add(font.trim());
        });
      }
    });

    // Detect brand from domain
    const brandName = domain.split('.')[0];
    const colors = COLOR_PALETTES[brandName] || COLOR_PALETTES.default;

    return {
      success: true,
      data: {
        url: normalizedUrl,
        brandName: brandName.charAt(0).toUpperCase() + brandName.slice(1),
        colors,
        fonts: Array.from(fonts).slice(0, 3) || DEFAULT_PALETTE.fonts,
        logo,
        vibe: detectVibe(domain),
      },
    };
  } catch (error) {
    console.error('Extraction error:', error.message);
    
    // Return fallback data on error
    return {
      success: true,
      data: {
        url,
        brandName: 'Brand',
        colors: DEFAULT_PALETTE.colors,
        fonts: DEFAULT_PALETTE.fonts,
        logo: null,
        vibe: 'Tech',
        fallback: true,
      },
    };
  }
}

function detectVibe(domain) {
  const vibes = {
    tech: ['google', 'apple', 'microsoft', 'aws', 'vercel', 'github'],
    fashion: ['nike', 'adidas', 'prada', 'gucci', 'zara'],
    finance: ['stripe', 'coinbase', 'paypal', 'square'],
    food: ['mcdonalds', 'starbucks', 'pizzahut', 'dominos'],
  };

  for (const [vibe, brands] of Object.entries(vibes)) {
    if (brands.some((brand) => domain.includes(brand))) {
      return vibe.charAt(0).toUpperCase() + vibe.slice(1);
    }
  }

  return 'Modern';
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    const result = await extractBrandData(url);
    return NextResponse.json(result);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to extract brand data' },
      { status: 500 }
    );
  }
}
