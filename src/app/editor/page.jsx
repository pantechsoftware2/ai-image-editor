'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Canvas } from '@/components/Canvas';
import { CanvasToolbar } from '@/components/CanvasToolbar';
import { Toolbar } from '@/components/Toolbar';
import { ImageVariantsGrid } from '@/components/ImageVariantsGrid';
import { StyleChips } from '@/components/StyleChips';
import { Toast } from '@/components/Toast';
import { useEditorStore } from '@/store/editor-store';
import { TEMPLATES } from '@/lib/templates';
import { uploadBase64ImageToStorage } from '@/lib/storage-utils';
import { exportCanvasToPNG, exportCanvasToJPG, getCanvasDimensions } from '@/lib/canvas-export';
import { saveProject, loadProject } from '@/lib/project-manager';
import { regenerateText, generateCopySuggestions } from '@/lib/vertex-ai';
import { retryWithBackoff, getErrorMessage, logErrorToService } from '@/lib/error-handler';

/**
 * Editor - Main editing interface with full feature set
 * Features: Image generation, canvas merging, text tools, project saving, export
 */
export default function EditorPage() {
  const router = useRouter();
  const editorStore = useEditorStore();
  const fabricCanvasRef = useRef(null);
  
  // Brand & Prompt State
  const [brandData, setBrandData] = useState(null);
  const [userPrompt, setUserPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(null);
  
  // Image Generation State
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [useTextBaking, setUseTextBaking] = useState(false);
  const [textBakingContent, setTextBakingContent] = useState('');
  
  // Project Management State
  const [projectName, setProjectName] = useState('Untitled Design');
  const [isSaving, setIsSaving] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  
  // Text Regeneration State
  const [showCopySuggestions, setShowCopySuggestions] = useState(false);
  const [copySuggestions, setCopySuggestions] = useState(null);
  const [isRegeneratingText, setIsRegeneratingText] = useState(false);
  
  // UI State
  const [toast, setToast] = useState(null);
  const [showExportMenu, setShowExportMenu] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('brandData');
    if (stored) {
      setBrandData(JSON.parse(stored));
    }
  }, []);

  const handleGenerateImages = async () => {
    if (!userPrompt.trim() || !brandData) {
      setToast({ type: 'error', message: 'Please enter a prompt' });
      return;
    }

    setLoading(true);
    setToast(null);
    
    try {
      await retryWithBackoff(async () => {
        // Build request with selected style and text baking option
        const requestBody = {
          brandColors: brandData.colors,
          brandVibe: brandData.vibe,
          userRequest: userPrompt,
          templateId: editorStore.template.id,
          styleChip: selectedStyle,
          useTextBaking,
          textBakingContent: useTextBaking ? textBakingContent : '',
        };

        const promptResponse = await fetch('/api/generate-prompt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        });

        if (!promptResponse.ok) throw new Error('Failed to generate prompt');
        const promptData = await promptResponse.json();

        // Extract the imagen_prompt from nested response
        const imagenPrompt = promptData.data?.imagen_prompt || promptData.imagen_prompt;
        if (!imagenPrompt) throw new Error('No image prompt generated');

        const imageResponse = await fetch('/api/generate-images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imagenPrompt,
            count: 4,
            templateId: editorStore.template.id,
          }),
        });

        if (!imageResponse.ok) throw new Error('Failed to generate images');
        const imageData = await imageResponse.json();
        
        // Store variants with uploaded URLs
        const variantsWithUrls = await Promise.all(
          (imageData.variants || []).map(async (variant) => {
            // Upload base64 to Supabase Storage if available
            if (variant.base64Data) {
              const uploadResult = await uploadBase64ImageToStorage(
                variant.base64Data,
                variant.mimeType || 'image/jpeg',
                'generated-images',
                `variant-${variant.index}-${Date.now()}.jpg`
              );
              
              return {
                ...variant,
                imageUrl: uploadResult.success ? uploadResult.url : null,
                storagePath: uploadResult.success ? uploadResult.path : null,
                stored: uploadResult.success,
              };
            }
            return variant;
          })
        );

        setVariants(variantsWithUrls);
        setToast({ type: 'success', message: '4 image variants generated! Click one to load on canvas.' });
      }, {
        maxAttempts: 3,
        initialDelayMs: 1000,
      });
    } catch (error) {
      console.error('Generation error:', error);
      logErrorToService(error, { operation: 'generateImages', context: userPrompt });
      const errorMsg = getErrorMessage(error, 'image generation');
      setToast({ type: 'error', message: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectVariant = async (variant) => {
    try {
      setSelectedVariantId(variant.id);
      editorStore.setSelectedVariant(variant);

      // Load image as background on canvas
      if (variant.imageUrl || variant.base64Data) {
        const imageSource = variant.imageUrl || `data:${variant.mimeType};base64,${variant.base64Data}`;
        
        // Get fabric canvas from window
        if (window.fabricCanvas) {
          const canvas = window.fabricCanvas;
          
          // Set background image
          const img = new Image();
          img.onload = () => {
            const fabricImg = new fabric.Image(img, {
              left: 0,
              top: 0,
              scaleX: canvas.width / img.width,
              scaleY: canvas.height / img.height,
            });
            
            // Send image to back
            canvas.add(fabricImg);
            canvas.sendToBack();
            canvas.renderAll();
          };
          img.onerror = () => {
            setToast({ type: 'error', message: 'Failed to load image' });
          };
          img.src = imageSource;
          
          setToast({ type: 'success', message: 'Image loaded on canvas!' });
        }
      }
    } catch (error) {
      console.error('Select variant error:', error);
      setToast({ type: 'error', message: 'Failed to load image' });
    }
  };

  const handleRegenerateText = async () => {
    if (!selectedVariantId) {
      setToast({ type: 'error', message: 'Please select an image first' });
      return;
    }

    setIsRegeneratingText(true);
    setToast(null);

    try {
      const result = await regenerateText({
        currentText: projectName,
        userRequest: userPrompt,
        brandColors: brandData?.colors || [],
        brandVibe: brandData?.vibe || 'modern',
        purpose: 'headline',
      });

      setCopySuggestions(result.data.variations || []);
      setShowCopySuggestions(true);
      setToast({ type: 'success', message: '5 text variations generated!' });
    } catch (error) {
      console.error('Text regeneration error:', error);
      const errorMsg = getErrorMessage(error, 'text regeneration');
      setToast({ type: 'error', message: errorMsg });
    } finally {
      setIsRegeneratingText(false);
    }
  };

  const handleExportCanvas = async (format) => {
    if (!window.fabricCanvas) {
      setToast({ type: 'error', message: 'Canvas not ready' });
      return;
    }

    try {
      const filename = `${projectName || 'design'}-${new Date().getTime()}`;
      
      if (format === 'png') {
        await exportCanvasToPNG(window.fabricCanvas, filename, 2);
      } else if (format === 'jpg') {
        await exportCanvasToJPG(window.fabricCanvas, filename, 0.95, 2);
      }
      
      setToast({ type: 'success', message: `Design exported as ${format.toUpperCase()}!` });
      setShowExportMenu(false);
    } catch (error) {
      console.error('Export error:', error);
      const errorMsg = getErrorMessage(error, 'export');
      setToast({ type: 'error', message: errorMsg });
    }
  };

  const handleSaveProject = async () => {
    if (!window.fabricCanvas) {
      setToast({ type: 'error', message: 'Canvas not ready' });
      return;
    }

    setIsSaving(true);
    setToast(null);

    try {
      const canvasData = window.fabricCanvas.toJSON();
      const dimensions = getCanvasDimensions(window.fabricCanvas);
      
      const projectData = {
        id: currentProjectId || undefined,
        name: projectName,
        description: userPrompt,
        canvasJson: canvasData,
        brandData: brandData,
        metadata: {
          templateId: editorStore.template.id,
          selectedStyle: selectedStyle?.id,
          dimensions,
          savedAt: new Date().toISOString(),
        },
      };

      const saved = await saveProject(projectData);
      setCurrentProjectId(saved.id);
      setToast({ type: 'success', message: `Project "${projectName}" saved!` });
    } catch (error) {
      console.error('Save error:', error);
      logErrorToService(error, { operation: 'saveProject', projectName });
      const errorMsg = getErrorMessage(error, 'save');
      setToast({ type: 'error', message: errorMsg });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadProject = async () => {
    if (!currentProjectId) {
      setToast({ type: 'error', message: 'No project loaded' });
      return;
    }

    try {
      const project = await loadProject(currentProjectId);
      if (project.canvas_json && window.fabricCanvas) {
        await new Promise((resolve) => {
          window.fabricCanvas.loadFromJSON(project.canvas_json, () => {
            window.fabricCanvas.renderAll();
            resolve();
          });
        });
        setToast({ type: 'success', message: 'Project loaded!' });
      }
    } catch (error) {
      console.error('Load error:', error);
      const errorMsg = getErrorMessage(error, 'load');
      setToast({ type: 'error', message: errorMsg });
    }
  };

  if (!brandData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading brand data...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Toast Notifications */}
      {toast && <Toast type={toast.type} message={toast.message} onDismiss={() => setToast(null)} />}

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">Vizly Editor</h1>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="text-xs text-gray-500 border-none bg-transparent px-0 w-64"
              placeholder="Project name..."
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSaveProject}
              disabled={isSaving}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 font-semibold text-sm"
            >
              {isSaving ? 'Saving...' : 'Save Project'}
            </button>
            <button
              onClick={() => router.push('/projects')}
              className="px-4 py-2 border rounded hover:bg-gray-50 font-semibold text-sm"
            >
              My Projects
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 border rounded hover:bg-gray-50 text-sm"
            >
              Exit
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Canvas */}
        <div className="lg:col-span-2">
          <div className="mb-6 border rounded-lg bg-white p-4">
            <Canvas containerId="editor-canvas" width={1080} height={1350} />
          </div>
          
          {/* Canvas Toolbar for text editing */}
          <div className="mb-6 bg-white rounded-lg p-4 border">
            <h3 className="font-semibold mb-3 text-sm">Text Tools</h3>
            <CanvasToolbar fabricCanvas={window.fabricCanvas} onError={(msg) => setToast({ type: 'error', message: msg })} />
          </div>

          {/* Export Controls */}
          <div className="bg-white rounded-lg p-4 border flex gap-3">
            <div className="relative flex-1">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 font-semibold text-sm"
              >
                📥 Export Design
              </button>
              {showExportMenu && (
                <div className="absolute top-full mt-2 left-0 bg-white border rounded shadow-lg w-full z-10">
                  <button
                    onClick={() => handleExportCanvas('png')}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                  >
                    📄 Export as PNG (2x resolution)
                  </button>
                  <button
                    onClick={() => handleExportCanvas('jpg')}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm border-t"
                  >
                    🖼️ Export as JPG (95% quality)
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={handleLoadProject}
              disabled={!currentProjectId}
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50 font-semibold text-sm"
            >
              Reload
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Brand Info */}
          <div className="bg-white rounded-lg p-4 border">
            <h3 className="font-semibold mb-3 text-sm">Brand Info</h3>
            <img
              src={brandData.logo}
              alt="Brand"
              className="w-20 h-20 object-cover mb-3 rounded"
            />
            <div className="space-y-2 text-sm">
              <p>
                <strong>Vibe:</strong> {brandData.vibe}
              </p>
              <p>
                <strong>Colors:</strong>
              </p>
              <div className="flex gap-2">
                {brandData.colors.map((color) => (
                  <div
                    key={color}
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Style Selection */}
          <div className="bg-white rounded-lg p-4 border">
            <h3 className="font-semibold mb-3 text-sm">Visual Style</h3>
            <StyleChips
              onSelect={setSelectedStyle}
              selectedId={selectedStyle?.id}
            />
          </div>

          {/* Generate Images */}
          <div className="bg-white rounded-lg p-4 border">
            <h3 className="font-semibold mb-3 text-sm">Generate Images</h3>
            <textarea
              placeholder="Describe what you want... (e.g., 'Coffee with minimalist design')"
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              className="w-full px-3 py-2 border rounded text-sm mb-3 h-20"
            />
            
            {/* Text Baking Toggle */}
            <div className="mb-3 p-3 bg-yellow-50 rounded border border-yellow-200">
              <label className="flex items-center gap-2 cursor-pointer mb-2">
                <input
                  type="checkbox"
                  checked={useTextBaking}
                  onChange={(e) => setUseTextBaking(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-xs font-semibold text-yellow-900">Use AI Text Effects?</span>
              </label>
              <p className="text-xs text-yellow-700 mb-2">
                ⚠️ Warning: Text will be baked into the image and cannot be edited later.
              </p>
              {useTextBaking && (
                <input
                  type="text"
                  placeholder="Text to render (e.g., 'SALE', 'New')"
                  value={textBakingContent}
                  onChange={(e) => setTextBakingContent(e.target.value)}
                  className="w-full px-2 py-1 border rounded text-xs"
                />
              )}
            </div>

            <button
              onClick={handleGenerateImages}
              disabled={loading || !userPrompt.trim()}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 font-semibold text-sm mb-2"
            >
              {loading ? 'Generating...' : 'Generate 4 Variants'}
            </button>

            {selectedVariantId && (
              <button
                onClick={handleRegenerateText}
                disabled={isRegeneratingText}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 font-semibold text-xs"
              >
                {isRegeneratingText ? 'Regenerating...' : '✨ Regenerate Headline'}
              </button>
            )}
          </div>

          {/* Copy Suggestions */}
          {showCopySuggestions && copySuggestions && (
            <div className="bg-white rounded-lg p-4 border">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-sm">Headline Suggestions</h3>
                <button
                  onClick={() => setShowCopySuggestions(false)}
                  className="text-gray-400 hover:text-gray-600 text-lg"
                >
                  ×
                </button>
              </div>
              <div className="space-y-2">
                {copySuggestions.map((text, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setProjectName(text);
                      setShowCopySuggestions(false);
                      setToast({ type: 'success', message: 'Headline updated!' });
                    }}
                    className="w-full text-left px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded text-xs border border-blue-200 transition"
                  >
                    {text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Template Selector */}
          <div className="bg-white rounded-lg p-4 border">
            <h3 className="font-semibold mb-3 text-sm">Template</h3>
            <div className="space-y-2">
              {TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  onClick={() => editorStore.setTemplate(template)}
                  className={`w-full text-left px-3 py-2 rounded text-xs ${
                    editorStore.template.id === template.id
                      ? 'bg-blue-100 text-blue-900 font-semibold'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {template.name}
                </button>
              ))}
            </div>
          </div>

          {/* Image Variants */}
          {variants.length > 0 && (
            <div className="bg-white rounded-lg p-4 border">
              <h3 className="font-semibold mb-2 text-sm">Generated Variants ({variants.length})</h3>
              <p className="text-xs text-gray-500 mb-3">Click an image to load on canvas</p>
              <ImageVariantsGrid
                variants={variants}
                onSelect={handleSelectVariant}
                selectedId={selectedVariantId}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
