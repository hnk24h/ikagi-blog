'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Props {
  src?: string | null
  name: string
  size?: number        // px, used for both w/h
  className?: string
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return name[0]?.toUpperCase() ?? '?'
}

export default function AuthorAvatar({ src, name, size = 40, className = '' }: Props) {
  const [imgError, setImgError] = useState(false)

  const showInitials = !src || imgError

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-brand to-brand-dark ${className}`}
      style={{ width: size, height: size }}
    >
      {!showInitials ? (
        <Image
          src={src!}
          alt={name}
          fill
          className="object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span
          className="font-bold text-brand-fg select-none"
          style={{ fontSize: Math.max(10, Math.round(size * 0.38)) }}
        >
          {getInitials(name)}
        </span>
      )}
    </span>
  )
}
