/**
 * Application constants
 */

// Colors
export const COLORS = {
  PRIMARY: '#2563eb',
  SECONDARY: '#64748b',
  SUCCESS: '#16a34a',
  WARNING: '#ea580c',
  ERROR: '#dc2626',
  GRAY_50: '#f9fafb',
  GRAY_100: '#f3f4f6',
  GRAY_500: '#6b7280',
  GRAY_900: '#111827',
};

// Text Styles
export const TEXT_SIZES = {
  XS: 12,
  SM: 14,
  BASE: 16,
  LG: 18,
  XL: 20,
  '2XL': 24,
  '3XL': 30,
  '4XL': 36,
  '5XL': 48,
};

export const FONT_FAMILIES = [
  'Arial',
  'Helvetica',
  'Georgia',
  'Times New Roman',
  'Courier New',
  'Verdana',
  'Trebuchet MS',
  'Comic Sans MS',
];

// Templates
export const TEMPLATE_NAMES = {
  INSTAGRAM_FEED: 'instagram-feed',
  INSTAGRAM_STORY: 'instagram-story',
  TWITTER: 'twitter-post',
  LINKEDIN: 'linkedin-post',
};

// Vibes
export const BRAND_VIBES = [
  'modern',
  'minimalist',
  'bold',
  'playful',
  'luxury',
  'natural',
  'fun',
  'professional',
];

// Messages
export const MESSAGES = {
  SUCCESS_BRAND_EXTRACTED: 'Brand information extracted successfully!',
  SUCCESS_IMAGES_GENERATED: 'Images generated successfully!',
  ERROR_INVALID_URL: 'Please enter a valid URL',
  ERROR_FAILED_GENERATION: 'Failed to generate images. Please try again.',
  ERROR_NETWORK: 'Network error. Please check your connection.',
  LOADING_EXTRACTION: 'Analyzing your website...',
  LOADING_GENERATION: 'Generating images...',
};

// API Endpoints
export const API_ENDPOINTS = {
  EXTRACT_BRAND: '/api/extract-brand',
  GENERATE_PROMPT: '/api/generate-prompt',
  GENERATE_IMAGES: '/api/generate-images',
  PROJECTS: '/api/projects',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_ID: 'userId',
  BRAND_DATA: 'brandData',
  SELECTED_VARIANT: 'selectedVariant',
  EDITOR_STATE: 'editorState',
  DRAFTS: 'drafts',
};

// Canvas Constraints
export const CANVAS_CONSTRAINTS = {
  MIN_WIDTH: 500,
  MAX_WIDTH: 2160,
  MIN_HEIGHT: 500,
  MAX_HEIGHT: 4320,
  MIN_ZOOM: 0.1,
  MAX_ZOOM: 5,
};

// Export Formats
export const EXPORT_FORMATS = ['png', 'jpg', 'pdf'];

// Social Media Platforms
export const PLATFORMS = {
  INSTAGRAM: 'instagram',
  TWITTER: 'twitter',
  LINKEDIN: 'linkedin',
  TIKTOK: 'tiktok',
  FACEBOOK: 'facebook',
};

export const PLATFORM_DIMENSIONS = {
  instagram: { width: 1080, height: 1350 },
  twitter: { width: 1200, height: 675 },
  linkedin: { width: 1200, height: 627 },
  tiktok: { width: 1080, height: 1920 },
  facebook: { width: 1200, height: 630 },
};
