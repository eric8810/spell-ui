<script setup lang="ts">
import { ColorSelector } from "@/components/ui"
import { ref } from "vue"

const selectedColor = ref("purple")
</script>

<template>
  <div
    class="flex flex-col gap-4 items-center"
  >
    <ColorSelector
      :colors='["red", "blue", "green", "yellow", "purple", "pink", "orange"]'
      :default-value='selectedColor'
      @color-select='(color) => (selectedColor = color)'
    />
    <p
      class="text-sm text-muted-foreground"
    >
      Selected color:
      <span
        class="font-semibold"
      >
        {{ selectedColor }}
      </span>
    </p>
  </div>
</template>
