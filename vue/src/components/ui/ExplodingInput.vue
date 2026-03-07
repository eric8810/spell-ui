<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  useAttrs,
  type CSSProperties,
  type VNodeChild,
} from 'vue'
import VNodeRenderer from './VNodeRenderer'

defineOptions({ inheritAttrs: false })

type HorizontalDirection = 'left' | 'center' | 'right'
type VerticalDirection = 'top' | 'center' | 'bottom'

interface Props {
  content?: VNodeChild[]
  count?: number
  direction?: {
    horizontal?: HorizontalDirection
    vertical?: VerticalDirection
  }
  gravity?: number
  duration?: number
  scale?: {
    value?: number
    randomize?: boolean
    randomVariation?: number
  }
  rotation?: {
    value?: number
    animate?: boolean
  }
  style?: CSSProperties
  class?: string
}

interface Particle {
  id: number
  x: number
  y: number
  scale: number
  rotate: number
  opacity: number
  vx: number
  vy: number
  gravity: number
  birthTime: number
  lifeMs: number
  contentIdx: number
  scaleStart: number
  scaleEnd: number
  rotateStart: number
  rotateEnd: number
  isDead: boolean
}

const props = withDefaults(defineProps<Props>(), {
  content: () => [],
  count: 1,
  direction: () => ({ horizontal: 'center', vertical: 'top' }),
  gravity: 0.7,
  duration: 3,
  scale: () => ({ value: 1, randomize: false, randomVariation: 0 }),
  rotation: () => ({ value: 0, animate: false }),
  style: () => ({}),
  class: '',
})

const attrs = useAttrs()
const containerRef = ref<HTMLDivElement | null>(null)
const particles = ref<Particle[]>([])

const baseContainerStyle: CSSProperties = {
  position: 'relative',
  width: '0px',
  height: '0px',
  overflow: 'visible',
  backgroundColor: 'transparent',
  transform: 'translateZ(0)',
}

let inputRef: HTMLInputElement | null = null
let particleIdCounter = 0
let random = () => Math.random()
let rafId: number | null = null
let lastTime = 0
const timeoutIds = new Map<number, number>()

