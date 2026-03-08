<script setup lang="ts">
import { AnimatedCheckbox } from "@/components/ui"
</script>

<template>
  <div
    class="flex flex-col gap-2"
  >
    <AnimatedCheckbox
      title="Implement Checkbox"
    />
    <AnimatedCheckbox
      title="Write documentation"
    />
    <AnimatedCheckbox
      title="Add tests"
      default-checked
    />
  </div>
</template>
