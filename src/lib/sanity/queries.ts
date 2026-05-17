import { client, isSanityConfigured } from './client'
import type { Post, Category } from '@/types/blog'

// ─── Posts ────────────────────────────────────────────────────────────────────

export async function getAllPosts(): Promise<Post[]> {
  if (!isSanityConfigured) return []
  return client.fetch(
    `*[_type == "post" && status == "published"] | order(publishedAt desc) {
      _id, title, slug, excerpt, coverImage, publishedAt,
      "categories": categories[]->{ _id, title, slug, color },
      "author": author->{ name, image },
      tags, readingTime
    }`,
    {},
    { next: { revalidate: 60 } },
  )
}

export async function getFeaturedPosts(limit = 1): Promise<Post[]> {
  if (!isSanityConfigured) return []
  return client.fetch(
    `*[_type == "post" && status == "published" && featured == true] | order(publishedAt desc) [0...$limit] {
      _id, title, slug, excerpt, coverImage, publishedAt,
      "categories": categories[]->{ _id, title, slug, color },
      "author": author->{ name, image },
      tags, readingTime
    }`,
    { limit },
    { next: { revalidate: 60 } },
  )
}

export async function getLatestPosts(limit = 6): Promise<Post[]> {
  if (!isSanityConfigured) return []
  return client.fetch(
    `*[_type == "post" && status == "published"] | order(publishedAt desc) [0...$limit] {
      _id, title, slug, excerpt, coverImage, publishedAt,
      "categories": categories[]->{ _id, title, slug, color },
      "author": author->{ name, image },
      tags, readingTime
    }`,
    { limit },
    { next: { revalidate: 60 } },
  )
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!isSanityConfigured) return null
  return client.fetch(
    `*[_type == "post" && slug.current == $slug && status == "published"][0] {
      _id, title, slug, excerpt, coverImage, publishedAt, updatedAt, body,
      "categories": categories[]->{ _id, title, slug, color },
      "author": author->{ name, slug, image, bio, twitter, github, website },
      tags, readingTime, seo
    }`,
    { slug },
    { next: { revalidate: 60 } },
  )
}

export async function getPostsByCategory(categorySlug: string): Promise<Post[]> {
  if (!isSanityConfigured) return []
  return client.fetch(
    `*[_type == "post" && status == "published" && $categorySlug in categories[]->slug.current]
    | order(publishedAt desc) {
      _id, title, slug, excerpt, coverImage, publishedAt,
      "categories": categories[]->{ _id, title, slug, color },
      "author": author->{ name, image },
      tags, readingTime
    }`,
    { categorySlug },
    { next: { revalidate: 60 } },
  )
}

export async function getRelatedPosts(postId: string, categoryIds: string[], limit = 3): Promise<Post[]> {
  if (!isSanityConfigured) return []
  return client.fetch(
    `*[_type == "post" && status == "published" && _id != $postId
      && count((categories[]._ref)[@ in $categoryIds]) > 0]
    | order(publishedAt desc) [0...$limit] {
      _id, title, slug, excerpt, coverImage, publishedAt,
      "categories": categories[]->{ _id, title, slug, color },
      "author": author->{ name, image }
    }`,
    { postId, categoryIds, limit },
    { next: { revalidate: 60 } },
  )
}

export async function getAllPostSlugs(): Promise<{ slug: { current: string } }[]> {
  if (!isSanityConfigured) return []
  return client.fetch(
    `*[_type == "post" && status == "published"]{ slug }`,
    {},
    { next: { revalidate: 3600 } },
  )
}

export async function getPostsForRSS(): Promise<Post[]> {
  if (!isSanityConfigured) return []
  return client.fetch(
    `*[_type == "post" && status == "published"] | order(publishedAt desc) [0...20] {
      _id, title, slug, excerpt, publishedAt,
      "categories": categories[]->{ title },
      "author": author->{ name }
    }`,
    {},
    { next: { revalidate: 3600 } },
  )
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function getAllCategories(): Promise<Category[]> {
  if (!isSanityConfigured) return []
  return client.fetch(
    `*[_type == "category"] | order(title asc) {
      _id, title, slug, description, color,
      "postCount": count(*[_type == "post" && status == "published" && references(^._id)])
    }`,
    {},
    { next: { revalidate: 300 } },
  )
}
