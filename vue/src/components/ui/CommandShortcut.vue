<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
  class?: string
}

const props = defineProps<Props>()

defineOptions({
  inheritAttrs: false,
})
</script>

<template>
  <kbd
    data-slot="command-shortcut"
    :class="cn(
      'ms-auto font-medium font-sans text-muted-foreground/72 text-xs tracking-widest',
      props.class
    )"
    v-bind="$attrs"
  >
    <slot />
  </kbd>
</template>
