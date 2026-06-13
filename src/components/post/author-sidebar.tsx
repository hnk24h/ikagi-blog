import Image from 'next/image'
import Link from 'next/link'
import { Github, Twitter, Globe } from 'lucide-react'
import { urlFor } from '@/lib/api/image'
import { formatDateShort } from '@/lib/utils'
import AuthorAvatar from '@/components/ui/author-avatar'
import type { Author, Post } from '@/types/blog'

interface Props {
  author: Author
  posts: Post[]
  currentSlug: string
}

export function AuthorSidebar({ author, posts, currentSlug }: Props) {
  const avatarUrl = author.image ? urlFor(author.image).width(80).height(80).url() : null
  const otherPosts = posts.filter((p) => p.slug.current !== currentSlug).slice(0, 3)

  return (
    <div className="space-y-5 pt-5">
      {/* Divider */}
      <div className="h-px bg-border" />

      {/* ── Author card ── */}
      <div>
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Author
        </p>
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <AuthorAvatar src={avatarUrl} name={author.name} size={40} className="ring-2 ring-border" />

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold leading-tight text-foreground">{author.name}</p>

            {/* Social links */}
            <div className="mt-1.5 flex items-center gap-2">
              {author.twitter && (
                <a
                  href={`https://twitter.com/${author.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Twitter className="h-3.5 w-3.5" />
                </a>
              )}
              {author.github && (
                <a
                  href={`https://github.com/${author.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Github className="h-3.5 w-3.5" />
                </a>
              )}
              {author.website && (
                <a
                  href={author.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Website"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Globe className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Post timeline ── */}
      {otherPosts.length > 0 && (
        <div>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            More from {author.name.split(' ')[0]}
          </p>

          <ol className="relative space-y-3.5 border-l border-border pl-4">
            {otherPosts.map((p) => (
              <li key={p._id} className="group relative">
                {/* Timeline dot */}
                <span className="absolute -left-[1.3125rem] top-[0.35rem] flex h-2.5 w-2.5 items-center justify-center">
                  <span className="h-2 w-2 rounded-full bg-border transition-colors group-hover:bg-brand" />
                </span>

                <time className="block text-[11px] text-muted-foreground">
                  {formatDateShort(p.publishedAt)}
                </time>
                <Link
                  href={`/blog/${p.slug.current}`}
                  className="mt-0.5 block text-[13px] font-medium leading-snug text-foreground/80 transition-colors hover:text-brand line-clamp-2"
                >
                  {p.title}
                </Link>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}
