import { defineStore } from 'pinia'
import type { Doc, Pilot, RangeKey, Summary } from '~/types'

export const useHomeStore = defineStore('home', () => {
  const api = useApi()
  const pilot = ref<Pilot | null>(null)
  const documents = ref<Doc[]>([])
  const summary = ref<Summary | null>(null)
  const range = ref<RangeKey>('1w')
  const loading = ref(false)
  const chartLoading = ref(false)
  const error = ref('')

  async function loadSummary() {
    chartLoading.value = true
    try {
      summary.value = await api<Summary>('/flight-hours/summary', { query: { range: range.value } })
    } finally {
      chartLoading.value = false
    }
  }

  async function loadAll() {
    loading.value = true
    error.value = ''
    try {
      const [p, d] = await Promise.all([
        api<Pilot>('/pilot/me'),
        api<{ documents: Doc[] }>('/documents'),
      ])
      pilot.value = p
      documents.value = d.documents
      await loadSummary()
    } catch {
      error.value = 'Gagal memuat data. Periksa koneksi lalu coba lagi.'
    } finally {
      loading.value = false
    }
  }

  async function setRange(r: RangeKey) {
    range.value = r
    await loadSummary()
  }

  return { pilot, documents, summary, range, loading, chartLoading, error, loadAll, setRange }
})
