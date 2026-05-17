import Link from 'next/link'
import { getFeaturedPosts, getLatestPosts, getAllCategories } from '@/lib/api/queries'
import { PostCard } from '@/components/blog/post-card'
import { Container } from '@/components/layout/container'
import { formatDate } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'

export default async function HomePage() {
  const [featured, latest, categories] = await Promise.all([
    getFeaturedPosts(1),
    getLatestPosts(6),
    getAllCategories(),
  ])

  const featuredPost = featured[0]

  return (
    <>
      {/* Hero */}
      <section className="border-b py-20">
        <Container>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Writing about tech,<br />life &amp; everything in between.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Personal thoughts on software engineering, career growth, and the things I&apos;m learning.
          </p>
          <div className="mt-8 flex gap-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Read all posts <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-medium hover:bg-muted"
            >
              About me
            </Link>
          </div>
        </Container>
      </section>

      {/* Featured post */}
      {featuredPost && (
        <section className="border-b py-16">
          <Container>
            <h2 className="mb-8 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Featured
            </h2>
            <PostCard post={featuredPost} variant="horizontal" />
          </Container>
        </section>
      )}

      {/* Latest posts */}
      {latest.length > 0 && (
        <section className="border-b py-16">
          <Container>
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Latest posts</h2>
              <Link href="/blog" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {latest.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-16">
          <Container>
            <h2 className="mb-8 text-2xl font-bold">Browse by topic</h2>
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  href={`/blog?category=${cat.slug.current}`}
                  className="rounded-full border px-4 py-1.5 text-sm hover:bg-muted"
                >
                  {cat.title}
                  {cat.postCount !== undefined && (
                    <span className="ml-2 text-muted-foreground">({cat.postCount})</span>
                  )}
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Empty state */}
      {latest.length === 0 && (
        <section className="py-24">
          <Container>
            <div className="rounded-xl border border-dashed p-12 text-center">
              <p className="text-muted-foreground">
                No posts yet. Configure your Sanity project in <code>.env.local</code> to get started.
              </p>
            </div>
          </Container>
        </section>
      )}
    </>
  )
}
