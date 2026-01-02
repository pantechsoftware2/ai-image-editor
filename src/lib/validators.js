/**
 * Input validators
 */

/**
 * Validate URL
 * @param {string} url
 * @returns {boolean}
 */
export const validateURL = (url) => {
  try {
    new URL(url.includes('://') ? url : `https://${url}`);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate email
 * @param {string} email
 * @returns {boolean}
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate prompt length
 * @param {string} prompt
 * @param {number} maxLength
 * @returns {boolean}
 */
export const validatePromptLength = (prompt, maxLength = 500) => {
  return prompt && prompt.trim().length > 0 && prompt.length <= maxLength;
};

/**
 * Validate hex color
 * @param {string} color
 * @returns {boolean}
 */
export const validateHexColor = (color) => {
  return /^#[0-9A-F]{6}$/i.test(color);
};

/**
 * Validate image file
 * @param {File} file
 * @param {number} maxSize - in bytes
 * @returns {boolean}
 */
export const validateImageFile = (file, maxSize = 10 * 1024 * 1024) => {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  return validTypes.includes(file.type) && file.size <= maxSize;
};

/**
 * Validate project name
 * @param {string} name
 * @returns {boolean}
 */
export const validateProjectName = (name) => {
  return name && name.trim().length > 0 && name.length <= 100;
};

/**
 * Validate canvas dimensions
 * @param {number} width
 * @param {number} height
 * @returns {boolean}
 */
export const validateCanvasDimensions = (width, height) => {
  const MIN = 100;
  const MAX = 4320;
  return width >= MIN && width <= MAX && height >= MIN && height <= MAX;
};

/**
 * Sanitize string input
 * @param {string} input
 * @returns {string}
 */
export const sanitizeInput = (input) => {
  if (!input) return '';
  return input
    .trim()
    .replace(/[<>]/g, '')
    .substring(0, 1000);
};

/**
 * Validate all required fields
 * @param {Object} data
 * @param {Array<string>} requiredFields
 * @returns {boolean}
 */
export const validateRequiredFields = (data, requiredFields = []) => {
  return requiredFields.every((field) => {
    const value = data[field];
    return value !== null && value !== undefined && value !== '';
  });
};
