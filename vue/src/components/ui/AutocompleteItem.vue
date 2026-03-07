<script setup lang="ts">
import { ComboboxItem } from 'radix-vue'
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
  <ComboboxItem
    data-slot="autocomplete-item"
    :class="cn(
      'flex min-h-8 cursor-default select-none items-center rounded-sm px-2 py-1 text-base outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:opacity-64 sm:min-h-7 sm:text-sm',
      props.class
    )"
    v-bind="$attrs"
  >
    <slot />
  </ComboboxItem>
</template>
