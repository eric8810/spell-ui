<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { cn } from '@/lib/utils'

type SizeVariant = 'default' | 'sm' | 'lg'

interface Props {
  colors: string[]
  size?: SizeVariant
  defaultValue: string
  modelValue?: string
  name?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'default',
})

const emit = defineEmits<{
  colorSelect: [color: string]
  'update:modelValue': [color: string]
}>()

const colorMap = {
  default: 'var(--foreground)',
  red: 'var(--color-red-500)',
  green: 'var(--color-green-500)',
  blue: 'var(--color-blue-500)',
  yellow: 'var(--color-yellow-500)',
  purple: 'var(--color-purple-500)',
  pink: 'var(--color-pink-500)',
  indigo: 'var(--color-indigo-500)',
  orange: 'var(--color-orange-500)',
  teal: 'var(--color-teal-500)',
  cyan: 'var(--color-cyan-500)',
  lime: 'var(--color-lime-500)',
  emerald: 'var(--color-emerald-500)',
  violet: 'var(--color-violet-500)',
  fuchsia: 'var(--color-fuchsia-500)',
  rose: 'var(--color-rose-500)',
  sky: 'var(--color-sky-500)',
  amber: 'var(--color-amber-500)',
} as const

const selectedColor = ref(props.modelValue ?? props.defaultValue)

watch(
  () => props.modelValue,
  (value) => {
    if (value !== undefined) {
      selectedColor.value = value
    }
  },
)

watch(
  () => props.defaultValue,
  (value) => {
    if (props.modelValue === undefined) {
      selectedColor.value = value
    }
  },
)

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'size-4'
    case 'lg':
      return 'size-6'
    default:
      return 'size-5'
  }
})

const hiddenValue = computed(() => props.modelValue ?? selectedColor.value)

const getColorValue = (color: string) =>
  colorMap[color as keyof typeof colorMap] || color

const handleColorSelect = (color: string) => {
  if (props.modelValue === undefined) {
    selectedColor.value = color
  }

  emit('update:modelValue', color)
  emit('colorSelect', color)
}
</script>

<template>
  <div :class="cn('flex gap-2', props.class)">
    <input v-if="name" type="hidden" :name="name" :value="hiddenValue" />

    <button
      v-for="color in colors"
      :key="color"
      type="button"
      :class="
        cn(
          sizeClass,
          'cursor-pointer rounded-full transition-transform duration-200 active:scale-90',
          hiddenValue === color && 'ring-2 ring-gray-400 ring-offset-2',
        )
      "
      :style="{
        backgroundColor: getColorValue(color),
        ...(hiddenValue === color
          ? {
              boxShadow: `inset 0 0 0 2px var(--background), 0 0 0 2px ${getColorValue(color)}`,
            }
          : {}),
      }"
      :aria-label="`Select ${color} color`"
      :aria-pressed="hiddenValue === color"
      @click="handleColorSelect(color)"
      @keydown.enter.prevent="handleColorSelect(color)"
      @keydown.space.prevent="handleColorSelect(color)"
    />
  </div>
</template>
