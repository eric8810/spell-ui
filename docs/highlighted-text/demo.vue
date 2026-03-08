<script setup lang="ts">
import { HighlightedText } from "@/components/ui"
</script>

<template>
  <div
    class="text-2xl md:text-4xl font-medium tracking-[-.03em] flex items-center"
  >
    You&nbsp;
    <HighlightedText>
      can
    </HighlightedText>
    &nbsp;just&nbsp;
    <HighlightedText
      :delay='0.4'
      from="left"
    >
      ship things.
    </HighlightedText>
  </div>
</template>
