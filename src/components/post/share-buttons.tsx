'use client'

import { useState } from 'react'
import { Twitter, Link2, Check } from 'lucide-react'

interface Props {
  url: string
  title: string
}

export function ShareButtons({ url, title }: Props) {
  const [copied, setCopied] = useState(false)

  const tweet = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`

  async function copy() {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground">Share:</span>
      <a
        href={tweet}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-1.5 rounded border px-3 py-1.5 text-sm hover:bg-muted"
      >
        <Twitter className="h-3.5 w-3.5" /> Twitter
      </a>
      <button
        onClick={copy}
        className="flex items-center gap-1.5 rounded border px-3 py-1.5 text-sm hover:bg-muted"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Link2 className="h-3.5 w-3.5" />}
        {copied ? 'Copied' : 'Copy link'}
      </button>
    </div>
  )
}
