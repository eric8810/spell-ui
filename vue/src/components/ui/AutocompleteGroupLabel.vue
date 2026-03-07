<script setup lang="ts">
import { ComboboxLabel } from 'radix-vue'
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
  <ComboboxLabel
    data-slot="autocomplete-group-label"
    :class="cn(
      'px-2 py-1.5 font-medium text-muted-foreground text-xs',
      props.class
    )"
    v-bind="$attrs"
  >
    <slot />
  </ComboboxLabel>
</template>
