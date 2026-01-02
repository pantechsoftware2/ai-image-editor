'use client';

import { useState } from 'react';

const STYLE_CHIPS = [
  { id: 'minimalist', label: 'Minimalist', prompt: 'Clean, minimal design with lots of white space' },
  { id: 'bold', label: 'Bold', prompt: 'High contrast, bold typography and colors' },
  { id: 'luxury', label: 'Luxury', prompt: 'Elegant, premium, sophisticated aesthetic' },
  { id: 'modern', label: 'Modern', prompt: 'Contemporary, sleek, professional design' },
  { id: 'playful', label: 'Playful', prompt: 'Fun, colorful, creative and energetic' },
  { id: 'dark', label: 'Dark', prompt: 'Dark mode, moody, atmospheric lighting' },
];

/**
 * StyleChips Component - Quick style selection buttons
 * @param {Object} props
 * @param {Function} props.onSelect - Callback when style selected (receives full style object)
 * @param {string} props.selectedId - ID of currently selected style
 */
export function StyleChips({ onSelect, selectedId = null }) {
  return (
    <div className="flex flex-wrap gap-2">
      {STYLE_CHIPS.map((chip) => (
        <button
          key={chip.id}
          onClick={() => onSelect(chip)}
          className={`px-3 py-1 rounded-full text-sm transition ${
            selectedId === chip.id
              ? 'bg-blue-600 text-white font-semibold'
              : 'bg-gray-200 hover:bg-blue-500 hover:text-white text-gray-700'
          }`}
          title={chip.prompt}
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
}

export { STYLE_CHIPS };
