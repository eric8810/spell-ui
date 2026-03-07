<script setup lang="ts">
import ColorSelectorDemoSource from '@/components/demos/spell-ui/color-selector/ColorSelectorDemo.vue'

interface Props {
  variant?: 'default' | 'sizes' | 'callback'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})
</script>

<template>
  <ColorSelectorDemoSource v-bind="props" />
</template>
