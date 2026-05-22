'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { Loader2, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Email atau password salah')
      } else if (result?.ok) {
        router.push('/booth')
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-surface via-surface to-surface-raised px-4">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-border bg-surface-raised p-8 shadow-2xl">
          <h1 className="font-display mb-2 text-3xl font-bold text-foreground">
            Masuk
          </h1>
          <p className="mb-8 text-sm text-muted">
            Akses galeri foto pribadi Anda
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-foreground placeholder-muted transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-foreground">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-foreground placeholder-muted transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-2.5"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Memproses...
                </>
              ) : (
                'Masuk'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Belum punya akun?{' '}
            <Link href="/auth/register" className="font-semibold text-accent hover:underline">
              Daftar di sini
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          Foto Anda akan aman dan hanya bisa diakses dengan akun Anda
        </p>
      </div>
    </div>
  )
}
