import Link from 'next/link'
import { getMenuCategories } from '@/lib/api/queries'
import { siteConfig } from '@/config/site'
import { NavBar } from './nav-bar'

function SiteLogoMark() {
  const initials = siteConfig.logo.replace(/\..*$/, '').slice(0, 2)
  return (
    <span
      className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-dark shadow-sm transition-all duration-300 group-hover:shadow-brand-glow/60 group-hover:shadow-md"
      aria-hidden
    >
      <span className="text-[18px] font-black tracking-tight text-brand-fg drop-shadow-sm">
        {initials}
      </span>
    </span>
  )
}

export async function Header() {
  const menuCategories = await getMenuCategories()

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-md backdrop-saturate-150 supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <SiteLogoMark />
          <span className="flex flex-col leading-none select-none">
            <span className="text-[15px] font-bold tracking-tight text-foreground transition-colors group-hover:text-brand">
              {siteConfig.name}
            </span>
          </span>
        </Link>
        <NavBar menuCategories={menuCategories} />
      </div>
    </header>
  )
}
