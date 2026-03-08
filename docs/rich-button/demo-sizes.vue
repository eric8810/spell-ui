<script setup lang="ts">
import { RichButton } from "@/components/ui"
</script>

<template>
  <div
    class="flex flex-wrap items-center gap-4"
  >
    <RichButton
      size="sm"
    >
      Small
    </RichButton>
    <RichButton
      size="default"
    >
      Default
    </RichButton>
    <RichButton
      size="lg"
    >
      Large
    </RichButton>
  </div>
</template>
