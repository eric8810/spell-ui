export interface SpotifyData {
  title: string
  artist: string
  image: string
  link: string
  audio?: string
}

const DEFAULT_SPOTIFY_API_URL = '/api/spotify'
const LEGACY_SPOTIFY_API_URL = 'https://talks.superalign.cn/spell-ui/api/spotify'

function getSpotifyApiCandidates(apiUrl?: string) {
  if (apiUrl?.trim()) {
    return [apiUrl.trim()]
  }

  const envApiUrl = import.meta.env.VITE_SPOTIFY_API_URL?.trim()

  return Array.from(
    new Set(
      [envApiUrl, DEFAULT_SPOTIFY_API_URL, LEGACY_SPOTIFY_API_URL].filter(
        (value): value is string => Boolean(value?.trim()),
      ),
    ),
  )
}

function withQuery(endpoint: string, params: URLSearchParams) {
  const [pathname, query = ''] = endpoint.split('?')
  const searchParams = new URLSearchParams(query)

  params.forEach((value, key) => {
    searchParams.set(key, value)
  })

  return `${pathname}?${searchParams.toString()}`
}

export function normalizeSpotifyUrl(url: string) {
  return url.replace(/\/intl-[a-z]{2}\//, '/')
}

export async function fetchSpotifyData(url: string, apiUrl?: string) {
  const params = new URLSearchParams({
    url: normalizeSpotifyUrl(url),
  })

  let lastError: unknown = new Error('Failed to fetch Spotify metadata')

  for (const endpoint of getSpotifyApiCandidates(apiUrl)) {
    try {
      const response = await fetch(withQuery(endpoint, params))

      if (!response.ok) {
        throw new Error(`Failed to fetch Spotify metadata from ${endpoint}`)
      }

      return (await response.json()) as SpotifyData
    } catch (error) {
      lastError = error
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Failed to fetch Spotify metadata')
}
