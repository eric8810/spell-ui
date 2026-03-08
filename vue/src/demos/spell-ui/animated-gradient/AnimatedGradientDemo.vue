<script setup lang="ts">
import { ref } from 'vue'
import { AnimatedGradient } from '@/components/ui'

interface Props {
  variant?: 'default' | 'presets'
}

type PresetName = 'Lava' | 'Prism' | 'Plasma' | 'Pulse' | 'Vortex' | 'Mist'

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})

const presets: PresetName[] = ['Lava', 'Prism', 'Plasma', 'Pulse', 'Vortex', 'Mist']
const activePreset = ref<PresetName>('Lava')
</script>

<template>
  <div class="relative flex min-h-[500px] w-full flex-col md:min-h-[350px]">
    <AnimatedGradient
      :config="{ preset: props.variant === 'default' ? 'Prism' : activePreset }"
      :style="{ zIndex: 0 }"
    />

    <div v-if="props.variant === 'presets'" class="relative z-10 flex flex-wrap gap-2 p-4">
      <button
        v-for="preset in presets"
        :key="preset"
        type="button"
        class="cursor-pointer rounded-full px-3 py-1 text-sm font-medium tracking-tight transition-colors"
        :class="activePreset === preset ? 'bg-white text-black' : 'bg-transparent text-white'"
        @click="activePreset = preset"
      >
        {{ preset }}
      </button>
    </div>

    <div class="relative z-10 flex flex-1 items-center justify-center">
      <div v-if="props.variant === 'default'" class="flex flex-col items-center gap-1 text-white">
        <p class="text-4xl font-semibold tracking-tighter">Animated</p>
        <p class="font-serif text-4xl font-medium italic">Gradient</p>
      </div>
      <p v-else class="text-4xl font-semibold tracking-tighter text-white mix-blend-exclusion">
        {{ activePreset }}
      </p>
    </div>
  </div>
</template>
