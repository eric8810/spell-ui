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
  <div
    data-slot="autocomplete-row"
    :class="cn(props.class)"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>
