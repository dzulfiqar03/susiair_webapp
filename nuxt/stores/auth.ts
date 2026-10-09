import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const token = useCookie<string | null>('token', { maxAge: 60 * 60 * 12 })
  const loading = ref(false)
  const error = ref('')
  const api = useApi()

  async function login(username: string, password: string) {
    loading.value = true
    error.value = ''
    try {
      const res = await api<{ accessToken: string }>('/auth/login', {
        method: 'POST',
        body: { username, password },
      })
      token.value = res.accessToken
      return true
    } catch (e: any) {
      const status = e?.statusCode ?? e?.response?.status
      error.value =
        status === 401
          ? 'Username atau password salah. Silakan coba lagi.'
          : status === 400
            ? 'Username dan password wajib diisi.'
            : 'Tidak dapat terhubung ke server. Coba lagi nanti.'
      return false
    } finally {
      loading.value = false
    }
  }

  function logout() {
    token.value = null
    navigateTo('/login')
  }

  return { token, loading, error, login, logout }
})
