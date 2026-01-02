'use client';

/**
 * @typedef {Object} ToolbarProps
 * @property {Function} onFontColorChange - Callback for color changes
 * @property {Function} onFontSizeChange - Callback for size changes
 * @property {Function} onFontFamilyChange - Callback for font changes
 * @property {Function} onDownload - Callback for downloads
 */

/**
 * Toolbar Component - Text editing controls
 * @param {ToolbarProps} props
 */
export function Toolbar({
  onFontColorChange,
  onFontSizeChange,
  onFontFamilyChange,
  onDownload,
}) {
  return (
    <div className="bg-white border rounded-lg p-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Font Color */}
        <div>
          <label className="block text-sm font-medium mb-2">Text Color</label>
          <input
            type="color"
            onChange={(e) => onFontColorChange(e.target.value)}
            className="w-full h-10 rounded cursor-pointer"
          />
        </div>

        {/* Font Size */}
        <div>
          <label className="block text-sm font-medium mb-2">Font Size</label>
          <input
            type="range"
            min="12"
            max="120"
            defaultValue="40"
            onChange={(e) => onFontSizeChange(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Font Family */}
      <div>
        <label className="block text-sm font-medium mb-2">Font Family</label>
        <select
          onChange={(e) => onFontFamilyChange(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        >
          <option>Arial</option>
          <option>Helvetica</option>
          <option>Times New Roman</option>
          <option>Courier New</option>
          <option>Verdana</option>
          <option>Georgia</option>
        </select>
      </div>

      {/* Download */}
      <div className="flex gap-2">
        <button
          onClick={() => onDownload('png')}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Download PNG
        </button>
        <button
          onClick={() => onDownload('jpg')}
          className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Download JPG
        </button>
      </div>
    </div>
  );
}
