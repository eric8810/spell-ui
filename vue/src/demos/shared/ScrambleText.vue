<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  text: string
  speed?: number
  delay?: number
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  speed: 20,
  delay: 0,
  class: '',
})

const RANDOM_CHARS = '_!X$0-+*#'
const displayText = ref(' '.repeat(props.text.length))
const phase = ref<'phase1' | 'phase2'>('phase1')
const step = ref(0)

let startTimer: number | null = null
let loopTimer: number | null = null

const randomChar = (previous?: string) => {
  let char = RANDOM_CHARS.charAt(Math.floor(Math.random() * RANDOM_CHARS.length)) || '_'
  while (char === previous) {
    char = RANDOM_CHARS.charAt(Math.floor(Math.random() * RANDOM_CHARS.length)) || '_'
  }
  return char
}

const clearTimers = () => {
  if (startTimer !== null) {
    window.clearTimeout(startTimer)
    startTimer = null
  }

  if (loopTimer !== null) {
    window.clearInterval(loopTimer)
    loopTimer = null
  }
}

const runPhase1 = () => {
  const maxSteps = props.text.length * 2
  const currentLength = Math.min(step.value + 1, props.text.length)
  const chars: string[] = []

  for (let index = 0; index < currentLength; index += 1) {
    chars.push(randomChar(chars[index - 1]))
  }

  for (let index = currentLength; index < props.text.length; index += 1) {
    chars.push('\u00A0')
  }

  displayText.value = chars.join('')

  if (step.value < maxSteps - 1) {
    step.value += 1
    return
  }

  phase.value = 'phase2'
  step.value = 0
}

const runPhase2 = () => {
  const revealedCount = Math.floor(step.value / 2)
  const chars: string[] = []

  for (let index = 0; index < revealedCount && index < props.text.length; index += 1) {
    chars.push(props.text.charAt(index))
  }

  if (revealedCount < props.text.length) {
    chars.push(step.value % 2 === 0 ? '_' : randomChar())
  }

  for (let index = chars.length; index < props.text.length; index += 1) {
    chars.push(randomChar())
  }

  displayText.value = chars.join('')

  if (step.value < props.text.length * 2 - 1) {
    step.value += 1
    return
  }

  displayText.value = props.text
  if (loopTimer !== null) {
    window.clearInterval(loopTimer)
    loopTimer = null
  }
}

const startAnimation = () => {
  displayText.value = ' '.repeat(props.text.length)
  phase.value = 'phase1'
  step.value = 0

  if (loopTimer !== null) {
    window.clearInterval(loopTimer)
  }

  loopTimer = window.setInterval(() => {
    if (phase.value === 'phase1') {
      runPhase1()
      return
    }

    runPhase2()
  }, props.speed)
}

onMounted(() => {
  startTimer = window.setTimeout(startAnimation, props.delay * 1000)
})

onBeforeUnmount(() => {
  clearTimers()
})
</script>

<template>
  <span :class="cn('inline-flex h-4.5 font-mono font-medium leading-5', props.class)">
    {{ displayText }}
  </span>
</template>
