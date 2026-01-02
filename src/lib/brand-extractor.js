import axios from 'axios';
import * as cheerio from 'cheerio';

// Default tech palette for fallback
const DEFAULT_TECH_PALETTE = {
  colors: ['#0066CC', '#333333', '#FFFFFF', '#666666', '#E8E8E8'],
  fonts: ['Segoe UI', 'Helvetica Neue', 'Arial'],
  logo: null,
  vibe: 'tech',
};

/**
 * Extract brand info from website
 * @param {string} url
 * @returns {Promise<Object>}
 */
export const extractBrandFromWebsite = async (url) => {
  try {
    // Normalize URL
    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }

    // Fetch website HTML
    const response = await axios.get(normalizedUrl, {
      timeout: 10000,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      maxRedirects: 5,
    });

    const $ = cheerio.load(response.data);

    // Extract colors from CSS and styles
    const colors = extractColors($);

    // Extract fonts
    const fonts = extractFonts($);

    // Extract logo
    const logo = extractLogo($, normalizedUrl);

    // Extract vibe from content
    const vibe = analyzeVibe($);

    // Use fallback colors if none extracted
    const finalColors = colors.length > 0 ? colors.slice(0, 5) : DEFAULT_TECH_PALETTE.colors;
    const finalFonts = fonts.length > 0 ? fonts.slice(0, 3) : DEFAULT_TECH_PALETTE.fonts;

    return {
      colors: finalColors,
      fonts: finalFonts,
      logo: logo || null,
      vibe: vibe || 'modern',
      url: normalizedUrl,
      success: true,
    };
  } catch (error) {
    console.error('Brand extraction error:', error.message);

    // Return default palette on error
    return {
      ...DEFAULT_TECH_PALETTE,
      url: url.trim(),
      success: false,
      error: error.message,
    };
  }
};

/**
 * Extract colors from webpage - improved version
 * @param {Object} $
 * @returns {Array<string>}
 */
const extractColors = ($) => {
  const colors = new Set();

  // Color regex patterns
  const hexRegex = /#[0-9A-Fa-f]{6}\b/g;
  const rgbRegex = /rgba?\([^)]+\)/g;

  // Extract from all text nodes and attributes
  $('*').each((_, el) => {
    // Check style attribute
    const styles = $(el).attr('style');
    if (styles) {
      const hexMatches = styles.match(hexRegex) || [];
      const rgbMatches = styles.match(rgbRegex) || [];
      [...hexMatches, ...rgbMatches].forEach((color) => colors.add(color));
    }

    // Check computed styles for common properties
    const color = $(el).css('color');
    const bgColor = $(el).css('background-color');
    const borderColor = $(el).css('border-color');

    if (color && color !== 'transparent') colors.add(color);
    if (bgColor && bgColor !== 'transparent') colors.add(bgColor);
    if (borderColor && borderColor !== 'transparent') colors.add(borderColor);
  });

  // Also extract from link tags (stylesheets would be external)
  // Extract from any data attributes that might contain colors
  $('[data-color], [data-bg-color]').each((_, el) => {
    const dataColor = $(el).attr('data-color');
    const dataBgColor = $(el).attr('data-bg-color');
    if (dataColor) colors.add(dataColor);
    if (dataBgColor) colors.add(dataBgColor);
  });

  return Array.from(colors)
    .filter((c) => c && c.length > 0 && (c.startsWith('#') || c.startsWith('rgb')))
    .slice(0, 10); // Get up to 10 colors
};

/**
 * Extract fonts from webpage - improved version
 * @param {Object} $
 * @returns {Array<string>}
 */
const extractFonts = ($) => {
  const fonts = new Set();

  // Extract from style attributes
  $('[style*="font-family"]').each((_, el) => {
    const fontFamily = $(el).css('font-family');
    if (fontFamily) {
      const fontNames = fontFamily.split(',').map((f) => f.trim().replace(/['"]/g, ''));
      fontNames.forEach((f) => {
        if (f && f.length > 0) fonts.add(f);
      });
    }
  });

  // Extract from link tags (Google Fonts, etc.)
  $('link[href*="fonts.googleapis"]').each((_, el) => {
    const href = $(el).attr('href');
    if (href) {
      // Extract font names from Google Fonts URL
      const match = href.match(/family=([^&:]+)/g);
      if (match) {
        match.forEach((m) => {
          const fontName = m.replace('family=', '').replace(/\+/g, ' ');
          fonts.add(fontName);
        });
      }
    }
  });

  // Extract from style tags
  $('style').each((_, el) => {
    const content = $(el).html();
    if (content) {
      const fontMatches = content.match(/font-family:\s*([^;]+)/gi) || [];
      fontMatches.forEach((m) => {
        const fontName = m
          .replace(/font-family:\s*/i, '')
          .split(',')[0]
          .trim()
          .replace(/['"]/g, '');
        if (fontName && fontName.length > 0) fonts.add(fontName);
      });
    }
  });

  return Array.from(fonts).slice(0, 5); // Get up to 5 fonts
};

/**
 * Extract logo from webpage - improved version
 * @param {Object} $
 * @param {string} baseUrl
 * @returns {string|null}
 */
const extractLogo = ($, baseUrl) => {
  // Try to find logo by various methods
  const searchPatterns = [
    'img[alt*="logo" i]',
    'img[src*="logo" i]',
    'img[class*="logo" i]',
    'img[id*="logo" i]',
    '.header img',
    '.navbar img',
    '.nav img',
    '[role="banner"] img',
  ];

  for (const pattern of searchPatterns) {
    const img = $(pattern).first();
    if (img.length > 0) {
      let src = img.attr('src');
      if (src) {
        // Convert relative URLs to absolute
        if (src.startsWith('http')) {
          return src;
        }
        try {
          const url = new URL(src, baseUrl);
          return url.toString();
        } catch (e) {
          return src;
        }
      }
    }
  }

  // Fallback: try to get OG image
  const ogImage = $('meta[property="og:image"]').attr('content');
  if (ogImage) return ogImage;

  // Last fallback: first image that's reasonably sized
  let firstImg = null;
  $('img').each((_, el) => {
    const src = $(el).attr('src');
    const width = $(el).attr('width');
    const height = $(el).attr('height');

    if (src && !src.includes('tracking') && !src.includes('analytics')) {
      // Prefer larger images that are likely logos
      if ((width && parseInt(width) > 50) || (height && parseInt(height) > 50)) {
        if (!firstImg) firstImg = src;
      }
    }
  });

  return firstImg || null;
};

/**
 * Analyze brand vibe from content
 * @param {Object} $
 * @returns {string}
 */
const analyzeVibe = ($) => {
  const text = $('body').text().toLowerCase();
  const headings = $('h1, h2, h3').text().toLowerCase();

  const vibes = {
    modern: ['modern', 'innovative', 'digital', 'tech'],
    minimalist: ['minimal', 'simple', 'clean', 'elegant'],
    bold: ['bold', 'strong', 'powerful', 'impact'],
    playful: ['fun', 'play', 'creative', 'exciting'],
    luxury: ['luxury', 'premium', 'exclusive', 'sophisticated'],
    natural: ['natural', 'organic', 'eco', 'sustainable'],
  };

  let scores = {};
  for (const [vibe, keywords] of Object.entries(vibes)) {
    scores[vibe] = keywords.filter((k) => text.includes(k) || headings.includes(k)).length;
  }

  const bestVibe = Object.entries(scores).reduce((a, b) => (a[1] > b[1] ? a : b))[0];
  return bestVibe || 'modern';
};
