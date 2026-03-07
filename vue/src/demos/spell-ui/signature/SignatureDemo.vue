<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'default' | 'contrast'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})

const signature = computed(() =>
  props.variant === 'contrast'
    ? { text: 'Tomm.', color: '#0156FE', className: 'text-[80px]' }
    : { text: 'Spell Studio', color: '#1D1D1F', className: 'text-[76px] dark:invert' },
)
</script>

<template>
  <div :class="props.variant === 'contrast' ? 'rounded-2xl p-6' : 'flex items-center justify-center'">
    <svg viewBox="0 0 720 140" class="w-[320px] max-w-full overflow-visible">
      <text
        x="12"
        y="96"
        :fill="signature.color"
        stroke="currentColor"
        :style="{ color: signature.color, fontFamily: 'LastoriaBold, cursive' }"
        class="fill-current stroke-current text-[80px] [paint-order:stroke_fill] [stroke-dasharray:1400] [stroke-dashoffset:1400] [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:2] animate-[spell-signature_2.8s_ease-in-out_forwards]"
      >
        {{ signature.text }}
      </text>
    </svg>
  </div>
</template>

<style scoped>
@font-face {
  font-family: 'LastoriaBold';
  src: url('/LastoriaBoldRegular.otf') format('opentype');
}

@keyframes spell-signature {
  0% {
    stroke-dashoffset: 1400;
    fill-opacity: 0;
  }

  70% {
    stroke-dashoffset: 0;
    fill-opacity: 0;
  }

  100% {
    stroke-dashoffset: 0;
    fill-opacity: 1;
  }
}
</style>
