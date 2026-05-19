'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PostCard } from '@/components/blog/post-card'
import { SearchInput } from '@/components/blog/search-input'
import type { Post, Category } from '@/types/blog'

interface Props {
  initialPosts: Post[]
  categories: Category[]
}

export function BlogClient({ initialPosts, categories }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('q') || '')
  const activeCategory = searchParams.get('category') || ''

  // Sync when header search navigates to /blog?q=...
  useEffect(() => {
    setSearch(searchParams.get('q') || '')
  }, [searchParams])

  const filtered = useMemo(() => {
    let result = initialPosts
    if (activeCategory) {
      result = result.filter((p) =>
        p.categories?.some((c) => c.slug.current === activeCategory),
      )
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt?.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q)),
      )
    }
    return result
  }, [initialPosts, activeCategory, search])

  function setCategory(slug: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (slug) params.set('category', slug)
    else params.delete('category')
    router.push(`/blog?${params.toString()}`)
  }

  return (
    <div>
      {/* Search */}
      <div className="mb-6">
        <SearchInput value={search} onChange={setSearch} placeholder="Search posts..." />
      </div>

      {/* Category filter */}
      {categories.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setCategory('')}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              !activeCategory
                ? 'bg-primary text-primary-foreground'
                : 'border hover:bg-muted'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setCategory(cat.slug.current)}
              className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                activeCategory === cat.slug.current
                  ? 'bg-primary text-primary-foreground'
                  : 'border hover:bg-muted'
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      {filtered.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">No posts found.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
