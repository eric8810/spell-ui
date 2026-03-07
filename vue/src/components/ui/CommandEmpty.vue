<script setup lang="ts">
import { cn } from '@/lib/utils'
import AutocompleteEmpty from './AutocompleteEmpty.vue'

interface Props {
  class?: string
}

const props = defineProps<Props>()

defineOptions({
  inheritAttrs: false,
})
</script>

<template>
  <AutocompleteEmpty
    data-slot="command-empty"
    :class="cn('not-empty:py-6', props.class)"
    v-bind="$attrs"
  >
    <slot />
  </AutocompleteEmpty>
</template>
