<script setup lang="ts">
import SiteHeader from '@/components/docs/SiteHeader.vue'
import HomeHero from '@/components/docs/HomeHero.vue'
import { getDocSchema } from '@/lib/doc'

const docSchema = getDocSchema()
</script>

<template>
  <div class="relative flex min-h-dvh flex-col pt-14">
    <SiteHeader :doc-schema="docSchema" />
    <HomeHero class="flex-1" />
  </div>
</template>
