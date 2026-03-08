<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import { Eye, EyeOff } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

defineOptions({
  inheritAttrs: false,
})

type RingColor =
  | 'muted'
  | 'primary'
  | 'secondary'
  | 'destructive'
  | 'red'
  | 'blue'
  | 'green'
  | 'yellow'
  | 'purple'
  | 'pink'
  | 'orange'
  | 'cyan'
  | 'indigo'
  | 'violet'
  | 'rose'
  | 'amber'
  | 'lime'
  | 'emerald'
  | 'sky'
  | 'slate'
  | 'fuchsia'

interface Props {
  label?: string
  ringColor?: RingColor
  type?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  ringColor: 'muted',
  type: 'text',
  class: '',
})

const attrs = useAttrs()
const visible = ref(false)
const value = ref('')

const inputAttrs = computed(() => {
  const next = { ...attrs }
  delete next.class
  return next
})

const ringClass = computed(() => {
  const colors: Record<RingColor, string> = {
    muted: 'focus:ring-muted',
    primary: 'focus:ring-primary',
    secondary: 'focus:ring-secondary',
    destructive: 'focus:ring-destructive',
    red: 'focus:ring-red-600',
    blue: 'focus:ring-blue-600',
    green: 'focus:ring-green-600',
    yellow: 'focus:ring-yellow-600',
    purple: 'focus:ring-purple-600',
    pink: 'focus:ring-pink-600',
    orange: 'focus:ring-orange-600',
    cyan: 'focus:ring-cyan-600',
    indigo: 'focus:ring-indigo-600',
    violet: 'focus:ring-violet-600',
    rose: 'focus:ring-rose-600',
    amber: 'focus:ring-amber-600',
    lime: 'focus:ring-lime-600',
    emerald: 'focus:ring-emerald-600',
    sky: 'focus:ring-sky-600',
    slate: 'focus:ring-slate-600',
    fuchsia: 'focus:ring-fuchsia-600',
  }

  return colors[props.ringColor]
})

const inputType = computed(() => {
  if (props.type !== 'password') {
    return props.type
  }

  return visible.value ? 'text' : 'password'
})
</script>

<template>
  <div :class="cn('group relative w-full', props.class)">
    <input
      v-model="value"
      v-bind="inputAttrs"
      :type="inputType"
      placeholder=" "
      :class="
        cn(
          'peer block h-10 w-full rounded-lg border bg-background px-3.5 text-sm text-primary outline-none transition-shadow focus:ring-2 dark:border-neutral-700/75 dark:bg-neutral-950',
          props.type === 'password' && 'pr-9',
          ringClass,
        )
      "
    >
    <label class="pointer-events-none absolute inset-y-0 left-[7px] my-auto block h-fit origin-top-left bg-white px-2 text-sm text-muted-foreground transition-transform duration-200 peer-focus:-translate-y-[19px] peer-focus:scale-[.8] peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 dark:bg-neutral-950">
      {{ props.label }}
    </label>
    <button
      v-if="props.type === 'password'"
      type="button"
      class="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 transition-colors hover:text-foreground"
      :aria-label="visible ? 'Hide password' : 'Show password'"
      @click="visible = !visible"
    >
      <EyeOff v-if="visible" :size="16" />
      <Eye v-else :size="16" />
    </button>
  </div>
</template>
