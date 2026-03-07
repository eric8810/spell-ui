import { computed, readonly, ref, type ComputedRef } from 'vue'
import type { RouteMatch } from './routes'

const NAVIGATION_EVENT = 'spell-ui:navigate'

const normalizePath = (value: string) => {
  const path = value.replace(/[?#].*$/, '') || '/'
  if (path.length > 1 && path.endsWith('/')) {
    return path.slice(0, -1)
  }
  return path
}

const matchRoute = (path: string): RouteMatch => {
  if (path === '/') {
    return { name: 'home' }
  }

  if (path === '/docs') {
    return { name: 'docs-redirect' }
  }

  const docMatch = path.match(/^\/docs\/([^/]+)$/)
  const id = docMatch?.[1]
  if (id) {
    return {
      name: 'doc',
      id: decodeURIComponent(id),
    }
  }

  return { name: 'not-found' }
}

const currentPath = ref(
  typeof window === 'undefined' ? '/' : normalizePath(window.location.pathname),
)

export const routeState: ComputedRef<RouteMatch> = computed(() =>
  matchRoute(currentPath.value),
)

const syncFromLocation = () => {
  currentPath.value = normalizePath(window.location.pathname)
}

export const installRouter = () => {
  if (typeof window === 'undefined') {
    return
  }

  syncFromLocation()
  window.addEventListener('popstate', syncFromLocation)
  window.addEventListener(NAVIGATION_EVENT, syncFromLocation)
}

export const navigate = (to: string, options: { replace?: boolean } = {}) => {
  if (typeof window === 'undefined') {
    return
  }

  const url = new URL(to, window.location.origin)
  const path = normalizePath(`${url.pathname}${url.search}${url.hash}`)

  if (options.replace) {
    window.history.replaceState({}, '', path)
  } else if (path !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
    window.history.pushState({}, '', path)
  }

  currentPath.value = normalizePath(url.pathname)
  window.dispatchEvent(new Event(NAVIGATION_EVENT))
}

export const useRoute = () => readonly(routeState)

export const isExternalLink = (href: string) =>
  /^([a-z]+:)?\/\//i.test(href) || href.startsWith('mailto:') || href.startsWith('tel:')

export const getCurrentPath = () => currentPath.value
