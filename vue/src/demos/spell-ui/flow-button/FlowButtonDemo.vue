<script setup lang="ts">
import FlowButtonDemoSource from '@/components/demos/spell-ui/flow-button/FlowButtonDemo.vue'

interface Props {
  variant?: 'default' | 'sizes' | 'colors'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})
</script>

<template>
  <FlowButtonDemoSource v-bind="props" />
</template>
