<script setup lang="ts">
import { ColorSelector } from "@/components/ui"
</script>

<template>
  <div
    class="flex flex-col gap-6"
  >
    <div
      class="flex flex-col items-start gap-2"
    >
      <span
        class="text-sm text-muted-foreground font-mono"
      >
        SMALL
      </span>
      <ColorSelector
        :colors='["red", "blue", "green", "yellow"]'
        default-value="red"
        size="sm"
      />
    </div>
    <div
      class="flex flex-col items-start gap-2"
    >
      <span
        class="text-sm text-muted-foreground font-mono"
      >
        DEFAULT
      </span>
      <ColorSelector
        :colors='["red", "blue", "green", "yellow"]'
        default-value="blue"
        size="default"
      />
    </div>
    <div
      class="flex flex-col items-start gap-2"
    >
      <span
        class="text-sm text-muted-foreground font-mono"
      >
        LARGE
      </span>
      <ColorSelector
        :colors='["red", "blue", "green", "yellow"]'
        default-value="green"
        size="lg"
      />
    </div>
  </div>
</template>
