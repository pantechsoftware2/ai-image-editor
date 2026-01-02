import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';

/**
 * Canvas hook for managing Fabric.js canvas
 * @param {string} containerId
 * @param {number} width
 * @param {number} height
 * @returns {Object}
 */
export function useCanvas(containerId, width = 1080, height = 1350) {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  // Initialize canvas
  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
      const fabricCanvas = new fabric.Canvas(containerId, {
        width,
        height,
        backgroundColor: '#ffffff',
        selection: true,
        preserveObjectStacking: true,
      });

      fabricCanvasRef.current = fabricCanvas;
      canvasRef.current = container;
      setIsReady(true);

      return () => {
        fabricCanvas.dispose();
      };
    } catch (error) {
      console.error('Canvas initialization error:', error);
    }
  }, [containerId, width, height]);

  return {
    canvas: fabricCanvasRef.current,
    container: canvasRef.current,
    isReady,
  };
}
