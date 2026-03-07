<script setup lang="ts">
import { BookOpen } from 'lucide-vue-next'
import AppLink from '@/components/AppLink.vue'
import { PerspectiveBook, RichButton, ShimmerText, TextMarquee } from '@/components/ui'
import AnimatedCheckboxDemo from '@/demos/spell-ui/animated-checkbox/AnimatedCheckboxDemo.vue'
import ColorSelectorDemo from '@/demos/spell-ui/color-selector/ColorSelectorDemo.vue'
import MarqueeDemo from '@/demos/spell-ui/marquee/MarqueeDemo.vue'
import SpotifyCardDemo from '@/demos/spell-ui/spotify-card/SpotifyCardDemo.vue'

const usernames = ['emily', 'james', 'dennis', 'max', 'michele', 'adgv', 'tomm', 'hugh', 'alex']
</script>

<template>
  <div class="flex w-full flex-col items-center gap-8 px-4 py-12 md:gap-16 md:py-24">
    <div class="flex max-w-[700px] flex-col items-center gap-6 text-center">
      <h1 class="text-3xl font-medium tracking-tight md:text-4xl lg:text-5xl">
        <span class="inline-block animate-[spell-home-blur_900ms_ease-out_forwards] [filter:blur(12px)] opacity-0">Refined UI components for Design Engineers</span>
      </h1>
      <p class="text-base leading-6 text-muted-foreground md:text-lg">
        A large collection of high-quality React components that
        <br>
        you can copy and paste into any project.
      </p>
      <div class="mt-2 flex w-auto flex-row gap-3">
        <RichButton size="lg" class="trakcing-tight rounded-full px-4.5 transition-transform duration-150 ease-out active:scale-[0.97] will-change-transform" as-child>
          <AppLink to="/docs/introduction">Get Started</AppLink>
        </RichButton>
        <RichButton size="lg" color="blue" class="trakcing-tight group rounded-full px-4 shadow-sm shadow-zinc-950/20 transition-transform duration-150 ease-out active:scale-[0.97] [&_svg]:size-4.5 will-change-transform" as-child>
          <AppLink to="/docs/blur-reveal">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><g fill="currentColor"><circle cx="14.5" cy="8.5" r="2.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" fill="currentColor" /><rect x="5" y="12" width="5" height="5" rx="1" ry="1" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" fill="currentColor" /><path d="m5.1889,3.7146l-2.1169,3.5282c-.2.3333.0401.7572.4287.7572h4.2338c.3886,0,.6287-.424.4287-.7572l-2.1169-3.5282c-.1942-.3237-.6633-.3237-.8575,0Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" fill="currentColor" /></g></svg>
            Components
          </AppLink>
        </RichButton>
      </div>
    </div>

    <div class="grid w-full max-w-[1400px] grid-flow-dense grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div class="col-span-1 row-span-1 flex min-h-[300px] flex-col rounded-2xl border p-4 shadow-inner md:col-span-2 md:row-span-2 md:min-h-[400px]">
        <div class="flex flex-1 items-center justify-center">
          <TextMarquee :height="300" :speed="1">
            <template #prefix>
              <span class="text-2xl font-medium text-muted-foreground/75 md:text-3xl">yourwebsite.com/</span>
            </template>
            <p v-for="username in usernames" :key="username" class="text-2xl font-medium md:text-3xl">{{ username }}</p>
          </TextMarquee>
        </div>
        <AppLink to="/docs/text-marquee" class="text-sm leading-4 text-muted-foreground transition-colors hover:text-foreground">Text Marquee</AppLink>
      </div>

      <div class="col-span-1 row-span-1 flex min-h-[300px] flex-col rounded-2xl border p-4 shadow-inner md:row-span-2 md:min-h-[400px] lg:col-start-4 lg:row-start-2">
        <div class="flex flex-1 items-center justify-center">
          <PerspectiveBook>
            <div class="flex flex-col gap-4">
              <h1 class="font-semibold leading-5">Your complete platform for the Design.</h1>
              <BookOpen class="size-5" />
            </div>
          </PerspectiveBook>
        </div>
        <AppLink to="/docs/perspective-book" class="text-sm leading-4 text-muted-foreground transition-colors hover:text-foreground">Perspective Book</AppLink>
      </div>

      <div class="col-span-1 flex min-h-[200px] flex-col rounded-2xl border p-4 shadow-inner md:min-h-[240px]">
        <div class="flex flex-1 items-center justify-center">
          <ShimmerText class="text-lg font-medium" :duration="1">Thinking longer...</ShimmerText>
        </div>
        <AppLink to="/docs/shimmer-text" class="text-sm leading-4 text-muted-foreground transition-colors hover:text-foreground">Shimmer Text</AppLink>
      </div>

      <div class="col-span-1 flex min-h-[200px] flex-col rounded-2xl border p-4 shadow-inner md:min-h-[240px]">
        <div class="flex flex-1 items-center justify-center">
          <AnimatedCheckboxDemo />
        </div>
        <AppLink to="/docs/animated-checkbox" class="text-sm leading-4 text-muted-foreground transition-colors hover:text-foreground">Animated Checkbox</AppLink>
      </div>

      <div class="col-span-1 flex min-h-[200px] flex-col overflow-hidden rounded-2xl border p-4 shadow-inner md:min-h-[240px]">
        <div class="flex flex-1 items-center justify-center">
          <MarqueeDemo />
        </div>
        <AppLink to="/docs/marquee" class="text-sm leading-4 text-muted-foreground transition-colors hover:text-foreground">Marquee</AppLink>
      </div>

      <div class="col-span-1 flex min-h-[200px] flex-col rounded-2xl border p-4 shadow-inner md:min-h-[240px]">
        <div class="flex flex-1 items-center justify-center">
          <ColorSelectorDemo />
        </div>
        <AppLink to="/docs/color-selector" class="text-sm leading-4 text-muted-foreground transition-colors hover:text-foreground">Color Selector</AppLink>
      </div>

      <div class="col-span-1 flex min-h-[200px] flex-col rounded-2xl border p-4 shadow-inner md:col-span-2 md:min-h-[240px]">
        <div class="flex flex-1 items-center justify-center">
          <SpotifyCardDemo variant="carousel" />
        </div>
        <AppLink to="/docs/spotify-card" class="text-sm leading-4 text-muted-foreground transition-colors hover:text-foreground">Spotify Card</AppLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes spell-home-blur {
  0% {
    opacity: 0;
    filter: blur(12px);
    transform: translateY(10px);
  }

  100% {
    opacity: 1;
    filter: blur(0px);
    transform: translateY(0);
  }
}
</style>
