import Link from 'next/link'
import { getFeaturedPosts, getLatestPosts, getAllCategories } from '@/lib/api/queries'
import { PostCard } from '@/components/blog/post-card'
import { Container } from '@/components/layout/container'
import { siteConfig } from '@/config/site'
import { ArrowRight } from 'lucide-react'

// ─── Terminal visual ──────────────────────────────────────────────────────────

function TerminalLine({ prompt, cmd }: { prompt: string; cmd: string }) {
  return (
    <div className="flex gap-2">
      <span className="select-none text-brand">{prompt}</span>
      <span className="text-foreground">{cmd}</span>
    </div>
  )
}

function TerminalOutput({ lines }: { lines: string[] }) {
  return (
    <div className="pl-4 text-muted-foreground">
      {lines.map((line, i) => (
        <div key={i}>{line}</div>
      ))}
    </div>
  )
}

function TerminalWindow() {
  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-2xl">
      {/* Title bar */}
      <div className="flex items-center gap-1.5 border-b bg-muted/60 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-red-400/80" />
        <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
        <span className="h-3 w-3 rounded-full bg-green-400/80" />
        <span className="ml-3 text-xs text-muted-foreground">~/about.sh</span>
      </div>
      {/* Body */}
      <div className="space-y-3 p-5 font-mono text-sm leading-relaxed">
        <TerminalLine prompt="$" cmd="whoami" />
        <TerminalOutput lines={[`${siteConfig.author.name}`, `📍 ${siteConfig.author.location} 🇯🇵`]} />

        <TerminalLine prompt="$" cmd="cat focus.txt" />
        <TerminalOutput
          lines={[
            '→ IT & Clean Code',
            '→ AI / AWS / Cloud',
            `→ Life: ${siteConfig.author.origin} ↔ Japan`,
            '→ Real-world dev stories',
          ]}
        />

        <TerminalLine prompt="$" cmd="git log --oneline -1" />
        <TerminalOutput lines={['a1b2c3 Writing to learn, sharing to grow']} />

        <div className="flex gap-2">
          <span className="select-none text-brand">$</span>
          <span className="inline-block h-4 w-2 animate-pulse bg-brand align-middle" />
        </div>
      </div>
    </div>
  )
}

// ─── Identity strip ───────────────────────────────────────────────────────────

const identity = [
  {
    emoji: '🇯🇵',
    title: 'Software Engineer in Japan',
    body: `Originally from Vietnam, now building things in ${siteConfig.author.location}. Living between two cultures, one keyboard.`,
  },
  {
    emoji: '✍️',
    title: 'What I write about',
    body: 'IT & coding · AI & AWS · Cloud architecture · Developer life between Vietnam and Japan.',
  },
  {
    emoji: '🎯',
    title: 'Who this is for',
    body: 'Developers who want real stories, not just tutorials. Curious people who love tech and life abroad.',
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const [featured, latest, categories] = await Promise.all([
    getFeaturedPosts(1),
    getLatestPosts(6),
    getAllCategories(),
  ])

  const featuredPost = featured[0]

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="border-b py-12 sm:py-20">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
            {/* Left — copy */}
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                Software Engineer · {siteConfig.author.location} 🇯🇵
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-[3.25rem] lg:leading-[1.15]">
                Writing about tech,{' '}
                life &amp; everything{' '}
                in between.
              </h1>

              <p className="mt-5 text-lg text-muted-foreground">
                Personal notes on software engineering, AI, AWS — and the everyday life
                of a Vietnamese dev building in Japan.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-brand-fg transition-colors hover:bg-brand-dark"
                >
                  Read all posts <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
                >
                  About me
                </Link>
              </div>
            </div>

            {/* Right — terminal visual */}
            <div className="hidden lg:block">
              <TerminalWindow />
            </div>
          </div>
        </Container>
      </section>

      {/* ── Identity strip ────────────────────────────────────────────────── */}
      <section className="border-b bg-muted/30 py-10 sm:py-14">
        <Container>
          <div className="grid gap-6 sm:grid-cols-3">
            {identity.map((item) => (
              <div key={item.title} className="flex flex-col gap-2">
                <span className="text-2xl">{item.emoji}</span>
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Featured post ─────────────────────────────────────────────────── */}
      {featuredPost && (
        <section className="border-b py-10 sm:py-16">
          <Container>
            <h2 className="mb-8 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Featured
            </h2>
            <PostCard post={featuredPost} variant="horizontal" />
          </Container>
        </section>
      )}

      {/* ── Latest posts ──────────────────────────────────────────────────── */}
      {latest.length > 0 && (
        <section className="border-b py-10 sm:py-16">
          <Container>
            <div className="mb-6 flex items-center justify-between sm:mb-8">
              <h2 className="text-xl font-bold sm:text-2xl">Latest posts</h2>
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

      {/* ── Categories ────────────────────────────────────────────────────── */}
      {categories.length > 0 && (
        <section className="py-10 sm:py-16">
          <Container>
            <h2 className="mb-6 text-xl font-bold sm:mb-8 sm:text-2xl">Browse by topic</h2>
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  href={`/blog?category=${cat.slug.current}`}
                  className="rounded-full border px-4 py-1.5 text-sm transition-colors hover:bg-muted"
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

      {/* ── Empty state ───────────────────────────────────────────────────── */}
      {latest.length === 0 && (
        <section className="py-24">
          <Container>
            <div className="rounded-xl border border-dashed p-12 text-center">
              <p className="text-muted-foreground">
                No posts yet. Configure your API in <code>.env.local</code> to get started.
              </p>
            </div>
          </Container>
        </section>
      )}
    </>
  )
}
