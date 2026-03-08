<script setup lang="ts">
import { Kbd } from "@/components/ui"
</script>

<template>
  <div
    class="flex gap-4"
  >
    <Kbd
      :keys='["alt"]'
      listen-to-keyboard
    />
    <Kbd
      :keys='[{ display: "ENTER", key: "enter" }]'
      listen-to-keyboard
    />
    <Kbd
      :keys='["space"]'
      listen-to-keyboard
    />
    <Kbd
      :keys='["ctrl", "j"]'
      listen-to-keyboard
    />
    <Kbd
      :keys='[{ display: "HOLD", key: "H" }]'
      listen-to-keyboard
    />
    <Kbd
      :keys='["up"]'
      listen-to-keyboard
    />
  </div>
</template>
