<script setup lang="ts">
import PerspectiveBookDemoSource from '@/components/demos/spell-ui/perspective-book/PerspectiveBookDemo.vue'

interface Props {
  variant?: 'default' | 'textured'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})
</script>

<template>
  <PerspectiveBookDemoSource v-bind="props" />
</template>
