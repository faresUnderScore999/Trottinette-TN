<template>
  <div class="min-h-screen bg-slate-50/50 py-12">
    <div class="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-3xl font-extrabold tracking-tight text-slate-900">👤 My Profile</h1>
        <p class="mt-1 text-sm text-slate-500">Manage your personal information</p>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/40">
        <form @submit.prevent="updateProfile" class="p-6 sm:p-8 space-y-6">
          <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">First Name</label>
              <input
                v-model="form.first_name"
                type="text"
                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">Last Name</label>
              <input
                v-model="form.last_name"
                type="text"
                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </div>
            <div class="sm:col-span-2">
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
              <input
                :value="form.email"
                type="email"
                disabled
                class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500 shadow-sm cursor-not-allowed"
              />
              <p class="mt-1 text-xs text-slate-400">Email cannot be changed</p>
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">Phone</label>
              <input
                v-model="form.phone"
                type="tel"
                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="+216 XX XXX XXX"
              />
            </div>
            <div class="sm:col-span-2">
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">Address</label>
              <input
                v-model="form.address"
                type="text"
                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="123 Main St"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">City</label>
              <input
                v-model="form.city"
                type="text"
                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="Tunis"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">Postal Code</label>
              <input
                v-model="form.postal_code"
                type="text"
                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="1000"
              />
            </div>
            <div class="sm:col-span-2">
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">Country</label>
              <input
                v-model="form.country"
                type="text"
                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="Tunisia"
              />
            </div>
          </div>

          <div
            v-if="success"
            class="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
          >
            Profile updated successfully!
          </div>

          <div v-if="error" class="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {{ error }}
          </div>

          <div class="flex flex-col gap-3">
            <button
              type="submit"
              :disabled="isLoading"
              class="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-slate-900/20 transition hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                v-if="!isLoading"
                class="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <div
                v-else
                class="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
              ></div>
              {{ isLoading ? 'Saving...' : 'Save Changes' }}
            </button>
            <router-link
              to="/orders"
              class="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
            >
              View My Orders
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/ecommerce.js'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const isLoading = ref(false)
const success = ref(false)
const error = ref('')

const form = ref({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postal_code: '',
  country: '',
})

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  await loadProfile()
})

const loadProfile = async () => {
  try {
    const profile = await authStore.getProfile()
    const user = authStore.user || {}
    form.value = {
      first_name: profile.first_name || user.first_name || '',
      last_name: profile.last_name || user.last_name || '',
      email: profile.email || user.email || '',
      phone: profile.phone || '',
      address: profile.address || '',
      city: profile.city || '',
      postal_code: profile.postal_code || '',
      country: profile.country || '',
    }
  } catch {
    error.value = 'Failed to load profile'
  }
}

const updateProfile = async () => {
  isLoading.value = true
  success.value = false
  error.value = ''
  try {
    const updated = await authStore.updateProfile(form.value)
    if (updated) {
      success.value = true
    } else {
      error.value = authStore.error || 'Failed to update profile'
    }
  } catch {
    error.value = 'Failed to update profile'
  } finally {
    isLoading.value = false
  }
}
</script>
