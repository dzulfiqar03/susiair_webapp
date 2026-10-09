<script setup lang="ts">
import { Home, CalendarDays, BookOpen, Menu } from 'lucide-vue-next'
const items = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/schedule', label: 'Schedule', icon: CalendarDays },
  { to: '/logbook', label: 'Logbook', icon: BookOpen },
  { to: '/more', label: 'More', icon: Menu },
]
</script>

<template>
  <nav>
    <NuxtLink v-for="i in items" :key="i.to" :to="i.to" active-class="active">
      <component :is="i.icon" :size="22" /><span>{{ i.label }}</span>
    </NuxtLink>
  </nav>
</template>

<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;
nav {
  position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 480px;
  background: #fff; display: flex; justify-content: space-around; padding: 8px 0 12px;
  box-shadow: 0 -2px 12px rgba($navy, 0.08); z-index: 10;
}
a {
  display: grid; justify-items: center; gap: 2px; font-size: 11px; font-weight: 600;
  color: $text-secondary; text-decoration: none;
  &.active { color: $red; }
}
</style>
