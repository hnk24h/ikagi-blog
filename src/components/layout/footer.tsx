import Link from 'next/link'
import { siteConfig } from '@/config/site'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
        <p className="text-sm text-muted-foreground">
          © {year} {siteConfig.author.name}
        </p>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <Link href="/blog" className="hover:text-foreground">Blog</Link>
          <Link href="/about" className="hover:text-foreground">About</Link>
          <a
            href={`https://github.com/${siteConfig.author.github}`}
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground"
          >
            GitHub
          </a>
          <a
            href={`https://twitter.com/${siteConfig.author.twitter.replace('@', '')}`}
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground"
          >
            Twitter
          </a>
        </div>
      </div>
    </footer>
  )
}
