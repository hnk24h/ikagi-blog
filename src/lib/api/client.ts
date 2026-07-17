const LOCAL_API_URL = 'http://localhost:3002/api/v1'
const LOCAL_HOST_PATTERN = /(^|\/\/)(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?(\/|$)/i

const serverApiUrl = process.env.API_URL?.trim()
const publicApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim()

const API_URL = serverApiUrl || publicApiUrl || (process.env.NODE_ENV === 'production'
  ? 'https://cms.ikagi.site/api/v1'
  : LOCAL_API_URL)

if (process.env.NODE_ENV === 'production' && LOCAL_HOST_PATTERN.test(API_URL)) {
  throw new Error(
    'Invalid API_URL for production build. Set API_URL or NEXT_PUBLIC_API_URL to a deployed API endpoint.',
  )
}

type FetchOptions = {
  next?: NextFetchRequestConfig
}

async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { Accept: 'application/json' },
    next: options.next,
  })

  if (!res.ok) {
    if (res.status === 404) return null as T
    throw new Error(`API error ${res.status}: ${path}`)
  }

  return res.json()
}

export { apiFetch, API_URL }
