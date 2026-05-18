export const siteConfig = {
  name: 'Ikagi Blog',
  description: 'Writing about tech, life, and everything in between.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.ikagi.site',
  author: {
    name: 'Nguyễn Khắc Hòa',
    twitter: '@ikagi',
    github: 'ikagi',
  },
  nav: [
    { label: 'Blog', href: '/blog' },
    { label: 'About', href: '/about' },
    { label: 'Now', href: '/now' },
  ],
}
