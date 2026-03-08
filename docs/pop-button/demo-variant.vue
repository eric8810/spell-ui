<script setup lang="ts">
import { PopButton } from "@/components/ui"
</script>

<template>
  <div
    class="flex not-sm:flex-col flex-wrap gap-3 font-semibold"
  >
    <PopButton
      color="default"
    >
      Button
    </PopButton>
    <PopButton
      color="amber"
    >
      Button
    </PopButton>
    <PopButton
      color="purple"
    >
      Button
    </PopButton>
  </div>
</template>
