'use client'

import { Header } from '@/components/header'
import { MagicInput } from '@/components/magic-input'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  const { user, loading } = useAuth()

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Main heading */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-6">
              Design with AI
            </h1>
            <p className="text-xl md:text-2xl text-purple-200/80 mb-8 max-w-2xl mx-auto">
              Transform your ideas into stunning visuals in seconds using AI-powered design generation.
            </p>
          </div>

          {/* Magic Input Component */}
          <div className="mb-20">
            <MagicInput />
          </div>

          {/* CTA Section */}
          {!loading && !user && (
            <div className="flex items-center justify-center gap-4 mt-12">
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-purple-500/30 text-white hover:bg-slate-800 px-8 text-lg"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 text-lg"
                >
                  Get Started Free
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/30 border-y border-purple-500/10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">Powerful Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '🎨',
                title: 'AI Image Generation',
                description: 'Generate unique, high-quality images using Google Imagen-4',
              },
              {
                icon: '✨',
                title: 'Smart Editing',
                description: 'Edit and refine with fabric.js canvas - industry standard for design',
              },
              {
                icon: '⚡',
                title: 'Lightning Fast',
                description: 'Get results in seconds, not minutes or hours',
              },
              {
                icon: '🎯',
                title: 'Brand Consistency',
                description: 'Save brand profiles to maintain visual consistency',
              },
              {
                icon: '💾',
                title: 'Cloud Storage',
                description: 'Store and manage all your projects in the cloud',
              },
              {
                icon: '🔐',
                title: 'Secure & Private',
                description: 'Enterprise-grade security with Supabase',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-slate-800/30 backdrop-blur border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition-all hover:bg-slate-800/50"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-purple-200/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-purple-500/10">
        <div className="max-w-7xl mx-auto text-center text-purple-200/50">
          <p>&copy; 2024 Vizly. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
