<script setup lang="ts">
import { cn } from '@/lib/utils'
import AutocompleteItem from './AutocompleteItem.vue'

interface Props {
  class?: string
}

const props = defineProps<Props>()

defineOptions({
  inheritAttrs: false,
})
</script>

<template>
  <AutocompleteItem
    data-slot="command-item"
    :class="cn('py-1.5', props.class)"
    v-bind="$attrs"
  >
    <slot />
  </AutocompleteItem>
</template>
