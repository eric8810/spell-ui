<script setup lang="ts">
import { TextMarquee } from "@/components/ui"
</script>

<template>
  <TextMarquee
    :height="250"
    :speed="1"
  >
    <template #prefix>
      <span class="text-3xl font-medium text-muted-foreground/75">
        spell.sh/
      </span>
    </template>

    <p
      class="text-3xl font-medium"
    >
      emily
    </p>
    <p
      class="text-3xl font-medium"
    >
      dennis
    </p>
    <p
      class="text-3xl font-medium"
    >
      max
    </p>
    <p
      class="text-3xl font-medium"
    >
      michele
    </p>
    <p
      class="text-3xl font-medium"
    >
      adgv
    </p>
    <p
      class="text-3xl font-medium"
    >
      tomm
    </p>
    <p
      class="text-3xl font-medium"
    >
      hugh
    </p>
    <p
      class="text-3xl font-medium"
    >
      alex
    </p>
  </TextMarquee>
</template>
