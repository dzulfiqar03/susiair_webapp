<script setup lang="ts">
import { ChevronLeft } from 'lucide-vue-next'
const route = useRoute()
</script>

<template>
  <main style="padding: 24px 20px">
    <NuxtLink to="/schedule" style="display: inline-flex; align-items: center; gap: 4px; color: #0e2138; text-decoration: none; font-weight: 600">
      <ChevronLeft :size="18" /> Back
    </NuxtLink>
    <h1 style="margin: 24px 0 8px">{{ route.params.date }}</h1>
    <p class="muted">Detail page coming soon</p>
  </main>
</template>
