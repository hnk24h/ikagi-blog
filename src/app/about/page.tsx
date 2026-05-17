import type { Metadata } from 'next'
import { Container } from '@/components/layout/container'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'About',
  description: `About ${siteConfig.author.name}`,
}

export default function AboutPage() {
  return (
    <Container size="md" className="py-16">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">About me</h1>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Hi, I&apos;m {siteConfig.author.name}. I&apos;m a software engineer who writes about tech,
          career, and the things I learn along the way.
        </p>
        <p>
          This blog is my place to think out loud — posts about code, tools, books, and occasional
          life observations.
        </p>
        <h2>Get in touch</h2>
        <ul>
          <li>
            Twitter / X:{' '}
            <a href={`https://twitter.com/${siteConfig.author.twitter.replace('@', '')}`}>
              {siteConfig.author.twitter}
            </a>
          </li>
          <li>
            GitHub:{' '}
            <a href={`https://github.com/${siteConfig.author.github}`}>
              @{siteConfig.author.github}
            </a>
          </li>
        </ul>
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: siteConfig.author.name,
            url: siteConfig.url,
            sameAs: [
              `https://twitter.com/${siteConfig.author.twitter.replace('@', '')}`,
              `https://github.com/${siteConfig.author.github}`,
            ],
          }),
        }}
      />
    </Container>
  )
}
