<script setup lang="ts">
import MarqueeDemoSource from '@/components/demos/spell-ui/marquee/MarqueeDemo.vue'

interface Props {
  variant?: 'default' | 'pause' | 'vertical'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})
</script>

<template>
  <MarqueeDemoSource v-bind="props" />
</template>
