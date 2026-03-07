<script setup lang="ts">
import { PopButton } from '@/components/ui'

interface Props {
  variant?: 'default' | 'sizes' | 'variant'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})
</script>

<template>
  <div v-if="props.variant === 'sizes'" class="flex flex-wrap items-center gap-4 font-semibold not-sm:flex-col">
    <PopButton size="sm" color="violet">Small</PopButton>
    <PopButton size="default" color="violet">Default</PopButton>
    <PopButton size="lg" color="violet">Large</PopButton>
  </div>

  <div v-else-if="props.variant === 'variant'" class="flex flex-wrap gap-3 font-semibold not-sm:flex-col">
    <PopButton color="default">Button</PopButton>
    <PopButton color="amber">Button</PopButton>
    <PopButton color="purple">Button</PopButton>
  </div>

  <div v-else class="flex items-center justify-center">
    <PopButton class="font-semibold">Button</PopButton>
  </div>
</template>
