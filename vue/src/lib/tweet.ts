export type Indices = [number, number]

export interface HashtagEntity {
  indices: Indices
  text: string
}

export interface UserMentionEntity {
  id_str: string
  indices: Indices
  name: string
  screen_name: string
}

export interface UrlEntity {
  display_url: string
  expanded_url: string
  indices: Indices
  url: string
}

export interface MediaEntity {
  display_url: string
  expanded_url: string
  indices: Indices
  url: string
}

export interface SymbolEntity {
  indices: Indices
  text: string
}

export interface TweetEntities {
  hashtags?: HashtagEntity[]
  urls?: UrlEntity[]
  user_mentions?: UserMentionEntity[]
  symbols?: SymbolEntity[]
  media?: MediaEntity[]
}

export interface TweetUser {
  id_str?: string
  name: string
  profile_image_url_https: string
  profile_image_shape?: 'Circle' | 'Square'
  screen_name: string
  verified?: boolean
  verified_type?: 'Business' | 'Government'
  is_blue_verified?: boolean
}

export interface TweetPhoto {
  backgroundColor?: {
    red: number
    green: number
    blue: number
  }
  cropCandidates?: Array<{
    x: number
    y: number
    w: number
    h: number
  }>
  expandedUrl?: string
  url: string
  width?: number
  height?: number
}

export interface TweetVideo {
  aspectRatio?: [number, number]
  contentType?: string
  durationMs?: number
  mediaAvailability?: {
    status: string
  }
  poster: string
  variants: Array<{
    type: string
    src: string
  }>
  videoId?: {
    type: string
    id: string
  }
  viewCount?: number
}

export interface Tweet {
  __typename?: string
  created_at: string
  display_text_range: Indices
  entities: TweetEntities
  favorite_count: number
  id_str: string
  in_reply_to_screen_name?: string
  in_reply_to_status_id_str?: string
  photos?: TweetPhoto[]
  text: string
  user: TweetUser
  video?: TweetVideo
}

type TextEntity = {
  indices: Indices
  text: string
  type: 'text'
}

type EnrichedHashtagEntity = HashtagEntity & {
  href: string
  type: 'hashtag'
}

type EnrichedMentionEntity = UserMentionEntity & {
  href: string
  type: 'mention'
  text: string
}

type EnrichedUrlEntity = UrlEntity & {
  href: string
  type: 'url'
  text: string
}

type EnrichedMediaEntity = MediaEntity & {
  href: string
  type: 'media'
  text: string
}

type EnrichedSymbolEntity = SymbolEntity & {
  href: string
  type: 'symbol'
}

export type EnrichedEntity =
  | TextEntity
  | EnrichedHashtagEntity
  | EnrichedMentionEntity
  | EnrichedUrlEntity
  | EnrichedMediaEntity
  | EnrichedSymbolEntity

export interface EnrichedTweet extends Omit<Tweet, 'entities' | 'user'> {
  entities: EnrichedEntity[]
  in_reply_to_url?: string
  like_url: string
  reply_url: string
  url: string
  user: TweetUser & {
    follow_url: string
    url: string
  }
}

type RawEntity =
  | {
      indices: Indices
      type: 'text'
    }
  | (HashtagEntity & { type: 'hashtag' })
  | (UserMentionEntity & { type: 'mention' })
  | (UrlEntity & { type: 'url' })
  | (MediaEntity & { type: 'media' })
  | (SymbolEntity & { type: 'symbol' })

const DEFAULT_TWEET_API_HOST = 'https://react-tweet.vercel.app'
const SYNDICATION_URL = 'https://cdn.syndication.twimg.com'
const TWEET_ID_PATTERN = /^[0-9]+$/
const TWEET_FEATURES = [
  'tfw_timeline_list:',
  'tfw_follower_count_sunset:true',
  'tfw_tweet_edit_backend:on',
  'tfw_refsrc_session:on',
  'tfw_fosnr_soft_interventions_enabled:on',
  'tfw_show_birdwatch_pivots_enabled:on',
  'tfw_show_business_verified_badge:on',
  'tfw_duplicate_scribes_to_settings:on',
  'tfw_use_profile_image_shape_enabled:on',
  'tfw_show_blue_verified_badge:on',
  'tfw_legacy_timeline_sunset:true',
  'tfw_show_gov_verified_badge:on',
  'tfw_show_business_affiliate_badge:on',
  'tfw_tweet_edit_frontend:on',
].join(';')

function getToken(id: string) {
  return (Number(id) / 1e15 * Math.PI).toString(6 ** 2).replace(/(0+|\.)/g, '')
}

function getTweetUrl(tweet: Pick<Tweet, 'id_str' | 'user'>) {
  return `https://x.com/${tweet.user.screen_name}/status/${tweet.id_str}`
}

function getUserUrl(screenName: string) {
  return `https://x.com/${screenName}`
}

function getLikeUrl(tweet: Pick<Tweet, 'id_str'>) {
  return `https://x.com/intent/like?tweet_id=${tweet.id_str}`
}

function getReplyUrl(tweet: Pick<Tweet, 'id_str'>) {
  return `https://x.com/intent/tweet?in_reply_to=${tweet.id_str}`
}

function getFollowUrl(tweet: Pick<Tweet, 'user'>) {
  return `https://x.com/intent/follow?screen_name=${tweet.user.screen_name}`
}

function getHashtagUrl(entity: HashtagEntity) {
  return `https://x.com/hashtag/${entity.text}`
}

function getSymbolUrl(entity: SymbolEntity) {
  return `https://x.com/search?q=%24${entity.text}`
}

