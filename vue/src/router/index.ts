import { computed, readonly, ref, type ComputedRef } from 'vue'
import type { RouteMatch } from './routes'
import {
  buildHashHref,
  isExternalHref,
  parseHashLocation,
  resolveInternalHref,
} from '@/lib/routing'

const NAVIGATION_EVENT = 'spell-ui:navigate'

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

const getLocationState = () => {
  if (typeof window === 'undefined') {
    return {
      path: '/',
      section: null,
    }
  }

  return parseHashLocation(window.location.hash || '#/')
}

const initialLocationState = getLocationState()
const currentPath = ref(initialLocationState.path)
const currentSection = ref(initialLocationState.section)

export const routeState: ComputedRef<RouteMatch> = computed(() =>
  matchRoute(currentPath.value),
)

const syncFromLocation = () => {
  const nextState = getLocationState()
  currentPath.value = nextState.path
  currentSection.value = nextState.section
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

export const navigate = (
  to: string,
  options: { replace?: boolean; section?: string | null } = {},
) => {
  if (typeof window === 'undefined') {
    return
  }

  const hashPath = buildHashHref(to, { section: options.section ?? null })

  if (options.replace) {
    window.history.replaceState({}, '', hashPath)
  } else {
    window.location.hash = hashPath
  }

  const nextState = parseHashLocation(hashPath)
  currentPath.value = nextState.path
  currentSection.value = nextState.section
  window.dispatchEvent(new Event(NAVIGATION_EVENT))
}

export const useRoute = () => readonly(routeState)
export const routeSection = readonly(currentSection)

export const isExternalLink = isExternalHref

export const getCurrentPath = () => currentPath.value
export const getCurrentSection = () => currentSection.value
export const toInternalHref = (href: string, options: { section?: string | null } = {}) =>
  resolveInternalHref(options.section ? buildHashHref(href, options) : href, currentPath.value)
