'use client'

import { Header } from '@/components/header'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Editor() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <main className="min-h-screen bg-slate-950">
        <Header />
        <div className="pt-32 flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950">
      <Header />

      <div className="pt-20 h-screen flex flex-col">
        {/* Canvas Area */}
        <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Editor Coming Soon</h1>
            <p className="text-purple-200/70 mb-8">
              The full canvas editor with fabric.js is being integrated
            </p>
            <div className="bg-slate-800/30 border border-purple-500/20 rounded-lg p-8 max-w-md">
              <h2 className="text-xl font-semibold text-white mb-4">Canvas will include:</h2>
              <ul className="text-left text-purple-200/70 space-y-2">
                <li>✓ fabric.js v6 integration</li>
                <li>✓ Real-time image generation with Gemini Pro</li>
                <li>✓ Imagen-4 for high-quality image output</li>
                <li>✓ Project save and load functionality</li>
                <li>✓ Team collaboration features</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
