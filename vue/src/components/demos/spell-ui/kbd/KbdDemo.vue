<script setup lang="ts">
import { Kbd } from '@/components/ui'

interface Props {
  variant?: 'default' | 'symbols' | 'custom'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})
</script>

<template>
  <div v-if="props.variant === 'symbols'" class="flex flex-wrap gap-4">
    <Kbd :keys="['command']" listen-to-keyboard />
    <Kbd :keys="['control']" listen-to-keyboard />
    <Kbd :keys="['alt']" listen-to-keyboard />
    <Kbd :keys="['up']" listen-to-keyboard />
    <Kbd :keys="['down']" listen-to-keyboard />
    <Kbd :keys="['left']" listen-to-keyboard />
    <Kbd :keys="['right']" listen-to-keyboard />
  </div>

  <div v-else-if="props.variant === 'custom'" class="flex flex-col items-center gap-4">
    <p class="text-sm text-muted-foreground">Press M key to activate</p>
    <Kbd :keys="[{ display: 'HOLD', key: 'M' }]" listen-to-keyboard />
  </div>

  <div v-else class="flex gap-4">
    <Kbd :keys="['alt']" listen-to-keyboard />
    <Kbd :keys="[{ display: 'ENTER', key: 'enter' }]" listen-to-keyboard />
    <Kbd :keys="['space']" listen-to-keyboard />
    <Kbd :keys="['ctrl', 'j']" listen-to-keyboard />
    <Kbd :keys="[{ display: 'HOLD', key: 'H' }]" listen-to-keyboard />
    <Kbd :keys="['up']" listen-to-keyboard />
  </div>
</template>
