<script setup lang="ts">
import { TextMarquee } from "@/components/ui"
</script>

<template>
  <div
    class="flex gap-8"
  >
    <div
      class="space-y-2"
    >
      <p
        class="text-sm text-muted-foreground"
      >
        Speed: 0.5
      </p>
      <TextMarquee
        :speed='0.5'
      >
        <p
          class="text-xl font-medium"
        >
          Tomato
        </p>
        <p
          class="text-xl font-medium"
        >
          Apple
        </p>
        <p
          class="text-xl font-medium"
        >
          Carrot
        </p>
        <p
          class="text-xl font-medium"
        >
          Lettuce
        </p>
        <p
          class="text-xl font-medium"
        >
          Onion
        </p>
      </TextMarquee>
    </div>
    <div
      class="space-y-2"
    >
      <p
        class="text-sm text-muted-foreground"
      >
        Speed: 1
      </p>
      <TextMarquee
        :speed='1'
      >
        <p
          class="text-xl font-medium"
        >
          Tomato
        </p>
        <p
          class="text-xl font-medium"
        >
          Apple
        </p>
        <p
          class="text-xl font-medium"
        >
          Carrot
        </p>
        <p
          class="text-xl font-medium"
        >
          Lettuce
        </p>
        <p
          class="text-xl font-medium"
        >
          Onion
        </p>
      </TextMarquee>
    </div>
    <div
      class="space-y-2"
    >
      <p
        class="text-sm text-muted-foreground"
      >
        Speed: 2
      </p>
      <TextMarquee
        :speed='2'
      >
        <p
          class="text-xl font-medium"
        >
          Tomato
        </p>
        <p
          class="text-xl font-medium"
        >
          Apple
        </p>
        <p
          class="text-xl font-medium"
        >
          Carrot
        </p>
        <p
          class="text-xl font-medium"
        >
          Lettuce
        </p>
        <p
          class="text-xl font-medium"
        >
          Onion
        </p>
      </TextMarquee>
    </div>
  </div>
</template>
