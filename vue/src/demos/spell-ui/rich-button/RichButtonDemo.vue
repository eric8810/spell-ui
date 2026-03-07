<script setup lang="ts">
import RichButtonDemoSource from '@/components/demos/spell-ui/rich-button/RichButtonDemo.vue'

interface Props {
  variant?: 'default' | 'sizes' | 'colored'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})
</script>

<template>
  <RichButtonDemoSource v-bind="props" />
</template>
