<script setup lang="ts">
import AppLink from '@/components/AppLink.vue'
import { getDocSchema } from '@/lib/doc'

const schema = getDocSchema()
const componentsSection = schema.find((section) => section.title === 'Components')
const components = componentsSection?.items ?? []
</script>

<template>
  <div class="not-prose grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-x-8 lg:gap-x-8 lg:gap-y-6">
    <AppLink
      v-for="component in components"
      :key="component.id"
      :to="`/docs/${component.id}`"
      class="group block rounded-lg border border-border p-4 transition-colors hover:border-foreground/20"
    >
      <h2 class="font-medium transition-colors group-hover:text-foreground">
        {{ component.title }}
      </h2>
      <p class="mt-1 line-clamp-2 text-sm text-muted-foreground">
        {{ component.description }}
      </p>
    </AppLink>
  </div>
</template>
