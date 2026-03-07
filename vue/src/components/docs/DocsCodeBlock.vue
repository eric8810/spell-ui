<script setup lang="ts">
import { CheckIcon, Copy } from 'lucide-vue-next'
import { ref } from 'vue'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'

interface Props {
  html: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
})

const copied = ref(false)

const copy = async (event: MouseEvent) => {
  const container = (event.currentTarget as HTMLElement).closest('[data-code-container]')
  const pre = container?.querySelector('pre')

  if (!pre) {
    return
  }

  await navigator.clipboard.writeText(pre.textContent ?? '')
  copied.value = true
  window.setTimeout(() => {
    copied.value = false
  }, 1500)
}
</script>

<template>
  <div data-code-container="true" :class="cn('relative', props.class)">
    <div
      class="[&_pre]:max-h-80 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:border [&_pre]:font-mono"
      v-html="props.html"
    />
    <div class="absolute top-2.5 right-2.5">
      <Button variant="outline" size="icon" class="size-7 dark:bg-[#191919] dark:hover:bg-[#212121]" @click="copy">
        <CheckIcon v-if="copied" class="size-3.5 text-emerald-500" />
        <Copy v-else class="size-3.5" />
      </Button>
    </div>
  </div>
</template>
