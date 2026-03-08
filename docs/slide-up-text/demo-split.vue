<script setup lang="ts">
import { SlideUpText } from "@/components/ui"
</script>

<template>
  <div
    class="flex flex-col gap-8"
  >
    <div>
      <span
        class="text-sm font-mono text-muted-foreground mb-2"
      >
        BY WORDS
      </span>
      <SlideUpText
        split="words"
        class="text-xl font-medium"
      >
        Beautiful animated text
      </SlideUpText>
    </div>
    <div>
      <span
        class="text-sm font-mono text-muted-foreground mb-2"
      >
        BY CHARACTERS
      </span>
      <SlideUpText
        split="characters"
        :stagger='0.02'
        class="text-xl font-medium"
      >
        You just can ship things.
      </SlideUpText>
    </div>
    <div>
      <span
        class="text-sm font-mono text-muted-foreground mb-2"
      >
        BY LINES
      </span>
      <SlideUpText
        split="lines"
        :stagger='0.2'
        class="text-xl font-medium"
        in-view
      >
        {{ "First line\nSecond line\nThird line" }}
      </SlideUpText>
    </div>
  </div>
</template>
