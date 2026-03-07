<script setup lang="ts">
import { ComboboxGroup } from 'radix-vue'
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
  <ComboboxGroup
    data-slot="autocomplete-group"
    :class="cn('[[role=group]+&]:mt-1.5', props.class)"
    v-bind="$attrs"
  >
    <slot />
  </ComboboxGroup>
</template>
