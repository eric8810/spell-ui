<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { cn } from '@/lib/utils'

type KeyItem = string | { display: string; key: string }

interface Props {
  keys?: KeyItem[]
  class?: string
  active?: boolean
  listenToKeyboard?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  keys: () => [],
  active: false,
  listenToKeyboard: false,
})

const keySymbolMap = {
  command: '⌘',
  cmd: '⌘',
  control: '⌃',
  ctrl: '⌃',
  alt: '⌥',
  option: '⌥',
  space: '␣',
  arrowleft: '←',
  left: '←',
  arrowdown: '↓',
  down: '↓',
  arrowup: '↑',
  up: '↑',
  arrowright: '→',
  right: '→',
} as const

const keyHotkeyMap: Record<string, string> = {
  command: 'meta',
  cmd: 'meta',
  control: 'ctrl',
  ctrl: 'ctrl',
  alt: 'alt',
  option: 'alt',
  shift: 'shift',
  enter: 'enter',
  return: 'enter',
  space: 'space',
  arrowleft: 'left',
  left: 'left',
  arrowdown: 'down',
  down: 'down',
  arrowup: 'up',
  up: 'up',
  arrowright: 'right',
  right: 'right',
}

const browserKeyMap: Record<string, string> = {
  Meta: 'meta',
  Control: 'ctrl',
  Alt: 'alt',
  Shift: 'shift',
  Enter: 'enter',
  ' ': 'space',
  Spacebar: 'space',
  ArrowLeft: 'left',
  ArrowDown: 'down',
  ArrowUp: 'up',
  ArrowRight: 'right',
}

const pressedKeys = ref<Set<string>>(new Set())

const normalizeKey = (key: string) => {
  const mappedKey = browserKeyMap[key] ?? keyHotkeyMap[key.toLowerCase()] ?? key.toLowerCase()
  return mappedKey
}

const displayKeys = computed(() =>
  props.keys.map((item) => {
    const key = typeof item === 'string' ? item : item.display
    const normalizedKey = key.toLowerCase()
    return keySymbolMap[normalizedKey as keyof typeof keySymbolMap] || key.toUpperCase()
  }),
)

const requiredKeys = computed(() =>
  props.keys.map((item) => {
    const key = typeof item === 'string' ? item : item.key
    return normalizeKey(key)
  }),
)

const syncModifierKeys = (event: KeyboardEvent, nextKeys: Set<string>) => {
  if (event.metaKey) nextKeys.add('meta')
  else nextKeys.delete('meta')

  if (event.ctrlKey) nextKeys.add('ctrl')
  else nextKeys.delete('ctrl')

  if (event.altKey) nextKeys.add('alt')
  else nextKeys.delete('alt')

  if (event.shiftKey) nextKeys.add('shift')
  else nextKeys.delete('shift')
}

const updatePressedKeys = (event: KeyboardEvent, isKeyDown: boolean) => {
  const nextKeys = new Set(pressedKeys.value)
  const key = normalizeKey(event.key)

  if (isKeyDown) nextKeys.add(key)
  else nextKeys.delete(key)

  syncModifierKeys(event, nextKeys)
  pressedKeys.value = nextKeys
}

const clearPressedKeys = () => {
  pressedKeys.value = new Set()
}

const handleKeyDown = (event: KeyboardEvent) => {
  updatePressedKeys(event, true)
}

const handleKeyUp = (event: KeyboardEvent) => {
  updatePressedKeys(event, false)
}

const removeListeners = () => {
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
  window.removeEventListener('blur', clearPressedKeys)
}

const addListeners = () => {
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
  window.addEventListener('blur', clearPressedKeys)
}

watch(
  () => props.listenToKeyboard,
  (listenToKeyboard) => {
    if (typeof window === 'undefined') {
      return
    }

    removeListeners()
    clearPressedKeys()

    if (listenToKeyboard) {
      addListeners()
    }
  },
  { immediate: true },
)

onMounted(() => {
  if (typeof window === 'undefined' || !props.listenToKeyboard) {
    return
  }

  addListeners()
})

onBeforeUnmount(() => {
  if (typeof window === 'undefined') {
    return
  }

  removeListeners()
})

const isKeyboardActive = computed(() => {
  if (!props.listenToKeyboard || !requiredKeys.value.length) {
    return false
  }

  return requiredKeys.value.every((key) => pressedKeys.value.has(key))
})

const isActive = computed(() => props.active || isKeyboardActive.value)
</script>

<template>
  <kbd
    :class="
      cn(
        'relative -top-[0.03em] inline-flex min-w-[1.75em] shrink-0 cursor-default select-none items-center justify-center whitespace-nowrap rounded-[0.35em] px-[0.5em] pb-[0.05em] align-text-top text-[0.75em] font-normal leading-[1.7em] tracking-tight transition-all duration-100',
        isActive
          ? 'translate-y-[0.05em] bg-background text-foreground shadow-[inset_0_0.05em_rgba(255,255,255,0.95),inset_0_0.05em_0.2em_rgba(0,0,0,0.1),0_0_0_0.05em_rgba(0,0,0,0.134)] dark:shadow-[inset_0_0.05em_0.2em_rgba(0,0,0,0.3),0_0_0_0.05em_rgba(255,255,255,0.134)]'
          : 'bg-background text-foreground shadow-[inset_0_-0.05em_0.5em_rgba(0,0,0,0.034),inset_0_0.05em_rgba(255,255,255,0.95),inset_0_0.25em_0.5em_rgba(0,0,0,0.034),inset_0_-0.05em_rgba(0,0,0,0.172),0_0_0_0.05em_rgba(0,0,0,0.134),0_0.08em_0.17em_rgba(0,0,0,0.231)] dark:shadow-[inset_0_-0.05em_0.5em_rgba(255,255,255,0.034),inset_0_0.05em_rgba(255,255,255,0.1),inset_0_0.25em_0.5em_rgba(255,255,255,0.034),inset_0_-0.05em_rgba(255,255,255,0.172),0_0_0_0.05em_rgba(255,255,255,0.134),0_0.08em_0.17em_rgba(255,255,255,0.231)]',
        props.class,
      )
    "
  >
    <span
      v-for="(key, index) in displayKeys"
      :key="`${key}-${index}`"
      :class="index > 0 ? 'ml-0.5' : undefined"
    >
      {{ key }}
    </span>
  </kbd>
</template>
