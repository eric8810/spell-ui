<script setup lang="ts">
import { cn } from '@/lib/utils'
import AutocompleteSeparator from './AutocompleteSeparator.vue'

interface Props {
  class?: string
}

const props = defineProps<Props>()

defineOptions({
  inheritAttrs: false,
})
</script>

<template>
  <AutocompleteSeparator
    data-slot="command-separator"
    :class="cn('my-2', props.class)"
    v-bind="$attrs"
  />
</template>
