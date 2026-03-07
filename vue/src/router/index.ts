import { computed, readonly, ref, type ComputedRef } from 'vue'
import type { RouteMatch } from './routes'

const NAVIGATION_EVENT = 'spell-ui:navigate'

const normalizePath = (value: string) => {
  const path = value.replace(/^#/, '').replace(/[?#].*$/, '') || '/'
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

const getHashPath = () => {
  if (typeof window === 'undefined') {
    return '/'
  }
  const hash = window.location.hash || '#/'
  return normalizePath(hash)
}

const currentPath = ref(getHashPath())

export const routeState: ComputedRef<RouteMatch> = computed(() =>
  matchRoute(currentPath.value),
)

const syncFromLocation = () => {
  currentPath.value = getHashPath()
}

export const installRouter = () => {
  if (typeof window === 'undefined') {
    return
  }

  // 初始化时如果没有 hash，设置默认值
  if (!window.location.hash) {
    window.location.hash = '#/'
  }

  syncFromLocation()
  window.addEventListener('hashchange', syncFromLocation)
  window.addEventListener(NAVIGATION_EVENT, syncFromLocation)
}

export const navigate = (to: string, options: { replace?: boolean } = {}) => {
  if (typeof window === 'undefined') {
    return
  }

  const path = normalizePath(to)
  const hashPath = '#' + (path.startsWith('/') ? path : '/' + path)

  if (options.replace) {
    window.location.replace(hashPath)
  } else {
    window.location.hash = hashPath
  }

  currentPath.value = normalizePath(path)
  window.dispatchEvent(new Event(NAVIGATION_EVENT))
}

export const useRoute = () => readonly(routeState)

export const isExternalLink = (href: string) =>
  /^([a-z]+:)?\/\//i.test(href) || href.startsWith('mailto:') || href.startsWith('tel:')

export const getCurrentPath = () => currentPath.value
