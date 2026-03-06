<template>
  <optgroup
    data-slot="native-select-optgroup"
    :class="cn(props.class)"
    v-bind="$attrs"
  >
    <slot />
  </optgroup>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
  class?: string
}

const props = defineProps<Props>()

defineOptions({
  inheritAttrs: false
})
</script>
