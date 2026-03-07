import { inject, type ComputedRef, type Ref } from 'vue'

interface SidebarContextProps {
  state: ComputedRef<'expanded' | 'collapsed'>
  open: Ref<boolean>
  setOpen: (value: boolean) => void
  openMobile: Ref<boolean>
  setOpenMobile: (value: boolean) => void
  isMobile: Ref<boolean>
  toggleSidebar: () => void
}

const SIDEBAR_INJECTION_KEY = Symbol('sidebar')

export function useSidebar(): SidebarContextProps {
  const context = inject<SidebarContextProps>(SIDEBAR_INJECTION_KEY)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.')
  }
  return context
}

export { SIDEBAR_INJECTION_KEY }
export type { SidebarContextProps }
