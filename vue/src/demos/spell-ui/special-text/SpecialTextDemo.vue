<script setup lang="ts">
import { SpecialText } from '@/components/ui'

interface Props {
  variant?: 'default' | 'speed'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})
</script>

<template>
  <SpecialText v-if="props.variant === 'default'" class="text-xl">
    SPELL UI
  </SpecialText>

  <div v-else class="flex flex-col gap-4">
    <div class="flex items-center gap-4">
      <span class="w-20 text-sm font-mono text-muted-foreground">FAST:</span>
      <SpecialText :speed="10" class="text-lg" in-view>
        FAST ANIMATION
      </SpecialText>
    </div>
    <div class="flex items-center gap-4">
      <span class="w-20 text-sm font-mono text-muted-foreground">NORMAL:</span>
      <SpecialText :speed="20" class="text-lg" in-view>
        NORMAL SPEED
      </SpecialText>
    </div>
    <div class="flex items-center gap-4">
      <span class="w-20 text-sm font-mono text-muted-foreground">SLOW:</span>
      <SpecialText :speed="40" class="text-lg" in-view>
        SLOW MOTION
      </SpecialText>
    </div>
  </div>
</template>
