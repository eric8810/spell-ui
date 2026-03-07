<script setup lang="ts">
import SpotifyCardDemoSource from '@/components/demos/spell-ui/spotify-card/SpotifyCardDemo.vue'

interface Props {
  variant?: 'default' | 'carousel'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})
</script>

<template>
  <SpotifyCardDemoSource v-bind="props" />
</template>
