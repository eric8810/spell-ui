<script setup lang="ts">
import { ref } from 'vue'

interface Particle {
  id: number
  left: number
  top: number
  x: number
  y: number
  rotate: number
  content: string
}

const inputValue = ref('')
const particles = ref<Particle[]>([])
let nextId = 0

const emojis = ['🤩', '👾', '😺', '👻', '🎃', '🖤', '🗯️']

const spawnParticles = () => {
  const created: Particle[] = Array.from({ length: 3 }).map(() => ({
    id: nextId++,
    left: 240 + Math.random() * 40,
    top: 8 + Math.random() * 12,
    x: -30 - Math.random() * 60,
    y: -30 - Math.random() * 90,
    rotate: -40 + Math.random() * 80,
    content: emojis[Math.floor(Math.random() * emojis.length)] ?? '✨',
  }))

  particles.value = [...particles.value, ...created]

  window.setTimeout(() => {
    const ids = new Set(created.map((particle) => particle.id))
    particles.value = particles.value.filter((particle) => !ids.has(particle.id))
  }, 3000)
}

const handleInput = (event: Event) => {
  inputValue.value = (event.target as HTMLInputElement).value
  spawnParticles()
}
</script>

<template>
  <label class="relative block">
    <input
      :value="inputValue"
      type="text"
      placeholder="try@spell.here"
      class="h-10 w-72 border-b bg-background p-0 text-base font-medium outline-none placeholder:font-medium"
      @input="handleInput"
    >

    <span
      v-for="particle in particles"
      :key="particle.id"
      class="pointer-events-none absolute left-0 top-0 z-50 text-4xl animate-[spell-particle-fly_3s_linear_forwards]"
      :style="{
        left: `${particle.left}px`,
        top: `${particle.top}px`,
        '--particle-x': `${particle.x}px`,
        '--particle-y': `${particle.y}px`,
        '--particle-rotate': `${particle.rotate}deg`,
      }"
    >
      {{ particle.content }}
    </span>
  </label>
</template>

<style scoped>
@keyframes spell-particle-fly {
  0% {
    transform: translate3d(0, 0, 0) scale(1) rotate(0deg);
    opacity: 1;
  }

  100% {
    transform: translate3d(var(--particle-x), var(--particle-y), 0) scale(0.65) rotate(var(--particle-rotate));
    opacity: 0;
  }
}
</style>
