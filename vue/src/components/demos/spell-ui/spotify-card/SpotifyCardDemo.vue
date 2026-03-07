<script setup lang="ts">
import Autoplay from 'embla-carousel-autoplay'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  SpotifyCard,
} from '@/components/ui'

interface Props {
  variant?: 'default' | 'carousel'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})

const tracks = [
  'https://open.spotify.com/track/2OZVskV28xxJjjhQqKTLSg',
  'https://open.spotify.com/track/7tTRFVlFzk6yTnoMcParmi',
  'https://open.spotify.com/track/2EiGLWYEH6x79f9ir0VEah',
]

const plugins = [
  Autoplay({
    delay: 2000,
  }),
]
</script>

<template>
  <Carousel
    v-if="props.variant === 'carousel'"
    class="max-h-[100px] w-full max-w-[330px]"
    :plugins="plugins"
  >
    <CarouselContent>
      <CarouselItem v-for="url in tracks" :key="url">
        <SpotifyCard :url="url" />
      </CarouselItem>
    </CarouselContent>
  </Carousel>

  <SpotifyCard
    v-else
    url="https://open.spotify.com/track/0DTSnA1bcVI5niJzoyBPyZ"
    class="max-h-[100px] max-w-[325px]"
  />
</template>
