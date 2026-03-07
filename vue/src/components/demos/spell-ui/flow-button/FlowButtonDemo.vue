<script setup lang="ts">
import { FlowButton } from '@/components/ui'

interface Props {
  variant?: 'default' | 'sizes' | 'colors'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})
</script>

<template>
  <div v-if="props.variant === 'sizes'" class="flex items-center gap-4">
    <FlowButton size="sm">Small</FlowButton>
    <FlowButton size="default">Default</FlowButton>
    <FlowButton size="lg">Large</FlowButton>
  </div>

  <div v-else-if="props.variant === 'colors'" class="flex flex-wrap gap-4">
    <FlowButton border-color="var(--primary)">
      Primary
    </FlowButton>
    <FlowButton border-color="var(--color-red-500)">
      Red
    </FlowButton>
    <FlowButton border-color="var(--color-blue-500)">
      Blue
    </FlowButton>
    <FlowButton border-color="var(--color-purple-500)">
      Purple
    </FlowButton>
    <FlowButton border-color="var(--color-green-500)">
      Green
    </FlowButton>
  </div>

  <FlowButton v-else>Learn more</FlowButton>
</template>
