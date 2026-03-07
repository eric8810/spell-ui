<script setup lang="ts">
import { ComboboxViewport } from 'radix-vue'
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
  <ComboboxViewport
    data-slot="autocomplete-list"
    :class="cn('not-empty:scroll-py-1 not-empty:p-1', props.class)"
    v-bind="$attrs"
  >
    <slot />
  </ComboboxViewport>
</template>
