<template>
  <DropdownMenuLabel
    data-slot="dropdown-menu-label"
    :data-inset="inset"
    :class="cn(
      'px-2 py-1.5 text-sm font-medium data-[inset]:pl-8',
      props.class
    )"
    v-bind="$attrs"
  >
    <slot />
  </DropdownMenuLabel>
</template>

<script setup lang="ts">
import { DropdownMenuLabel } from 'radix-vue'
import { cn } from '@/lib/utils'

interface Props {
  class?: string
  inset?: boolean
}

const props = defineProps<Props>()

defineOptions({
  inheritAttrs: false
})
</script>