function getInReplyToUrl(tweet: Pick<Tweet, 'in_reply_to_screen_name' | 'in_reply_to_status_id_str'>) {
  return tweet.in_reply_to_screen_name && tweet.in_reply_to_status_id_str
    ? `https://x.com/${tweet.in_reply_to_screen_name}/status/${tweet.in_reply_to_status_id_str}`
    : undefined
}

function addEntities(
  result: RawEntity[],
  type: 'hashtag' | 'mention' | 'url' | 'media' | 'symbol',
  entities: Array<HashtagEntity | UserMentionEntity | UrlEntity | MediaEntity | SymbolEntity>,
) {
  for (const entity of entities) {
    for (const [index, item] of result.entries()) {
      if (item.indices[0] > entity.indices[0] || item.indices[1] < entity.indices[1]) {
        continue
      }

      const items: RawEntity[] = [{ ...entity, type } as RawEntity]

      if (item.indices[0] < entity.indices[0]) {
        items.unshift({
          indices: [item.indices[0], entity.indices[0]],
          type: 'text' as const,
        })
      }

      if (item.indices[1] > entity.indices[1]) {
        items.push({
          indices: [entity.indices[1], item.indices[1]],
          type: 'text' as const,
        })
      }

      result.splice(index, 1, ...items)
      break
    }
  }
}

function fixRange(tweet: Tweet, entities: Array<{ indices: Indices }>) {
  if (tweet.entities.media?.[0] && tweet.entities.media[0].indices[0] < tweet.display_text_range[1]) {
    tweet.display_text_range[1] = tweet.entities.media[0].indices[0]
  }

  const lastEntity = entities[entities.length - 1]

  if (lastEntity && lastEntity.indices[1] > tweet.display_text_range[1]) {
    lastEntity.indices[1] = tweet.display_text_range[1]
  }
}

function getEntities(tweet: Tweet): EnrichedEntity[] {
  const textMap = Array.from(tweet.text)
  const result: RawEntity[] = [
    {
      indices: [...tweet.display_text_range] as Indices,
      type: 'text',
    },
  ]

  addEntities(result, 'hashtag', tweet.entities.hashtags ?? [])
  addEntities(result, 'mention', tweet.entities.user_mentions ?? [])
  addEntities(result, 'url', tweet.entities.urls ?? [])
  addEntities(result, 'symbol', tweet.entities.symbols ?? [])

  if (tweet.entities.media?.length) {
    addEntities(result, 'media', tweet.entities.media)
  }

  fixRange(tweet, result)

  return result.map((entity) => {
    const text = textMap.slice(entity.indices[0], entity.indices[1]).join('')

    switch (entity.type) {
      case 'hashtag':
        return {
          ...entity,
          href: getHashtagUrl(entity),
          text,
        }
      case 'mention':
        return {
          ...entity,
          href: getUserUrl(entity.screen_name),
          text,
        }
      case 'url':
      case 'media':
        return {
          ...entity,
          href: entity.expanded_url,
          text: entity.display_url,
        }
      case 'symbol':
        return {
          ...entity,
          href: getSymbolUrl(entity),
          text,
        }
      default:
        return {
          ...entity,
          text,
        }
    }
  })
}

function assertTweetId(id: string) {
  if (id.length > 40 || !TWEET_ID_PATTERN.test(id)) {
    throw new Error(`Invalid tweet id: ${id}`)
  }
}

async function readJson(response: Response) {
  const isJson = response.headers.get('content-type')?.includes('application/json')
  return isJson ? await response.json() : undefined
}

async function fetchTweetFromApi(apiUrl: string, fetchOptions?: RequestInit) {
  const response = await fetch(apiUrl, fetchOptions)
  const payload = await readJson(response)

  if (response.ok) {
    return (payload?.data ?? null) as Tweet | null
  }

  throw new Error(`Failed to fetch tweet from ${apiUrl} with status ${response.status}`)
}

async function fetchTweetFromSyndication(id: string, fetchOptions?: RequestInit) {
  const url = new URL(`${SYNDICATION_URL}/tweet-result`)
  url.searchParams.set('id', id)
  url.searchParams.set('lang', 'en')
  url.searchParams.set('features', TWEET_FEATURES)
  url.searchParams.set('token', getToken(id))

  const response = await fetch(url.toString(), fetchOptions)
  const payload = await readJson(response)

  if (response.ok) {
    if (payload?.__typename === 'TweetTombstone') {
      return null
    }

    return (payload ?? null) as Tweet | null
  }

  if (response.status === 404) {
    return null
  }

  throw new Error(`Failed to fetch tweet from syndication API with status ${response.status}`)
}

export async function fetchTweet(id: string, apiUrl?: string, fetchOptions?: RequestInit) {
  assertTweetId(id)

  if (apiUrl?.trim()) {
    return fetchTweetFromApi(apiUrl, fetchOptions)
  }

  const defaultApiUrl = `${DEFAULT_TWEET_API_HOST}/api/tweet/${id}`

  try {
    return await fetchTweetFromApi(defaultApiUrl, fetchOptions)
  } catch (apiError) {
    try {
      return await fetchTweetFromSyndication(id, fetchOptions)
    } catch {
      throw apiError
    }
  }
}

export function formatTweetNumber(number: number) {
  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(1).replace(/\.0$/, '')}M`
  }

  if (number >= 1000) {
    return `${(number / 1000).toFixed(1).replace(/\.0$/, '')}k`
  }

  return number.toString()
}

export function enrichTweet(tweet: Tweet): EnrichedTweet {
  return {
    ...tweet,
    entities: getEntities(tweet),
    in_reply_to_url: getInReplyToUrl(tweet),
    like_url: getLikeUrl(tweet),
    reply_url: getReplyUrl(tweet),
    url: getTweetUrl(tweet),
    user: {
      ...tweet.user,
      follow_url: getFollowUrl(tweet),
      url: getUserUrl(tweet.user.screen_name),
    },
  }
}
