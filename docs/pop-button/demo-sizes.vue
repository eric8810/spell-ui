<script setup lang="ts">
import { PopButton } from "@/components/ui"
</script>

<template>
  <div
    class="flex not-sm:flex-col flex-wrap items-center gap-4 font-semibold"
  >
    <PopButton
      size="sm"
      color="violet"
    >
      Small
    </PopButton>
    <PopButton
      size="default"
      color="violet"
    >
      Default
    </PopButton>
    <PopButton
      size="lg"
      color="violet"
    >
      Large
    </PopButton>
  </div>
</template>
