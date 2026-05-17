import Link from 'next/link'
import { getMenuCategories } from '@/lib/api/queries'
import { siteConfig } from '@/config/site'
import { NavBar } from './nav-bar'

export async function Header() {
  const menuCategories = await getMenuCategories()

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-lg font-bold tracking-tight">
          {siteConfig.name}
        </Link>
        <NavBar menuCategories={menuCategories} />
      </div>
    </header>
  )
}
