'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Github, Twitter, Globe, X } from 'lucide-react'
import { urlFor } from '@/lib/api/image'
import type { Author, Post } from '@/types/blog'

interface Props {
  author: Author
  authorPosts: Post[]
  currentPostId: string
}

export function AuthorChip({ author, authorPosts, currentPostId }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on click outside
  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const otherPosts = authorPosts.filter((p) => p._id !== currentPostId).slice(0, 4)
  const avatarUrl = author.image ? urlFor(author.image).width(80).height(80).url() : null

  return (
    <div ref={ref} className="relative">
      {/* ── Chip ── */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
        aria-expanded={open}
      >
        {avatarUrl ? (
          <span className="relative h-5 w-5 shrink-0 overflow-hidden rounded-full">
            <Image src={avatarUrl} alt={author.name} fill className="object-cover" />
          </span>
        ) : (
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-brand-fg">
            {author.name[0]}
          </span>
        )}
        <span>{author.name}</span>
        <svg
          className={`h-3 w-3 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 12 12"
          fill="currentColor"
        >
          <path d="M6 8L1 3h10L6 8z" />
        </svg>
      </button>

      {/* ── Popover ── */}
      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-xl border bg-card shadow-2xl">
          {/* Author header */}
          <div className="flex items-start justify-between gap-3 border-b p-4">
            <div className="flex gap-3">
              {avatarUrl ? (
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border">
                  <Image src={avatarUrl} alt={author.name} fill className="object-cover" />
                </div>
              ) : (
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-dark text-xl font-bold text-brand-fg">
                  {author.name[0]}
                </span>
              )}
              <div>
                <p className="font-semibold">{author.name}</p>
                <div className="mt-1.5 flex gap-3">
                  {author.twitter && (
                    <a
                      href={`https://twitter.com/${author.twitter.replace('@', '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Twitter className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {author.github && (
                    <a
                      href={`https://github.com/${author.github}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Github className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {author.website && (
                    <a
                      href={author.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Globe className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Other posts */}
          {otherPosts.length > 0 && (
            <div className="p-3">
              <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                More from {author.name}
              </p>
              <ul className="space-y-0.5">
                {otherPosts.map((p) => (
                  <li key={p._id}>
                    <Link
                      href={`/blog/${p.slug.current}`}
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-2 py-2 text-sm leading-snug transition-colors hover:bg-muted"
                    >
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {otherPosts.length === 0 && (
            <p className="p-4 text-center text-xs text-muted-foreground">No other posts yet.</p>
          )}
        </div>
      )}
    </div>
  )
}
