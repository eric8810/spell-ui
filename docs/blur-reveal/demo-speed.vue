<script setup lang="ts">
import { BlurReveal } from "@/components/ui"
</script>

<template>
  <div
    class="flex flex-col gap-8 *:flex-col"
  >
    <div>
      <p
        class="font-mono text-sm text-muted-foreground"
      >
        SLOW (0.5)
      </p>
      <BlurReveal
        class="tracking-tight text-2xl font-medium"
        :speed-reveal='0.5'
        in-view
      >
        You can just ship things.
      </BlurReveal>
    </div>
    <div>
      <p
        class="font-mono text-sm text-muted-foreground"
      >
        NORMAL (1.5)
      </p>
      <BlurReveal
        class="tracking-tight text-2xl font-medium"
        :speed-reveal='1.5'
        in-view
      >
        You can just ship things.
      </BlurReveal>
    </div>
    <div>
      <p
        class="font-mono text-sm text-muted-foreground"
      >
        FAST (2)
      </p>
      <BlurReveal
        class="tracking-tight text-2xl font-medium"
        :speed-reveal='2'
        in-view
      >
        You can just ship things.
      </BlurReveal>
    </div>
  </div>
</template>
