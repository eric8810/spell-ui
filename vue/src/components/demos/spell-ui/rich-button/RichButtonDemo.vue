<script setup lang="ts">
import { RichButton } from '@/components/ui'

interface Props {
  variant?: 'default' | 'sizes' | 'colored'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})
</script>

<template>
  <div v-if="props.variant === 'sizes'" class="flex flex-wrap items-center gap-4">
    <RichButton size="sm">Small</RichButton>
    <RichButton size="default">Default</RichButton>
    <RichButton size="lg">Large</RichButton>
  </div>

  <div v-else-if="props.variant === 'colored'" class="relative flex gap-4">
    <RichButton color="zinc">Button</RichButton>
    <RichButton color="amber">Button</RichButton>
    <RichButton color="purple">Button</RichButton>
  </div>

  <RichButton v-else>Default</RichButton>
</template>
