<script setup lang="ts">
import type { RangeKey } from '~/types'

const home = useHomeStore()
await useAsyncData('home', async () => { await home.loadAll(); return true })

const ranges: RangeKey[] = ['1w', '1m', '3m', '6m', '1y']

// Sapaan hanya kosmetik (client-side), tidak dipakai untuk logika data.
const greeting = ref('Hello')
onMounted(() => {
  const h = new Date().getHours()
  greeting.value = h < 11 ? 'Good morning' : h < 15 ? 'Good afternoon' : h < 19 ? 'Good evening' : 'Good night'
})

const badge = { safe: 'Safe', soon: 'Expiring soon', expired: 'Expired' } as const
const fmt = (d: string) =>
  new Date(d + 'T00:00:00Z').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' })
</script>

<template>
  <main class="home">
    <p v-if="home.error" class="err" role="alert">{{ home.error }}</p>

    <header v-if="home.pilot">
      <div>
        <p class="muted">{{ greeting }},</p>
        <h1>{{ home.pilot.name }}</h1>
        <p class="muted">Total flight hours <b class="num">{{ home.pilot.totalFlightHours }}</b></p>
      </div>
      <img :src="home.pilot.avatarUrl" alt="Pilot avatar" />
    </header>
    <div v-else class="card skeleton" style="height: 90px" />

    <h2 class="section-title">Hours to Limit</h2>
    <div v-if="home.summary" class="cards">
      <LimitCard v-for="c in home.summary.cards" :key="c.key" :card="c" />
    </div>

    <section class="card chart">
      <div class="toggle">
        <button v-for="r in ranges" :key="r" :class="{ on: home.range === r }" @click="home.setRange(r)">{{ r }}</button>
      </div>
      <div class="chart-body" :class="{ dim: home.chartLoading }">
        <TrendChart v-if="home.summary" :summary="home.summary" />
      </div>
      <p v-if="home.summary" class="muted">
        Rolling {{ home.summary.windowDays }} days · limit {{ home.summary.limit }} h
      </p>
    </section>

    <h2 class="section-title">My Documents</h2>
    <ul class="docs">
      <li v-for="d in home.documents" :key="d.id" class="card">
        <div><b>{{ d.label }}</b><p class="muted">{{ fmt(d.expiryDate) }}</p></div>
        <span class="badge" :class="d.status">{{ badge[d.status] }}</span>
      </li>
    </ul>

    <BottomNav />
  </main>
</template>

<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;
.home { padding: 24px 16px 100px; }
.err { background: rgba($danger, 0.1); color: $danger; padding: 10px 12px; border-radius: 10px; font-size: 13px; font-weight: 600; margin-bottom: 12px; }
header {
  display: flex; justify-content: space-between; align-items: center;
  h1 { font-size: 22px; font-weight: 800; margin: 2px 0; }
  img { width: 56px; height: 56px; border-radius: 50%; object-fit: cover; border: 3px solid #fff; box-shadow: $shadow; }
}
.cards { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
.toggle {
  display: flex; gap: 6px; background: $bg; padding: 4px; border-radius: 999px; margin-bottom: 8px;
  button {
    flex: 1; padding: 7px 0; border-radius: 999px; font-size: 13px; font-weight: 700; color: $text-secondary;
    &.on { background: $navy; color: #fff; }
  }
}
.chart-body { transition: opacity 0.2s; &.dim { opacity: 0.5; } }
.docs {
  list-style: none; display: grid; gap: 10px;
  li { display: flex; justify-content: space-between; align-items: center; padding: 14px 16px; b { font-size: 14px; } }
}
.badge {
  font-size: 11px; font-weight: 700; padding: 5px 10px; border-radius: 999px; white-space: nowrap;
  &.safe { background: rgba($success, 0.15); color: #12906a; }
  &.soon { background: rgba($warning, 0.18); color: #b87305; }
  &.expired { background: rgba($danger, 0.14); color: $danger; }
}
.skeleton { background: linear-gradient(90deg, #eceef1, #f7f8fa, #eceef1); }
</style>
