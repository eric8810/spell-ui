declare module '@react/*' {
  const value: any
  export default value
  export = value
}

declare module '@/generated/manifest.js' {
  export const heroLoader: () => Promise<any>
  export const docModuleLoaders: Record<string, () => Promise<any>>
  export const docSourceLoaders: Record<string, () => Promise<any>>
}

declare module '@root/*.json' {
  const value: any
  export default value
}
