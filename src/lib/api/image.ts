/**
 * Drop-in replacement for the Sanity `urlFor` helper.
 * When images come from the Laravel API they are plain URL strings wrapped in
 * `{ url: string }`. This shim extracts the URL and exposes the same fluent
 * `.width()` / `.height()` / `.url()` chain so all components keep working
 * without modification.
 */

type ImageLike =
  | { url?: string; asset?: { _ref?: string; url?: string } }
  | string
  | null
  | undefined

function extractUrl(source: ImageLike): string {
  if (!source) return ''
  if (typeof source === 'string') return source
  if ((source as { url?: string }).url) return (source as { url: string }).url
  return ''
}

function builder(src: ImageLike) {
  const raw = extractUrl(src)
  return {
    width: (_w: number) => builder(raw),
    height: (_h: number) => builder(raw),
    url: () => raw,
    toString: () => raw,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  return builder(source)
}
