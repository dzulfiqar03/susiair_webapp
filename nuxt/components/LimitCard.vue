<script setup lang="ts">
import type { LimitCardData } from '~/types'
const props = defineProps<{ card: LimitCardData }>()
const color = computed(() =>
  props.card.percent >= 100 ? '#e63757' : props.card.percent >= 80 ? '#f59e0b' : '#1fbf8f',
)
</script>

<template>
  <div class="card lc">
    <span class="muted">{{ card.label }}</span>
    <p class="num">{{ card.hours }}<small> / {{ card.limit }} h</small></p>
    <div class="bar"><i :style="{ width: Math.min(card.percent, 100) + '%', background: color }" /></div>
    <span class="pct" :style="{ color }">{{ card.percent }}%</span>
  </div>
</template>

<style scoped lang="scss">
.lc { padding: 14px; p { font-size: 22px; margin: 4px 0 10px; small { font-size: 12px; color: #6b7280; font-weight: 600; } } }
.bar { height: 6px; background: #eef0f3; border-radius: 99px; overflow: hidden; i { display: block; height: 100%; border-radius: 99px; } }
.pct { font-size: 11px; font-weight: 700; display: block; margin-top: 6px; }
</style>
