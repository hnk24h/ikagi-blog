import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/api/image'
import type { Author } from '@/types/blog'
import { Github, Twitter, Globe } from 'lucide-react'

interface Props {
  author: Author
}

export function AuthorCard({ author }: Props) {
  return (
    <div className="flex gap-4">
      {author.image && (
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full">
          <Image
            src={urlFor(author.image).width(128).height(128).url()}
            alt={author.name}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div>
        <p className="font-semibold">{author.name}</p>
        <div className="mt-1 flex gap-3">
          {author.twitter && (
            <a href={`https://twitter.com/${author.twitter.replace('@', '')}`} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
              <Twitter className="h-4 w-4" />
            </a>
          )}
          {author.github && (
            <a href={`https://github.com/${author.github}`} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
              <Github className="h-4 w-4" />
            </a>
          )}
          {author.website && (
            <a href={author.website} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
              <Globe className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
