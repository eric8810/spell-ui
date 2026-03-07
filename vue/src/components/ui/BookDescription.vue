<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <p :class="cn('select-none text-xs/relaxed opacity-80', props.class)">
    <slot />
  </p>
</template>
