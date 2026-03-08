<script setup lang="ts">
import { LightRays } from "@/components/ui"
</script>

<template>
  <div
    class="relative min-h-[500px] w-full md:min-h-[350px] flex items-center justify-center"
  >
    <LightRays
      background-color="var(--background)"
      :style='{ zIndex: 0 }'
      :rays-color='{ mode: "multi", color1: "#2060DF", color2: "#ffffff" }'
    />
    <div
      class="z-10 flex flex-col items-center h-full gap-2"
    >
      <p
        class="text-4xl font-semibold tracking-tighter"
      >
        Multi Colored
      </p>
      <p
        class="text-4xl font-medium italic font-serif"
      >
        Light Rays
      </p>
    </div>
  </div>
</template>
