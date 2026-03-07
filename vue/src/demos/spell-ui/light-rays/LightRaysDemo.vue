<script setup lang="ts">
import LightRaysDemoSource from '@/components/demos/spell-ui/light-rays/LightRaysDemo.vue'

interface Props {
  variant?: 'default' | 'multi'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})
</script>

<template>
  <LightRaysDemoSource v-bind="props" />
</template>
