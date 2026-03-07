<script setup lang="ts">
import { HighlightedText } from '@/components/ui'

interface Props {
  variant?: 'default' | 'direction'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})
</script>

<template>
  <div v-if="props.variant === 'direction'" class="flex flex-col gap-6 text-xl font-semibold tracking-tight">
    <div>
      <HighlightedText from="left" :delay="0" in-view>
        From Left
      </HighlightedText>
    </div>
    <div>
      <HighlightedText from="right" :delay="0.2" in-view>
        From Right
      </HighlightedText>
    </div>
    <div>
      <HighlightedText from="top" :delay="0.4" in-view>
        From Top
      </HighlightedText>
    </div>
    <div>
      <HighlightedText from="bottom" :delay="0.6" in-view>
        From Bottom
      </HighlightedText>
    </div>
  </div>

  <div v-else class="flex items-center text-2xl font-medium tracking-[-.03em] md:text-4xl">
    You&nbsp;<HighlightedText>can</HighlightedText>&nbsp;just&nbsp;
    <HighlightedText :delay="0.4" from="left">ship things.</HighlightedText>
  </div>
</template>
