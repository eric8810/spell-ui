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
    />
    <div
      class="z-10 flex h-full text-primary gap-2"
    >
      <p
        class="text-4xl font-semibold tracking-tighter"
      >
        Beautiful
      </p>
      <p
        class="text-4xl font-medium italic font-serif"
      >
        Light Rays
      </p>
    </div>
  </div>
</template>
