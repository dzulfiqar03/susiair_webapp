<script setup lang="ts">
import type { Summary } from '~/types'
const props = defineProps<{ summary: Summary }>()

const W = 340
const H = 220
const pad = { l: 38, r: 12, t: 16, b: 30 }
const iw = W - pad.l - pad.r
const ih = H - pad.t - pad.b

const x = (i: number) => pad.l + (i / (props.summary.points.length - 1)) * iw
// Clamp: nilai di atas yMax digambar mentok di atas sehingga layout tidak rusak.
const y = (v: number) =>
  pad.t + ih - (Math.min(Math.max(v, 0), props.summary.yMax) / props.summary.yMax) * ih

const coords = computed(() =>
  props.summary.points.map((p, i) => ({
    ...p,
    cx: x(i),
    cy: y(p.rollingSum),
    over: p.rollingSum > props.summary.yMax,
  })),
)
const line = computed(() => coords.value.map((c, i) => `${i ? 'L' : 'M'}${c.cx},${c.cy}`).join(' '))
const area = computed(
  () => `${line.value} L${coords.value[coords.value.length - 1].cx},${pad.t + ih} L${coords.value[0].cx},${pad.t + ih} Z`,
)
const limitY = computed(() => y(props.summary.limit))
const ticks = computed(() => [0, 1, 2, 3, 4].map((i) => Math.round((props.summary.yMax / 4) * i)))
const todayIdx = computed(() => Math.max(coords.value.findIndex((c) => c.isToday), 0))
const label = (d: string) => d.slice(8)

const active = ref<number | null>(null)
const tipX = computed(() => (active.value === null ? 0 : Math.min(Math.max(coords.value[active.value].cx - 52, 2), W - 106)))
const tipY = computed(() => (active.value === null ? 0 : Math.max(coords.value[active.value].cy - 46, 2)))
</script>

<template>
  <svg :viewBox="`0 0 ${W} ${H}`" width="100%" role="img" aria-label="Rolling sum flight hours chart">
    <g v-for="t in ticks" :key="t">
      <line :x1="pad.l" :x2="W - pad.r" :y1="y(t)" :y2="y(t)" stroke="#eef0f3" />
      <text :x="pad.l - 6" :y="y(t) + 4" text-anchor="end" font-size="10" fill="#6b7280">{{ t }}</text>
    </g>

    <line :x1="coords[todayIdx].cx" :x2="coords[todayIdx].cx" :y1="pad.t" :y2="pad.t + ih" stroke="#0e2138" stroke-dasharray="3 3" opacity=".35" />

    <path :d="area" fill="#22c5e8" opacity=".12" />
    <path :d="line" fill="none" stroke="#22c5e8" stroke-width="2.5" stroke-linejoin="round" />

    <line :x1="pad.l" :x2="W - pad.r" :y1="limitY" :y2="limitY" stroke="#e63757" stroke-width="1.5" stroke-dasharray="5 4" />
    <text :x="W - pad.r" :y="limitY - 4" text-anchor="end" font-size="10" font-weight="700" fill="#e63757">Limit {{ summary.limit }}</text>

    <g v-for="(c, i) in coords" :key="c.date" style="cursor: pointer" @click="active = active === i ? null : i">
      <circle :cx="c.cx" :cy="c.cy" r="9" fill="transparent" />
      <circle
        :cx="c.cx" :cy="c.cy" :r="c.isToday ? 5 : 3.5"
        :fill="c.rollingSum > summary.limit ? '#e63757' : '#fff'"
        :stroke="c.rollingSum > summary.limit ? '#e63757' : '#22c5e8'"
        stroke-width="2"
        :stroke-dasharray="c.isFuture ? '2 2' : undefined"
      />
      <text v-if="c.over" :x="c.cx" :y="c.cy + 12" text-anchor="middle" font-size="9" fill="#e63757">▲</text>
    </g>

    <text
      v-for="(c, i) in coords" :key="'l' + c.date"
      :x="c.cx" :y="H - 10" text-anchor="middle" font-size="9.5"
      :font-weight="c.isToday ? 800 : 500" :fill="c.isToday ? '#0e2138' : '#6b7280'"
    >{{ i % 2 === 0 || c.isToday ? label(c.date) : '' }}</text>

    <g v-if="active !== null">
      <rect :x="tipX" :y="tipY" width="104" height="34" rx="8" fill="#0e2138" />
      <text :x="tipX + 52" :y="tipY + 14" text-anchor="middle" font-size="9.5" fill="#fff">{{ coords[active].date }}{{ coords[active].isFuture ? ' (future)' : '' }}</text>
      <text :x="tipX + 52" :y="tipY + 27" text-anchor="middle" font-size="11" font-weight="800" fill="#22c5e8">{{ coords[active].rollingSum }} h</text>
    </g>
  </svg>
</template>
