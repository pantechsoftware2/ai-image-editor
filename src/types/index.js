/**
 * TypeScript type definitions converted to JSDoc
 */

/**
 * @typedef {Object} UserProfile
 * @property {string} id
 * @property {string} email
 * @property {string} fullName
 * @property {string} [avatarUrl]
 * @property {string} [bio]
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} Project
 * @property {string} id
 * @property {string} userId
 * @property {string} name
 * @property {string} [description]
 * @property {string} [thumbnailUrl]
 * @property {Object} [canvasState]
 * @property {BrandData} [brandData]
 * @property {string} [templateId]
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} Generation
 * @property {string} id
 * @property {string} projectId
 * @property {string} userId
 * @property {string} prompt
 * @property {string[]} imageUrls
 * @property {string} [selectedImageUrl]
 * @property {Object} [metadata]
 * @property {Date} createdAt
 */

/**
 * @typedef {Object} BrandData
 * @property {string[]} colors
 * @property {string[]} fonts
 * @property {string} logo
 * @property {string} vibe
 * @property {string} url
 */

/**
 * @typedef {Object} ImageVariant
 * @property {string} id
 * @property {string} imageUrl
 * @property {string} prompt
 * @property {number} width
 * @property {number} height
 */

/**
 * @typedef {Object} TemplateLayer
 * @property {string} type
 * @property {number} [left]
 * @property {number} [top]
 * @property {number} width
 * @property {number} height
 * @property {string} [fill]
 * @property {number} [fontSize]
 * @property {string} [fontFamily]
 */

/**
 * @typedef {Object} TemplateConfig
 * @property {string} id
 * @property {string} name
 * @property {number} width
 * @property {number} height
 * @property {TemplateLayer[]} layers
 */

/**
 * @typedef {Object} EditorState
 * @property {ImageVariant} [selectedVariant]
 * @property {Object} [canvasState]
 * @property {TemplateConfig} template
 * @property {boolean} isDirty
 */

/**
 * @typedef {Object} APIResponse
 * @property {boolean} success
 * @property {*} data
 * @property {string} [error]
 */

/**
 * @typedef {Object} ExtractBrandResponse
 * @property {BrandData} data
 */

/**
 * @typedef {Object} GeneratePromptResponse
 * @property {string} imagen_prompt
 * @property {string} original_request
 * @property {string} brand_vibe
 * @property {string} template
 */

/**
 * @typedef {Object} GenerateImagesResponse
 * @property {ImageVariant[]} variants
 */

export {};
