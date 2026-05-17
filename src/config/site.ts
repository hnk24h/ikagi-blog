export const siteConfig = {
  name: 'My Blog',
  description: 'Writing about tech, life, and everything in between.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com',
  author: {
    name: 'Your Name',
    twitter: '@yourhandle',
    github: 'yourgithub',
  },
  nav: [
    { label: 'Blog', href: '/blog' },
    { label: 'About', href: '/about' },
    { label: 'Now', href: '/now' },
  ],
}
