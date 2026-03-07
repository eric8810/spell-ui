<script setup lang="ts">
import SpinnerDemoSource from '@/components/demos/spell-ui/spinner/SpinnerDemo.vue'

interface Props {
  variant?: 'default' | 'sizes' | 'speeds' | 'colors'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})
</script>

<template>
  <SpinnerDemoSource v-bind="props" />
</template>
