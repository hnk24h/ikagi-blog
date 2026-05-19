'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
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
  const { groups, ungrouped } = groupMenuCategories(menuCategories)

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/')

  const linkCls = (href: string) =>
    cn(
      'rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-muted',
      isActive(href) ? 'font-medium text-foreground' : 'text-muted-foreground',
    )

  return (
    <nav className="flex items-center gap-1">

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

      {/* Ungrouped menu categories as direct links */}
      {ungrouped.map((cat) => (
        <Link
          key={cat._id}
          href={`/blog?category=${cat.slug.current}`}
          className={linkCls(`/blog?category=${cat.slug.current}`)}
        >
          {cat.title}
        </Link>
      ))}
      
      {/* Static nav links */}
      {siteConfig.nav.map((item) => (
        <Link key={item.href} href={item.href} className={linkCls(item.href)}>
          {item.label}
        </Link>
      ))}

      <div className="ml-2 flex items-center gap-1">
        <SearchBar />
        <ThemeToggle />
      </div>
    </nav>
  )
}
