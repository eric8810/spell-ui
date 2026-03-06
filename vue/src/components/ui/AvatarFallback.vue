<script setup lang="ts">
import { AvatarFallback } from 'radix-vue'
import { cn } from '@/lib/utils'

interface Props {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <AvatarFallback
    data-slot="avatar-fallback"
    :class="cn('bg-muted flex size-full items-center justify-center rounded-full', props.class)"
    v-bind="$attrs"
  >
    <slot />
  </AvatarFallback>
</template>
