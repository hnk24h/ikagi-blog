import type { Post, Category, Author } from '@/types/blog'
import { apiFetch } from './client'

// ─── Transform helpers ────────────────────────────────────────────────────────
// The frontend uses Sanity-style `slug: { current: string }`. We map the flat
// `slug` string from the Laravel API to keep all components unchanged.

function mapCategory(c: Record<string, unknown>): Category {
  return {
    _id: String(c.id),
    title: c.title as string,
    slug: { current: c.slug as string },
    description: (c.description as string) ?? undefined,
    color: (c.color as string) ?? undefined,
    postCount: (c.post_count as number) ?? undefined,
    isMenu: (c.is_menu as boolean) ?? false,
    menuGroup: (c.menu_group as string) ?? null,
  }
}

function mapAuthor(a: Record<string, unknown>): Author {
  return {
    _id: String(a.id),
    name: a.name as string,
    slug: { current: a.slug as string },
    bio: undefined, // plain text → not PortableText; show via description if needed
    twitter: (a.twitter as string) ?? undefined,
    github: (a.github as string) ?? undefined,
    website: (a.website as string) ?? undefined,
    image: (a.avatar as string)
      ? ({ url: a.avatar } as unknown as import('@/types/blog').SanityImage)
      : undefined,
  }
}

function mapPost(p: Record<string, unknown>): Post {
  return {
    _id: String(p.id),
    title: p.title as string,
    slug: { current: p.slug as string },
    excerpt: (p.excerpt as string) ?? undefined,
    coverImage: (p.cover_image as string)
      ? ({ url: p.cover_image } as unknown as import('@/types/blog').SanityImage)
      : undefined,
    publishedAt: p.published_at as string,
    updatedAt: (p.updated_at as string) ?? undefined,
    body: (p.body as string) ?? undefined,
    categories: p.categories
      ? (p.categories as Record<string, unknown>[]).map(mapCategory)
      : undefined,
    author: p.author
      ? mapAuthor(p.author as Record<string, unknown>)
      : undefined,
    tags: (p.tags as string[]) ?? [],
    readingTime: (p.reading_time as number) ?? undefined,
    featured: (p.featured as boolean) ?? false,
    seo: p.seo
      ? {
          metaTitle: ((p.seo as Record<string, unknown>).title as string) ?? undefined,
          metaDescription: ((p.seo as Record<string, unknown>).description as string) ?? undefined,
        }
      : undefined,
  }
}

// ─── Posts ────────────────────────────────────────────────────────────────────

export async function getAllPosts(): Promise<Post[]> {
  const data = await apiFetch<{ data: Record<string, unknown>[] }>('/posts', {
    next: { revalidate: 60 },
  })
  return (data?.data ?? []).map(mapPost)
}

export async function getFeaturedPosts(limit = 1): Promise<Post[]> {
  const data = await apiFetch<{ data: Record<string, unknown>[] }>(
    `/posts?featured=1&limit=${limit}`,
    { next: { revalidate: 60 } },
  )
  return (data?.data ?? []).map(mapPost)
}

export async function getLatestPosts(limit = 6): Promise<Post[]> {
  const data = await apiFetch<{ data: Record<string, unknown>[] }>(
    `/posts?limit=${limit}`,
    { next: { revalidate: 60 } },
  )
  return (data?.data ?? []).map(mapPost)
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const data = await apiFetch<Record<string, unknown>>(`/posts/${slug}`, {
    next: { revalidate: 60 },
  })
  if (!data) return null
  const post = (data.data ?? data) as Record<string, unknown>
  return mapPost(post)
}

export async function getPostsByCategory(categorySlug: string): Promise<Post[]> {
  const data = await apiFetch<{ data: Record<string, unknown>[] }>(
    `/posts?category=${categorySlug}`,
    { next: { revalidate: 60 } },
  )
  return (data?.data ?? []).map(mapPost)
}

export async function getRelatedPosts(
  _postId: string,
  _categoryIds: string[],
  _limit = 3,
  slug?: string,
): Promise<Post[]> {
  if (!slug) return []
  const data = await apiFetch<{ data: Record<string, unknown>[] }>(
    `/posts/${slug}/related`,
    { next: { revalidate: 60 } },
  )
  return (data?.data ?? []).map(mapPost)
}

export async function getAllPostSlugs(): Promise<{ slug: { current: string } }[]> {
  const slugs = await apiFetch<string[]>('/posts/slugs', {
    next: { revalidate: 3600 },
  })
  return (slugs ?? []).map((s) => ({ slug: { current: s } }))
}

export async function getPostsForRSS(): Promise<Post[]> {
  const data = await apiFetch<{ data: Record<string, unknown>[] }>(
    '/posts?limit=20',
    { next: { revalidate: 3600 } },
  )
  return (data?.data ?? []).map(mapPost)
}

export async function searchPosts(query: string): Promise<Post[]> {
  const data = await apiFetch<{ data: Record<string, unknown>[] }>(
    `/posts?search=${encodeURIComponent(query)}`,
    { next: { revalidate: 0 } },
  )
  return (data?.data ?? []).map(mapPost)
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function getAllCategories(): Promise<Category[]> {
  const data = await apiFetch<{ data: Record<string, unknown>[] }>('/categories', {
    next: { revalidate: 300 },
  })
  return (data?.data ?? []).map(mapCategory)
}

export async function getMenuCategories(): Promise<Category[]> {
  const all = await getAllCategories()
  return all.filter((c) => c.isMenu)
}
