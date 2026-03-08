<script setup lang="ts">
import { Kbd } from "@/components/ui"
</script>

<template>
  <div
    class="flex flex-col items-center gap-4"
  >
    <p
      class="text-sm text-muted-foreground"
    >
      Press M key to activate
    </p>
    <Kbd
      :keys='[{ display: "HOLD", key: "M" }]'
      listen-to-keyboard
    />
  </div>
</template>
