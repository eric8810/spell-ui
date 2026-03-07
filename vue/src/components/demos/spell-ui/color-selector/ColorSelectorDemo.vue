<script setup lang="ts">
import { ref } from 'vue'
import { ColorSelector } from '@/components/ui'

interface Props {
  variant?: 'default' | 'sizes' | 'callback'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})

const selectedColor = ref('purple')
</script>

<template>
  <div v-if="props.variant === 'sizes'" class="flex flex-col gap-6">
    <div class="flex flex-col items-start gap-2">
      <span class="text-sm font-mono text-muted-foreground">SMALL</span>
      <ColorSelector
        :colors="['red', 'blue', 'green', 'yellow']"
        default-value="red"
        size="sm"
      />
    </div>
    <div class="flex flex-col items-start gap-2">
      <span class="text-sm font-mono text-muted-foreground">DEFAULT</span>
      <ColorSelector
        :colors="['red', 'blue', 'green', 'yellow']"
        default-value="blue"
        size="default"
      />
    </div>
    <div class="flex flex-col items-start gap-2">
      <span class="text-sm font-mono text-muted-foreground">LARGE</span>
      <ColorSelector
        :colors="['red', 'blue', 'green', 'yellow']"
        default-value="green"
        size="lg"
      />
    </div>
  </div>

  <div v-else-if="props.variant === 'callback'" class="flex flex-col items-center gap-4">
    <ColorSelector
      v-model="selectedColor"
      :colors="['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'orange']"
      :default-value="selectedColor"
    />
    <p class="text-sm text-muted-foreground">
      Selected color: <span class="font-semibold">{{ selectedColor }}</span>
    </p>
  </div>

  <ColorSelector
    v-else
    :colors="['red', 'blue', 'green', 'yellow', 'purple']"
    default-value="blue"
  />
</template>
