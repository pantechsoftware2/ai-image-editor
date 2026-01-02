/**
 * @typedef {Object} Template
 * @property {string} id
 * @property {string} name
 * @property {number} width
 * @property {number} height
 * @property {Array<Object>} layers
 */

/**
 * Templates for social media content
 * @type {Array<Template>}
 */
export const TEMPLATES = [
  {
    id: 'instagram-feed',
    name: 'Instagram Feed',
    width: 1080,
    height: 1350,
    layers: [
      {
        type: 'background',
        fill: '#ffffff',
        width: 1080,
        height: 1350,
      },
      {
        type: 'image',
        left: 0,
        top: 0,
        width: 1080,
        height: 1000,
      },
      {
        type: 'text',
        left: 50,
        top: 1020,
        width: 980,
        height: 280,
        fontSize: 48,
        fontFamily: 'Arial',
        fill: '#000000',
      },
    ],
  },
  {
    id: 'instagram-story',
    name: 'Instagram Story',
    width: 1080,
    height: 1920,
    layers: [
      {
        type: 'background',
        fill: '#ffffff',
        width: 1080,
        height: 1920,
      },
      {
        type: 'image',
        left: 0,
        top: 0,
        width: 1080,
        height: 1700,
      },
      {
        type: 'text',
        left: 50,
        top: 1750,
        width: 980,
        height: 150,
        fontSize: 64,
        fontFamily: 'Arial',
        fill: '#ffffff',
      },
    ],
  },
  {
    id: 'twitter-post',
    name: 'Twitter/X Post',
    width: 1200,
    height: 675,
    layers: [
      {
        type: 'background',
        fill: '#ffffff',
        width: 1200,
        height: 675,
      },
      {
        type: 'image',
        left: 600,
        top: 0,
        width: 600,
        height: 675,
      },
      {
        type: 'text',
        left: 50,
        top: 50,
        width: 500,
        height: 575,
        fontSize: 48,
        fontFamily: 'Arial',
        fill: '#000000',
      },
    ],
  },
  {
    id: 'linkedin-post',
    name: 'LinkedIn Post',
    width: 1200,
    height: 627,
    layers: [
      {
        type: 'background',
        fill: '#f0f0f0',
        width: 1200,
        height: 627,
      },
      {
        type: 'image',
        left: 0,
        top: 0,
        width: 1200,
        height: 500,
      },
      {
        type: 'text',
        left: 50,
        top: 520,
        width: 1100,
        height: 77,
        fontSize: 32,
        fontFamily: 'Arial',
        fill: '#0a66c2',
      },
    ],
  },
];

/**
 * Get template by ID
 * @param {string} id
 * @returns {Template|undefined}
 */
export const getTemplate = (id) => {
  return TEMPLATES.find((t) => t.id === id);
};

/**
 * Get default template
 * @returns {Template}
 */
export const getDefaultTemplate = () => {
  return TEMPLATES[0];
};
