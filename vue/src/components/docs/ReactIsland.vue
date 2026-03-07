<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import type { Root } from 'react-dom/client'
import { mountReactComponent, resolveReactComponent } from '@/lib/react'

interface Props {
  component: any
  componentProps?: Record<string, unknown>
  mode?: 'react' | 'mdx'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  componentProps: () => ({}),
  mode: 'react',
})

const host = ref<HTMLElement | null>(null)
let root: Root | null = null

const render = async () => {
  await nextTick()
  if (!host.value) {
    return
  }

  const component = resolveReactComponent(props.component)
  if (!component) {
    root?.unmount()
    root = null
    return
  }

  root?.unmount()
  root = mountReactComponent(host.value, component, props.componentProps, props.mode)
}

watch(
  () => [props.component, props.componentProps, props.mode],
  () => {
    void render()
  },
  { deep: true, immediate: true },
)

onBeforeUnmount(() => {
  root?.unmount()
  root = null
})
</script>

<template>
  <div ref="host" :class="props.class" />
</template>
