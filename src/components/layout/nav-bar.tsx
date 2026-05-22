'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ChevronDown, Menu, X } from 'lucide-react'
import { ThemeToggle } from '@/components/common/theme-toggle'
import { SearchBar } from '@/components/layout/search-bar'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'
import type { Category } from '@/types/blog'

interface NavBarProps {
  menuCategories: Category[]
}

interface CategoryGroup {
  name: string
  categories: Category[]
}

function groupMenuCategories(categories: Category[]): {
  groups: CategoryGroup[]
  ungrouped: Category[]
} {
  const groupMap = new Map<string, Category[]>()
  const ungrouped: Category[] = []

  for (const cat of categories) {
    if (cat.menuGroup) {
      if (!groupMap.has(cat.menuGroup)) groupMap.set(cat.menuGroup, [])
      groupMap.get(cat.menuGroup)!.push(cat)
    } else {
      ungrouped.push(cat)
    }
  }

  const groups = Array.from(groupMap.entries()).map(([name, cats]) => ({
    name,
    categories: cats,
  }))

  return { groups, ungrouped }
}

export function NavBar({ menuCategories }: NavBarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { groups, ungrouped } = groupMenuCategories(menuCategories)

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [pathname])

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/')

  const linkCls = (href: string) =>
    cn(
      'rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-muted',
      isActive(href) ? 'font-medium text-foreground' : 'text-muted-foreground',
    )

  const mobileLinkCls = (href: string) =>
    cn(
      'block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted',
      isActive(href) ? 'text-foreground bg-muted/60' : 'text-muted-foreground',
    )

  return (
    <>
      {/* ── Desktop nav ──────────────────────────────────────────────────── */}
      <nav className="hidden items-center gap-1 md:flex">
        {/* Static nav links */}
        {siteConfig.nav.map((item) => (
          <Link key={item.href} href={item.href} className={linkCls(item.href)}>
            {item.label}
          </Link>
        ))}

        {/* Category groups as hover dropdowns */}
        {groups.map((group) => {
          const groupActive = group.categories.some((c) =>
            isActive(`/blog?category=${c.slug.current}`),
          )
          return (
            <div key={group.name} className="group relative">
              <button
                className={cn(
                  'flex items-center gap-1 rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-muted',
                  groupActive ? 'font-medium text-foreground' : 'text-muted-foreground',
                )}
              >
                {group.name}
                <ChevronDown className="h-3.5 w-3.5 opacity-60 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute left-0 top-full z-50 hidden min-w-[160px] rounded-md border bg-background p-1 shadow-md group-hover:block">
                {group.categories.map((cat) => (
                  <Link
                    key={cat._id}
                    href={`/blog?category=${cat.slug.current}`}
                    className="block rounded px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {cat.title}
                  </Link>
                ))}
              </div>
            </div>
          )
        })}

        {/* Ungrouped categories */}
        {ungrouped.map((cat) => (
          <Link
            key={cat._id}
            href={`/blog?category=${cat.slug.current}`}
            className={linkCls(`/blog?category=${cat.slug.current}`)}
          >
            {cat.title}
          </Link>
        ))}

        <div className="ml-2 flex items-center gap-1">
          <SearchBar />
          <ThemeToggle />
        </div>
      </nav>

      {/* ── Mobile: search + hamburger ───────────────────────────────────── */}
      <div className="flex items-center gap-1 md:hidden">
        <SearchBar />
        <ThemeToggle />
        <button
          type="button"
          aria-label="Mở menu"
          onClick={() => setMobileOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* ── Mobile drawer ────────────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 top-16 z-40 flex flex-col bg-background/95 backdrop-blur-sm md:hidden">
          <nav className="flex-1 overflow-y-auto border-t px-4 py-4">
            {/* Static links */}
            <div className="space-y-1">
              {siteConfig.nav.map((item) => (
                <Link key={item.href} href={item.href} className={mobileLinkCls(item.href)}>
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Category groups */}
            {groups.length > 0 && (
              <div className="mt-4 space-y-1">
                <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                  Chủ đề
                </p>
                {groups.map((group) => (
                  <div key={group.name}>
                    <p className="px-3 py-1 text-xs font-semibold text-muted-foreground">
                      {group.name}
                    </p>
                    {group.categories.map((cat) => (
                      <Link
                        key={cat._id}
                        href={`/blog?category=${cat.slug.current}`}
                        className={mobileLinkCls(`/blog?category=${cat.slug.current}`)}
                      >
                        {cat.title}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* Ungrouped categories */}
            {ungrouped.length > 0 && (
              <div className="mt-4 space-y-1">
                {ungrouped.map((cat) => (
                  <Link
                    key={cat._id}
                    href={`/blog?category=${cat.slug.current}`}
                    className={mobileLinkCls(`/blog?category=${cat.slug.current}`)}
                  >
                    {cat.title}
                  </Link>
                ))}
              </div>
            )}
          </nav>
        </div>
      )}
    </>
  )
}
