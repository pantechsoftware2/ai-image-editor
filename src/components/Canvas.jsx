'use client';

import { useEffect, useRef } from 'react';
import { fabric } from 'fabric';

/**
 * Canvas Component - Fabric.js canvas with responsive sizing
 * @param {Object} props
 * @param {string} props.containerId - Canvas element ID
 * @param {number} props.width - Canvas width (1080 default)
 * @param {number} props.height - Canvas height (1350 default)
 * @param {Function} props.onCanvasReady - Callback when canvas is ready
 */
export function Canvas({ 
  containerId = 'editor-canvas', 
  width = 1080, 
  height = 1350,
  onCanvasReady = null 
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize fabric canvas
    try {
      const fabricCanvas = new fabric.Canvas(containerId, {
        width,
        height,
        backgroundColor: '#ffffff',
        selection: true,
        preserveObjectStacking: true,
        renderOnAddRemove: true,
      });

      fabricCanvasRef.current = fabricCanvas;
      canvasRef.current = containerRef.current.querySelector('canvas');

      // Expose canvas globally for image merging
      window.fabricCanvas = fabricCanvas;

      // Call callback if provided
      if (onCanvasReady) {
        onCanvasReady(fabricCanvas);
      }

      // Handle responsive resize
      const handleResize = () => {
        if (!containerRef.current || !fabricCanvas) return;

        const container = containerRef.current;
        const containerWidth = container.clientWidth;
        
        // Calculate responsive dimensions maintaining aspect ratio
        const aspectRatio = width / height;
        let newWidth = containerWidth - 32; // Account for padding
        let newHeight = newWidth / aspectRatio;

        // Prevent canvas from being too small
        if (newWidth < 300) {
          newWidth = 300;
          newHeight = newWidth / aspectRatio;
        }

        // Scale factor for rendering
        const scaleFactor = newWidth / width;

        // Update canvas CSS dimensions
        fabricCanvas.setWidth(newWidth);
        fabricCanvas.setHeight(newHeight);

        // Scale all objects
        fabricCanvas.getObjects().forEach((obj) => {
          obj.scale(scaleFactor);
        });

        // Recalculate zoom to fit
        const maxZoom = Math.min(
          containerWidth / width,
          container.clientHeight / height
        );
        fabricCanvas.setZoom(maxZoom);

        fabricCanvas.renderAll();
      };

      // Initial resize
      setTimeout(handleResize, 100);

      // Add resize listener
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        fabricCanvas.dispose();
      };
    } catch (error) {
      console.error('Canvas initialization error:', error);
    }
  }, [containerId, width, height, onCanvasReady]);

  return (
    <div
      ref={containerRef}
      className="flex justify-center items-center bg-gray-100 p-4 rounded-lg w-full overflow-auto"
      style={{
        aspectRatio: `${width} / ${height}`,
        maxHeight: '700px',
      }}
    >
      <canvas
        id={containerId}
        style={{
          border: '1px solid #ddd',
          backgroundColor: '#fff',
          cursor: 'crosshair',
        }}
      />
    </div>
  );
}
