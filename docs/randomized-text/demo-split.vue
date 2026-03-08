<script setup lang="ts">
import { RandomizedText } from "@/components/ui"
</script>

<template>
  <div
    class="flex flex-col justify-start items-center min-h-[200px] w-[500px] gap-4"
  >
    <div
      class="flex flex-col items-start gap-1 justif-start"
    >
      <span
        class="text-sm font-mono text-muted-foreground"
      >
        BY CHARACTERS
      </span>
      <RandomizedText
        split="chars"
        class="text-base tracking-tight font-medium"
        in-view
      >
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis debitis ipsam saepe incidunt laboriosam eaque quasi commodi beatae excepturi quos!
      </RandomizedText>
    </div>
    <div
      class="flex flex-col items-start gap-1 justif-start"
    >
      <span
        class="text-sm font-mono text-muted-foreground"
      >
        BY WORDS
      </span>
      <RandomizedText
        class="text-base tracking-tight font-medium"
        in-view
      >
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis debitis ipsam saepe incidunt laboriosam eaque quasi commodi beatae excepturi quos!
      </RandomizedText>
    </div>
  </div>
</template>
