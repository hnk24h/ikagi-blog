import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { urlFor } from '@/lib/api/image'
import { formatDate, formatDateShort } from '@/lib/utils'
import type { Post } from '@/types/blog'

interface Props {
  related: Post[]
  authorPosts: Post[]
  currentSlug: string
  authorName?: string
}

// ── Next post card (full-width horizontal) ───────────────────────────────────
function NextPostCard({ post }: { post: Post }) {
  const coverUrl = post.coverImage ? urlFor(post.coverImage).width(800).height(400).url() : null

  return (
    <Link
      href={`/blog/${post.slug.current}`}
      className="group relative flex min-h-[200px] w-full overflow-hidden rounded-2xl border bg-card transition-shadow hover:shadow-lg"
    >
      {/* Text side */}
      <div className="flex flex-1 flex-col justify-between gap-4 p-6 sm:p-8">
        <div>
          <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand">
            <span>Up next</span>
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
          </p>
          {post.categories?.[0] && (
            <span className="mb-2 block text-xs text-muted-foreground">
              {post.categories[0].title}
            </span>
          )}
          <h3 className="text-lg font-bold leading-snug text-foreground group-hover:text-brand sm:text-xl line-clamp-3">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>{formatDate(post.publishedAt)}</span>
          {post.readingTime && (
            <>
              <span className="text-border">·</span>
              <span>{post.readingTime} min read</span>
            </>
          )}
        </div>
      </div>

      {/* Cover image side */}
      {coverUrl && (
        <div className="relative hidden w-72 shrink-0 overflow-hidden sm:block">
          <Image
            src={coverUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="288px"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-card via-card/10 to-transparent" />
        </div>
      )}
    </Link>
  )
}

// ── Related post card (compact grid card) ───────────────────────────────────
function RelatedCard({ post }: { post: Post }) {
  const coverUrl = post.coverImage ? urlFor(post.coverImage).width(600).height(340).url() : null

  return (
    <Link
      href={`/blog/${post.slug.current}`}
      className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md"
    >
      {coverUrl ? (
        <div className="relative h-40 overflow-hidden">
          <Image
            src={coverUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        </div>
      ) : (
        <div className="h-40 bg-muted/60" />
      )}
      <div className="flex flex-1 flex-col gap-2 p-4">
        {post.categories?.[0] && (
          <span className="text-[11px] font-semibold uppercase tracking-wider text-brand">
            {post.categories[0].title}
          </span>
        )}
        <h3 className="flex-1 text-sm font-semibold leading-snug text-foreground group-hover:text-brand line-clamp-3">
          {post.title}
        </h3>
        <p className="text-xs text-muted-foreground">{formatDate(post.publishedAt)}</p>
      </div>
    </Link>
  )
}

// ── Author post compact row (4-col) ─────────────────────────────────────────
function AuthorPostRow({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug.current}`}
      className="group flex flex-col gap-1.5 rounded-lg border bg-card p-3.5 transition-colors hover:bg-muted/50"
    >
      {post.categories?.[0] && (
        <span className="text-[10px] font-semibold uppercase tracking-wider text-brand">
          {post.categories[0].title}
        </span>
      )}
      <h4 className="text-sm font-medium leading-snug text-foreground group-hover:text-brand line-clamp-3">
        {post.title}
      </h4>
      <p className="mt-auto text-[11px] text-muted-foreground">{formatDateShort(post.publishedAt)}</p>
    </Link>
  )
}

// ── Main export ──────────────────────────────────────────────────────────────
export function PostEndSection({ related, authorPosts, currentSlug, authorName }: Props) {
  // "Next post" = first related; fallback to first author post not current
  const nextPost =
    related[0] ??
    authorPosts.find((p) => p.slug.current !== currentSlug) ??
    null

  // Grid posts = related excluding the nextPost, up to 3
  const gridPosts = related
    .filter((p) => p.slug.current !== nextPost?.slug.current)
    .slice(0, 3)

  // Author compact grid = author posts excluding current + nextPost, up to 4
  const authorGrid = authorPosts
    .filter(
      (p) =>
        p.slug.current !== currentSlug &&
        p.slug.current !== nextPost?.slug.current,
    )
    .slice(0, 4)

  if (!nextPost && gridPosts.length === 0 && authorGrid.length === 0) return null

  return (
    <div className="border-t">
      <div className="mx-auto max-w-screen-xl px-4 py-14 sm:px-6 lg:px-8 space-y-14">

        {/* ── Next post ── */}
        {nextPost && (
          <section>
            <NextPostCard post={nextPost} />
          </section>
        )}

        {/* ── Related grid (3 cols) ── */}
        {gridPosts.length > 0 && (
          <section>
            <div className="mb-6 flex items-center gap-4">
              <h2 className="text-lg font-bold">You might also like</h2>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {gridPosts.map((p) => (
                <RelatedCard key={p._id} post={p} />
              ))}
            </div>
          </section>
        )}

        {/* ── More from author (4 cols) ── */}
        {authorGrid.length > 0 && (
          <section>
            <div className="mb-6 flex items-center gap-4">
              <h2 className="text-lg font-bold">
                More from{' '}
                <span className="text-brand">{authorName ?? 'the author'}</span>
              </h2>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {authorGrid.map((p) => (
                <AuthorPostRow key={p._id} post={p} />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  )
}
