<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  text: string
  split?: 'chars' | 'words'
  class?: string
  delay?: number
}

const props = withDefaults(defineProps<Props>(), {
  split: 'words',
  class: '',
  delay: 0.2,
})

const active = ref(false)

const items = computed(() => {
  if (props.split === 'chars') {
    return Array.from(props.text).map((char, index) => ({
      key: `char-${index}`,
      content: char === ' ' ? '\u00A0' : char,
      className: 'inline',
    }))
  }

  return props.text.split(' ').map((word, index) => ({
    key: `word-${index}`,
    content: word,
    className: 'mr-[0.25em] inline-block',
  }))
})

const delays = computed(() =>
  items.value.map((_, index) => props.delay + ((index % 5) * 0.045 + (index % 3) * 0.015)),
)

onMounted(() => {
  window.requestAnimationFrame(() => {
    active.value = true
  })
})
</script>

<template>
  <span :class="cn('inline-block break-words', props.class)" :aria-label="props.text">
    <span
      v-for="(item, index) in items"
      :key="item.key"
      :class="item.className"
      :style="{
        opacity: active ? 1 : 0,
        transition: `opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${delays[index]}s`,
      }"
    >
      {{ item.content }}
    </span>
  </span>
</template>
