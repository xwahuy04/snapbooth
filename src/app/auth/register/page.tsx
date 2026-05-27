'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, AlertCircle, Check, Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const validatePassword = (pwd: string) => {
    return pwd.length >= 8
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      // Validate inputs
      if (!name.trim()) {
        setError('Nama harus diisi')
        setIsLoading(false)
        return
      }

      if (!validatePassword(password)) {
        setError('Password minimal 8 karakter')
        setIsLoading(false)
        return
      }

      if (password !== confirmPassword) {
        setError('Password tidak cocok')
        setIsLoading(false)
        return
      }

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Pendaftaran gagal')
      } else {
        setSuccess('Akun berhasil dibuat! Mengarahkan ke login...')
        setTimeout(() => router.push('/auth/login'), 2000)
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
            Daftar Sekarang
          </h1>
          <p className="mb-8 text-sm text-muted">
            Buat akun untuk menjaga foto Anda tetap pribadi
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-3.5 text-sm text-green-700">
                <Check size={16} className="shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-foreground">
                Nama Lengkap
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Anda"
                required
                disabled={isLoading}
                className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-foreground placeholder-muted transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-50"
              />
            </div>

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
                disabled={isLoading}
                className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-foreground placeholder-muted transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-50"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  required
                  disabled={isLoading}
                  className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 pr-11 text-foreground placeholder-muted transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-foreground focus:outline-none"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-foreground">
                Konfirmasi Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 pr-11 text-foreground placeholder-muted transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-foreground focus:outline-none"
                  tabIndex={-1}
                  aria-label={showConfirmPassword ? 'Sembunyikan konfirmasi password' : 'Tampilkan konfirmasi password'}
                >
                  {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-2.5"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Membuat Akun...
                </>
              ) : (
                'Daftar'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Sudah punya akun?{' '}
            <Link href="/auth/login" className="font-semibold text-accent hover:underline">
              Masuk di sini
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          Data pribadi Anda dilindungi dengan enkripsi
        </p>
      </div>
    </div>
  )
}
