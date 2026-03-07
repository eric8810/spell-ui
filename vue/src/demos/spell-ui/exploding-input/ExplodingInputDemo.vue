<script setup lang="ts">
import { h } from 'vue'
import { ExplodingInput } from '@/components/ui'

const content = [
  h('span', { class: 'text-4xl' }, '🤩'),
  h('span', { class: 'text-4xl' }, '👾'),
  h('span', { class: 'text-4xl' }, '😺'),
  h('span', { class: 'text-4xl' }, '👻'),
  h('span', { class: 'text-4xl' }, '🎃'),
  h('span', { class: 'text-4xl' }, '🖤'),
  h('span', { class: 'text-4xl' }, '🗯️'),
]
</script>

<template>
  <label class="block">
    <input
      type="text"
      placeholder="try@spell.here"
      class="h-10 w-72 border-b bg-background p-0 text-base font-medium outline-none placeholder:font-medium"
    >
    <ExplodingInput
      class="z-50"
      :content="content"
      :direction="{ horizontal: 'left', vertical: 'top' }"
      :gravity="0.5"
      :duration="3"
      :count="3"
    />
  </label>
</template>
