<script setup lang="ts">
import { FlowButton } from "@/components/ui"
</script>

<template>
  <div
    class="flex items-center gap-4"
  >
    <FlowButton
      size="sm"
    >
      Small
    </FlowButton>
    <FlowButton
      size="default"
    >
      Default
    </FlowButton>
    <FlowButton
      size="lg"
    >
      Large
    </FlowButton>
  </div>
</template>
