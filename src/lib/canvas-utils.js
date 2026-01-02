/**
 * Export canvas as image
 * @param {Object} canvas - Fabric canvas
 * @param {string} format - 'png' or 'jpg'
 * @returns {Promise<Blob>}
 */
export const exportCanvasAsImage = async (canvas, format = 'png') => {
  return new Promise((resolve) => {
    const dataUrl = canvas.toDataURL({
      format: format === 'jpg' ? 'jpeg' : 'png',
      quality: 0.95,
      multiplier: 2,
    });

    fetch(dataUrl).then((res) => res.blob()).then((blob) => resolve(blob));
  });
};

/**
 * Download canvas
 * @param {Object} canvas - Fabric canvas
 * @param {string} filename
 * @param {string} format - 'png' or 'jpg'
 * @returns {Promise<void>}
 */
export const downloadCanvas = async (canvas, filename = 'image', format = 'png') => {
  const blob = await exportCanvasAsImage(canvas, format);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.${format}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Resize canvas
 * @param {Object} canvas - Fabric canvas
 * @param {number} width
 * @param {number} height
 * @returns {void}
 */
export const resizeCanvas = (canvas, width, height) => {
  canvas.setWidth(width);
  canvas.setHeight(height);
  canvas.renderAll();
};

/**
 * Add text to canvas
 * @param {Object} canvas - Fabric canvas
 * @param {string} text
 * @param {Object} options
 * @returns {Object} Fabric Text object
 */
export const addTextToCanvas = (canvas, text, options = {}) => {
  const { fabric } = canvas;

  const fabricText = new fabric.Text(text, {
    left: 100,
    top: 100,
    fontSize: 32,
    fill: '#000000',
    fontFamily: 'Arial',
    ...options,
  });

  canvas.add(fabricText);
  canvas.renderAll();
  return fabricText;
};

/**
 * Add image to canvas
 * @param {Object} canvas - Fabric canvas
 * @param {string} imageSrc
 * @param {Object} options
 * @returns {Promise<Object>} Fabric Image object
 */
export const addImageToCanvas = (canvas, imageSrc, options = {}) => {
  return new Promise((resolve, reject) => {
    const { fabric } = canvas;

    fabric.Image.fromURL(
      imageSrc,
      (img) => {
        img.set({
          left: 0,
          top: 0,
          ...options,
        });
        canvas.add(img);
        canvas.renderAll();
        resolve(img);
      },
      null,
      { crossOrigin: 'anonymous' }
    );
  });
};

/**
 * Clear canvas
 * @param {Object} canvas - Fabric canvas
 * @returns {void}
 */
export const clearCanvas = (canvas) => {
  canvas.clear();
  canvas.renderAll();
};

/**
 * Undo last action
 * @param {Object} canvas - Fabric canvas
 * @param {Array} history
 * @param {number} historyIndex
 * @returns {number} new history index
 */
export const undoCanvas = (canvas, history, historyIndex) => {
  if (historyIndex > 0) {
    const newIndex = historyIndex - 1;
    const canvasData = history[newIndex];
    canvas.loadFromJSON(canvasData, () => canvas.renderAll());
    return newIndex;
  }
  return historyIndex;
};

/**
 * Redo last action
 * @param {Object} canvas - Fabric canvas
 * @param {Array} history
 * @param {number} historyIndex
 * @returns {number} new history index
 */
export const redoCanvas = (canvas, history, historyIndex) => {
  if (historyIndex < history.length - 1) {
    const newIndex = historyIndex + 1;
    const canvasData = history[newIndex];
    canvas.loadFromJSON(canvasData, () => canvas.renderAll());
    return newIndex;
  }
  return historyIndex;
};

/**
 * Save canvas state to history
 * @param {Object} canvas - Fabric canvas
 * @param {Array} history
 * @param {number} historyIndex
 * @returns {Array} updated history
 */
export const saveToHistory = (canvas, history, historyIndex) => {
  const newHistory = history.slice(0, historyIndex + 1);
  newHistory.push(JSON.stringify(canvas.toJSON()));
  return newHistory;
};
