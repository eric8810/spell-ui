import { buildHashHref, isExternalHref, isSectionHref, parseHashLocation, resolveInternalHref } from '@/lib/routing'

export const dispatchNavigation = () => {
  window.dispatchEvent(new Event('spell-ui:navigate'))
}

export const readCurrentPath = () => parseHashLocation(window.location.hash || '#/').path

export const toInternalHref = (href: string) => resolveInternalHref(href, readCurrentPath())

export const navigateTo = (href: string) => {
  if (isExternalHref(href)) {
    window.location.href = href
    return
  }

  const section = isSectionHref(href) ? href.slice(1) : null
  const nextHash = isSectionHref(href)
    ? buildHashHref(readCurrentPath(), { section })
    : toInternalHref(href)

  if (window.location.hash !== nextHash) {
    window.location.hash = nextHash
  }

  if (section) {
    window.requestAnimationFrame(() => {
      document.getElementById(section)?.scrollIntoView({
        block: 'start',
        behavior: 'smooth',
      })
    })
  }

  dispatchNavigation()
}
