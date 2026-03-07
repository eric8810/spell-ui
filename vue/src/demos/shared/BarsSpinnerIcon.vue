<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 20,
})

const wrapperStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
}))
</script>

<template>
  <div class="spell-bars-spinner" :style="wrapperStyle" aria-hidden="true">
    <span v-for="index in 12" :key="index" class="bar" :style="{ transform: `rotate(${(index - 1) * 30}deg) translate(146%)`, animationDelay: `${-1.2 + (index - 1) * 0.1}s` }" />
  </div>
</template>

<style scoped>
.spell-bars-spinner {
  position: relative;
  display: inline-block;
}

.bar {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 10%;
  height: 26%;
  margin-top: -13%;
  margin-left: -5%;
  transform-origin: center center;
  border-radius: 9999px;
  background: currentColor;
  animation: spell-bars-fade 1.2s linear infinite;
}

@keyframes spell-bars-fade {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0.15;
  }
}
</style>
