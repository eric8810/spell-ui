<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage, Marquee } from "@/components/ui"

const users = [
    { id: "alice", name: "Alice", role: "Product Manager", initials: "AL" },
    { id: "bob", name: "Bob", role: "Software Engineer", initials: "BO" },
    { id: "carol", name: "Carol", role: "UX Designer", initials: "CA" },
    { id: "david", name: "David", role: "Data Scientist", initials: "DA" },
    { id: "emma", name: "Emma", role: "Marketing Lead", initials: "EM" },
    { id: "frank", name: "Frank", role: "DevOps Engineer", initials: "FR" },
    { id: "grace", name: "Grace", role: "Design Engineer", initials: "GR" },
    { id: "henry", name: "Henry", role: "QA Specialist", initials: "HE" },
]
</script>

<template>
  <Marquee
    pause-on-hover
    class="py-4"
  >
    <div
      v-for="user in users"
      :key='user.id'
      class="mx-2 border shadow-xs p-3 rounded-md flex gap-3"
    >
      <Avatar
        class="border size-9 my-auto"
      >
        <AvatarImage
          :src='`https://api.dicebear.com/9.x/dylan/svg?backgroundColor=b6e3f4,c0aede,d1d4f9&amp;seed=${user.id}`'
          :alt='`@${user.id}`'
        />
        <AvatarFallback>
          {{ user.initials }}
        </AvatarFallback>
      </Avatar>
      <div
        class="flex flex-col justify-between"
      >
        <h1
          class="font-medium text-sm"
        >
          {{ user.name }}
        </h1>
        <p
          class="text-xs text-muted-foreground"
        >
          {{ user.role }}
        </p>
      </div>
    </div>
  </Marquee>
</template>
