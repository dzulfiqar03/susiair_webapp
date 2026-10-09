<script setup lang="ts">
import { ChevronLeft, ChevronRight, Check } from 'lucide-vue-next'
import type { ScheduleItem } from '~/types'

const s = useScheduleStore()
await useAsyncData('schedule', async () => { await s.load(); return true })

const monthName = computed(() =>
  new Date(Date.UTC(s.year, s.month - 1, 1)).toLocaleString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' }),
)

type Cell = { day: number; iso: string; item?: ScheduleItem } | null
const cells = computed<Cell[]>(() => {
  const first = new Date(Date.UTC(s.year, s.month - 1, 1)).getUTCDay() // 0 = Minggu
  const days = new Date(Date.UTC(s.year, s.month, 0)).getUTCDate()
  const byDate = new Map(s.items.map((i) => [i.duty_date, i]))
  const out: Cell[] = Array(first).fill(null)
  for (let d = 1; d <= days; d++) {
    const iso = `${s.year}-${String(s.month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    out.push({ day: d, iso, item: byDate.get(iso) })
  }
  return out
})
</script>

<template>
  <main class="sch">
    <div class="head">
      <button aria-label="Previous month" @click="s.shift(-1)"><ChevronLeft /></button>
      <h1>{{ monthName }}</h1>
      <button aria-label="Next month" @click="s.shift(1)"><ChevronRight /></button>
    </div>

    <p v-if="s.error" class="err" role="alert">{{ s.error }}</p>

    <div class="card" :class="{ dim: s.loading }">
      <div class="grid dow"><span v-for="(d, i) in ['S', 'M', 'T', 'W', 'T', 'F', 'S']" :key="i">{{ d }}</span></div>
      <div class="grid">
        <template v-for="(c, i) in cells" :key="i">
          <span v-if="!c" />
          <NuxtLink
            v-else :to="`/schedule/${c.iso}`" class="cell"
            :style="c.item ? { background: c.item.base_color, color: '#fff' } : {}"
          >
            <b class="num">{{ c.day }}</b>
            <small v-if="c.item">{{ c.item.base_name }}</small>
            <i v-if="c.item" class="status">
              <Check v-if="c.item.count_logbooks === c.item.count_schedules" :size="12" />
              <template v-else>{{ c.item.remaining }}</template>
            </i>
          </NuxtLink>
        </template>
      </div>
    </div>

    <ul class="legend">
      <li v-for="l in s.legend" :key="l.code">
        <i :style="{ background: l.color }" />{{ l.label }} <span class="muted">({{ l.code }})</span>
      </li>
    </ul>
    <BottomNav />
  </main>
</template>

<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;
.sch { padding: 24px 16px 100px; }
.err { background: rgba($danger, 0.1); color: $danger; padding: 10px 12px; border-radius: 10px; font-size: 13px; font-weight: 600; margin-bottom: 12px; }
.head {
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;
  h1 { font-size: 18px; font-weight: 800; }
  button { width: 36px; height: 36px; border-radius: 50%; background: #fff; box-shadow: $shadow; display: grid; place-items: center; }
}
.dim { opacity: 0.5; transition: opacity 0.2s; }
.grid {
  display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px;
  &.dow { margin-bottom: 8px; text-align: center; font-size: 11px; font-weight: 700; color: $text-secondary; }
}
.cell {
  position: relative; aspect-ratio: 1; border-radius: 10px; background: $bg; color: $navy; text-decoration: none;
  display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1.1;
  b { font-size: 13px; }
  small { font-size: 8.5px; font-weight: 700; opacity: 0.9; }
  .status {
    position: absolute; top: 3px; right: 3px; min-width: 14px; height: 14px; border-radius: 99px;
    background: rgba(255, 255, 255, 0.9); color: $navy; font-size: 9px; font-weight: 800; font-style: normal;
    display: grid; place-items: center; padding: 0 3px;
  }
}
.legend {
  list-style: none; display: grid; grid-template-columns: 1fr 1fr; gap: 8px 12px; margin-top: 16px; font-size: 12px; font-weight: 600;
  li { display: flex; align-items: center; gap: 8px; }
  i { width: 12px; height: 12px; border-radius: 4px; flex-shrink: 0; }
}
</style>
