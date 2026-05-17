import { Suspense } from 'react'
import { getAllPosts, getAllCategories } from '@/lib/api/queries'
import { BlogClient } from './blog-client'
import { Container } from '@/components/layout/container'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'All posts — tech, life, and career thoughts.',
}

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([getAllPosts(), getAllCategories()])

  return (
    <Container className="py-16">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">Blog</h1>
      <p className="mb-10 text-muted-foreground">
        {posts.length} post{posts.length !== 1 ? 's' : ''}
      </p>
      <Suspense fallback={<div>Loading...</div>}>
        <BlogClient initialPosts={posts} categories={categories} />
      </Suspense>
    </Container>
  )
}
