'use client'

import { useState } from 'react'
import { Twitter, Link2, Check, Facebook } from 'lucide-react'

interface Props {
  url: string
  title: string
  compact?: boolean
}

export function ShareButtons({ url, title, compact = false }: Props) {
  const [copied, setCopied] = useState(false)

  const tweet = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
  const fbShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`

  async function copy() {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-muted-foreground">Share</span>
        <a
          href={tweet}
          target="_blank"
          rel="noreferrer"
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          title="Share on Twitter"
        >
          <Twitter className="h-4 w-4" />
        </a>
        <a
          href={fbShare}
          target="_blank"
          rel="noreferrer"
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          title="Share on Facebook"
        >
          <Facebook className="h-4 w-4" />
        </a>
        <button
          onClick={copy}
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          title={copied ? 'Copied!' : 'Copy link'}
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Link2 className="h-4 w-4" />
          )}
        </button>
      </div>
    )
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
      <a
        href={fbShare}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-1.5 rounded border px-3 py-1.5 text-sm hover:bg-muted"
      >
        <Facebook className="h-3.5 w-3.5" /> Facebook
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
