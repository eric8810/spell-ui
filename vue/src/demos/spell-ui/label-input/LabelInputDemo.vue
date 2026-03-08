<script setup lang="ts">
import { LabelInput } from '@/components/ui'

interface Props {
  variant?: 'default' | 'password' | 'colors'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})
</script>

<template>
  <div v-if="props.variant === 'colors'" class="flex gap-4 not-md:flex-col">
    <LabelInput label="Primary" ring-color="primary" class="max-w-40" />
    <LabelInput label="Orange" ring-color="orange" class="max-w-40" />
    <LabelInput label="Blue" ring-color="blue" class="max-w-40" />
  </div>

  <LabelInput
    v-else-if="props.variant === 'password'"
    label="Password"
    type="password"
    ring-color="blue"
    class="max-w-72"
  />

  <LabelInput v-else label="Username" type="username" class="max-w-72" />
</template>
