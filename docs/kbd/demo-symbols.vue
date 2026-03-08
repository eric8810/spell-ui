<script setup lang="ts">
import { Kbd } from "@/components/ui"
</script>

<template>
  <div
    class="flex flex-wrap gap-4"
  >
    <Kbd
      :keys='["command"]'
      listen-to-keyboard
    />
    <Kbd
      :keys='["control"]'
      listen-to-keyboard
    />
    <Kbd
      :keys='["alt"]'
      listen-to-keyboard
    />
    <Kbd
      :keys='["up"]'
      listen-to-keyboard
    />
    <Kbd
      :keys='["down"]'
      listen-to-keyboard
    />
    <Kbd
      :keys='["left"]'
      listen-to-keyboard
    />
    <Kbd
      :keys='["right"]'
      listen-to-keyboard
    />
  </div>
</template>
