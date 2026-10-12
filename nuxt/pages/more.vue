<script setup lang="ts">
import { LogOut } from 'lucide-vue-next'

const auth = useAuthStore()
const confirming = ref(false)
const busy = ref(false)

async function signOut() {
  busy.value = true
  await auth.logout()
}
</script>

<template>
  <main class="more">
    <h1>More</h1>

    <section class="card">
      <button v-if="!confirming" class="row" @click="confirming = true">
        <LogOut :size="20" />
        <span>Sign Out</span>
      </button>

      <div v-else class="confirm" role="alertdialog" aria-label="Confirm sign out">
        <p>Keluar dari akun ini?</p>
        <div class="actions">
          <button class="btn-primary" :disabled="busy" @click="signOut">
            {{ busy ? 'Signing out…' : 'Ya, keluar' }}
          </button>
          <button class="btn-ghost" :disabled="busy" @click="confirming = false">Batal</button>
        </div>
      </div>
    </section>

    <BottomNav />
  </main>
</template>

<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;
.more { padding: 24px 16px 100px; h1 { font-size: 22px; font-weight: 800; margin-bottom: 16px; } }
.row {
  display: flex; align-items: center; gap: 12px; width: 100%;
  font-size: 15px; font-weight: 700; color: $danger; padding: 4px 0;
}
.confirm p { font-size: 14px; font-weight: 600; margin-bottom: 14px; }
.actions { display: grid; gap: 10px; }
.btn-ghost {
  padding: 13px 24px; border-radius: 999px; font-size: 15px; font-weight: 700;
  border: 1px solid #e2e5ea; background: #fff;
  &:disabled { opacity: 0.6; }
}
</style>
