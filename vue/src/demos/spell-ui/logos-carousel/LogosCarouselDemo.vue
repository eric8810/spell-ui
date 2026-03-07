<script setup lang="ts">
import { LogosCarousel } from '@/components/ui'

interface Props {
  variant?: 'default' | 'count'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})

const logos = [
  { src: './logos/vercel.svg', alt: 'Vercel logo' },
  { src: './logos/google.svg', alt: 'Google logo' },
  { src: './logos/framer.svg', alt: 'Framer logo' },
  { src: './logos/discord.svg', alt: 'Discord logo' },
  { src: './logos/openai.svg', alt: 'OpenAI logo' },
  { src: './logos/phantom.svg', alt: 'Phantom logo' },
  { src: './logos/descript.svg', alt: 'Descript logo' },
  { src: './logos/netflix.svg', alt: 'Netflix logo' },
  { src: './logos/linear.svg', alt: 'Linear logo' },
  { src: './logos/notion.svg', alt: 'Notion logo' },
  { src: './logos/shopify.svg', alt: 'Shopify logo' },
  { src: './logos/duolingo.svg', alt: 'Duolingo logo' },
  { src: './logos/ramp.svg', alt: 'Ramp logo' },
  { src: './logos/tesla.svg', alt: 'Tesla logo' },
  { src: './logos/opensea.svg', alt: 'OpenSea logo' },
  { src: './logos/cursor.svg', alt: 'Cursor logo' },
]

const countLogos = [
  { src: './logos/vercel.svg', alt: 'Vercel logo' },
  { src: './logos/framer.svg', alt: 'Framer logo' },
  { src: './logos/discord.svg', alt: 'Discord logo' },
  { src: './logos/shopify.svg', alt: 'Shopify logo' },
  { src: './logos/phantom.svg', alt: 'Phantom logo' },
  { src: './logos/linear.svg', alt: 'Linear logo' },
  { src: './logos/ramp.svg', alt: 'Ramp logo' },
  { src: './logos/opensea.svg', alt: 'OpenSea logo' },
  { src: './logos/notion.svg', alt: 'Notion logo' },
]
</script>

<template>
  <div v-if="props.variant === 'count'" class="flex flex-col">
    <div>
      <p class="text-sm font-mono text-muted-foreground">3 LOGOS PER ROW</p>
      <LogosCarousel :count="3">
        <img
          v-for="logo in countLogos"
          :key="logo.src"
          :src="logo.src"
          :alt="logo.alt"
          width="96"
          height="96"
          class="pointer-events-none h-24 w-24 select-none object-contain opacity-70 not-dark:invert-100"
        >
      </LogosCarousel>
    </div>
  </div>

  <LogosCarousel v-else :count="4" class="gap-6 sm:gap-10">
    <img
      v-for="logo in logos"
      :key="logo.src"
      :src="logo.src"
      :alt="logo.alt"
      width="96"
      height="96"
      class="pointer-events-none h-24 w-24 select-none object-contain opacity-70 not-dark:invert-100"
    >
  </LogosCarousel>
</template>
