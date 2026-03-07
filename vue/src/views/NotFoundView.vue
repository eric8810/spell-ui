<script setup lang="ts">
import { Button } from '@/components/ui'
import SiteHeader from '@/components/docs/SiteHeader.vue'
import AppLink from '@/components/AppLink.vue'
import { getDocSchema } from '@/lib/doc'

const docSchema = getDocSchema()
</script>

<template>
  <div class="min-h-dvh pt-14">
    <SiteHeader :doc-schema="docSchema" />
    <div class="container flex min-h-[calc(100dvh-3.5rem)] flex-col items-center justify-center gap-4 text-center">
      <p class="text-sm uppercase tracking-[0.2em] text-muted-foreground">404</p>
      <h1 class="text-3xl font-semibold tracking-tight">Page Not Found</h1>
      <p class="max-w-md text-muted-foreground">
        The page you requested does not exist in the Vue documentation build.
      </p>
      <Button as-child>
        <AppLink to="/docs/introduction">Back to Docs</AppLink>
      </Button>
    </div>
  </div>
</template>
