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
        FROM FIRST
      </span>
      <SlideUpText
        from="first"
        class="text-xl font-medium"
        in-view
      >
        Animation from first word
      </SlideUpText>
    </div>
    <div>
      <span
        class="text-sm font-mono text-muted-foreground mb-2"
      >
        FROM LAST
      </span>
      <SlideUpText
        from="last"
        class="text-xl font-medium"
        in-view
      >
        Animation from last word
      </SlideUpText>
    </div>
    <div>
      <span
        class="text-sm font-mono text-muted-foreground mb-2"
      >
        FROM CENTER
      </span>
      <SlideUpText
        from="center"
        class="text-xl font-medium"
        in-view
      >
        Animation from center outward
      </SlideUpText>
    </div>
  </div>
</template>
