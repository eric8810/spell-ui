<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import HomeView from '@/views/HomeView.vue'
import DocView from '@/views/DocView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import { navigate, routeState } from '@/router'
import { getDocById } from '@/lib/doc'

const currentView = computed(() => {
  switch (routeState.value.name) {
    case 'home':
      return HomeView
    case 'doc':
      return getDocById(routeState.value.id) ? DocView : NotFoundView
    case 'docs-redirect':
      return null
    default:
      return NotFoundView
  }
})

watchEffect(() => {
  if (routeState.value.name === 'docs-redirect') {
    navigate('/docs/introduction', { replace: true })
  }
})
</script>

<template>
  <component :is="currentView" v-if="currentView" />
</template>
