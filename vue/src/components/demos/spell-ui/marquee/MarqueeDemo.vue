<script setup lang="ts">
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Marquee,
} from '@/components/ui'
import { cn } from '@/lib/utils'

interface Props {
  variant?: 'default' | 'pause' | 'vertical'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})

const logos = [
  { src: './logos/vercel.svg', alt: 'Vercel logo' },
  { src: './logos/google.svg', alt: 'Google logo' },
  { src: './logos/framer.svg', alt: 'Framer logo' },
  { src: './logos/discord.svg', alt: 'Discord logo' },
  { src: './logos/openai.svg', alt: 'OpenAI logo' },
  { src: './logos/phantom.svg', alt: 'Phantom logo' },
  { src: './logos/descript.svg', alt: 'Descript logo' },
  { src: './logos/netflix.svg', alt: 'Netflix logo' },
  { src: './logos/linear.svg', alt: 'Linear logo' },
  { src: './logos/notion.svg', alt: 'Notion logo' },
  { src: './logos/shopify.svg', alt: 'Shopify logo' },
  { src: './logos/duolingo.svg', alt: 'Duolingo logo' },
  { src: './logos/ramp.svg', alt: 'Ramp logo' },
  { src: './logos/tesla.svg', alt: 'Tesla logo' },
  { src: './logos/opensea.svg', alt: 'OpenSea logo' },
  { src: './logos/cursor.svg', alt: 'Cursor logo' },
]

const users = [
  { id: 'alice', name: 'Alice', role: 'Product Manager', initials: 'AL' },
  { id: 'bob', name: 'Bob', role: 'Software Engineer', initials: 'BO' },
  { id: 'carol', name: 'Carol', role: 'UX Designer', initials: 'CA' },
  { id: 'david', name: 'David', role: 'Data Scientist', initials: 'DA' },
  { id: 'emma', name: 'Emma', role: 'Marketing Lead', initials: 'EM' },
  { id: 'frank', name: 'Frank', role: 'DevOps Engineer', initials: 'FR' },
  { id: 'grace', name: 'Grace', role: 'Design Engineer', initials: 'GR' },
  { id: 'henry', name: 'Henry', role: 'QA Specialist', initials: 'HE' },
]

const notifications = [
  { text: 'New message received', time: '2 min ago', type: 'info' },
  { text: 'Upload completed', time: '5 min ago', type: 'success' },
  { text: 'Meeting starting soon', time: '10 min ago', type: 'warning' },
  { text: 'Task completed', time: '15 min ago', type: 'success' },
  { text: 'New follower', time: '20 min ago', type: 'info' },
  { text: 'System update available', time: '30 min ago', type: 'warning' },
]
</script>

<template>
  <div v-if="props.variant === 'pause'">
    <Marquee pause-on-hover class="py-4">
      <div
        v-for="user in users"
        :key="user.id"
        class="mx-2 flex gap-3 rounded-md border p-3 shadow-xs"
      >
        <Avatar class="my-auto size-9 border">
          <AvatarImage
            :src="`https://api.dicebear.com/9.x/dylan/svg?backgroundColor=b6e3f4,c0aede,d1d4f9&seed=${user.id}`"
            :alt="`@${user.id}`"
          />
          <AvatarFallback>{{ user.initials }}</AvatarFallback>
        </Avatar>
        <div class="flex flex-col justify-between">
          <h1 class="text-sm font-medium">{{ user.name }}</h1>
          <p class="text-xs text-muted-foreground">{{ user.role }}</p>
        </div>
      </div>
    </Marquee>
  </div>

  <div v-else-if="props.variant === 'vertical'" class="h-[300px]">
    <Marquee direction="up" class="h-full">
      <div
        v-for="(notification, index) in notifications"
        :key="index"
        class="mx-4 my-2 flex items-center gap-3 rounded-md border bg-card p-3"
      >
        <div
          :class="
            cn(
              'h-2 w-2 rounded-full',
              notification.type === 'success' && 'bg-green-500',
              notification.type === 'warning' && 'bg-yellow-500',
              notification.type === 'info' && 'bg-blue-500',
            )
          "
        />
        <div class="flex-1">
          <p class="text-sm font-medium">{{ notification.text }}</p>
          <p class="text-xs text-muted-foreground">{{ notification.time }}</p>
        </div>
      </div>
    </Marquee>
  </div>

  <Marquee v-else class="flex py-4" :duration="40">
    <img
      v-for="logo in logos"
      :key="logo.src"
      :src="logo.src"
      :alt="logo.alt"
      class="mx-8 h-24 w-24 select-none object-contain opacity-70 pointer-events-none not-dark:invert-100"
    />
  </Marquee>
</template>
