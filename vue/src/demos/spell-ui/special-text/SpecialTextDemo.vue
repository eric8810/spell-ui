<script setup lang="ts">
import ScrambleText from '@/demos/shared/ScrambleText.vue'

interface Props {
  variant?: 'default' | 'speed'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})
</script>

<template>
  <ScrambleText v-if="props.variant === 'default'" text="SPELL UI" class="text-xl" />

  <div v-else class="flex flex-col gap-4">
    <div class="flex items-center gap-4">
      <span class="w-20 text-sm font-mono text-muted-foreground">FAST:</span>
      <ScrambleText text="FAST ANIMATION" class="text-lg" :speed="10" />
    </div>
    <div class="flex items-center gap-4">
      <span class="w-20 text-sm font-mono text-muted-foreground">NORMAL:</span>
      <ScrambleText text="NORMAL SPEED" class="text-lg" :speed="20" />
    </div>
    <div class="flex items-center gap-4">
      <span class="w-20 text-sm font-mono text-muted-foreground">SLOW:</span>
      <ScrambleText text="SLOW MOTION" class="text-lg" :speed="40" />
    </div>
  </div>
</template>
