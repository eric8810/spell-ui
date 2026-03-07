<script setup lang="ts">
import ShimmerTextDemoSource from '@/components/demos/spell-ui/shimmer-text/ShimmerTextDemo.vue'

interface Props {
  variant?: 'default' | 'colors'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})
</script>

<template>
  <ShimmerTextDemoSource v-bind="props" />
</template>
