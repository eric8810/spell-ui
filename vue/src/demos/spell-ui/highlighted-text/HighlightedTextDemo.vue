<script setup lang="ts">
import HighlightedTextDemoSource from '@/components/demos/spell-ui/highlighted-text/HighlightedTextDemo.vue'

interface Props {
  variant?: 'default' | 'direction'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})
</script>

<template>
  <HighlightedTextDemoSource v-bind="props" />
</template>
