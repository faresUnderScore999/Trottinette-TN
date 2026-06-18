<template>
  <div class="max-w-md mx-auto">
    <div class="bg-white rounded-lg shadow p-8">
      <h1 class="text-3xl font-bold mb-6 text-center">{{ isLogin ? 'Login' : 'Register' }}</h1>

      <form @submit.prevent="submitForm" class="space-y-4">
        <div v-if="!isLogin">
          <label class="block text-sm font-bold mb-2">First Name</label>
          <input
            v-model="form.firstName"
            type="text"
            class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>

        <div v-if="!isLogin">
          <label class="block text-sm font-bold mb-2">Last Name</label>
          <input
            v-model="form.lastName"
            type="text"
            class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-bold mb-2">Email</label>
          <input
            v-model="form.email"
            type="email"
            class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-bold mb-2">Password</label>
          <input
            v-model="form.password"
            type="password"
            class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>

        <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {{ isLoading ? 'Loading...' : isLogin ? 'Login' : 'Register' }}
        </button>
      </form>

      <div class="text-center mt-6">
        <button @click="isLogin = !isLogin" class="text-blue-600 hover:underline">
          {{ isLogin ? "Don't have an account? Register" : 'Already have an account? Login' }}
        </button>
      </div>

      <!-- Demo Credentials -->
      <div class="mt-8 bg-blue-50 rounded p-4">
        <h3 class="font-bold mb-2">Demo Credentials:</h3>
        <div class="text-sm space-y-1">
          <p><strong>Customer:</strong> customer@example.com / password123</p>
          <p><strong>Admin:</strong> admin@example.com / password123</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
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
  } catch (err) {
    error.value = authStore.error || 'Something went wrong'
  } finally {
    isLoading.value = false
  }
}
</script>
