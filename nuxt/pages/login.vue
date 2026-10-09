<script setup lang="ts">
import { Plane } from 'lucide-vue-next'

const auth = useAuthStore()
const username = ref('')
const password = ref('')

async function submit() {
  if (await auth.login(username.value.trim(), password.value)) await navigateTo('/')
}
</script>

<template>
  <main class="login">
    <div class="brand">
      <div class="logo"><Plane :size="28" /></div>
      <h1>Susi Air</h1>
      <p class="muted">Pilot App</p>
    </div>

    <form class="card" @submit.prevent="submit">
      <label>Username
        <input v-model="username" autocomplete="username" placeholder="Username" required />
      </label>
      <label>Password
        <input v-model="password" type="password" autocomplete="current-password" placeholder="Password" required />
      </label>
      <p v-if="auth.error" class="error" role="alert">{{ auth.error }}</p>
      <button class="btn-primary" :disabled="auth.loading">
        {{ auth.loading ? 'Signing in…' : 'Sign In' }}
      </button>
    </form>
  </main>
</template>

<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;
.login { padding: 64px 20px; }
.brand {
  text-align: center; margin-bottom: 32px;
  .logo { width: 56px; height: 56px; border-radius: 16px; background: $navy; color: #fff; display: grid; place-items: center; margin: 0 auto 12px; }
  h1 { font-size: 24px; font-weight: 800; }
}
form { display: grid; gap: 16px; }
label { display: grid; gap: 6px; font-size: 13px; font-weight: 600; }
input {
  padding: 12px 14px; border: 1px solid #e2e5ea; border-radius: 12px; font: inherit; font-size: 15px;
  &:focus { outline: 2px solid rgba($red, 0.35); border-color: $red; }
}
.error { background: rgba($danger, 0.1); color: $danger; padding: 10px 12px; border-radius: 10px; font-size: 13px; font-weight: 600; }
</style>
