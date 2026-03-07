import { useEffect, useState } from 'react'
import { navigateTo } from './navigation'

const readPathname = () => window.location.pathname

export const usePathname = () => {
  const [pathname, setPathname] = useState(readPathname)

  useEffect(() => {
    const update = () => setPathname(readPathname())
    window.addEventListener('popstate', update)
    window.addEventListener('spell-ui:navigate', update)
    return () => {
      window.removeEventListener('popstate', update)
      window.removeEventListener('spell-ui:navigate', update)
    }
  }, [])

  return pathname
}

export const useRouter = () => ({
  push: (href: string) => navigateTo(href),
})
