<template>
  <div class="space-y-8">
    <!-- Header -->
    <div
      class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 px-6 py-10 shadow-xl"
    >
      <div
        class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2Zy4uLgo=')] opacity-10"
      ></div>
      <div class="relative flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 class="text-4xl font-extrabold text-white tracking-tight">Products</h1>
          <p class="mt-2 text-blue-200">Find the perfect ride for you</p>
        </div>
        <div class="flex gap-3">
          <button
            @click="sortBy = 'name'"
            :class="[
              'rounded-xl px-5 py-2.5 text-sm font-semibold shadow-sm transition-all duration-200 border',
              sortBy === 'name'
                ? 'bg-white text-slate-900 border-white scale-105'
                : 'bg-white/10 text-white border-white/20 hover:bg-white/20',
            ]"
          >
            Sort by Name
          </button>
          <button
            @click="sortBy = 'price'"
            :class="[
              'rounded-xl px-5 py-2.5 text-sm font-semibold shadow-sm transition-all duration-200 border',
              sortBy === 'price'
                ? 'bg-white text-slate-900 border-white scale-105'
                : 'bg-white/10 text-white border-white/20 hover:bg-white/20',
            ]"
          >
            Sort by Price
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <!-- Sidebar Filter -->
      <div class="lg:col-span-1">
        <div
          class="sticky top-24 rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50 p-6"
        >
          <h2 class="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <svg
              class="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filters
          </h2>
          <div class="space-y-6">
            <div>
              <h3 class="font-semibold text-slate-900 mb-3">Categories</h3>
              <div class="space-y-2.5">
                <label class="flex items-center gap-3 cursor-pointer group">
                  <div class="relative flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      v-model="selectedCategory"
                      @change="selectCategory"
                      class="peer h-4 w-4 appearance-none rounded-full border border-slate-300 transition checked:border-blue-600 checked:bg-blue-600"
                    />
                    <div
                      class="pointer-events-none absolute inset-0 flex items-center justify-center text-white opacity-0 peer-checked:opacity-100"
                    >
                      <div class="h-2 w-2 rounded-full bg-white"></div>
                    </div>
                  </div>
                  <span class="text-sm text-slate-600 group-hover:text-slate-900 transition"
                    >All Categories</span
                  >
                </label>
                <label
                  v-for="cat in categories"
                  :key="cat.id"
                  class="flex items-center gap-3 cursor-pointer group"
                >
                  <div class="relative flex items-center">
                    <input
                      type="radio"
                      name="category"
                      :value="cat.slug"
                      v-model="selectedCategory"
                      @change="selectCategory"
                      class="peer h-4 w-4 appearance-none rounded-full border border-slate-300 transition checked:border-blue-600 checked:bg-blue-600"
                    />
                    <div
                      class="pointer-events-none absolute inset-0 flex items-center justify-center text-white opacity-0 peer-checked:opacity-100"
                    >
                      <div class="h-2 w-2 rounded-full bg-white"></div>
                    </div>
                  </div>
                  <span class="text-sm text-slate-600 group-hover:text-slate-900 transition">{{
                    cat.name
                  }}</span>
                </label>
              </div>
            </div>

            <div>
              <h3 class="font-semibold text-slate-900 mb-3">Price Range</h3>
              <input
                v-model.number="priceRange"
                type="range"
                min="0"
                max="1000"
                @change="filterByPrice"
                class="w-full h-2 rounded-full bg-slate-100 appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition"
              />
              <div class="mt-3 flex items-center justify-between">
                <span class="text-xs text-slate-500">Max price</span>
                <span class="text-sm font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-md"
                  >{{ priceRange }} DT</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Products Grid -->
      <div class="lg:col-span-4">
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
          <div
            class="h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600"
          ></div>
          <p class="mt-4 text-sm font-medium text-slate-500">Loading products...</p>
        </div>

        <div
          v-else-if="filteredProducts.length === 0"
          class="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-slate-300 bg-slate-50/50"
        >
          <svg
            class="w-16 h-16 text-slate-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <p class="mt-4 text-lg font-medium text-slate-600">No products found</p>
          <p class="mt-1 text-sm text-slate-500">Try adjusting your filters or search query</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div
            v-for="product in filteredProducts"
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
              <p class="mb-4 text-sm text-slate-500 line-clamp-2 flex-1">
                {{ product.description }}
              </p>

              <div v-if="product.specs" class="mb-4 flex flex-wrap gap-2">
                <span
                  v-for="(value, key) in typeof product.specs === 'string'
                    ? JSON.parse(product.specs)
                    : product.specs"
                  :key="key"
                  class="rounded-lg border border-slate-100 bg-slate-50 px-2 py-1 text-xs text-slate-600"
                >
                  {{ key }}: {{ value }}
                </span>
              </div>

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
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCartStore } from '../stores/ecommerce.js'
import { productsAPI, searchAPI } from '../services/api.js'

const router = useRouter()
const route = useRoute()
const cartStore = useCartStore()

const categories = ref([])
const products = ref([])
const isLoading = ref(false)
const selectedCategory = ref('')
const sortBy = ref('name')
const priceRange = ref(1000)

const loadProducts = async () => {
  isLoading.value = true
  try {
    const searchParam = route.query.search
    if (searchParam && searchParam.trim()) {
      const { data } = await searchAPI.searchProducts(searchParam)
      products.value = data
    } else {
      const param = selectedCategory.value || ''
      const { data } = await productsAPI.getProducts(param)
      products.value = data
    }
  } catch {
    console.error('Failed to fetch products')
  } finally {
    isLoading.value = false
  }
}

const selectCategory = () => {
  const query = { category: selectedCategory.value || undefined }
  if (!query.category) delete query.category
  router.push({ path: '/products', query })
}

watch(
  () => route.query,
  (newQuery) => {
    if (newQuery.search && newQuery.search.trim()) {
      selectedCategory.value = ''
    } else {
      selectedCategory.value = newQuery.category || ''
    }
    if (categories.value.length) {
      loadProducts()
    }
  },
  { immediate: true, deep: true },
)

onMounted(async () => {
  try {
    const { data } = await productsAPI.getCategories()
    categories.value = data
  } catch {
    console.error('Failed to fetch categories')
  }
  if (categories.value.length) {
    await loadProducts()
  }
})

const filteredProducts = computed(() => {
  let filtered = products.value.filter((p) => p.price <= priceRange.value)

  if (sortBy.value === 'name') {
    filtered.sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortBy.value === 'price') {
    filtered.sort((a, b) => a.price - b.price)
  }

  return filtered
})

const filterByPrice = () => {
  // computed handles it
}

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
