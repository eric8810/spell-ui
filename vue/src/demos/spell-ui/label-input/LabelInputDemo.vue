<script setup lang="ts">
import LabelInputField from '@/demos/shared/LabelInputField.vue'

interface Props {
  variant?: 'default' | 'password' | 'colors'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})
</script>

<template>
  <div v-if="props.variant === 'colors'" class="flex gap-4 not-md:flex-col">
    <LabelInputField label="Primary" ring-color="primary" class="max-w-40" />
    <LabelInputField label="Orange" ring-color="orange" class="max-w-40" />
    <LabelInputField label="Blue" ring-color="blue" class="max-w-40" />
  </div>

  <LabelInputField
    v-else-if="props.variant === 'password'"
    label="Password"
    type="password"
    ring-color="blue"
    class="max-w-72"
  />

  <LabelInputField v-else label="Username" type="text" class="max-w-72" />
</template>
