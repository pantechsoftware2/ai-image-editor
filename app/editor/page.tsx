'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

/**
 * Editor Page - Main editing interface with canvas
 */
export default function EditorPage() {
  const router = useRouter();
  const [brandData, setBrandData] = useState<any>(null);
  const [userPrompt, setUserPrompt] = useState('');
  const [variants, setVariants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [promptData, setPromptData] = useState<any>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('brandData');
    if (!stored) {
      router.push('/');
      return;
    }
    setBrandData(JSON.parse(stored));
  }, [router]);

  const handleGenerateImages = async () => {
    if (!userPrompt.trim() || !brandData) return;

    setLoading(true);
    try {
      // Generate prompt using Gemini
      const promptResponse = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandColors: brandData.colors,
          brandVibe: brandData.vibe,
          userRequest: userPrompt,
          templateMode: 'Headline',
        }),
      });

      if (!promptResponse.ok) throw new Error('Failed to generate prompt');
      const promptJson = await promptResponse.json();
      const geminiData = promptJson.data;
      setPromptData(geminiData);

      // Generate images using Imagen-4
      const imageResponse = await fetch('/api/generate-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: geminiData.imagen_prompt,
          userRequest: userPrompt,
          brandColors: brandData.colors,
        }),
      });

      if (!imageResponse.ok) throw new Error('Failed to generate images');
      const imageData = await imageResponse.json();
      setVariants(imageData.data.variants);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate content. Try again!');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!selectedVariant) {
      alert('Please select a variant first');
      return;
    }

    try {
      // If it's a data URL (mock SVG), convert to PNG using canvas
      if (selectedVariant.url.startsWith('data:')) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        // Set canvas size to match content dimensions (1080x1350)
        canvas.width = 1080;
        canvas.height = 1350;
        
        img.onload = () => {
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            canvas.toBlob((blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `vizly-content-${Date.now()}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
              }
            }, 'image/png');
          }
        };
        
        img.src = selectedVariant.url;
      } else {
        // Regular image URL - download directly
        const link = document.createElement('a');
        link.href = selectedVariant.url;
        link.download = `vizly-content-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download image');
    }
  };

  if (!brandData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-900">
      {/* Navigation */}
      <nav className="bg-slate-950/50 backdrop-blur border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Vizly AI
          </Link>
          <div className="space-x-4">
            <Button variant="outline" onClick={() => router.push('/')}>
              New Project
            </Button>
            <Button onClick={handleDownload} disabled={!selectedVariant}>
              Save & Download
            </Button>
          </div>
        </div>
      </nav>

      {/* Editor Layout */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar - Brand Info */}
        <aside className="w-80 bg-slate-800/50 border-r border-slate-700 p-6 overflow-y-auto">
          <h3 className="text-lg font-semibold text-white mb-4">Brand Info</h3>
          
          <div className="space-y-4">
            {/* Brand Name */}
            <div>
              <label className="text-sm text-slate-300 block mb-2">Brand Name</label>
              <div className="px-3 py-2 bg-slate-700 rounded text-white">
                {brandData.brandName}
              </div>
            </div>

            {/* Colors */}
            <div>
              <label className="text-sm text-slate-300 block mb-2">Brand Colors</label>
              <div className="flex gap-2">
                {brandData.colors.slice(0, 3).map((color: string, idx: number) => (
                  <div
                    key={idx}
                    className="w-10 h-10 rounded border border-slate-600"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Logo */}
            {brandData.logo && (
              <div>
                <label className="text-sm text-slate-300 block mb-2">Logo</label>
                <img
                  src={brandData.logo}
                  alt="Brand Logo"
                  className="w-full h-32 object-contain bg-slate-700 rounded p-2"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Fonts */}
            <div>
              <label className="text-sm text-slate-300 block mb-2">Fonts</label>
              <div className="text-xs text-slate-400 space-y-1">
                {brandData.fonts?.map((font: string, idx: number) => (
                  <div key={idx} className="truncate">{font}</div>
                ))}
              </div>
            </div>

            {/* Vibe */}
            <div>
              <label className="text-sm text-slate-300 block mb-2">Brand Vibe</label>
              <div className="px-3 py-2 bg-slate-700 rounded text-white text-sm">
                {brandData.vibe}
              </div>
            </div>
          </div>

          <Button className="w-full mt-6" variant="outline" onClick={() => router.push('/')}>
            Change Brand
          </Button>
        </aside>

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-900 overflow-auto">
          {selectedVariant ? (
            <div className="relative w-full h-full max-w-[1080px] mx-auto flex items-center justify-center">
              <div className="bg-white rounded-lg shadow-2xl overflow-hidden" style={{ width: '1080px', height: '1350px' }}>
                <div className="relative w-full h-full">
                  <img
                    src={selectedVariant.url}
                    alt="Selected variant"
                    className="w-full h-full object-cover"
                  />
                  {/* Text Overlay */}
                  {promptData && (
                    <div className="absolute top-12 left-0 right-0 px-8 text-center">
                      <h2 className="text-5xl font-bold text-white drop-shadow-lg mb-3">
                        {promptData.headline_suggestion}
                      </h2>
                      <p className="text-xl text-slate-100 drop-shadow-md">
                        {promptData.subheadline_suggestion}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-2xl flex flex-col items-center justify-center" style={{ width: '1080px', height: '1350px', maxWidth: '100%' }}>
              <div className="text-center text-slate-400">
                <p className="text-lg mb-4">Canvas Ready</p>
                <p className="text-sm">Generated content will appear here</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Controls */}
        <aside className="w-80 bg-slate-800/50 border-l border-slate-700 p-6 overflow-y-auto">
          <h3 className="text-lg font-semibold text-white mb-4">Generate Content</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-300 block mb-2">Describe your content</label>
              <textarea
                placeholder="e.g., A promotional post about our new summer collection"
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 rounded border border-slate-600 text-white placeholder-slate-500"
                rows={4}
              />
            </div>

            <Button 
              className="w-full" 
              onClick={handleGenerateImages}
              disabled={loading || !userPrompt.trim()}
            >
              {loading ? 'Generating...' : 'Generate with AI'}
            </Button>

            {/* Image Variants */}
            {variants.length > 0 && (
              <div>
                <label className="text-sm text-slate-300 block mb-3">Generated Variants</label>
                <div className="grid grid-cols-2 gap-2">
                  {variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`aspect-[3/4] rounded border-2 overflow-hidden transition ${
                        selectedVariant?.id === variant.id
                          ? 'border-blue-400'
                          : 'border-slate-600 hover:border-slate-500'
                      }`}
                    >
                      <img
                        src={variant.url}
                        alt={`Variant ${variant.id}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Templates */}
            {variants.length === 0 && (
              <div>
                <label className="text-sm text-slate-300 block mb-3">Templates</label>
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <button
                      key={i}
                      className="aspect-[3/4] bg-slate-700 rounded border border-slate-600 hover:border-blue-400 transition text-xs text-slate-400"
                    >
                      Template {i}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
