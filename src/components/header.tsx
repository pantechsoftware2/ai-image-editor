'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export function Header() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <header className="fixed w-full top-0 z-50 bg-gradient-to-b from-slate-900/80 via-slate-900/50 to-transparent backdrop-blur-sm border-b border-purple-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">V</span>
          </div>
          <span className="text-white font-bold text-xl">Vizly</span>
        </Link>

        <div className="flex items-center gap-4">
          {!loading && user ? (
            <>
              <Link href="/dashboard">
                <Button className="bg-purple-600 hover:bg-purple-700">Dashboard</Button>
              </Link>
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="border-purple-500/30 text-white hover:bg-slate-800"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="text-white hover:bg-slate-800">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-purple-600 hover:bg-purple-700">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
