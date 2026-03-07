<script setup lang="ts">
import BadgePill from '@/demos/shared/BadgePill.vue'

interface Props {
  variant?: 'default' | 'colors' | 'sizes'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})

const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'orange', 'cyan', 'indigo', 'violet', 'rose', 'amber', 'lime', 'emerald', 'sky', 'fuchsia'] as const
const formatColor = (color: string) => color.charAt(0).toUpperCase() + color.slice(1)
</script>

<template>
  <div v-if="props.variant === 'colors'" class="flex flex-wrap gap-2">
    <BadgePill v-for="color in colors" :key="color" :variant="color">
      {{ formatColor(color) }}
    </BadgePill>
  </div>

  <div v-else-if="props.variant === 'sizes'" class="flex items-center gap-4">
    <BadgePill size="sm">Small</BadgePill>
    <BadgePill size="default">Default</BadgePill>
  </div>

  <div v-else class="flex gap-2">
    <BadgePill>Default</BadgePill>
    <BadgePill variant="secondary">Secondary</BadgePill>
    <BadgePill variant="outline">Outline</BadgePill>
    <BadgePill variant="destructive">Destructive</BadgePill>
  </div>
</template>
