<script setup lang="ts">
import { ComboboxSeparator } from 'radix-vue'
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
  <ComboboxSeparator
    data-slot="autocomplete-separator"
    :class="cn('mx-2 my-1 h-px bg-border last:hidden', props.class)"
    v-bind="$attrs"
  />
</template>
