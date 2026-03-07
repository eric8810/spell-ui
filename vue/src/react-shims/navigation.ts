export const dispatchNavigation = () => {
  window.dispatchEvent(new Event('spell-ui:navigate'))
}

export const navigateTo = (href: string) => {
  const nextUrl = new URL(href, window.location.origin)
  const nextPath = `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`
  const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`

  if (nextPath !== currentPath) {
    window.history.pushState({}, '', nextPath)
  }

  dispatchNavigation()
}
