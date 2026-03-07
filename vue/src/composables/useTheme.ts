const STORAGE_KEY = 'spell-ui-theme'

export type ThemeMode = 'dark' | 'light'

const resolveTheme = (theme: ThemeMode) => {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  document.documentElement.dataset.scrollBehavior = 'smooth'
}

export const applyStoredTheme = () => {
  if (typeof window === 'undefined') {
    return
  }

  const stored = window.localStorage.getItem(STORAGE_KEY)
  resolveTheme(stored === 'light' ? 'light' : 'dark')
}

export const getStoredTheme = (): ThemeMode => {
  if (typeof window === 'undefined') {
    return 'dark'
  }

  return window.localStorage.getItem(STORAGE_KEY) === 'light' ? 'light' : 'dark'
}

export const setStoredTheme = (theme: ThemeMode) => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, theme)
  resolveTheme(theme)
}

export const toggleStoredTheme = () => {
  setStoredTheme(getStoredTheme() === 'dark' ? 'light' : 'dark')
}
