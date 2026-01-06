'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowRight, Zap, Image, Palette } from 'lucide-react'
import Link from 'next/link'

export function MagicInput() {
  const [input, setInput] = useState('')

  return (
    <div className="space-y-8">
      <div className="relative w-full max-w-2xl mx-auto">
        {/* Glowing background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-purple-600/20 rounded-full blur-3xl -z-10"></div>

        <div className="relative flex gap-2 bg-slate-800/50 backdrop-blur border border-purple-500/30 rounded-full p-2 focus-within:border-purple-500/60 transition-all">
          <Input
            type="text"
            placeholder="Describe your design, brand, or image idea..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent border-0 text-white placeholder-purple-300/70 focus:outline-none text-lg"
          />
          <Link href={input ? '/editor' : '#'}>
            <Button
              className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8"
              disabled={!input}
            >
              <Zap className="w-4 h-4 mr-2" />
              Create
            </Button>
          </Link>
        </div>
      </div>

      {/* Feature highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
        <div className="bg-slate-800/30 backdrop-blur border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition-all">
          <Zap className="w-8 h-8 text-purple-400 mb-3" />
          <h3 className="text-white font-semibold mb-2">Lightning Fast</h3>
          <p className="text-purple-200/70 text-sm">Generate stunning designs in seconds using AI</p>
        </div>

        <div className="bg-slate-800/30 backdrop-blur border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition-all">
          <Image className="w-8 h-8 text-pink-400 mb-3" />
          <h3 className="text-white font-semibold mb-2">AI-Powered</h3>
          <p className="text-purple-200/70 text-sm">Powered by Google Imagen-4 and Gemini Pro 1.5</p>
        </div>

        <div className="bg-slate-800/30 backdrop-blur border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition-all">
          <Palette className="w-8 h-8 text-blue-400 mb-3" />
          <h3 className="text-white font-semibold mb-2">Full Control</h3>
          <p className="text-purple-200/70 text-sm">Edit and refine with our powerful canvas editor</p>
        </div>
      </div>
    </div>
  )
}
