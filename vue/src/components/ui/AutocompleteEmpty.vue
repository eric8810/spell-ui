<script setup lang="ts">
import { ComboboxEmpty } from 'radix-vue'
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
  <ComboboxEmpty
    data-slot="autocomplete-empty"
    :class="cn(
      'not-empty:p-2 text-center text-base text-muted-foreground sm:text-sm',
      props.class
    )"
    v-bind="$attrs"
  >
    <slot>No options</slot>
  </ComboboxEmpty>
</template>
