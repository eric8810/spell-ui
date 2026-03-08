<script setup lang="ts">
import { HighlightedText } from "@/components/ui"
</script>

<template>
  <div
    class="flex flex-col gap-6 text-xl font-semibold tracking-tight"
  >
    <div>
      <HighlightedText
        from="left"
        :delay='0'
        in-view
      >
        From Left
      </HighlightedText>
    </div>
    <div>
      <HighlightedText
        from="right"
        :delay='0.2'
        in-view
      >
        From Right
      </HighlightedText>
    </div>
    <div>
      <HighlightedText
        from="top"
        :delay='0.4'
        in-view
      >
        From Top
      </HighlightedText>
    </div>
    <div>
      <HighlightedText
        from="bottom"
        :delay='0.6'
        in-view
      >
        From Bottom
      </HighlightedText>
    </div>
  </div>
</template>
