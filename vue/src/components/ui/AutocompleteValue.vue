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
  <span
    data-slot="autocomplete-value"
    :class="cn(props.class)"
    v-bind="$attrs"
  >
    <slot />
  </span>
</template>
