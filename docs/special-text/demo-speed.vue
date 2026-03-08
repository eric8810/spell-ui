<script setup lang="ts">
import { SpecialText } from "@/components/ui"
</script>

<template>
  <div
    class="flex flex-col gap-4"
  >
    <div
      class="flex items-center gap-4"
    >
      <span
        class="text-sm text-muted-foreground w-20 font-mono"
      >
        FAST:
      </span>
      <SpecialText
        :speed='10'
        class="text-lg"
        in-view
      >
        FAST ANIMATION
      </SpecialText>
    </div>
    <div
      class="flex items-center gap-4"
    >
      <span
        class="text-sm text-muted-foreground w-20 font-mono"
      >
        NORMAL:
      </span>
      <SpecialText
        :speed='20'
        class="text-lg"
        in-view
      >
        NORMAL SPEED
      </SpecialText>
    </div>
    <div
      class="flex items-center gap-4"
    >
      <span
        class="text-sm text-muted-foreground w-20 font-mono"
      >
        SLOW:
      </span>
      <SpecialText
        :speed='40'
        class="text-lg"
        in-view
      >
        SLOW MOTION
      </SpecialText>
    </div>
  </div>
</template>
