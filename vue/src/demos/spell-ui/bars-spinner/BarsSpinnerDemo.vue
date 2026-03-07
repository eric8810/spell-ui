<script setup lang="ts">
import { BarsSpinner } from '@/components/ui'

interface Props {
  variant?: 'default' | 'sizes'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})
</script>

<template>
  <div v-if="props.variant === 'sizes'" class="flex items-center gap-4">
    <BarsSpinner :size="16" />
    <BarsSpinner :size="20" />
    <BarsSpinner :size="24" />
    <BarsSpinner :size="32" />
  </div>

  <BarsSpinner v-else />
</template>
