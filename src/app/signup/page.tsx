'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const { signUpWithEmail, signInWithGoogle } = useAuth()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      setError('Please enter email and password')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    try {
      setLoading(true)
      setError(null)
      await signUpWithEmail(email, password)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err?.message ?? 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-3xl font-bold mb-2">Create Account</h1>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-4 mb-6">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating...' : 'Sign Up'}
          </Button>
        </form>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">Or continue with</span>
          </div>
        </div>

        <Button
          onClick={signInWithGoogle}
          variant="outline"
          className="w-full"
          disabled={loading}
        >
          Continue with Google
        </Button>
      </Card>
    </div>
  )
}
