<script setup lang="ts">
import { Marquee } from "@/components/ui"

const notifications = [
    { text: "New message received", time: "2 min ago", type: "info" },
    { text: "Upload completed", time: "5 min ago", type: "success" },
    { text: "Meeting starting soon", time: "10 min ago", type: "warning" },
    { text: "Task completed", time: "15 min ago", type: "success" },
    { text: "New follower", time: "20 min ago", type: "info" },
    { text: "System update available", time: "30 min ago", type: "warning" },
]

function cn(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(" ");
}
</script>

<template>
  <div
    class="h-[300px]"
  >
    <Marquee
      direction="up"
      class="h-full"
    >
      <div
        v-for="(notification, index) in notifications"
        :key='index'
        class="mx-4 my-2 flex items-center gap-3 rounded-md border bg-card p-3"
      >
        <div
          :class='cn("h-2 w-2 rounded-full", notification.type === "success" &amp;&amp; "bg-green-500", notification.type === "warning" &amp;&amp; "bg-yellow-500", notification.type === "info" &amp;&amp; "bg-blue-500")'
        ></div>
        <div
          class="flex-1"
        >
          <p
            class="text-sm font-medium"
          >
            {{ notification.text }}
          </p>
          <p
            class="text-xs text-muted-foreground"
          >
            {{ notification.time }}
          </p>
        </div>
      </div>
    </Marquee>
  </div>
</template>
