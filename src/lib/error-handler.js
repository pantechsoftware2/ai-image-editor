/**
 * Error Handler & Retry Logic
 * Centralized error handling with exponential backoff retry
 */

/**
 * Retry configuration
 */
const DEFAULT_RETRY_CONFIG = {
  maxAttempts: 3,
  initialDelayMs: 1000,
  maxDelayMs: 10000,
  backoffMultiplier: 2,
};

/**
 * Error type categorization
 */
export const ErrorTypes = {
  NETWORK: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT_ERROR',
  API: 'API_ERROR',
  AUTH: 'AUTH_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND_ERROR',
  SERVER: 'SERVER_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR',
};

/**
 * Categorize error by status code or type
 * @param {Error|Object} error - Error object or response
 * @returns {string} Error type
 */
export function categorizeError(error) {
  if (!error) return ErrorTypes.UNKNOWN;

  // Network errors
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return ErrorTypes.TIMEOUT;
  }
  if (error.message?.includes('network') || error.code === 'ENOTFOUND') {
    return ErrorTypes.NETWORK;
  }

  // HTTP status errors
  if (error.status || error.response?.status) {
    const status = error.status || error.response.status;
    if (status === 401 || status === 403) return ErrorTypes.AUTH;
    if (status === 404) return ErrorTypes.NOT_FOUND;
    if (status >= 400 && status < 500) return ErrorTypes.VALIDATION;
    if (status >= 500) return ErrorTypes.SERVER;
  }

  // Generic API errors
  if (error.message?.includes('API') || error.message?.includes('response')) {
    return ErrorTypes.API;
  }

  return ErrorTypes.UNKNOWN;
}

/**
 * Generate user-friendly error message
 * @param {Error|Object} error - Error object
 * @param {string} context - Context where error occurred
 * @returns {string} User-friendly message
 */
export function getErrorMessage(error, context = '') {
  const type = categorizeError(error);
  const contextStr = context ? ` in ${context}` : '';

  const messages = {
    [ErrorTypes.NETWORK]: `Network connection failed${contextStr}. Check your internet connection.`,
    [ErrorTypes.TIMEOUT]: `Request timed out${contextStr}. Please try again.`,
    [ErrorTypes.API]: `API error${contextStr}. Please try again later.`,
    [ErrorTypes.AUTH]: `Authentication failed${contextStr}. Please log in again.`,
    [ErrorTypes.VALIDATION]: `Invalid input${contextStr}. Please check your data.`,
    [ErrorTypes.NOT_FOUND]: `Resource not found${contextStr}. It may have been deleted.`,
    [ErrorTypes.SERVER]: `Server error${contextStr}. Please try again later.`,
    [ErrorTypes.UNKNOWN]: `Something went wrong${contextStr}. Please try again.`,
  };

  return messages[type] || messages[ErrorTypes.UNKNOWN];
}

/**
 * Retry a function with exponential backoff
 * @param {Function} fn - Async function to retry
 * @param {Object} config - Retry configuration
 * @returns {Promise} Function result
 */
export async function retryWithBackoff(fn, config = {}) {
  const {
    maxAttempts = DEFAULT_RETRY_CONFIG.maxAttempts,
    initialDelayMs = DEFAULT_RETRY_CONFIG.initialDelayMs,
    maxDelayMs = DEFAULT_RETRY_CONFIG.maxDelayMs,
    backoffMultiplier = DEFAULT_RETRY_CONFIG.backoffMultiplier,
  } = config;

  let lastError;
  let delay = initialDelayMs;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const type = categorizeError(error);

      // Don't retry certain errors
      if (type === ErrorTypes.AUTH || type === ErrorTypes.VALIDATION) {
        throw error;
      }

      // Last attempt, throw error
      if (attempt === maxAttempts) {
        break;
      }

      // Wait before retry
      console.warn(`Attempt ${attempt}/${maxAttempts} failed. Retrying in ${delay}ms...`, error.message);
      await sleep(delay);

      // Increase delay exponentially
      delay = Math.min(delay * backoffMultiplier, maxDelayMs);
    }
  }

  throw lastError;
}

/**
 * Sleep for specified milliseconds
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise}
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Timeout wrapper for promises
 * @param {Promise} promise - Promise to timeout
 * @param {number} ms - Timeout in milliseconds
 * @returns {Promise}
 */
export function withTimeout(promise, ms = 30000) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), ms)
    ),
  ]);
}

/**
 * Validate API response
 * @param {Object} response - API response
 * @param {Object} schema - Expected data schema
 * @returns {boolean} Is valid
 */
export function validateResponse(response, schema) {
  if (!response) return false;
  if (schema.required) {
    return schema.required.every(field => field in response);
  }
  return true;
}

/**
 * Create error report for logging
 * @param {Error} error - Error object
 * @param {Object} context - Additional context
 * @returns {Object} Error report
 */
export function createErrorReport(error, context = {}) {
  return {
    timestamp: new Date().toISOString(),
    type: categorizeError(error),
    message: error?.message || 'Unknown error',
    stack: error?.stack,
    userMessage: getErrorMessage(error, context.operation),
    context: {
      operation: context.operation,
      userId: context.userId,
      projectId: context.projectId,
      ...context,
    },
  };
}

/**
 * Log error to service (e.g., Sentry, LogRocket)
 * @param {Error} error - Error to log
 * @param {Object} context - Error context
 */
export function logErrorToService(error, context = {}) {
  const report = createErrorReport(error, context);
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('[Error Report]', report);
  }

  // Send to logging service if configured
  if (typeof window !== 'undefined' && window.__ERROR_LOGGER__) {
    window.__ERROR_LOGGER__.captureException(error, { contexts: report.context });
  }
}

/**
 * Network status monitoring
 */
export class NetworkMonitor {
  static isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
  static listeners = [];

  static init() {
    if (typeof window === 'undefined') return;

    window.addEventListener('online', () => {
      this.isOnline = true;
      this.notifyListeners(true);
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notifyListeners(false);
    });
  }

  static onStatusChange(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  static notifyListeners(isOnline) {
    this.listeners.forEach(callback => callback(isOnline));
  }
}

// Initialize network monitor
if (typeof window !== 'undefined') {
  NetworkMonitor.init();
}
