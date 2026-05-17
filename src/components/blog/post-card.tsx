import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/api/image'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { Post } from '@/types/blog'

interface Props {
  post: Post
  variant?: 'default' | 'compact' | 'horizontal'
}

export function PostCard({ post, variant = 'default' }: Props) {
  const href = `/blog/${post.slug.current}`

  if (variant === 'horizontal') {
    return (
      <Link href={href} className="group flex gap-6 rounded-xl border p-4 hover:bg-muted/50 sm:p-6">
        {post.coverImage && (
          <div className="relative hidden h-32 w-48 shrink-0 overflow-hidden rounded-lg sm:block">
            <Image
              src={urlFor(post.coverImage).width(400).height(266).url()}
              alt={post.coverImage.alt || post.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="flex flex-col justify-center">
          {post.categories?.[0] && (
            <span className="mb-2 text-xs font-medium text-primary">
              {post.categories[0].title}
            </span>
          )}
          <h2 className="text-xl font-bold group-hover:underline">{post.title}</h2>
          {post.excerpt && (
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
          )}
          <div className="mt-3 flex gap-3 text-xs text-muted-foreground">
            <span>{formatDate(post.publishedAt)}</span>
            {post.readingTime && <span>{post.readingTime} min read</span>}
          </div>
        </div>
      </Link>
    )
  }

  if (variant === 'compact') {
    return (
      <Link href={href} className="group flex items-start gap-3 py-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground">{formatDate(post.publishedAt)}</p>
          <h3 className="mt-0.5 font-medium leading-snug group-hover:underline line-clamp-2">
            {post.title}
          </h3>
        </div>
      </Link>
    )
  }

  return (
    <Link href={href} className="group flex flex-col rounded-xl border overflow-hidden hover:shadow-sm transition-shadow">
      {post.coverImage && (
        <div className="relative h-44 overflow-hidden">
          <Image
            src={urlFor(post.coverImage).width(600).height(340).url()}
            alt={post.coverImage.alt || post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        {post.categories?.[0] && (
          <span className="mb-2 text-xs font-medium text-primary">
            {post.categories[0].title}
          </span>
        )}
        <h2 className="font-bold leading-snug group-hover:underline">{post.title}</h2>
        {post.excerpt && (
          <p className="mt-2 flex-1 text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
        )}
        <div className="mt-4 flex gap-3 text-xs text-muted-foreground">
          <span>{formatDate(post.publishedAt)}</span>
          {post.readingTime && <span>{post.readingTime} min read</span>}
        </div>
      </div>
    </Link>
  )
}
