<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Header/Navigation -->
    <nav class="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <router-link to="/" class="flex items-center gap-2">
          <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <span class="text-xl font-bold text-slate-900 hidden sm:inline">Trottinette TN</span>
        </router-link>

        <div class="flex-1 mx-4 max-w-md hidden sm:block">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search products..."
              class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 pl-10 text-sm text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              @keyup.enter="handleSearch"
            />
            <svg
              class="absolute left-3 top-2.5 h-4 w-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div class="flex items-center gap-1">
          <!-- Contact Link -->
          <router-link
            to="/contact"
            class="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 hidden sm:inline-flex items-center gap-1.5"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Contact
          </router-link>

          <!-- Categories dropdown -->
          <div class="relative group hidden sm:block">
            <button
              class="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
            >
              &#128722; Categories
            </button>
            <div
              class="absolute right-0 mt-1 w-48 rounded-xl border border-slate-100 bg-white py-2 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
            >
              <router-link
                v-for="cat in categories"
                :key="cat.id"
                :to="`/products?category=${cat.slug}`"
                class="block px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
              >
                {{ cat.name }}
              </router-link>
            </div>
          </div>

          <!-- Auth/Account -->
          <div v-if="authStore.isAuthenticated" class="relative group">
            <button
              class="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 flex items-center gap-2"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span class="hidden sm:inline">Account</span>
            </button>
            <div
              class="absolute right-0 mt-1 w-48 rounded-xl border border-slate-100 bg-white py-2 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
            >
              <router-link
                to="/profile"
                class="block px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                >Profile</router-link
              >
              <router-link
                to="/orders"
                class="block px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                >Orders</router-link
              >
              <router-link
                v-if="authStore.isAdmin"
                to="/admin"
                class="block px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 border-t border-slate-100"
              >
                Admin Panel
              </router-link>
              <button
                @click="logout"
                class="block w-full text-left px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 border-t border-slate-100"
              >
                Logout
              </button>
            </div>
          </div>
          <router-link
            v-else
            to="/login"
            class="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
            >Login</router-link
          >

          <!-- Cart -->
          <router-link
            to="/cart"
            class="relative rounded-xl p-2 text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <span
              v-if="cartStore.cartCount > 0"
              class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
            >
              {{ cartStore.cartCount }}
            </span>
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-1 container mx-auto px-4 py-8 w-full">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="bg-slate-900 text-white mt-16">
      <div class="container mx-auto px-4 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div class="flex items-center gap-2 mb-4">
              <div
                class="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-900"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 class="font-bold text-lg">Trottinette TN</h3>
            </div>
            <p class="text-slate-400 text-sm">
              Your premium destination for electric scooters and parts in Tunisia.
            </p>
          </div>
          <div>
            <h3 class="font-semibold text-white mb-4">Quick Links</h3>
            <ul class="space-y-2.5 text-sm">
              <li>
                <router-link to="/" class="text-slate-400 transition hover:text-white"
                  >Home</router-link
                >
              </li>
              <li>
                <router-link to="/products" class="text-slate-400 transition hover:text-white"
                  >Products</router-link
                >
              </li>
              <li>
                <router-link to="/cart" class="text-slate-400 transition hover:text-white"
                  >Cart</router-link
                >
              </li>
              <li>
                <router-link to="/contact" class="text-slate-400 transition hover:text-white"
                  >Contact</router-link
                >
              </li>
            </ul>
          </div>
          <div>
            <h3 class="font-semibold text-white mb-4">Support</h3>
            <ul class="space-y-2.5 text-sm">
              <li><a href="#" class="text-slate-400 transition hover:text-white">Contact Us</a></li>
              <li><a href="#" class="text-slate-400 transition hover:text-white">FAQ</a></li>
              <li><a href="#" class="text-slate-400 transition hover:text-white">Shipping</a></li>
            </ul>
          </div>
          <div>
            <h3 class="font-semibold text-white mb-4">Contact</h3>
            <p class="text-slate-400 text-sm">Email: info@trottinetteTN.com</p>
            <p class="text-slate-400 text-sm">Phone: +216 XX XXX XXX</p>
          </div>
        </div>
        <div class="border-t border-slate-800 pt-8 text-center text-slate-500 text-sm">
          <p>&copy; 2024 Trottinette Tunisie. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from './stores/ecommerce.js'
import { useCartStore } from './stores/ecommerce.js'
import { productsAPI } from './services/api.js'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const route = useRoute()

const categories = ref([])
const searchQuery = ref('')

onMounted(async () => {
  authStore.loadFromStorage()
  if (authStore.isAuthenticated) {
    await cartStore.fetchCart()
  }
  try {
    const { data } = await productsAPI.getCategories()
    categories.value = data
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }
})

watch(
  () => route.query,
  (newQuery) => {
    if (newQuery.category && !newQuery.search) {
      searchQuery.value = ''
    }
  },
  { deep: true },
)

const handleSearch = () => {
  const query = searchQuery.value.trim()
  if (query) {
    router.push(`/products?search=${encodeURIComponent(query)}`)
  }
}

const logout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<style scoped>
/* Add any scoped styles here */
</style>
