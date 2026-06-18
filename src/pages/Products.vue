<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-4xl font-bold">Products</h1>
      <div class="space-x-2">
        <button
          @click="sortBy = 'name'"
          :class="[
            'px-4 py-2 rounded',
            sortBy === 'name' ? 'bg-blue-600 text-white' : 'bg-gray-200',
          ]"
        >
          Sort by Name
        </button>
        <button
          @click="sortBy = 'price'"
          :class="[
            'px-4 py-2 rounded',
            sortBy === 'price' ? 'bg-blue-600 text-white' : 'bg-gray-200',
          ]"
        >
          Sort by Price
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-5 gap-6">
      <!-- Sidebar Filter -->
      <div class="bg-white rounded-lg shadow p-6 h-fit">
        <h2 class="font-bold text-lg mb-4">Filters</h2>
        <div class="space-y-4">
          <div>
            <h3 class="font-bold mb-3">Categories</h3>
            <div class="space-y-2">
              <label class="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  value=""
                  v-model="selectedCategory"
                  @change="selectCategory"
                  class="mr-2"
                />
                <span>All Categories</span>
              </label>
              <label
                v-for="cat in categories"
                :key="cat.id"
                class="flex items-center cursor-pointer"
              >
                <input
                  type="radio"
                  name="category"
                  :value="cat.slug"
                  v-model="selectedCategory"
                  @change="selectCategory"
                  class="mr-2"
                />
                <span>{{ cat.name }}</span>
              </label>
            </div>
          </div>

          <div>
            <h3 class="font-bold mb-3">Price Range</h3>
            <input
              v-model.number="priceRange"
              type="range"
              min="0"
              max="1000"
              class="w-full"
              @change="filterByPrice"
            />
            <p class="text-sm text-gray-600 mt-2">Up to ${{ priceRange }}</p>
          </div>
        </div>
      </div>

      <!-- Products Grid -->
      <div class="md:col-span-4">
        <div v-if="isLoading" class="text-center py-12">
          <p class="text-gray-600">Loading products...</p>
        </div>

        <div v-else-if="filteredProducts.length === 0" class="text-center py-12">
          <p class="text-gray-600 text-lg">No products found</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            class="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden cursor-pointer"
            @click="goToProduct(product.slug)"
          >
            <img :src="product.image_url" :alt="product.name" class="w-full h-48 object-cover" />
            <div class="p-4">
              <p class="text-sm text-gray-500 mb-1">{{ product.category_name }}</p>
              <h3 class="font-bold text-gray-800 line-clamp-2">{{ product.name }}</h3>
              <p class="text-gray-600 text-sm line-clamp-2">{{ product.description }}</p>

              <div v-if="product.specs" class="mt-2 text-xs text-gray-500">
                <p
                  v-for="(value, key) in typeof product.specs === 'string'
                    ? JSON.parse(product.specs)
                    : product.specs"
                  :key="key"
                >
                  {{ key }}: {{ value }}
                </p>
              </div>

              <div class="flex justify-between items-center mt-4">
                <span class="text-2xl font-bold text-blue-600">{{ product.price }} DT</span>
                <button
                  @click.stop="addToCart(product.id)"
                  class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Add
                </button>
              </div>

              <div
                class="mt-2 text-sm"
                :class="product.stock > 0 ? 'text-green-600' : 'text-red-600'"
              >
                {{ product.stock > 0 ? `${product.stock} in stock` : 'Out of stock' }}
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

// ---------- Load products ----------
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
  } catch (error) {
    console.error('Failed to fetch products:', error)
  } finally {
    isLoading.value = false
  }
}

// ---------- Select category (clears search) ----------
const selectCategory = () => {
  const query = { category: selectedCategory.value || undefined }
  if (!query.category) delete query.category
  router.push({ path: '/products', query })
}

// ---------- Single watch on route.query ----------
watch(
  () => route.query,
  (newQuery) => {
    // Update selectedCategory based on query
    if (newQuery.search && newQuery.search.trim()) {
      // Search is active → clear category
      selectedCategory.value = ''
    } else {
      // No search → use category from URL
      selectedCategory.value = newQuery.category || ''
    }
    // Load products if categories are loaded
    if (categories.value.length) {
      loadProducts()
    }
  },
  { immediate: true, deep: true },
)

// ---------- On mount: fetch categories ----------
onMounted(async () => {
  try {
    const { data } = await productsAPI.getCategories()
    categories.value = data
    console.log('Categories loaded:', categories.value)
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }
  // The watch with immediate:true will now run after categories are loaded? No – watch runs before onMounted.
  // But watch is setup during component creation and runs before onMounted.
  // However, categories are empty when watch runs, so it won't call loadProducts.
  // Then onMounted fetches categories and we need to load products manually.
  // So we call loadProducts here if categories are loaded.
  if (categories.value.length) {
    await loadProducts()
  }
})

// ---------- Computed: price + sorting ----------
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
  } catch (error) {
    alert('Please login to add items to cart')
  }
}
</script>
