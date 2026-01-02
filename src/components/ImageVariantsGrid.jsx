'use client';

/**
 * @typedef {Object} ImageVariant
 * @property {string} id - Unique ID
 * @property {string} url - Image URL
 * @property {string} headline - Headline text
 * @property {string} subheadline - Subheadline text
 */

/**
 * @typedef {Object} ImageVariantsGridProps
 * @property {ImageVariant[]} variants - Array of image variants
 * @property {Function} onSelect - Callback when variant selected
 * @property {string} selectedId - ID of selected variant
 */

/**
 * ImageVariantsGrid Component - Display generated image variants
 * @param {ImageVariantsGridProps} props
 */
export function ImageVariantsGrid({
  variants,
  onSelect,
  selectedId,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {variants.map((variant) => (
        <div
          key={variant.id}
          onClick={() => onSelect(variant)}
          className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-colors ${
            selectedId === variant.id
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <img
            src={variant.url}
            alt={variant.headline}
            className="w-full h-auto object-cover"
          />
          <div className="p-3 bg-white">
            <h3 className="font-semibold text-sm">{variant.headline}</h3>
            <p className="text-xs text-gray-600 mt-1">{variant.subheadline}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
