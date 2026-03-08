<script setup lang="ts">
import { BarsSpinner } from "@/components/ui"
</script>

<template>
  <div
    class="flex items-center gap-4"
  >
    <BarsSpinner
      :size='16'
    />
    <BarsSpinner
      :size='20'
    />
    <BarsSpinner
      :size='24'
    />
    <BarsSpinner
      :size='32'
    />
  </div>
</template>
