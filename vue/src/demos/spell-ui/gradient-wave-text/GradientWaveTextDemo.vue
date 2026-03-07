<script setup lang="ts"></script>

<template>
  <p class="spell-gradient-wave text-3xl font-medium tracking-[-.03em] md:text-5xl">
    Just ship things.
  </p>
</template>

<style scoped>
.spell-gradient-wave {
  --gradient-wave-base: rgb(29, 29, 31);
  background-image: radial-gradient(
    circle at 50% bottom,
    var(--gradient-wave-base) 0%,
    #8d6869 10%,
    #5a8ea6 18%,
    #b9c96e 26%,
    #c7c571 34%,
    #cb706f 42%,
    #7e5e5f 50%,
    var(--gradient-wave-base) 60%
  );
  background-size: 220% 220%;
  background-position: 0% 100%;
  color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
  animation: spell-gradient-wave 4.5s linear infinite;
}

:global(.dark) .spell-gradient-wave {
  --gradient-wave-base: rgb(255, 255, 255);
}

@keyframes spell-gradient-wave {
  0% {
    background-position: 0% 100%;
  }

  100% {
    background-position: 200% 100%;
  }
}
</style>
