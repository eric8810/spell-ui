<script setup lang="ts">
import { onMounted, ref } from 'vue'
import SiteHeader from '@/components/docs/SiteHeader.vue'
import ReactIsland from '@/components/docs/ReactIsland.vue'
import { getDocSchema } from '@/lib/doc'

const docSchema = getDocSchema()
const heroComponent = ref<any>(null)

onMounted(async () => {
  const { heroLoader } = await import('@/generated/manifest.js')
  heroComponent.value = await heroLoader()
})
</script>

<template>
  <div class="relative flex min-h-dvh flex-col pt-14">
    <SiteHeader :doc-schema="docSchema" />
    <ReactIsland v-if="heroComponent" :component="heroComponent" mode="react" class="flex-1" />
  </div>
</template>
