<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'
import { cn } from '@/lib/utils'

type PresetName = 'Lava' | 'Prism' | 'Plasma' | 'Pulse' | 'Vortex' | 'Mist'

interface NoiseConfig {
  opacity: number
  scale?: number
}

interface CustomConfig {
  preset: 'custom'
  color1: string
  color2: string
  color3: string
  rotation?: number
  proportion?: number
  scale?: number
  speed?: number
  distortion?: number
  swirl?: number
  swirlIterations?: number
  softness?: number
  offset?: number
  shape?: 'Checks' | 'Stripes' | 'Edge'
  shapeSize?: number
}

type GradientConfig = { preset?: PresetName } | CustomConfig

interface Props {
  config?: GradientConfig
  noise?: NoiseConfig
  radius?: string
  class?: string
  style?: CSSProperties
}

const props = withDefaults(defineProps<Props>(), {
  config: () => ({ preset: 'Prism' }),
  noise: () => ({ opacity: 0.12, scale: 100 }),
  radius: '0px',
  class: '',
  style: () => ({}),
})

const presets: Record<PresetName, { colors: [string, string, string]; rotation: number; speed: number }> = {
  Prism: { colors: ['#050505', '#66B3FF', '#FFFFFF'], rotation: 20, speed: 18 },
  Lava: { colors: ['#FF9F21', '#FF0303', '#050505'], rotation: 35, speed: 14 },
  Plasma: { colors: ['#B566FF', '#111111', '#050505'], rotation: 28, speed: 20 },
  Pulse: { colors: ['#66FF85', '#050505', '#0f0f0f'], rotation: 18, speed: 16 },
  Vortex: { colors: ['#050505', '#FFFFFF', '#050505'], rotation: 90, speed: 22 },
  Mist: { colors: ['#050505', '#FF66B8', '#050505'], rotation: 22, speed: 19 },
}

const palette = computed(() => {
  if (props.config.preset === 'custom') {
    return {
      colors: [props.config.color1, props.config.color2, props.config.color3] as [string, string, string],
      rotation: props.config.rotation ?? 0,
      speed: props.config.speed ?? 18,
      scale: props.config.scale ?? 1,
    }
  }

  const preset = presets[props.config.preset ?? 'Prism']
  return {
    colors: preset.colors,
    rotation: preset.rotation,
    speed: preset.speed,
    scale: 1,
  }
})

const rootStyle = computed<CSSProperties>(() => ({
  borderRadius: props.radius,
  ...props.style,
}))

const gradientStyle = computed<CSSProperties>(() => ({
  backgroundImage: `linear-gradient(${palette.value.rotation}deg, ${palette.value.colors[0]}, ${palette.value.colors[1]}, ${palette.value.colors[2]})`,
  transform: `scale(${palette.value.scale})`,
  animationDuration: `${Math.max(palette.value.speed, 6)}s`,
}))

const noiseStyle = computed<CSSProperties>(() => ({
  opacity: String(props.noise.opacity),
  backgroundSize: `${props.noise.scale ?? 100}px ${props.noise.scale ?? 100}px`,
}))
</script>

<template>
  <div
    aria-hidden="true"
    :class="cn('pointer-events-none absolute inset-0 overflow-hidden', props.class)"
    :style="rootStyle"
  >
    <div class="spell-animated-gradient absolute inset-[-20%]" :style="gradientStyle" />
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.15),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.12),transparent_35%),radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.08),transparent_40%)]" />
    <div class="absolute inset-0 animate-[spell-gradient-spin_18s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent,rgba(255,255,255,0.35),transparent_60%)] opacity-40 mix-blend-screen" />
    <div class="absolute inset-0 spell-gradient-noise" :style="noiseStyle" />
  </div>
</template>

<style scoped>
.spell-animated-gradient {
  opacity: 0.95;
  filter: blur(48px);
  animation: spell-gradient-pan ease-in-out infinite alternate;
}

.spell-gradient-noise {
  background-image: radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px);
  mix-blend-mode: soft-light;
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