function mapLinear(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number {
  if (inMax === inMin) {
    return outMin
  }

  const progress = (value - inMin) / (inMax - inMin)
  return outMin + progress * (outMax - outMin)
}

function createPRNG(seed: number): () => number {
  let state = seed

  return () => {
    state |= 0
    state = (state + 1831565813) | 0
    let value = Math.imul(state ^ (state >>> 15), 1 | state)
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

const containerStyle = computed(() => [baseContainerStyle, props.style])

const getParticleStyle = (particle: Particle) => ({
  transform: `translate(${particle.x}px, ${particle.y}px) translate(-50%, -50%) scale(${particle.scale}) rotate(${particle.rotate}deg)`,
  opacity: particle.opacity,
})

const getInputSpawnPosition = (input: HTMLInputElement): { x: number; y: number } | null => {
  const container = containerRef.value

  if (!container) {
    return null
  }

  const inputRect = input.getBoundingClientRect()
  const containerRect = container.getBoundingClientRect()
  const inputValue = input.value

  const getTextWidth = (text: string, currentInput: HTMLInputElement) => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    if (!context) {
      return 0
    }

    const computedStyle = window.getComputedStyle(currentInput)
    context.font = `${computedStyle.fontSize} ${computedStyle.fontFamily}`
    return context.measureText(text).width
  }

  const computedStyle = window.getComputedStyle(input)
  const paddingLeft = Number.parseInt(computedStyle.paddingLeft, 10) || 0
  const paddingRight = Number.parseInt(computedStyle.paddingRight, 10) || 0

  let x = 0

  if (inputValue.length > 0) {
    const textWidth = getTextWidth(inputValue, input)
    const inputStartX = inputRect.left - containerRect.left
    const maxX = inputStartX + inputRect.width - paddingRight
    x = Math.min(textWidth + inputStartX + paddingLeft, maxX)
  } else {
    x = inputRect.left - containerRect.left
  }

  const y = inputRect.top - containerRect.top + inputRect.height / 2

  return { x, y }
}

const removeParticle = (particleId: number) => {
  particles.value = particles.value.filter((particle) => particle.id !== particleId)
  const timeoutId = timeoutIds.get(particleId)

  if (timeoutId !== undefined) {
    window.clearTimeout(timeoutId)
    timeoutIds.delete(particleId)
  }
}

const createParticlesAtPosition = (x: number, y: number) => {
  const horizontal = props.direction.horizontal ?? 'center'
  const vertical = props.direction.vertical ?? 'top'

  const spawnOne = () => {
    const horizontalValue = horizontal === 'left' ? -0.4 : horizontal === 'right' ? 0.4 : 0
    const baseVx = mapLinear(horizontalValue, -1, 1, -800, 800)
    const spreadVx = 300
    const vx = baseVx + (random() * 2 - 1) * spreadVx

    const verticalValue = vertical === 'top' ? -0.7 : vertical === 'bottom' ? 0.7 : 0
    const baseVy = mapLinear(verticalValue, -1, 1, -800, 800)
    const spreadVy = 300
    const vy = baseVy + (random() * 2 - 1) * spreadVy

    particleIdCounter += 1

    const randBetween = (min: number, max: number) => min + random() * (max - min)

    const baseScale = props.scale.value ?? 1
    let particleScale = baseScale

    if (props.scale.randomize) {
      const percent = Math.max(0, Math.min(100, props.scale.randomVariation ?? 50)) / 100
      const minScale = Math.max(0.1, baseScale * (1 - percent))
      const maxScale = baseScale * (1 + percent)
      particleScale = randBetween(minScale, maxScale)
    }

    const safeScale = Math.max(0.1, Math.min(4, particleScale))

    const baseRotation = props.rotation.value ?? 0
    let initialRotation = baseRotation
    let endRotation = baseRotation

    if (props.rotation.animate) {
      initialRotation = randBetween(-180, 180)
      endRotation = initialRotation + randBetween(-360, 360)
    }

    const particle: Particle = {
      id: particleIdCounter,
      x,
      y,
      scale: safeScale,
      rotate: initialRotation,
      opacity: 1,
      vx,
      vy,
      gravity: mapLinear(Math.max(-1, Math.min(1, props.gravity ?? 0.45)), -1, 1, -2000, 2000),
      birthTime: performance.now(),
      lifeMs: props.duration * 1000,
      contentIdx: props.content.length > 0 ? (particleIdCounter - 1) % props.content.length : -1,
      scaleStart: safeScale,
      scaleEnd: safeScale,
      rotateStart: initialRotation,
      rotateEnd: endRotation,
      isDead: false,
    }

    particles.value.push(particle)

    const timeoutId = window.setTimeout(() => {
      particle.isDead = true
      removeParticle(particle.id)
    }, props.duration * 1000)

    timeoutIds.set(particle.id, timeoutId)
  }

  const particlesToSpawn = Math.max(1, Math.min(5, Math.round(props.count)))

  for (let index = 0; index < particlesToSpawn; index += 1) {
    spawnOne()
  }
}

const updateParticles = (currentTime: number) => {
  const delta = currentTime - lastTime
  lastTime = currentTime

  const dtMs = Math.min(32, delta)
  const dt = dtMs / 1000
  const now = performance.now()

  for (const particle of particles.value) {
    if (particle.isDead) {
      continue
    }

    const age = now - particle.birthTime

    if (age >= particle.lifeMs) {
      continue
    }

    const progress = age / particle.lifeMs
    particle.vy += particle.gravity * dt
    particle.x += particle.vx * dt
    particle.y += particle.vy * dt
    particle.scale = mapLinear(progress, 0, 1, particle.scaleStart, particle.scaleEnd)
    particle.rotate = mapLinear(progress, 0, 1, particle.rotateStart, particle.rotateEnd)

    const fadeStart = 0.7
    particle.opacity =
      progress > fadeStart ? mapLinear(progress, fadeStart, 1, 1, 0) : 1

    if (Number.isNaN(particle.x) || Number.isNaN(particle.y) || Number.isNaN(particle.scale)) {
      continue
    }

    particle.scale = Math.max(0.1, Math.min(3, particle.scale))
  }

  rafId = window.requestAnimationFrame(updateParticles)
}

const handleInput = () => {
  if (!inputRef) {
    return
  }

  const position = getInputSpawnPosition(inputRef)

  if (position) {
    createParticlesAtPosition(position.x, position.y)
  }
}

onMounted(() => {
  const timeBits = (Date.now() & 4294967295) >>> 0
  const extra = Math.floor(Math.random() * 4294967295) >>> 0
  const seed = (timeBits ^ extra) >>> 0
  random = createPRNG(seed)

  const container = containerRef.value

  if (container) {
    const label = container.closest('label')
    const input = label?.querySelector('input') ?? null

    if (input instanceof HTMLInputElement) {
      inputRef = input
      input.addEventListener('input', handleInput)
    }
  }

  lastTime = performance.now()
  rafId = window.requestAnimationFrame(updateParticles)
})

onBeforeUnmount(() => {
  if (inputRef) {
    inputRef.removeEventListener('input', handleInput)
    inputRef = null
  }

  if (rafId !== null) {
    window.cancelAnimationFrame(rafId)
  }

  for (const timeoutId of timeoutIds.values()) {
    window.clearTimeout(timeoutId)
  }

  timeoutIds.clear()
  particles.value = []
})
</script>

<template>
  <div
    ref="containerRef"
    :class="props.class"
    :style="containerStyle"
    v-bind="attrs"
  >
    <div class="pointer-events-none absolute left-0 top-0 h-full w-full">
      <div
        v-for="particle in particles"
        :key="particle.id"
        class="pointer-events-none absolute left-0 top-0 flex items-center justify-center will-change-[transform,opacity]"
        :style="getParticleStyle(particle)"
      >
        <VNodeRenderer
          v-if="particle.contentIdx >= 0 && props.content[particle.contentIdx] !== undefined"
          :node="props.content[particle.contentIdx]"
          :render-key="particle.id"
        />
        <div v-else class="h-4 w-4 rounded-[6px] bg-[#6366f1]" />
      </div>
    </div>
  </div>
</template>
