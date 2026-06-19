<template>
  <div class="space-y-16">
    <!-- Hero Section -->
    <div
      class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 px-6 py-20 shadow-2xl"
    >
      <div
        class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2Zy4uLgo=')] opacity-10"
      ></div>
      <div class="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl"></div>
      <div
        class="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-slate-500/20 blur-3xl"
      ></div>
      <div class="relative mx-auto max-w-3xl text-center">
        <h1 class="text-5xl font-black tracking-tight text-white md:text-6xl">
          Welcome to Trottinette Tunisie
        </h1>
        <p class="mt-6 text-lg text-blue-200 md:text-xl">Premium Electric Scooters & Accessories</p>
        <div class="mt-8 flex flex-wrap justify-center gap-4">
          <router-link
            to="/products"
            class="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-slate-900 shadow-lg transition hover:scale-105 hover:bg-blue-50"
          >
            Shop Now
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </router-link>
          <router-link
            to="/products"
            class="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-8 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            Browse Categories
          </router-link>
        </div>
      </div>
    </div>

    <!-- Featured Categories -->
    <div>
      <div class="mb-8 flex items-end justify-between">
        <div>
          <h2 class="text-3xl font-extrabold tracking-tight text-slate-900">Shop by Category</h2>
          <p class="mt-1 text-sm text-slate-500">Find exactly what you need</p>
        </div>
      </div>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <router-link
          v-for="cat in categories"
          :key="cat.id"
          :to="`/products?category=${cat.slug}`"
          class="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/40 transition hover:-translate-y-1 hover:shadow-xl"
        >
          <div class="p-6">
            <div
              class="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-2xl transition group-hover:scale-110"
            >
              <span v-if="cat.slug === 'electric-scooters'">🛴</span>
              <span v-else-if="cat.slug === 'batteries'">🔋</span>
              <span v-else-if="cat.slug === 'spare-parts'">⚙️</span>
              <span v-else>🎁</span>
            </div>
            <h3 class="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition">
              {{ cat.name }}
            </h3>
            <p class="mt-1 text-sm text-slate-500">Explore our collection</p>
          </div>
          <div
            class="absolute bottom-0 left-0 h-1 w-0 bg-blue-600 transition-all duration-300 group-hover:w-full"
          ></div>
        </router-link>
      </div>
    </div>

    <!-- Featured Products -->
    <div>
      <div class="mb-8 flex items-end justify-between">
        <div>
          <h2 class="text-3xl font-extrabold tracking-tight text-slate-900">Featured Products</h2>
          <p class="mt-1 text-sm text-slate-500">Handpicked favorites just for you</p>
        </div>
        <router-link
          to="/products"
          class="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
          >View all →</router-link
        >
      </div>
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="product in featuredProducts"
          :key="product.id"
          class="group relative flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/40 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          @click="goToProduct(product.slug)"
        >
          <div class="relative aspect-[4/3] overflow-hidden bg-slate-100">
            <img
              :src="product.image_url"
              :alt="product.name"
              class="h-full w-full object-cover transition duration-500 group-hover:scale-110"
            />
            <div class="absolute top-3 right-3">
              <span
                class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold backdrop-blur-md"
                :class="
                  product.stock > 0
                    ? 'bg-emerald-50/90 text-emerald-700 border border-emerald-200'
                    : 'bg-red-50/90 text-red-700 border border-red-200'
                "
              >
                <span
                  class="h-1.5 w-1.5 rounded-full"
                  :class="product.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'"
                ></span>
                {{ product.stock > 0 ? `${product.stock} in stock` : 'Out of stock' }}
              </span>
            </div>
          </div>
          <div class="flex flex-1 flex-col p-5">
            <p class="mb-2 text-xs font-bold uppercase tracking-wider text-blue-600">
              {{ product.category_name }}
            </p>
            <h3
              class="mb-2 text-base font-bold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition"
            >
              {{ product.name }}
            </h3>
            <p class="mb-4 text-sm text-slate-500 line-clamp-2 flex-1">{{ product.description }}</p>
            <div class="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
              <span class="text-2xl font-black text-slate-900"
                >{{ product.price }}
                <span class="text-sm font-medium text-slate-500">DT</span></span
              >
              <button
                @click.stop="addToCart(product.id)"
                class="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-slate-900/20 transition hover:bg-blue-600 hover:shadow-blue-600/20 active:scale-95"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Why Choose Us -->
    <div
      class="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/40 md:p-12"
    >
      <h2 class="mb-12 text-center text-3xl font-extrabold tracking-tight text-slate-900">
        Why Choose Trottinette Tunisie?
      </h2>
      <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div class="text-center">
          <div
            class="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl"
          >
            🚚
          </div>
          <h3 class="text-lg font-bold text-slate-900">Fast Delivery</h3>
          <p class="mt-2 text-sm text-slate-500">Quick and reliable shipping across Tunisia</p>
        </div>
        <div class="text-center">
          <div
            class="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl"
          >
            🔒
          </div>
          <h3 class="text-lg font-bold text-slate-900">Secure Checkout</h3>
          <p class="mt-2 text-sm text-slate-500">Your payment information is always safe</p>
        </div>
        <div class="text-center">
          <div
            class="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl"
          >
            💬
          </div>
          <h3 class="text-lg font-bold text-slate-900">24/7 Support</h3>
          <p class="mt-2 text-sm text-slate-500">We're here to help anytime you need us</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/ecommerce.js'
import { productsAPI } from '../services/api.js'

const router = useRouter()
const cartStore = useCartStore()

const categories = ref([])
const featuredProducts = ref([])
const isLoading = ref(false)

onMounted(async () => {
  isLoading.value = true
  try {
    const [catsRes, productsRes] = await Promise.all([
      productsAPI.getCategories(),
      productsAPI.getProducts(),
    ])
    categories.value = catsRes.data
    featuredProducts.value = productsRes.data.slice(0, 4)
  } catch (error) {
    console.error('Failed to fetch data:', error)
  } finally {
    isLoading.value = false
  }
})

const goToProduct = (slug) => {
  router.push(`/product/${slug}`)
}

const addToCart = async (productId) => {
  try {
    await cartStore.addToCart(productId, 1)
    alert('Product added to cart!')
  } catch {
    alert('Please login to add items to cart')
  }
}
</script>
