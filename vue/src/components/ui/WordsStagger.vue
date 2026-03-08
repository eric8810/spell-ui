<script setup lang="ts">
import SlideUpText from './SlideUpText.vue'

interface Props {
  class?: string
  delay?: number
  stagger?: number
  speed?: number
  from?: 'first' | 'last' | 'center'
  autoStart?: boolean
  inView?: boolean
  once?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
  delay: 0,
  stagger: 0.1,
  speed: 0.5,
  from: 'first',
  autoStart: true,
  inView: false,
  once: true,
})

const emit = defineEmits<{
  start: []
  complete: []
}>()
</script>

<template>
  <SlideUpText
    split="words"
    :class="props.class"
    :delay="props.delay"
    :stagger="props.stagger"
    :from="props.from"
    :auto-start="props.autoStart"
    :in-view="props.inView"
    :once="props.once"
    :transition="{ duration: props.speed, ease: [0.625, 0.05, 0, 1] }"
    @start="emit('start')"
    @complete="emit('complete')"
  >
    <slot />
  </SlideUpText>
</template>
