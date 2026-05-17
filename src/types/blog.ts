import type { PortableTextBlock as PTBlock } from '@portabletext/react'

export interface Author {
  _id?: string
  name: string
  slug?: { current: string }
  image?: SanityImage | { url: string }
  bio?: PTBlock[]
  twitter?: string
  github?: string
  website?: string
}

export interface Category {
  _id: string
  title: string
  slug: { current: string }
  description?: string
  color?: string
  postCount?: number
  isMenu?: boolean
  menuGroup?: string | null
}

export interface Post {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  coverImage?: SanityImage
  publishedAt: string
  updatedAt?: string
  body?: PTBlock[] | string
  categories?: Category[]
  author?: Author
  tags?: string[]
  readingTime?: number
  featured?: boolean
  seo?: {
    metaTitle?: string
    metaDescription?: string
    ogImage?: SanityImage
  }
}

export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  alt?: string
  caption?: string
}

// Re-export for convenience
export type { PTBlock as PortableTextBlock }
