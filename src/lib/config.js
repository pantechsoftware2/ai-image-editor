/**
 * Application configuration
 */
export const CONFIG = {
  // API Configuration
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',

  // Canvas Configuration
  CANVAS_WIDTH: 1080,
  CANVAS_HEIGHT: 1350,
  CANVAS_BACKGROUND: '#ffffff',

  // Image Generation
  IMAGE_VARIANTS_COUNT: 4,
  IMAGE_QUALITY: 0.95,
  MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB

  // Vertex AI
  VERTEX_AI_MODEL_GEMINI: 'gemini-1.5-pro',
  VERTEX_AI_MODEL_IMAGEN: 'imagen-3.0-generate-001',
  VERTEX_AI_LOCATION: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1',

  // Supabase
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,

  // Storage
  STORAGE_BUCKET_IMAGES: 'images',
  STORAGE_BUCKET_PROJECTS: 'projects',

  // Timeouts
  REQUEST_TIMEOUT: 30000,
  IMAGE_GENERATION_TIMEOUT: 60000,

  // Limits
  MAX_PROMPT_LENGTH: 500,
  MAX_PROJECT_NAME_LENGTH: 100,
  MAX_PROJECTS_PER_USER: 100,

  // Feature Flags
  ENABLE_BRAND_EXTRACTION: true,
  ENABLE_AI_GENERATION: true,
  ENABLE_TEMPLATES: true,
  ENABLE_EXPORT: true,
};

/**
 * Get config value
 * @param {string} key
 * @param {*} defaultValue
 * @returns {*}
 */
export const getConfig = (key, defaultValue = null) => {
  return CONFIG[key] || defaultValue;
};

export default CONFIG;
