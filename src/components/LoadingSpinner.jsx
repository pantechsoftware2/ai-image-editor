'use client';

/**
 * LoadingSpinner Component - Animated loading indicator
 * @param {Object} props
 * @param {string} props.text - Text to display
 */
export function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
      <p className="text-gray-600">{text}</p>
    </div>
  );
}
