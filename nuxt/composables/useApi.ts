/** Wrapper $fetch: base URL dari env, sisipkan Bearer token, logout otomatis saat 401. */
export function useApi() {
  const config = useRuntimeConfig()
  const token = useCookie<string | null>('token')

  return async function api<T>(path: string, opts: Record<string, any> = {}): Promise<T> {
    try {
      return await $fetch<T>(path, {
        baseURL: config.public.apiBase,
        ...opts,
        headers: {
          ...(opts.headers || {}),
          ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
        },
      })
    } catch (e: any) {
      const status = e?.statusCode ?? e?.response?.status
      if (status === 401 && path !== '/auth/login') {
        token.value = null
        await navigateTo('/login')
      }
      throw e
    }
  }
}
