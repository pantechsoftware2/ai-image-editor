'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { BrandModal } from '@/components/BrandModal';

/**
 * Home - Landing page with brand extraction
 */
export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [brandData, setBrandData] = useState(null);
  const [showBrandModal, setShowBrandModal] = useState(false);

  const handleExtractBrand = async () => {
    if (!url.trim()) {
      setError('Please enter a website URL');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/extract-brand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to extract brand information');
      }

      const data = await response.json();
      setBrandData(data.data || data);
      setShowBrandModal(true);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Failed to extract brand data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBrandConfirm = (data) => {
    setShowBrandModal(false);
    sessionStorage.setItem('brandData', JSON.stringify(data));
    router.push('/editor');
  };

  const handleQuickBrand = (brand) => {
    setUrl(brand);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">V</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Vizly AI</h1>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 font-medium">
              Dashboard
            </Link>
            {user ? (
              <Link href="/dashboard" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                Go to Editor
              </Link>
            ) : (
              <Link href="/auth/login" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h2 className="text-6xl font-bold mb-6 text-gray-900 leading-tight">
            Create Stunning Content
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              In Seconds with AI
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Enter any website URL. We extract your brand colors, fonts, and logo. Then generate stunning social media content powered by AI.
          </p>
        </div>

        {/* Magic Input Section */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-3xl mx-auto mb-16">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Brand Website URL</label>
            <div className="flex gap-3">
              <input
                type="url"
                placeholder="https://apple.com or just apple.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleExtractBrand()}
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
              <button
                onClick={handleExtractBrand}
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 font-semibold transition transform hover:scale-105 active:scale-95 whitespace-nowrap"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⚡</span>
                    Extracting...
                  </span>
                ) : (
                  'Extract Brand'
                )}
              </button>
            </div>

            {error && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <p className="text-sm text-gray-500 mt-4">
              ✨ We'll automatically extract your brand colors, fonts, and logo
            </p>
          </div>

          {/* Quick Examples */}
          <div className="border-t pt-6">
            <p className="text-sm font-semibold text-gray-700 mb-3">Try with popular brands:</p>
            <div className="flex flex-wrap gap-2">
              {['apple.com', 'nike.com', 'airbnb.com', 'spotify.com', 'figma.com'].map((brand) => (
                <button
                  key={brand}
                  onClick={() => {
                    handleQuickBrand(brand);
                    setError('');
                  }}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-blue-100 hover:text-blue-600 transition"
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎨</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Brand Colors</h3>
            <p className="text-gray-600 text-sm">
              Automatically extract dominant colors from any website
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✍️</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Font Detection</h3>
            <p className="text-gray-600 text-sm">
              Identify the exact fonts used across the brand
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">AI Generation</h3>
            <p className="text-gray-600 text-sm">
              Generate unlimited content variations with AI
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">Ready to create amazing content?</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            {user ? (
              'Go to your editor and start creating with your brand settings'
            ) : (
              'Create a free account to save your projects and collaborate with your team'
            )}
          </p>
          {user ? (
            <Link
              href="/editor"
              className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 font-semibold transition"
            >
              Open Editor
            </Link>
          ) : (
            <Link
              href="/auth/signup"
              className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 font-semibold transition"
            >
              Get Started Free
            </Link>
          )}
        </div>
      </section>

      {/* Brand Modal */}
      {showBrandModal && brandData && (
        <BrandModal
          brandData={brandData}
          onConfirm={handleBrandConfirm}
          onClose={() => {
            setShowBrandModal(false);
            setUrl('');
          }}
        />
      )}
    </main>
  );
}
