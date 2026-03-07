<script setup lang="ts">
import { cn } from '@/lib/utils'
import AutocompleteList from './AutocompleteList.vue'

interface Props {
  class?: string
}

const props = defineProps<Props>()

defineOptions({
  inheritAttrs: false,
})
</script>

<template>
  <AutocompleteList
    data-slot="command-list"
    :class="cn('not-empty:scroll-py-2 not-empty:p-2', props.class)"
    v-bind="$attrs"
  >
    <slot />
  </AutocompleteList>
</template>
