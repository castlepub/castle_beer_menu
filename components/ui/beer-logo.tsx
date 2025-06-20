import Image from 'next/image'
import { useState } from 'react'

interface BeerLogoProps {
  src?: string | null
  alt: string
  size?: number
  className?: string
}

export function BeerLogo({ src, alt, size = 40, className = '' }: BeerLogoProps) {
  const [imageError, setImageError] = useState(false)

  if (!src || imageError) {
    return (
      <div 
        className={`bg-primary/20 rounded-lg flex items-center justify-center text-2xl ${className}`}
        style={{ width: size, height: size }}
      >
        🍺
      </div>
    )
  }

  return (
    <div 
      className={`relative overflow-hidden rounded-lg bg-white/10 ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain p-1"
        onError={() => setImageError(true)}
        sizes={`${size}px`}
      />
    </div>
  )
} 