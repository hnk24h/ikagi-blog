'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, Loader2, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { API_URL } from '@/lib/api/client'
import type { Post } from '@/types/blog'

interface SearchResult {
  id: string
  title: string
  slug: string
  excerpt?: string
  categories?: { title: string }[]
}

async function fetchSearchResults(q: string): Promise<SearchResult[]> {
  const res = await fetch(
    `${API_URL}/posts?search=${encodeURIComponent(q)}&limit=6`,
    { headers: { Accept: 'application/json' } },
  )
  if (!res.ok) return []
  const json = await res.json()
  // API trả về { data: [...] } hoặc { data: { data: [...] } } tùy pagination
  const items = json?.data?.data ?? json?.data ?? []
  return items as SearchResult[]
}

export function SearchBar() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const close = useCallback(() => {
    setOpen(false)
    setQuery('')
    setResults([])
    setActiveIndex(-1)
  }, [])

  // Auto-focus when opened
  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [close])

  // Close on click outside
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) close()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open, close])

  // Keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  // Debounced search
  useEffect(() => {
    const q = query.trim()
    if (!q) {
      setResults([])
      setLoading(false)
      return
    }
    setLoading(true)
    const timer = setTimeout(async () => {
      const data = await fetchSearchResults(q)
      setResults(data)
      setActiveIndex(-1)
      setLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (activeIndex >= 0 && results[activeIndex]) {
      const slug = results[activeIndex].slug
      close()
      router.push(`/blog/${slug}`)
      return
    }
    const q = query.trim()
    if (!q) return
    close()
    router.push(`/blog?q=${encodeURIComponent(q)}`)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!results.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => (i < results.length - 1 ? i + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => (i > 0 ? i - 1 : results.length - 1))
    }
  }

  const showDropdown = open && query.trim().length > 0

  return (
    <div ref={containerRef} className="relative flex items-center">
      {/* Expanded input */}
      <form
        onSubmit={handleSubmit}
        className={cn(
          'flex items-center overflow-hidden rounded-full border bg-background transition-all duration-200',
          open
            ? 'w-48 border-border/60 pr-1 pl-3 shadow-sm sm:w-64'
            : 'w-0 border-transparent',
        )}
      >
        {loading ? (
          <Loader2 className="mr-1.5 h-3.5 w-3.5 shrink-0 animate-spin text-muted-foreground" />
        ) : null}
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tìm bài viết…"
          autoComplete="off"
          className="w-full bg-transparent py-1 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none"
          tabIndex={open ? 0 : -1}
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); setResults([]); inputRef.current?.focus() }}
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </form>

      {/* Toggle button */}
      <button
        type="button"
        onClick={() => (open ? close() : setOpen(true))}
        aria-label="Tìm kiếm"
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-muted',
          open ? 'text-brand' : 'text-muted-foreground',
        )}
      >
        <Search className="h-4 w-4" />
      </button>

      {/* Dropdown results */}
      {showDropdown && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border bg-background shadow-lg">
          {results.length === 0 && !loading ? (
            <p className="px-4 py-3 text-sm text-muted-foreground">
              Không tìm thấy kết quả nào.
            </p>
          ) : (
            <ul>
              {results.map((post, i) => (
                <li key={post.id}>
                  <button
                    type="button"
                    onClick={() => { close(); router.push(`/blog/${post.slug}`) }}
                    className={cn(
                      'flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted',
                      activeIndex === i && 'bg-muted',
                    )}
                  >
                    <FileText className="mt-0.5 h-4 w-4 shrink-0 text-brand/70" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {post.title}
                      </p>
                      {post.categories?.length ? (
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {post.categories.map((c) => c.title).join(', ')}
                        </p>
                      ) : post.excerpt ? (
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {post.excerpt}
                        </p>
                      ) : null}
                    </div>
                  </button>
                </li>
              ))}
              {results.length > 0 && (
                <li className="border-t">
                  <button
                    type="button"
                    onClick={() => { const q = query.trim(); if (q) { close(); router.push(`/blog?q=${encodeURIComponent(q)}`) } }}
                    className="flex w-full items-center justify-between px-4 py-2.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <span>Xem tất cả kết quả cho &ldquo;{query}&rdquo;</span>
                    <Search className="h-3.5 w-3.5" />
                  </button>
                </li>
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
