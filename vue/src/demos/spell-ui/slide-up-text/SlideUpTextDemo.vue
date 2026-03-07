<script setup lang="ts">
import SlideUpTextDemoSource from '@/components/demos/spell-ui/slide-up-text/SlideUpTextDemo.vue'

interface Props {
  variant?: 'default' | 'stagger' | 'split'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})
</script>

<template>
  <SlideUpTextDemoSource v-bind="props" />
</template>
