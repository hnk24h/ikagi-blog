const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

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
