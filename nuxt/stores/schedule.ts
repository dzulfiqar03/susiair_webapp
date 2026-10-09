import { defineStore } from 'pinia'
import type { LegendItem, ScheduleItem } from '~/types'

export const useScheduleStore = defineStore('schedule', () => {
  const api = useApi()
  // Bulan awal = bulan "today" menurut brief (Mei 2026); bukan new Date().
  const year = ref(2026)
  const month = ref(5)
  const items = ref<ScheduleItem[]>([])
  const legend = ref<LegendItem[]>([])
  const loading = ref(false)
  const error = ref('')

  async function load() {
    loading.value = true
    error.value = ''
    try {
      const res = await api<{ schedules: ScheduleItem[]; legend: LegendItem[] }>('/schedules', {
        query: { year: year.value, month: month.value },
      })
      items.value = res.schedules
      legend.value = res.legend
    } catch {
      error.value = 'Gagal memuat jadwal.'
    } finally {
      loading.value = false
    }
  }

  async function shift(delta: number) {
    let m = month.value + delta
    let y = year.value
    if (m < 1) { m = 12; y-- }
    else if (m > 12) { m = 1; y++ }
    month.value = m
    year.value = y
    await load()
  }

  return { year, month, items, legend, loading, error, load, shift }
})
