<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Header/Navigation -->
    <nav class="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg sticky top-0 z-50">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <router-link to="/" class="flex items-center space-x-2">
          <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M10.5 1.5H5.75A2.25 2.25 0 003.5 3.75v12.5A2.25 2.25 0 005.75 18.5h8.5a2.25 2.25 0 002.25-2.25V8M10.5 1.5v6.5m0-6.5L17 8m-6.5 0L17 1.5"
              stroke="currentColor"
              stroke-width="1.5"
              fill="none"
            />
          </svg>
          <span class="text-xl font-bold hidden sm:inline">Trottinette TN</span>
        </router-link>

        <div class="flex-1 mx-4 max-w-md hidden sm:block">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search products..."
            class="w-full px-4 py-2 rounded text-gray-800 focus:outline-none"
            @keyup.enter="handleSearch"
          />
        </div>

        <div class="flex items-center space-x-4">
          <!-- Categories dropdown -->
          <div class="relative group hidden sm:block">
            <button class="hover:bg-blue-500 px-3 py-2 rounded transition">Categories</button>
            <div
              class="absolute left-0 mt-0 w-48 bg-white text-gray-800 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
            >
              <router-link
                v-for="cat in categories"
                :key="cat.id"
                :to="`/products?category=${cat.slug}`"
                class="block px-4 py-2 hover:bg-gray-100 first:rounded-t last:rounded-b"
              >
                {{ cat.name }}
              </router-link>
            </div>
          </div>

          <!-- Auth/Account -->
          <div v-if="authStore.isAuthenticated" class="relative group">
            <button class="hover:bg-blue-500 px-3 py-2 rounded transition flex items-center">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
              </svg>
            </button>
            <div
              class="absolute right-0 mt-0 w-48 bg-white text-gray-800 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
            >
              <router-link to="/profile" class="block px-4 py-2 hover:bg-gray-100"
                >Profile</router-link
              >
              <router-link to="/orders" class="block px-4 py-2 hover:bg-gray-100"
                >Orders</router-link
              >
              <router-link
                v-if="authStore.isAdmin"
                to="/admin"
                class="block px-4 py-2 hover:bg-gray-100 border-t"
                >Admin Panel</router-link
              >
              <button @click="logout" class="w-full text-left px-4 py-2 hover:bg-gray-100 border-t">
                Logout
              </button>
            </div>
          </div>
          <router-link v-else to="/login" class="hover:bg-blue-500 px-3 py-2 rounded transition"
            >Login</router-link
          >

          <!-- Cart -->
          <router-link
            to="/cart"
            class="relative hover:bg-blue-500 px-3 py-2 rounded transition flex items-center"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 6H6.28l-.31-1.243A1 1 0 005 4H3zM5 16a2 2 0 11-4 0 2 2 0 014 0zm8 0a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span
              v-if="cartStore.cartCount > 0"
              class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
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
    <footer class="bg-gray-900 text-white mt-12">
      <div class="container mx-auto px-4 py-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 class="font-bold text-lg mb-4">About Trottinette TN</h3>
            <p class="text-gray-400 text-sm">
              Your premium destination for electric scooters and parts in Tunisia.
            </p>
          </div>
          <div>
            <h3 class="font-bold text-lg mb-4">Quick Links</h3>
            <ul class="space-y-2 text-sm">
              <li><router-link to="/" class="text-gray-400 hover:text-white">Home</router-link></li>
              <li>
                <router-link to="/products" class="text-gray-400 hover:text-white"
                  >Products</router-link
                >
              </li>
              <li>
                <router-link to="/cart" class="text-gray-400 hover:text-white">Cart</router-link>
              </li>
            </ul>
          </div>
          <div>
            <h3 class="font-bold text-lg mb-4">Support</h3>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="text-gray-400 hover:text-white">Contact Us</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white">FAQ</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white">Shipping</a></li>
            </ul>
          </div>
          <div>
            <h3 class="font-bold text-lg mb-4">Contact</h3>
            <p class="text-gray-400 text-sm">Email: info@trottinetteTN.com</p>
            <p class="text-gray-400 text-sm">Phone: +216 XX XXX XXX</p>
          </div>
        </div>
        <div class="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
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
