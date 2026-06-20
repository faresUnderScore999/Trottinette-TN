<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Header/Navigation (unchanged) -->
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
          <!-- Language Selector (always visible) -->
          <div id="google_translate_element" class="sm:block"></div>
          <!-- Mobile menu button -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="sm:hidden rounded-xl p-2 text-slate-700 transition hover:bg-slate-100"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <!-- Contact Link (desktop) -->
          <router-link
            to="/contact"
            class="hidden sm:inline-flex rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 items-center gap-1.5"
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

          <!-- Categories dropdown (desktop) -->
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

          <!-- Mobile menu items (fixed) -->
          <div
            v-if="mobileMenuOpen"
            class="absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-lg sm:hidden z-50"
          >
            <div class="container mx-auto px-4 py-4 flex flex-col gap-2">
              <router-link
                to="/contact"
                class="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 flex items-center gap-2"
                @click="mobileMenuOpen = false"
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

              <div class="border-t border-slate-100 pt-2">
                <p class="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Categories
                </p>
                <router-link
                  v-for="cat in categories"
                  :key="cat.id"
                  :to="`/products?category=${cat.slug}`"
                  class="block px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 rounded-lg"
                  @click="mobileMenuOpen = false"
                >
                  {{ cat.name }}
                </router-link>
              </div>
            </div>
          </div>

          <!-- Auth/Account (unchanged) -->
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
                >Admin Panel</router-link
              >
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

    <!-- Footer (unchanged) -->
    <footer class="bg-slate-900 text-white mt-16">
      <!-- ... footer content ... -->
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore, useCartStore } from './stores/ecommerce.js'
import { productsAPI } from './services/api.js'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const route = useRoute()

const categories = ref([])
const searchQuery = ref('')
const mobileMenuOpen = ref(false)

// --- Google Translate init helpers ---
const initGoogleTranslate = (elementId) => {
  if (window.google && window.google.translate) {
    new window.google.translate.TranslateElement(
      {
        pageLanguage: 'en',
        includedLanguages: 'en,ar,fr',
        layout: window.google.translate.TranslateElement.InlineLayout.HORIZONTAL,
        autoDisplay: false,
      },
      elementId,
    )
    return true
  }
  return false
}

// --- Lifecycle ---
onMounted(async () => {
  // 1. Auth & cart
  authStore.loadFromStorage()
  if (authStore.isAuthenticated) {
    await cartStore.fetchCart()
  }

  // 2. Fetch categories
  try {
    const { data } = await productsAPI.getCategories()
    categories.value = data
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }

  // 3. Init desktop Google Translate (once the script is loaded)
  // The script in index.html calls googleTranslateElementInit() which will attach to #google_translate_element.
  // But we also need to ensure it works – the script is loaded separately, so we can rely on that.
  // However, if the script loads after this mounted, we can retry.
  // We'll also try to init it ourselves as fallback.
  const tryInitDesktop = () => {
    const desktopEl = document.getElementById('google_translate_element')
    if (desktopEl && !desktopEl.hasChildNodes()) {
      initGoogleTranslate('google_translate_element')
    }
  }

  // Try immediately; if fails, wait for script
  if (!tryInitDesktop()) {
    // If google is not yet defined, wait for it
    const checkGoogle = setInterval(() => {
      if (window.google && window.google.translate) {
        tryInitDesktop()
        clearInterval(checkGoogle)
      }
    }, 200)
    // Safety: clear after 5s
    setTimeout(() => clearInterval(checkGoogle), 5000)
  }
})

// --- Search & logout (unchanged) ---
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
