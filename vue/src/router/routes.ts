export type RouteMatch =
  | { name: 'home' }
  | { name: 'docs-redirect' }
  | { name: 'doc'; id: string }
  | { name: 'not-found' }

export const routes = [
  { name: 'home', path: '/' },
  { name: 'docs-redirect', path: '/docs' },
  { name: 'doc', path: '/docs/:id' },
] as const
