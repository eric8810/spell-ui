<script setup lang="ts">
import { Carousel, CarouselContent, CarouselItem, SpotifyCard } from "@/components/ui"
import Autoplay from "embla-carousel-autoplay"

const tracks = [
    "https://open.spotify.com/track/2OZVskV28xxJjjhQqKTLSg",
    "https://open.spotify.com/track/7tTRFVlFzk6yTnoMcParmi",
    "https://open.spotify.com/track/2EiGLWYEH6x79f9ir0VEah",
]
</script>

<template>
  <Carousel
    class="w-full max-w-[330px] max-h-[100px]"
    :plugins='[
      Autoplay({
          delay: 2000,
      }),
  ]'
  >
    <CarouselContent>
      <CarouselItem
        v-for="url in tracks"
        :key='url'
      >
        <SpotifyCard
          :url='url'
        />
      </CarouselItem>
    </CarouselContent>
  </Carousel>
</template>
