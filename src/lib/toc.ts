export interface TocHeading {
  id: string
  text: string
  level: number
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Extract headings h1–h4 from an HTML string */
export function extractHeadings(html: string): TocHeading[] {
  const matches = [...html.matchAll(/<h([1-4])[^>]*>([\s\S]*?)<\/h[1-4]>/gi)]
  const seen = new Map<string, number>()

  return matches.map(([, level, innerHtml]) => {
    const text = innerHtml.replace(/<[^>]*>/g, '').trim()
    const base = slugify(text) || 'heading'
    const count = seen.get(base) ?? 0
    seen.set(base, count + 1)
    const id = count === 0 ? base : `${base}-${count}`
    return { id, text, level: parseInt(level, 10) }
  })
}

/** Add id attributes to h1–h4 elements in an HTML string */
export function addHeadingIds(html: string): string {
  const seen = new Map<string, number>()

  return html.replace(
    /<h([1-4])([^>]*)>([\s\S]*?)<\/h[1-4]>/gi,
    (_, level, attrs, innerHtml) => {
      const text = innerHtml.replace(/<[^>]*>/g, '').trim()
      const base = slugify(text) || 'heading'
      const count = seen.get(base) ?? 0
      seen.set(base, count + 1)
      const id = count === 0 ? base : `${base}-${count}`
      // Remove any existing id attribute to avoid duplicates
      const cleanAttrs = attrs.replace(/\s*id="[^"]*"/g, '')
      return `<h${level}${cleanAttrs} id="${id}">${innerHtml}</h${level}>`
    },
  )
}
