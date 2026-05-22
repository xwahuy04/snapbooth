interface BackgroundOrbsProps {
  className?: string
}

export default function BackgroundOrbs({ className = '' }: BackgroundOrbsProps) {
  return (
    <>
      <div className={`glowing-orb orb-indigo ${className}`} aria-hidden />
      <div className={`glowing-orb orb-purple ${className}`} aria-hidden />
    </>
  )
}
