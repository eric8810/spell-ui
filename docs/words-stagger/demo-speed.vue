<script setup lang="ts">
import { WordsStagger } from "@/components/ui"
</script>

<template>
  <div
    class="flex flex-col gap-8"
  >
    <div
      class="space-y-2"
    >
      <p
        class="text-sm font-mono text-muted-foreground"
      >
        SLOW (1)
      </p>
      <WordsStagger
        :speed='1'
        class="text-xl font-medium"
        in-view
      >
        You can just ship things.
      </WordsStagger>
    </div>
    <div
      class="space-y-2"
    >
      <p
        class="text-sm font-mono text-muted-foreground"
      >
        NORMAL (0.5)
      </p>
      <WordsStagger
        :speed='0.5'
        class="text-xl font-medium"
        in-view
      >
        You can just ship things.
      </WordsStagger>
    </div>
    <div
      class="space-y-2"
    >
      <p
        class="text-sm font-mono text-muted-foreground"
      >
        FAST (0.3)
      </p>
      <WordsStagger
        :speed='0.3'
        class="text-xl font-medium"
        in-view
      >
        You can just ship things.
      </WordsStagger>
    </div>
  </div>
</template>
