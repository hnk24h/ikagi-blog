import { PostCard } from '@/components/blog/post-card'
import type { Post } from '@/types/blog'

interface Props {
  posts: Post[]
}

export function RelatedPosts({ posts }: Props) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  )
}
