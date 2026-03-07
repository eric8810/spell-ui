<script setup lang="ts">
import KbdDemoSource from '@/components/demos/spell-ui/kbd/KbdDemo.vue'

interface Props {
  variant?: 'default' | 'symbols' | 'custom'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})
</script>

<template>
  <KbdDemoSource v-bind="props" />
</template>
