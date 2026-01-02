'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BrandModal } from './components/BrandModal';

/**
 * Home - Landing page with brand extraction
 */
export default function Home() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [brandData, setBrandData] = useState<any>(null);
  const [showBrandModal, setShowBrandModal] = useState(false);

  const handleExtractBrand = async () => {
    if (!url.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/extract-brand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) throw new Error('Failed to extract brand');
      const data = await response.json();
      setBrandData(data.data);
      setShowBrandModal(true);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to extract brand data. Try again!');
    } finally {
      setLoading(false);
    }
  };

  const handleBrandConfirm = (data: any) => {
    setShowBrandModal(false);
    sessionStorage.setItem('brandData', JSON.stringify(data));
    router.push('/editor');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="bg-slate-950/50 backdrop-blur border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Vizly AI
          </h1>
          <div className="space-x-4">
            <Link href="/dashboard" className="text-slate-300 hover:text-white transition">
              Dashboard
            </Link>
            <Button variant="outline">Sign In</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold mb-6 text-white">
          AI-Powered Social Media Content Creator
        </h2>
        <p className="text-xl text-slate-300 mb-12">
          Transform your brand into stunning visual content in seconds. Extract brand colors, generate images with AI, and create professional posts.
        </p>

        {/* Magic Input */}
        <div className="bg-slate-800/50 backdrop-blur rounded-xl shadow-2xl p-8 max-w-2xl mx-auto border border-slate-700">
          <div className="flex gap-3">
            <Input
              type="url"
              placeholder="Enter your website URL (e.g., apple.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleExtractBrand()}
              className="flex-1 px-4 py-3 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
            />
            <Button
              onClick={handleExtractBrand}
              disabled={loading}
              className="px-8 py-3"
            >
              {loading ? 'Analyzing...' : 'Extract Brand'}
            </Button>
          </div>
          <p className="text-sm text-slate-400 mt-4">
            We'll extract your brand colors, fonts, and logo automatically
          </p>
        </div>

        {/* Style Chips */}
        <div className="mt-12">
          <p className="text-slate-300 mb-4">Or try with one of these brands:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {['apple.com', 'nike.com', 'google.com', 'tesla.com'].map((brand) => (
              <button
                key={brand}
                onClick={() => {
                  setUrl(brand);
                  setTimeout(() => handleExtractBrand(), 100);
                }}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-full transition"
              >
                {brand}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-4xl mx-auto px-4 py-20 grid md:grid-cols-3 gap-8">
        {[
          { title: 'Brand Extraction', desc: 'Auto-detect colors, fonts & logos' },
          { title: 'AI Image Gen', desc: 'Imagen-4 powered visuals' },
          { title: 'Pro Editor', desc: 'Fabric.js canvas editing' },
        ].map((feature) => (
          <div key={feature.title} className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 text-center">
            <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
            <p className="text-slate-400">{feature.desc}</p>
          </div>
        ))}
      </section>

      {/* Brand Modal */}
      {brandData && (
        <BrandModal
          open={showBrandModal}
          brandData={brandData}
          onConfirm={handleBrandConfirm}
          onClose={() => setShowBrandModal(false)}
        />
      )}
    </main>
  );
}
