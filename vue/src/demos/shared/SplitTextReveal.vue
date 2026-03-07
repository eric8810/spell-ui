<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  text: string
  split?: 'chars' | 'words'
  class?: string
  itemClass?: string
  delay?: number
  stagger?: number
  duration?: number
  blur?: boolean
  translateY?: number
}

const props = withDefaults(defineProps<Props>(), {
  split: 'chars',
  class: '',
  itemClass: '',
  delay: 0,
  stagger: 0.05,
  duration: 0.4,
  blur: true,
  translateY: 10,
})

const active = ref(false)

const items = computed(() => {
  if (props.split === 'words') {
    return props.text.split(' ').map((word, index, allWords) => ({
      key: `${word}-${index}`,
      content: word,
      trailingSpace: index < allWords.length - 1,
    }))
  }

  return Array.from(props.text).map((char, index) => ({
    key: `char-${index}`,
    content: char === ' ' ? '\u00A0' : char,
    trailingSpace: false,
  }))
})

const getItemStyle = (index: number) => ({
  transitionDelay: `${props.delay + index * props.stagger}s`,
  transitionDuration: `${props.duration}s`,
})

onMounted(() => {
  window.requestAnimationFrame(() => {
    active.value = true
  })
})
</script>

<template>
  <span :class="cn('inline-flex flex-wrap', props.class)" :aria-label="props.text">
    <span class="sr-only">{{ props.text }}</span>
    <span
      v-for="(item, index) in items"
      :key="item.key"
      aria-hidden="true"
      :class="cn('inline-block will-change-transform transition-[opacity,filter,transform] ease-out', props.itemClass)"
      :style="[
        getItemStyle(index),
        active
          ? { opacity: 1, filter: 'blur(0px)', transform: 'translateY(0px)' }
          : {
              opacity: 0,
              filter: props.blur ? 'blur(12px)' : 'blur(0px)',
              transform: `translateY(${props.translateY}px)`,
            },
      ]"
    >
      {{ item.content }}<span v-if="item.trailingSpace">&nbsp;</span>
    </span>
  </span>
</template>
