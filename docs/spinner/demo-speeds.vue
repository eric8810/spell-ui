<script setup lang="ts">
import { Spinner } from "@/components/ui"
</script>

<template>
  <div
    class="flex items-center gap-4"
  >
    <div
      class="flex flex-col items-center gap-2"
    >
      <Spinner
        speed="slow"
      />
      <span
        class="text-xs text-muted-foreground"
      >
        Slow
      </span>
    </div>
    <div
      class="flex flex-col items-center gap-2"
    >
      <Spinner
        speed="normal"
      />
      <span
        class="text-xs text-muted-foreground"
      >
        Normal
      </span>
    </div>
    <div
      class="flex flex-col items-center gap-2"
    >
      <Spinner
        speed="fast"
      />
      <span
        class="text-xs text-muted-foreground"
      >
        Fast
      </span>
    </div>
  </div>
</template>
