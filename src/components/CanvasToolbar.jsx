/**
 * Canvas Toolbar Component
 * Text editing tools: font color, size, family, alignment
 */
'use client';

import { useState, useEffect } from 'react';

export function CanvasToolbar({ fabricCanvas, onError }) {
  const [selectedObject, setSelectedObject] = useState(null);
  const [textColor, setTextColor] = useState('#000000');
  const [fontSize, setFontSize] = useState(24);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [textAlign, setTextAlign] = useState('left');
  const [showToolbar, setShowToolbar] = useState(false);

  const FONT_FAMILIES = [
    'Arial',
    'Times New Roman',
    'Courier New',
    'Georgia',
    'Verdana',
    'Comic Sans MS',
    'Impact',
  ];

  useEffect(() => {
    if (!fabricCanvas) return;

    const handleSelection = () => {
      const activeObject = fabricCanvas.getActiveObject();
      if (activeObject && activeObject.type === 'text') {
        setSelectedObject(activeObject);
        setTextColor(activeObject.fill || '#000000');
        setFontSize(activeObject.fontSize || 24);
        setFontFamily(activeObject.fontFamily || 'Arial');
        setTextAlign(activeObject.textAlign || 'left');
        setShowToolbar(true);
      } else {
        setShowToolbar(false);
      }
    };

    const handleDeselection = () => {
      setShowToolbar(false);
      setSelectedObject(null);
    };

    fabricCanvas.on('selection:created', handleSelection);
    fabricCanvas.on('selection:updated', handleSelection);
    fabricCanvas.on('selection:cleared', handleDeselection);

    return () => {
      fabricCanvas.off('selection:created', handleSelection);
      fabricCanvas.off('selection:updated', handleSelection);
      fabricCanvas.off('selection:cleared', handleDeselection);
    };
  }, [fabricCanvas]);

  const updateTextColor = (color) => {
    if (!selectedObject) return;
    setTextColor(color);
    selectedObject.set({ fill: color });
    fabricCanvas.renderAll();
  };

  const updateFontSize = (size) => {
    if (!selectedObject) return;
    const newSize = Math.max(8, Math.min(200, parseInt(size)));
    setFontSize(newSize);
    selectedObject.set({ fontSize: newSize });
    fabricCanvas.renderAll();
  };

  const updateFontFamily = (family) => {
    if (!selectedObject) return;
    setFontFamily(family);
    selectedObject.set({ fontFamily: family });
    fabricCanvas.renderAll();
  };

  const updateTextAlign = (align) => {
    if (!selectedObject) return;
    setTextAlign(align);
    selectedObject.set({ textAlign: align });
    fabricCanvas.renderAll();
  };

  const addNewText = () => {
    if (!fabricCanvas) return;

    try {
      const text = new fabric.Text('Click to edit', {
        left: 100,
        top: 100,
        fill: textColor,
        fontSize: fontSize,
        fontFamily: fontFamily,
        editable: true,
      });

      fabricCanvas.add(text);
      fabricCanvas.setActiveObject(text);
      fabricCanvas.renderAll();
    } catch (error) {
      console.error('Failed to add text:', error);
      onError?.('Failed to add text');
    }
  };

  const duplicateText = () => {
    if (!selectedObject || selectedObject.type !== 'text') return;

    try {
      const clone = fabric.util.object.clone(selectedObject);
      clone.set({
        left: selectedObject.left + 20,
        top: selectedObject.top + 20,
      });
      fabricCanvas.add(clone);
      fabricCanvas.setActiveObject(clone);
      fabricCanvas.renderAll();
    } catch (error) {
      console.error('Failed to duplicate text:', error);
      onError?.('Failed to duplicate text');
    }
  };

  const deleteText = () => {
    if (!selectedObject) return;

    try {
      fabricCanvas.remove(selectedObject);
      fabricCanvas.renderAll();
      setShowToolbar(false);
    } catch (error) {
      console.error('Failed to delete text:', error);
      onError?.('Failed to delete text');
    }
  };

  const increaseFontSize = () => {
    updateFontSize(fontSize + 2);
  };

  const decreaseFontSize = () => {
    updateFontSize(fontSize - 2);
  };

  return (
    <div className="space-y-3">
      {/* Quick Add Text Button */}
      <button
        onClick={addNewText}
        className="w-full px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm font-medium transition"
      >
        + Add Text
      </button>

      {/* Text Toolbar - Show when text is selected */}
      {showToolbar && selectedObject && (
        <div className="bg-gray-100 border border-gray-300 rounded p-3 space-y-3">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-gray-700 w-16">
              Color:
            </label>
            <input
              type="color"
              value={textColor}
              onChange={(e) => updateTextColor(e.target.value)}
              className="w-10 h-8 border border-gray-300 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-gray-700 w-16">
              Font:
            </label>
            <select
              value={fontFamily}
              onChange={(e) => updateFontFamily(e.target.value)}
              className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
            >
              {FONT_FAMILIES.map(font => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-gray-700 w-16">
              Size:
            </label>
            <button
              onClick={decreaseFontSize}
              className="px-2 py-1 bg-gray-300 hover:bg-gray-400 rounded text-xs font-medium"
            >
              −
            </button>
            <input
              type="number"
              value={fontSize}
              onChange={(e) => updateFontSize(e.target.value)}
              className="w-12 px-2 py-1 border border-gray-300 rounded text-xs text-center"
              min="8"
              max="200"
            />
            <button
              onClick={increaseFontSize}
              className="px-2 py-1 bg-gray-300 hover:bg-gray-400 rounded text-xs font-medium"
            >
              +
            </button>
          </div>

          <div className="flex items-center gap-1">
            <label className="text-xs font-semibold text-gray-700 w-16">
              Align:
            </label>
            {['left', 'center', 'right'].map(align => (
              <button
                key={align}
                onClick={() => updateTextAlign(align)}
                className={`flex-1 px-2 py-1 rounded text-xs font-medium transition ${
                  textAlign === align
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              >
                {align.charAt(0).toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={duplicateText}
              className="flex-1 px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-xs font-medium transition"
            >
              Duplicate
            </button>
            <button
              onClick={deleteText}
              className="flex-1 px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs font-medium transition"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
