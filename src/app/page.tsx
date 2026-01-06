'use client'

import { Header } from '@/components/header'
import { MagicInput } from '@/components/magic-input'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {  Sparkles, ArrowRight } from 'lucide-react'

export default function Home() {
  const { user, loading } = useAuth()

  return (
    <main className="min-h-screen bg-[#0d1224]">
      <Header />

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          {/* Main heading */}
          <div className="text-center mb-16">
            <div className="mb-6 inline-block">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-white/70">AI-Powered Design Generation</span>
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
              Create at the
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Speed of Thought
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-white/60 mb-12 max-w-3xl mx-auto leading-relaxed">
              Generate, edit, and iterate on stunning designs instantly. Powered by Google's Imagen-4 and Gemini Pro intelligence.
            </p>
          </div>

          {/* Magic Input Component */}
          <div className="mb-24">
            <MagicInput />
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-8 mb-24 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">10M+</div>
              <div className="text-white/50 text-sm">Designs Created</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">&lt;2s</div>
              <div className="text-white/50 text-sm">Generation Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">99.9%</div>
              <div className="text-white/50 text-sm">Uptime SLA</div>
            </div>
          </div>

{/* Features Grid */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-24">

  {/* Feature 1 */}
  <div className="group relative">
    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/0 to-purple-600/0 group-hover:from-purple-600/10 group-hover:via-purple-600/5 group-hover:to-purple-600/0 rounded-2xl transition-all duration-300"></div>
    <div className="relative p-8 rounded-2xl border border-white/10 group-hover:border-white/20 transition-all bg-black">

      <img
        src="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80"
        alt="AI system visualization"
        loading="lazy"
        className="w-full h-40 object-cover rounded-xl mb-6 opacity-95 transition-transform duration-700 group-hover:scale-105"
      />

      <h3 className="text-xl font-semibold text-white mb-3">
        Smart Generation
      </h3>
      <p className="text-white/60 text-sm leading-relaxed">
        Describe what you want and let AI handle the creativity. Powered by state-of-the-art models.
      </p>
    </div>
  </div>

  {/* Feature 2 */}
  <div className="group relative">
    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/0 to-purple-600/0 group-hover:from-purple-600/10 group-hover:via-purple-600/5 group-hover:to-purple-600/0 rounded-2xl transition-all duration-300"></div>
    <div className="relative p-8 rounded-2xl border border-white/10 group-hover:border-white/20 transition-all bg-black">

      <img
        src="https://images.unsplash.com/photo-1640552435388-a54879e72b28?auto=format&fit=crop&w=1200&q=80"
        alt="High-speed performance system"
        loading="lazy"
        className="w-full h-40 object-cover rounded-xl mb-6 opacity-95 transition-transform duration-700 group-hover:scale-105"
      />

      <h3 className="text-xl font-semibold text-white mb-3">
        Instant Iteration
      </h3>
      <p className="text-white/60 text-sm leading-relaxed">
        Refine and remix designs in real-time. No waiting, no complexity, pure speed.
      </p>
    </div>
  </div>

  {/* Feature 3 */}
  <div className="group relative">
    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/0 to-purple-600/0 group-hover:from-purple-600/10 group-hover:via-purple-600/5 group-hover:to-purple-600/0 rounded-2xl transition-all duration-300"></div>
    <div className="relative p-8 rounded-2xl border border-white/10 group-hover:border-white/20 transition-all bg-black">

      <img
        src="https://images.unsplash.com/photo-1674027444485-cec3da58eef4?auto=format&fit=crop&w=1200&q=80"
        alt="Creative digital tools"
        loading="lazy"
        className="w-full h-40 object-cover rounded-xl mb-6 opacity-95 transition-transform duration-700 group-hover:scale-105"
      />

      <h3 className="text-xl font-semibold text-white mb-3">
        Full Control
      </h3>
      <p className="text-white/60 text-sm leading-relaxed">
        Advanced canvas editor for fine-tuning. Your design, your way.
      </p>
    </div>
  </div>

</div>


          {/* CTA Section */}
          {!loading && !user && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
              <Link href="/signup" className="w-full sm:w-auto">
               <Button
  size="lg"
  className="w-full bg-blue-600 text-white px-8 font-semibold hover:bg-blue-700 transition-colors"
>
  Get Started Free
  <ArrowRight className="w-4 h-4 ml-2" />
</Button>

              </Link>
              {/* <Link href="/login" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full border-white/20 text-white">
                  Sign In
                </Button>
              </Link> */}
            </div>
          )}

        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-20">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-xl font-bold mb-6 mx-auto">
                1
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Describe</h3>
              <p className="text-white/60">
                Tell Vizly what you want to create. Be as detailed or simple as you like.
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-xl font-bold mb-6 mx-auto">
                2
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Generate</h3>
              <p className="text-white/60">
                Our AI instantly creates high-quality designs based on your description.
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-xl font-bold mb-6 mx-auto">
                3
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Refine</h3>
              <p className="text-white/60">
                Edit, iterate, and perfect your designs with our advanced tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between">
          <div className="text-white/50 text-sm mb-4 sm:mb-0">
            &copy; 2026 Vizly. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  )
}
