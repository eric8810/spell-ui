<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
  class?: string
  asChild?: boolean
}

const props = defineProps<Props>()
</script>

<template>
  <component
    :is="props.asChild ? 'div' : 'a'"
    data-slot="breadcrumb-link"
    :class="cn('hover:text-foreground transition-colors', props.class)"
    v-bind="$attrs"
  >
    <slot />
  </component>
</template>
