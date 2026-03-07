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
  <div
    aria-live="polite"
    data-slot="autocomplete-status"
    role="status"
    :class="cn(
      'px-3 py-2 font-medium text-muted-foreground text-xs empty:m-0 empty:p-0',
      props.class
    )"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>
