'use client'

import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'
import type { ReactNode } from 'react'

interface SignOutButtonProps {
  callbackUrl?: string
  className?: string
  title?: string
  children?: ReactNode
}

export default function SignOutButton({
  callbackUrl = '/',
  className = 'btn-ghost px-3 py-2.5 text-[13px]',
  title = 'Keluar',
  children,
}: SignOutButtonProps) {
  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault()
    await signOut({ redirect: true, callbackUrl })
  }

  return (
    <button
      type="button"
      className={className}
      onClick={handleSignOut}
      title={title}
    >
      {children || <LogOut size={14} />}
    </button>
  )
}
