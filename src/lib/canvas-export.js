/**
 * Canvas Export Utilities
 * Export fabric canvas to PNG/JPG with high resolution
 */

/**
 * Export canvas to PNG with high resolution
 * @param {fabric.Canvas} fabricCanvas - The fabric canvas instance
 * @param {string} filename - Output filename (without extension)
 * @param {number} scale - Resolution multiplier (default 2 for 2x resolution)
 * @returns {Promise<Blob>} PNG blob
 */
export async function exportCanvasToPNG(fabricCanvas, filename = 'design', scale = 2) {
  try {
    if (!fabricCanvas) {
      throw new Error('Canvas instance not available');
    }

    const dataURL = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: scale,
      withoutShadow: false,
    });

    // Convert data URL to blob
    const blob = await fetch(dataURL).then(res => res.blob());
    
    // Download file
    downloadBlob(blob, `${filename}.png`);
    
    return blob;
  } catch (error) {
    console.error('PNG export failed:', error);
    throw new Error(`Failed to export PNG: ${error.message}`);
  }
}

/**
 * Export canvas to JPG with high resolution
 * @param {fabric.Canvas} fabricCanvas - The fabric canvas instance
 * @param {string} filename - Output filename (without extension)
 * @param {number} quality - JPEG quality 0-1 (default 0.95)
 * @param {number} scale - Resolution multiplier (default 2 for 2x resolution)
 * @returns {Promise<Blob>} JPEG blob
 */
export async function exportCanvasToJPG(fabricCanvas, filename = 'design', quality = 0.95, scale = 2) {
  try {
    if (!fabricCanvas) {
      throw new Error('Canvas instance not available');
    }

    const dataURL = fabricCanvas.toDataURL({
      format: 'jpeg',
      quality: quality,
      multiplier: scale,
      withoutShadow: false,
    });

    const blob = await fetch(dataURL).then(res => res.blob());
    downloadBlob(blob, `${filename}.jpg`);
    
    return blob;
  } catch (error) {
    console.error('JPG export failed:', error);
    throw new Error(`Failed to export JPG: ${error.message}`);
  }
}

/**
 * Export canvas as PDF (using canvas2pdf library if available)
 * @param {fabric.Canvas} fabricCanvas - The fabric canvas instance
 * @param {string} filename - Output filename (without extension)
 * @returns {Promise<Blob>} PDF blob
 */
export async function exportCanvasToPDF(fabricCanvas, filename = 'design') {
  try {
    if (!fabricCanvas) {
      throw new Error('Canvas instance not available');
    }

    // For now, export as high-quality PNG and note this in UI
    // PDF export requires additional library (html2pdf, jsPDF, etc.)
    const dataURL = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 3, // Higher resolution for PDF
      withoutShadow: false,
    });

    const blob = await fetch(dataURL).then(res => res.blob());
    downloadBlob(blob, `${filename}_preview.png`);
    
    console.warn('PDF export not fully implemented. Exported as high-res PNG instead.');
    return blob;
  } catch (error) {
    console.error('PDF export failed:', error);
    throw new Error(`Failed to export PDF: ${error.message}`);
  }
}

/**
 * Get canvas as data URL with specified format and quality
 * @param {fabric.Canvas} fabricCanvas - The fabric canvas instance
 * @param {string} format - 'png' or 'jpeg'
 * @param {number} quality - Quality (0-1, only for jpeg)
 * @param {number} scale - Resolution multiplier
 * @returns {string} Data URL
 */
export function getCanvasDataURL(fabricCanvas, format = 'png', quality = 0.95, scale = 2) {
  try {
    if (!fabricCanvas) {
      throw new Error('Canvas instance not available');
    }

    return fabricCanvas.toDataURL({
      format,
      quality,
      multiplier: scale,
      withoutShadow: false,
    });
  } catch (error) {
    console.error(`Failed to get ${format} data URL:`, error);
    throw new Error(`Failed to generate ${format} preview: ${error.message}`);
  }
}

/**
 * Trigger browser download for a blob
 * @param {Blob} blob - The blob to download
 * @param {string} filename - Filename for download
 */
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Copy canvas to clipboard as image
 * @param {fabric.Canvas} fabricCanvas - The fabric canvas instance
 * @returns {Promise<void>}
 */
export async function copyCanvasToClipboard(fabricCanvas) {
  try {
    if (!fabricCanvas) {
      throw new Error('Canvas instance not available');
    }

    const dataURL = getCanvasDataURL(fabricCanvas, 'png', 1, 2);
    const blob = await fetch(dataURL).then(res => res.blob());

    await navigator.clipboard.write([
      new ClipboardItem({ [blob.type]: blob })
    ]);

    return true;
  } catch (error) {
    console.error('Copy to clipboard failed:', error);
    throw new Error(`Failed to copy to clipboard: ${error.message}`);
  }
}

/**
 * Get canvas dimensions info
 * @param {fabric.Canvas} fabricCanvas - The fabric canvas instance
 * @returns {Object} Dimensions info
 */
export function getCanvasDimensions(fabricCanvas) {
  if (!fabricCanvas) return null;

  return {
    width: fabricCanvas.width,
    height: fabricCanvas.height,
    aspectRatio: fabricCanvas.width / fabricCanvas.height,
    quality: {
      '1x': `${fabricCanvas.width}x${fabricCanvas.height}`,
      '2x': `${fabricCanvas.width * 2}x${fabricCanvas.height * 2}`,
      '3x': `${fabricCanvas.width * 3}x${fabricCanvas.height * 3}`,
    }
  };
}

/**
 * Generate downloadable design file with metadata
 * @param {fabric.Canvas} fabricCanvas - The fabric canvas instance
 * @param {Object} projectData - Project metadata to include
 * @returns {Promise<Blob>} JSON blob with design data and metadata
 */
export async function exportDesignFile(fabricCanvas, projectData = {}) {
  try {
    if (!fabricCanvas) {
      throw new Error('Canvas instance not available');
    }

    const designData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      canvas: {
        json: fabricCanvas.toJSON(),
        width: fabricCanvas.width,
        height: fabricCanvas.height,
      },
      metadata: {
        ...projectData,
        exportedAt: new Date().toISOString(),
      }
    };

    const blob = new Blob([JSON.stringify(designData, null, 2)], {
      type: 'application/json'
    });

    downloadBlob(blob, `${projectData.name || 'design'}.json`);
    return blob;
  } catch (error) {
    console.error('Design file export failed:', error);
    throw new Error(`Failed to export design file: ${error.message}`);
  }
}

/**
 * Load design file and reconstruct canvas
 * @param {File} file - JSON design file
 * @param {fabric.Canvas} fabricCanvas - The fabric canvas instance
 * @returns {Promise<Object>} Loaded design data
 */
export async function importDesignFile(file, fabricCanvas) {
  try {
    if (!fabricCanvas) {
      throw new Error('Canvas instance not available');
    }

    const text = await file.text();
    const designData = JSON.parse(text);

    // Reconstruct canvas from JSON
    await new Promise((resolve, reject) => {
      fabricCanvas.loadFromJSON(designData.canvas.json, () => {
        fabricCanvas.renderAll();
        resolve();
      }, (err) => {
        reject(err);
      });
    });

    return designData.metadata;
  } catch (error) {
    console.error('Design file import failed:', error);
    throw new Error(`Failed to import design file: ${error.message}`);
  }
}
