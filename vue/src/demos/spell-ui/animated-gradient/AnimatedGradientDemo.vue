<script setup lang="ts">
import { computed, ref } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  variant?: 'default' | 'presets'
}

type PresetName = 'Lava' | 'Prism' | 'Plasma' | 'Pulse' | 'Vortex' | 'Mist'

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})

const presets: PresetName[] = ['Lava', 'Prism', 'Plasma', 'Pulse', 'Vortex', 'Mist']
const activePreset = ref<PresetName>('Lava')

const palette = computed(() => {
  const colors: Record<PresetName, { surface: string; accent: string; text: string }> = {
    Prism: { surface: 'from-[#050505] via-[#66B3FF] to-white', accent: '#66B3FF', text: 'Animated' },
    Lava: { surface: 'from-[#FF9F21] via-[#FF0303] to-black', accent: '#FF9F21', text: 'Lava' },
    Plasma: { surface: 'from-[#B566FF] via-[#111111] to-black', accent: '#B566FF', text: 'Plasma' },
    Pulse: { surface: 'from-[#66FF85] via-black to-[#0f0f0f]', accent: '#66FF85', text: 'Pulse' },
    Vortex: { surface: 'from-black via-white to-black', accent: '#FFFFFF', text: 'Vortex' },
    Mist: { surface: 'from-[#050505] via-[#FF66B8] to-[#050505]', accent: '#FF66B8', text: 'Mist' },
  }

  return colors[props.variant === 'default' ? 'Prism' : activePreset.value]
})
</script>

<template>
  <div class="relative flex min-h-[500px] w-full flex-col overflow-hidden md:min-h-[350px]">
    <div class="absolute inset-0 spell-animated-gradient">
      <div :class="cn('absolute inset-[-20%] bg-gradient-to-br opacity-95 blur-2xl', palette.surface)" />
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.15),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.12),transparent_35%),radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.08),transparent_40%)]" />
      <div class="absolute inset-0 animate-[spell-gradient-spin_18s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent,rgba(255,255,255,0.35),transparent_60%)] opacity-40 mix-blend-screen" />
    </div>

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

<style scoped>
.spell-animated-gradient {
  animation: spell-gradient-pan 12s ease-in-out infinite alternate;
}

@keyframes spell-gradient-pan {
  0% {
    transform: scale(1) rotate(0deg);
  }

  100% {
    transform: scale(1.08) rotate(8deg);
  }
}

@keyframes spell-gradient-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
