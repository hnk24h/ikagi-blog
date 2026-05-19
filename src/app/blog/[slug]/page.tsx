import { notFound } from 'next/navigation'
import Image from 'next/image'
import type { Metadata } from 'next'
import { getPostBySlug, getAllPostSlugs, getRelatedPosts, getPostsByAuthor } from '@/lib/api/queries'
import { urlFor } from '@/lib/api/image'
import { RelatedPosts } from '@/components/post/related-posts'
import { ShareButtons } from '@/components/post/share-buttons'
import { TableOfContents } from '@/components/post/table-of-contents'
import { AuthorChip } from '@/components/post/author-chip'
import { Container } from '@/components/layout/container'
import { formatDate } from '@/lib/utils'
import { siteConfig } from '@/config/site'
import { extractHeadings, addHeadingIds } from '@/lib/toc'
import Link from 'next/link'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs()
  return slugs.map((s) => ({ slug: s.slug.current }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}
  return {
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      images: post.coverImage ? [urlFor(post.coverImage).width(1200).height(630).url()] : [],
    },
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const categoryIds = post.categories?.map((c) => c._id) ?? []
  const authorSlug = post.author?.slug?.current ?? ''

  const [related, authorPosts] = await Promise.all([
    getRelatedPosts(post._id, categoryIds, 3, post.slug.current),
    authorSlug ? getPostsByAuthor(authorSlug, 5) : Promise.resolve([]),
  ])

  const postUrl = `${siteConfig.url}/blog/${post.slug.current}`

  // Process HTML body: add id attrs to headings, then extract TOC
  const rawBody = !Array.isArray(post.body) ? (post.body as unknown as string) ?? '' : ''
  const processedBody = rawBody ? addHeadingIds(rawBody) : ''
  const headings = rawBody ? extractHeadings(rawBody) : []

  return (
    <article>
      {/* Cover image */}
      {post.coverImage && (
        <div className="relative h-[40vh] min-h-[280px] w-full overflow-hidden border-b">
          <Image
            src={urlFor(post.coverImage).width(1600).height(640).url()}
            alt={post.coverImage.alt || post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <Container size="xl" className="py-12">
        <div className="grid grid-cols-1 gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,1fr)_240px]">
          {/* ── Main content ── */}
          <div className="min-w-0">
            {/* ── Row 1: Categories + Tags + Author chip ── */}
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex flex-col gap-2">
                {/* Categories */}
                {post.categories && post.categories.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {post.categories.map((cat) => (
                      <Link
                        key={cat._id}
                        href={`/blog?category=${cat.slug.current}`}
                        className="rounded-full bg-muted px-3 py-1 text-xs font-medium hover:bg-muted/80"
                      >
                        {cat.title}
                      </Link>
                    ))}
                  </div>
                )}
                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/blog?search=${encodeURIComponent(tag)}`}
                        className="inline-flex items-center gap-0.5 rounded-full border border-brand/30 bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand transition-colors hover:bg-brand/20"
                      >
                        <span className="opacity-50">#</span>{tag}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              {post.author && (
                <AuthorChip
                  author={post.author}
                  authorPosts={authorPosts}
                  currentPostId={post._id}
                />
              )}
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>

            {post.excerpt && (
              <blockquote className="mt-6 rounded-xl border-l-4 border-brand bg-muted/40 px-5 py-4">
                <p className="text-base leading-relaxed text-foreground/80 italic">
                  {post.excerpt}
                </p>
              </blockquote>
            )}

            {/* ── Row 2: Meta + Share ── */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-b pb-6 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-brand font-medium">{formatDate(post.publishedAt)}</span>
                {post.readingTime && (
                  <>
                    <span className="text-border">·</span>
                    <span className="text-brand/80">{post.readingTime} min read</span>
                  </>
                )}
              </div>
              <ShareButtons url={postUrl} title={post.title} compact />
            </div>

            {/* Body */}
            {processedBody && (
              <div
                className="mt-12 prose prose-neutral dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: processedBody }}
              />
            )}

          </div>

          {/* ── TOC sidebar ── */}
          {headings.length > 0 && (
            <aside className="hidden lg:block">
              <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-lg border bg-muted/30 p-4">
                <TableOfContents headings={headings} />
              </div>
            </aside>
          )}
        </div>
      </Container>

      {/* Related */}
      {related.length > 0 && (
        <div className="border-t">
          <Container className="py-12">
            <h2 className="mb-8 text-xl font-bold">Related posts</h2>
            <RelatedPosts posts={related} />
          </Container>
        </div>
      )}
    </article>
  )
}
