declare module '@/generated/manifest.js' {
  export const docContentLoaders: Record<string, () => Promise<any>>
  export const docSourceLoaders: Record<string, () => Promise<any>>
  export const demoModuleLoaders: Record<string, () => Promise<any>>
}

declare module '@root/*.json' {
  const value: any
  export default value
}
