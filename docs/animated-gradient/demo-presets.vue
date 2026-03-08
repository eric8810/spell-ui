<script setup lang="ts">
import { AnimatedGradient } from "@/components/ui"
import { ref } from "vue"

const presets = ["Lava", "Prism", "Plasma", "Pulse", "Vortex", "Mist"] as const

const activePreset = ref<(typeof presets)[number]>("Lava")
</script>

<template>
  <div
    class="relative min-h-[500px] w-full md:min-h-[350px] flex flex-col"
  >
    <AnimatedGradient
      :style='{ zIndex: 0 }'
      :config='{ preset: activePreset }'
    />
    <div
      class="relative z-10 flex gap-2 p-4 flex-wrap"
    >
      <button
        v-for="preset in presets"
        :key='preset'
        @click='activePreset = preset'
        :class='`px-3 py-1 text-sm font-medium tracking-tight cursor-pointer rounded-full transition-colors ${activePreset === preset
          ? "bg-white text-black"
          : "bg-transparent text-white"}`'
      >
        {{ preset }}
      </button>
    </div>
    <div
      class="relative z-10 flex-1 flex items-center justify-center"
    >
      <p
        class="text-4xl font-semibold tracking-tighter text-white mix-blend-exclusion"
      >
        {{ activePreset }}
      </p>
    </div>
  </div>
</template>
