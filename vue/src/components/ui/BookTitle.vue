<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <h1 :class="cn('mt-3 mb-1 select-none text-balance font-bold', props.class)">
    <slot />
  </h1>
</template>
