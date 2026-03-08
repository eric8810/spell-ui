<script setup lang="ts">
import { AnimatedGradient } from "@/components/ui"
</script>

<template>
  <div
    class="relative min-h-[500px] w-full md:min-h-[350px] flex items-center justify-center"
  >
    <div
      class="z-10 flex flex-col items-center text-white gap-1"
    >
      <p
        class="text-4xl font-semibold tracking-tighter"
      >
        Animated
      </p>
      <p
        class="text-4xl font-medium italic font-serif"
      >
        Gradient
      </p>
    </div>
    <AnimatedGradient
      :style='{ zIndex: 0 }'
      :config='{ preset: "Prism" }'
    />
  </div>
</template>
