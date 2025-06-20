import Image from 'next/image'

interface TagIconProps {
  tag: string
  size?: number
  className?: string
}

export function TagIcon({ tag, size = 16, className = '' }: TagIconProps) {
  // Map tags to their icon files (support both PNG and SVG)
  const tagIcons: Record<string, string> = {
    'NEW': '/icons/new.svg',
    'LIMITED': '/icons/limited.svg',
    'STRONG': '/icons/strong.svg',
    'SEASONAL': '/icons/seasonal.svg',
    'HOUSE': '/icons/house.svg',
    'POPULAR': '/icons/popular.svg',
    'AWARD': '/icons/award.svg',
  }

  const iconPath = tagIcons[tag.toUpperCase()]

  if (!iconPath) {
    // Fallback to text if no icon is available
    return (
      <span className={`inline-block px-2 py-0.5 text-xs font-bold bg-accent text-accent-foreground rounded uppercase tracking-wider ${className}`}>
        {tag}
      </span>
    )
  }

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <Image
        src={iconPath}
        alt={`${tag} icon`}
        fill
        className="object-contain"
        sizes={`${size}px`}
      />
    </div>
  )
} 