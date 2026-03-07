<script setup lang="ts">
import BarsSpinnerIcon from '@/demos/shared/BarsSpinnerIcon.vue'

interface Props {
  variant?: 'default' | 'sizes'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})
</script>

<template>
  <div v-if="props.variant === 'sizes'" class="flex items-center gap-4 text-foreground">
    <BarsSpinnerIcon :size="16" />
    <BarsSpinnerIcon :size="20" />
    <BarsSpinnerIcon :size="24" />
    <BarsSpinnerIcon :size="32" />
  </div>

  <BarsSpinnerIcon v-else :size="24" class="text-foreground" />
</template>
