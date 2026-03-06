<template>
  <TooltipProvider :delay-duration="0">
    <div
      data-slot="sidebar-wrapper"
      :style="{
        '--sidebar-width': SIDEBAR_WIDTH,
        '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
        ...($attrs.style as any)
      }"
      :class="cn(
        'group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full',
        $attrs.class as string
      )"
    >
      <slot />
    </div>
  </TooltipProvider>
</template>

<script setup lang="ts">
import { provide, ref, computed } from 'vue'
import { useIsMobile } from '@/composables/use-mobile'
import { cn } from '@/lib/utils'
import TooltipProvider from './TooltipProvider.vue'
import { SIDEBAR_INJECTION_KEY, type SidebarContextProps } from '@/composables/useSidebar'

const SIDEBAR_COOKIE_NAME = 'sidebar_state'
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = '16rem'
const SIDEBAR_WIDTH_ICON = '3rem'

interface Props {
  defaultOpen?: boolean
  open?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  defaultOpen: true
})

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const isMobile = useIsMobile()
const openMobile = ref(false)
const _open = ref(props.defaultOpen)

const open = computed({
  get: () => props.open ?? _open.value,
  set: (value: boolean) => {
    _open.value = value
    emit('update:open', value)
    document.cookie = `${SIDEBAR_COOKIE_NAME}=${value}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
  }
})

const state = computed(() => open.value ? 'expanded' : 'collapsed')

const toggleSidebar = () => {
  if (isMobile.value) {
    openMobile.value = !openMobile.value
  } else {
    open.value = !open.value
  }
}

const setOpenMobile = (value: boolean) => {
  openMobile.value = value
}

provide(SIDEBAR_INJECTION_KEY, {
  state,
  open,
  setOpen: (value: boolean) => { open.value = value },
  openMobile,
  setOpenMobile,
  isMobile,
  toggleSidebar
} as SidebarContextProps)

defineOptions({
  inheritAttrs: false
})
</script>
