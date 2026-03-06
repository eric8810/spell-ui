<script setup lang="ts">
import { ref } from 'vue'
import {
  Button,
  Input,
  Label,
  Separator,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui'

const inputValue = ref('')
const dialogOpen = ref(false)
</script>

<template>
  <div class="p-8 space-y-6 max-w-lg mx-auto">
    <h1 class="text-2xl font-bold">Spell UI - Vue 3</h1>

    <Separator />

    <div class="space-y-2">
      <Label for="demo-input">Label</Label>
      <Input id="demo-input" v-model="inputValue" placeholder="Type something..." />
    </div>

    <div class="flex gap-2 flex-wrap">
      <Button>Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>

    <div class="flex gap-2">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>

    <Separator />

    <Dialog v-model:open="dialogOpen">
      <DialogTrigger as-child>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>This is a dialog description.</DialogDescription>
        </DialogHeader>
        <div class="py-4">Dialog content goes here.</div>
        <DialogFooter>
          <Button variant="outline" @click="dialogOpen = false">Cancel</Button>
          <Button @click="dialogOpen = false">Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
