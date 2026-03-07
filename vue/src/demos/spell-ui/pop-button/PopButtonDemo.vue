<script setup lang="ts">
import PopButtonDemoSource from '@/components/demos/spell-ui/pop-button/PopButtonDemo.vue'

interface Props {
  variant?: 'default' | 'sizes' | 'variant'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})
</script>

<template>
  <PopButtonDemoSource v-bind="props" />
</template>
