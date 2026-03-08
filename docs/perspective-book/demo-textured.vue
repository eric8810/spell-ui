<script setup lang="ts">
import { PerspectiveBook } from "@/components/ui"
import { Cog } from "lucide-vue-next"
</script>

<template>
  <div
    class="flex flex-wrap gap-8"
  >
    <PerspectiveBook
      class="bg-[#4D4E41] text-yellow-300 justify-start h-full"
      textured
    >
      <div
        class="flex flex-col h-full justify-between"
      >
        <div
          class="flex flex-col gap-4"
        >
          <h2
            class="font-semibold leading-4"
          >
            The Art of Doing Science and Engineering
          </h2>
          <Cog
            class="size-5"
          />
        </div>
        <span
          class="font-medium text-sm font-serif"
        >
          Richard
          <br />
          W. Hamming
        </span>
      </div>
    </PerspectiveBook>
  </div>
</template>
