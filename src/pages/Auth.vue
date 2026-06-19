<template>
  <div class="flex min-h-[80vh] items-center justify-center px-4 py-12">
    <div class="w-full max-w-md space-y-8">
      <div class="text-center">
        <div
          class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white"
        >
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <h1 class="mt-6 text-3xl font-extrabold tracking-tight text-slate-900">
          {{ isLogin ? 'Welcome back' : 'Create your account' }}
        </h1>
        <p class="mt-2 text-sm text-slate-500">
          {{
            isLogin
              ? "Don't have an account? Register instead"
              : 'Already have an account? Login instead'
          }}
        </p>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/40">
        <form @submit.prevent="submitForm" class="space-y-5">
          <div v-if="!isLogin" class="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">First Name</label>
              <input
                v-model="form.firstName"
                type="text"
                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">Last Name</label>
              <input
                v-model="form.lastName"
                type="text"
                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
            <input
              v-model="form.email"
              type="email"
              class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
            <input
              v-model="form.password"
              type="password"
              class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
            />
          </div>

          <div v-if="error" class="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-slate-900/20 transition hover:bg-blue-600 hover:shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <div
              v-else
              class="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
            ></div>
            {{ isLoading ? 'Loading...' : isLogin ? 'Login' : 'Register' }}
          </button>
        </form>

        <div class="mt-6 text-center">
          <button
            @click="isLogin = !isLogin"
            class="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
          >
            {{ isLogin ? "Don't have an account? Register" : 'Already have an account? Login' }}
          </button>
        </div>

        <div class="mt-6 rounded-xl bg-slate-50 p-4">
          <h3 class="mb-2 text-sm font-bold text-slate-900">Demo Credentials:</h3>
          <div class="space-y-1 text-xs text-slate-600">
            <p><strong>Customer:</strong> customer@example.com / password123</p>
            <p><strong>Admin:</strong> admin@example.com / password123</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/ecommerce.js'

const router = useRouter()
const authStore = useAuthStore()

const isLogin = ref(true)
const isLoading = ref(false)
const error = ref('')

const form = ref({
  email: '',
  password: '',
  firstName: '',
  lastName: '',
})

watch(isLogin, () => {
  error.value = ''
  form.value = { email: '', password: '', firstName: '', lastName: '' }
})

const submitForm = async () => {
  isLoading.value = true
  error.value = ''

  try {
    if (isLogin.value) {
      await authStore.login(form.value.email, form.value.password)
    } else {
      await authStore.register(
        form.value.email,
        form.value.password,
        form.value.firstName,
        form.value.lastName,
      )
    }
    router.push('/')
  } catch {
    error.value = authStore.error || 'Something went wrong'
  } finally {
    isLoading.value = false
  }
}
</script>
