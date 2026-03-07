<script setup lang="ts">
import { ShimmerText } from '@/components/ui'

interface Props {
  variant?: 'default' | 'colors'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})

const label = 'Thinking longer for a better answer'
</script>

<template>
  <div v-if="props.variant === 'colors'" class="flex flex-col gap-4 font-medium">
    <ShimmerText variant="blue">{{ label }}</ShimmerText>
    <ShimmerText variant="green">{{ label }}</ShimmerText>
    <ShimmerText variant="purple">{{ label }}</ShimmerText>
    <ShimmerText variant="rose">{{ label }}</ShimmerText>
  </div>

  <ShimmerText v-else class="font-medium">
    {{ label }}
  </ShimmerText>
</template>
