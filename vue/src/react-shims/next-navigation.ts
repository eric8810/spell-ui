import { useEffect, useState } from 'react'
import { navigateTo, readCurrentPath } from './navigation'

const readPathname = () => readCurrentPath()

export const usePathname = () => {
  const [pathname, setPathname] = useState(readPathname)

  useEffect(() => {
    const update = () => setPathname(readPathname())
    window.addEventListener('hashchange', update)
    window.addEventListener('spell-ui:navigate', update)
    return () => {
      window.removeEventListener('hashchange', update)
      window.removeEventListener('spell-ui:navigate', update)
    }
  }, [])

  return pathname
}

export const useRouter = () => ({
  push: (href: string) => navigateTo(href),
  replace: (href: string) => navigateTo(href),
})
