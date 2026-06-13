export const siteConfig = {
  logo: 'HNK',
  name: 'Tạp Hóa Của Hòa',
  description: 'Writing about tech, life, and everything in between.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.ikagi.site',
  author: {
    name: 'Nguyễn Khắc Hòa',
    location: 'Tokyo, Japan',
    origin: 'Vietnam',
    twitter: '@ikagi',
    github: 'ikagi',
  },
  nav: [
    { label: 'Blog', href: '/blog' },
    { label: 'Quiz', href: '/quiz' },
    { label: 'Thi', href: '/exam' },
    { label: 'Mẹo', href: '/tips' },
    { label: 'Now', href: '/now' },
    { label: 'About', href: '/about' },
  ],
}
