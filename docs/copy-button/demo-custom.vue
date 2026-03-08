<script setup lang="ts">
import { CopyButton } from "@/components/ui"
</script>

<template>
  <div
    class="flex items-center gap-4"
  >
    <CopyButton
      value="Small"
      size="sm"
    />
    <CopyButton
      value="Default"
    />
    <CopyButton
      value="Large"
      size="lg"
    />
  </div>
</template>
