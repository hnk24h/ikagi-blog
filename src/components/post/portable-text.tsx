'use client'

import Image from 'next/image'
import { PortableText as PortableTextComponent } from '@portabletext/react'
import type { PortableTextBlock } from '@/types/blog'
import { urlFor } from '@/lib/api/image'

interface PortableTextProps {
  value: PortableTextBlock[]
}

const components = {
  types: {
    image: ({ value }: { value: { asset: unknown; alt?: string; caption?: string } }) => {
      return (
        <figure className="my-8">
          <div className="relative overflow-hidden rounded-lg">
            <Image
              src={urlFor(value).width(900).url()}
              alt={value.alt || ''}
              width={900}
              height={600}
              className="w-full object-cover"
            />
          </div>
          {value.caption && (
            <figcaption className="mt-2 text-center text-sm text-muted-foreground">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
    code: ({ value }: { value: { code: string; language?: string } }) => {
      return (
        <pre className="my-6 overflow-x-auto rounded-lg bg-muted p-4 text-sm">
          <code>{value.code}</code>
        </pre>
      )
    },
  },
  marks: {
    link: ({ value, children }: { value?: { href: string; blank?: boolean }; children: React.ReactNode }) => (
      <a
        href={value?.href}
        target={value?.blank ? '_blank' : undefined}
        rel={value?.blank ? 'noreferrer' : undefined}
        className="underline underline-offset-2"
      >
        {children}
      </a>
    ),
  },
}

export function PortableText({ value }: PortableTextProps) {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <PortableTextComponent value={value} components={components} />
    </div>
  )
}
