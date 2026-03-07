<script setup lang="ts">
import { Spinner } from '@/components/ui'

interface Props {
  variant?: 'default' | 'sizes' | 'speeds' | 'colors'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})
</script>

<template>
  <div v-if="props.variant === 'sizes'" class="flex items-center gap-4">
    <Spinner size="sm" />
    <Spinner size="default" />
    <Spinner size="md" />
    <Spinner size="lg" />
  </div>

  <div v-else-if="props.variant === 'speeds'" class="flex items-center gap-4">
    <div class="flex flex-col items-center gap-2">
      <Spinner speed="slow" />
      <span class="text-xs text-muted-foreground">Slow</span>
    </div>
    <div class="flex flex-col items-center gap-2">
      <Spinner speed="normal" />
      <span class="text-xs text-muted-foreground">Normal</span>
    </div>
    <div class="flex flex-col items-center gap-2">
      <Spinner speed="fast" />
      <span class="text-xs text-muted-foreground">Fast</span>
    </div>
  </div>

  <div v-else-if="props.variant === 'colors'" class="flex items-center gap-4">
    <Spinner class="text-blue-600" />
    <Spinner class="text-green-600" />
    <Spinner class="text-red-600" />
    <Spinner class="text-purple-600" />
    <Spinner class="text-orange-600" />
    <Spinner class="text-pink-600" />
  </div>

  <Spinner v-else />
</template>
