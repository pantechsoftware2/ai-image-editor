'use client';

import { useState } from 'react';

/**
 * @typedef {Object} BrandModalProps
 * @property {Object} brandData - Brand information
 * @property {string[]} brandData.colors - Brand colors
 * @property {string[]} brandData.fonts - Brand fonts
 * @property {string|null} brandData.logo - Logo URL
 * @property {string} brandData.vibe - Brand vibe
 * @property {Function} onConfirm - Callback when confirmed
 * @property {Function} onClose - Callback when closed
 */

/**
 * BrandModal Component - Allows user to confirm/edit extracted brand data
 * @param {BrandModalProps} props
 */
export function BrandModal({ brandData, onConfirm, onClose }) {
  const [data, setData] = useState(brandData);
  const [logoPreview, setLogoPreview] = useState(brandData?.logo);
  const [activeTab, setActiveTab] = useState('colors');

  const handleColorChange = (index, value) => {
    const newColors = [...data.colors];
    newColors[index] = value;
    setData({ ...data, colors: newColors });
  };

  const handleAddColor = () => {
    setData({ ...data, colors: [...data.colors, '#000000'] });
  };

  const handleRemoveColor = (index) => {
    const newColors = data.colors.filter((_, i) => i !== index);
    setData({ ...data, colors: newColors });
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file is an image
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      // Max file size 5MB
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        setLogoPreview(result);
        setData({ ...data, logo: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = () => {
    if (data.colors.length === 0) {
      alert('Please add at least one color');
      return;
    }
    onConfirm(data);
  };

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})`
      : hex;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6">
          <h2 className="text-2xl font-bold text-gray-900">Brand Confirmation</h2>
          <p className="text-gray-600 text-sm mt-1">Review and customize your extracted brand data</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Logo Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Brand Logo</h3>
            <div className="flex gap-6">
              <div className="flex-1">
                {logoPreview ? (
                  <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center h-40">
                    <img
                      src={logoPreview}
                      alt="Brand Logo"
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        e.target.src = '';
                        e.target.className = 'hidden';
                      }}
                    />
                  </div>
                ) : (
                  <div className="bg-gray-100 rounded-lg p-4 h-40 flex items-center justify-center text-gray-500">
                    <p>No logo found</p>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <label className="block mb-3">
                  <span className="text-sm font-medium text-gray-700 mb-2 block">Upload Logo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 cursor-pointer"
                  />
                </label>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6 border-b">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('colors')}
                className={`px-4 py-2 font-medium border-b-2 transition ${
                  activeTab === 'colors'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Colors
              </button>
              <button
                onClick={() => setActiveTab('fonts')}
                className={`px-4 py-2 font-medium border-b-2 transition ${
                  activeTab === 'fonts'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Fonts & Vibe
              </button>
            </div>
          </div>

          {/* Colors Tab */}
          {activeTab === 'colors' && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Brand Colors</h3>
              <div className="space-y-3">
                {data.colors.map((color, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="flex-1 flex items-center gap-3">
                      <input
                        type="color"
                        value={color.startsWith('#') ? color : '#000000'}
                        onChange={(e) => handleColorChange(idx, e.target.value)}
                        className="w-12 h-12 rounded cursor-pointer border border-gray-300"
                      />
                      <div className="flex-1">
                        <input
                          type="text"
                          value={color}
                          onChange={(e) => handleColorChange(idx, e.target.value)}
                          placeholder="#000000"
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm font-mono"
                        />
                        <p className="text-xs text-gray-500 mt-1">{hexToRgb(color)}</p>
                      </div>
                    </div>
                    {data.colors.length > 1 && (
                      <button
                        onClick={() => handleRemoveColor(idx)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={handleAddColor}
                className="mt-4 w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                + Add Color
              </button>

              {/* Color Preview */}
              <div className="mt-6">
                <p className="text-sm font-medium text-gray-700 mb-2">Color Preview</p>
                <div className="flex gap-2">
                  {data.colors.slice(0, 5).map((color, idx) => (
                    <div
                      key={idx}
                      className="flex-1 h-12 rounded border border-gray-300"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Fonts & Vibe Tab */}
          {activeTab === 'fonts' && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Fonts & Brand Vibe</h3>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Fonts Used</label>
                <div className="space-y-2">
                  {data.fonts && data.fonts.length > 0 ? (
                    data.fonts.map((font, idx) => (
                      <div
                        key={idx}
                        className="px-4 py-3 bg-gray-50 rounded border border-gray-200 text-sm"
                        style={{ fontFamily: font }}
                      >
                        {font}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No fonts detected</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand Vibe</label>
                <select
                  value={data.vibe}
                  onChange={(e) => setData({ ...data, vibe: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="modern">Modern</option>
                  <option value="minimalist">Minimalist</option>
                  <option value="bold">Bold</option>
                  <option value="playful">Playful</option>
                  <option value="luxury">Luxury</option>
                  <option value="natural">Natural</option>
                  <option value="tech">Tech</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t p-6 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
          >
            Confirm & Continue
          </button>
        </div>
      </div>
    </div>
  );
}
