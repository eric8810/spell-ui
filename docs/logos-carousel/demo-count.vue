<script setup lang="ts">
import { LogosCarousel } from "@/components/ui"

const logos = [
  { src: "/logos/vercel.svg", alt: "Vercel logo" },
  { src: "/logos/framer.svg", alt: "Framer logo" },
  { src: "/logos/discord.svg", alt: "Discord logo" },
  { src: "/logos/shopify.svg", alt: "Shopify logo" },
  { src: "/logos/phantom.svg", alt: "Phantom logo" },
  { src: "/logos/linear.svg", alt: "Linear logo" },
  { src: "/logos/ramp.svg", alt: "Ramp logo" },
  { src: "/logos/opensea.svg", alt: "OpenSea logo" },
  { src: "/logos/notion.svg", alt: "Notion logo" },
]
</script>

<template>
  <div
    class="flex flex-col"
  >
    <div>
      <p
        class="text-sm text-muted-foreground font-mono"
      >
        3 LOGOS PER ROW
      </p>
      <LogosCarousel
        :count="3"
      >
        <img
          v-for="logo in logos"
          :key="logo.src"
          :src="logo.src"
          :alt="logo.alt"
          :width="96"
          :height="96"
          class="h-24 w-24 object-contain opacity-70 not-dark:invert-100 pointer-events-none select-none"
        />
      </LogosCarousel>
    </div>
  </div>
</template>
