<template>
  <Button
    data-sidebar="trigger"
    data-slot="sidebar-trigger"
    variant="ghost"
    size="icon"
    :class="cn('size-7', $attrs.class as string)"
    @click="handleClick"
  >
    <PanelLeftIcon class="size-4" />
    <span class="sr-only">Toggle Sidebar</span>
  </Button>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'
import { useSidebar } from '@/composables/useSidebar'
import Button from './Button.vue'
import { PanelLeftIcon } from 'lucide-vue-next'

const props = defineProps<{
  onClick?: (event: MouseEvent) => void
}>()

const { toggleSidebar } = useSidebar()

const handleClick = (event: MouseEvent) => {
  props.onClick?.(event)
  toggleSidebar()
}
</script>
