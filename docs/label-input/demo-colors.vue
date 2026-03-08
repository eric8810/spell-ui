<script setup lang="ts">
import { LabelInput } from "@/components/ui"
</script>

<template>
  <div
    class="flex not-md:flex-col gap-4"
  >
    <LabelInput
      label="Primary"
      ring-color="primary"
      class="max-w-40"
    />
    <LabelInput
      label="Orange"
      ring-color="orange"
      class="max-w-40"
    />
    <LabelInput
      label="Blue"
      ring-color="blue"
      class="max-w-40"
    />
  </div>
</template>
