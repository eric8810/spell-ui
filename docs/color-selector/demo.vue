<script setup lang="ts">
import { ColorSelector } from "@/components/ui"
</script>

<template>
  <ColorSelector
    :colors='["red", "blue", "green", "yellow", "purple"]'
    default-value="blue"
  />
</template>
