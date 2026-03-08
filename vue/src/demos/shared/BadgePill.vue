<script setup lang="ts">
import { Badge } from '@/components/ui'

interface Props {
  variant?:
    | 'default'
    | 'secondary'
    | 'outline'
    | 'destructive'
    | 'red'
    | 'blue'
    | 'green'
    | 'yellow'
    | 'purple'
    | 'pink'
    | 'orange'
    | 'cyan'
    | 'indigo'
    | 'violet'
    | 'rose'
    | 'amber'
    | 'lime'
    | 'emerald'
    | 'sky'
    | 'slate'
    | 'fuchsia'
  size?: 'sm' | 'default'
  asChild?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'default',
  asChild: false,
})
</script>

<template>
  <Badge
    :variant="props.variant"
    :size="props.size"
    :as-child="props.asChild"
    :class="props.class"
  >
    <slot />
  </Badge>
</template>
