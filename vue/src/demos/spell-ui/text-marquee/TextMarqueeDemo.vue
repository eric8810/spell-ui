<script setup lang="ts">
import TextMarqueeDemoSource from '@/components/demos/spell-ui/text-marquee/TextMarqueeDemo.vue'

interface Props {
  variant?: 'default' | 'speed'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})
</script>

<template>
  <TextMarqueeDemoSource v-bind="props" />
</template>
