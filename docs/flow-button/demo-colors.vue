<script setup lang="ts">
import { FlowButton } from "@/components/ui"
</script>

<template>
  <div
    class="flex flex-wrap gap-4"
  >
    <FlowButton
      border-color="var(--primary)"
    >
      Primary
    </FlowButton>
    <FlowButton
      border-color="var(--color-red-500)"
    >
      Red
    </FlowButton>
    <FlowButton
      border-color="var(--color-blue-500)"
    >
      Blue
    </FlowButton>
    <FlowButton
      border-color="var(--color-purple-500)"
    >
      Purple
    </FlowButton>
    <FlowButton
      border-color="var(--color-green-500)"
    >
      Green
    </FlowButton>
  </div>
</template>
