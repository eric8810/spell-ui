<template>
  <span
    data-slot="dropdown-menu-shortcut"
    :class="cn(
      'text-muted-foreground ml-auto text-xs tracking-widest',
      props.class
    )"
    v-bind="$attrs"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
  class?: string
}

const props = defineProps<Props>()

defineOptions({
  inheritAttrs: false
})
</script>
