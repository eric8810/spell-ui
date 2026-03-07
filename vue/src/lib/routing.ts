const EXTERNAL_LINK_RE = /^([a-z]+:)?\/\//i
const SECTION_QUERY_PARAM = 'section'

export const normalizePath = (value: string) => {
  const path = value.replace(/^#/, '').replace(/[?#].*$/, '') || '/'

  if (path.length > 1 && path.endsWith('/')) {
    return path.slice(0, -1)
  }

  return path.startsWith('/') ? path : `/${path}`
}

export const isExternalHref = (href: string) =>
  EXTERNAL_LINK_RE.test(href) || href.startsWith('mailto:') || href.startsWith('tel:')

export const isSectionHref = (href: string) => href.startsWith('#') && !href.startsWith('#/')

export const parseHashLocation = (hash: string) => {
  const raw = hash.replace(/^#/, '') || '/'
  const [pathPart = '/', query = ''] = raw.split('?')
  const params = new URLSearchParams(query)

  return {
    path: normalizePath(pathPart),
    section: params.get(SECTION_QUERY_PARAM),
  }
}

export const buildHashHref = (
  to: string,
  options: {
    section?: string | null
  } = {},
) => {
  const params = new URLSearchParams()

  if (options.section) {
    params.set(SECTION_QUERY_PARAM, options.section)
  }

  const query = params.toString()
  return `#${normalizePath(to)}${query ? `?${query}` : ''}`
}

export const resolveInternalHref = (href: string, currentPath = '/') => {
  if (isExternalHref(href)) {
    return href
  }

  if (isSectionHref(href)) {
    return buildHashHref(currentPath, { section: href.slice(1) })
  }

  return href.startsWith('#/') ? href : buildHashHref(href)
}
