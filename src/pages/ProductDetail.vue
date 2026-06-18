<template>
  <div v-if="isLoading" class="text-center py-12">
    <p class="text-gray-600">Loading product...</p>
  </div>

  <div v-else-if="product" class="space-y-8">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Product Image -->
      <div class="bg-white rounded-lg shadow p-6">
        <img :src="product.image_url" :alt="product.name" class="w-full rounded" />
      </div>

      <!-- Product Info -->
      <div class="space-y-6">
        <div>
          <p class="text-gray-500 text-sm mb-1">{{ product.category_name }}</p>
          <h1 class="text-4xl font-bold">{{ product.name }}</h1>
        </div>

        <!-- Rating -->
        <div class="flex items-center gap-2">
          <div class="flex gap-1">
            <span
              v-for="i in 5"
              :key="i"
              class="text-xl"
              :class="i <= averageRating ? 'text-yellow-400' : 'text-gray-300'"
            >
              ★
            </span>
          </div>
          <span class="text-gray-600">({{ product.reviews?.length || 0 }} reviews)</span>
        </div>

        <!-- Price and Stock -->
        <div class="bg-gray-100 rounded p-4">
          <p class="text-gray-600 text-sm mb-2">Price</p>
          <p class="text-4xl font-bold text-blue-600 mb-4">{{ product.price }} DT</p>

          <div
            :class="[
              'text-sm font-bold mb-4',
              product.stock > 0 ? 'text-green-600' : 'text-red-600',
            ]"
          >
            {{ product.stock > 0 ? `${product.stock} in stock` : 'Out of stock' }}
          </div>

          <div class="flex gap-2">
            <input
              v-model.number="quantity"
              type="number"
              min="1"
              :max="product.stock"
              class="w-24 px-4 py-2 border rounded focus:outline-none"
            />
            <button
              @click="addToCart"
              :disabled="product.stock === 0"
              class="flex-1 bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition disabled:opacity-50"
            >
              Add to Cart
            </button>
          </div>
        </div>

        <!-- Description -->
        <div>
          <h2 class="text-xl font-bold mb-2">Description</h2>
          <p class="text-gray-600">{{ product.description }}</p>
        </div>

        <!-- Specifications (FIXED) -->
        <div v-if="product.specs && Object.keys(parsedSpecs).length">
          <h2 class="text-xl font-bold mb-2">Specifications</h2>
          <div class="bg-gray-50 rounded p-4 space-y-2">
            <div v-for="(value, key) in parsedSpecs" :key="key" class="flex justify-between">
              <span class="font-bold capitalize">{{ key }}:</span>
              <span class="text-gray-600">{{ value }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Reviews Section -->
    <div class="space-y-6">
      <h2 class="text-3xl font-bold">Customer Reviews</h2>

      <!-- Add Review Form -->
      <div v-if="authStore.isAuthenticated" class="bg-white rounded-lg shadow p-6">
        <h3 class="font-bold mb-4">Leave a Review</h3>
        <form @submit.prevent="submitReview" class="space-y-4">
          <div>
            <label class="block text-sm font-bold mb-2">Rating</label>
            <div class="flex gap-2">
              <button
                v-for="i in 5"
                :key="i"
                type="button"
                @click="reviewRating = i"
                class="text-3xl transition"
                :class="i <= reviewRating ? 'text-yellow-400' : 'text-gray-300'"
              >
                ★
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-bold mb-2">Comment</label>
            <textarea
              v-model="reviewComment"
              class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              rows="4"
            ></textarea>
          </div>

          <button
            type="submit"
            class="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700 transition"
          >
            Submit Review
          </button>
        </form>
      </div>

      <!-- Reviews List -->
      <div v-if="product.reviews?.length" class="space-y-4">
        <div
          v-for="review in product.reviews"
          :key="review.id"
          class="bg-white rounded-lg shadow p-6"
        >
          <div class="flex justify-between items-start mb-2">
            <div>
              <p class="font-bold">{{ review.first_name }} {{ review.last_name }}</p>
              <div class="flex gap-1 text-sm text-yellow-400">
                <span
                  v-for="i in 5"
                  :key="i"
                  :class="i <= review.rating ? 'text-yellow-400' : 'text-gray-300'"
                  >★</span
                >
              </div>
            </div>
            <p class="text-gray-500 text-sm">
              {{ new Date(review.created_at).toLocaleDateString() }}
            </p>
          </div>
          <p class="text-gray-600">{{ review.comment }}</p>
        </div>
      </div>

      <div v-else class="text-center py-8 bg-gray-50 rounded">
        <p class="text-gray-600">No reviews yet. Be the first to review this product!</p>
      </div>
    </div>
  </div>

  <div v-else class="text-center py-12">
    <p class="text-gray-600 text-lg">Product not found</p>
    <router-link to="/products" class="text-blue-600 hover:underline">Back to products</router-link>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/ecommerce.js'
import { useCartStore } from '../stores/ecommerce.js'
import { productsAPI, reviewsAPI } from '../services/api.js'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()

const product = ref(null)
const isLoading = ref(false)
const quantity = ref(1)
const reviewRating = ref(5)
const reviewComment = ref('')

const averageRating = computed(() => {
  if (!product.value?.reviews?.length) return 0
  const total = product.value.reviews.reduce((sum, r) => sum + r.rating, 0)
  return Math.round((total / product.value.reviews.length) * 2) / 2
})

// NEW computed property to safely parse specs
const parsedSpecs = computed(() => {
  if (!product.value?.specs) return {}
  try {
    return typeof product.value.specs === 'string'
      ? JSON.parse(product.value.specs)
      : product.value.specs
  } catch {
    return {}
  }
})

onMounted(async () => {
  isLoading.value = true
  try {
    const { data } = await productsAPI.getProductBySlug(route.params.slug)
    product.value = data
  } catch (error) {
    console.error('Failed to fetch product:', error)
  } finally {
    isLoading.value = false
  }
})

const addToCart = async () => {
  try {
    await cartStore.addToCart(product.value.id, quantity.value)
    alert('Product added to cart!')
  } catch (error) {
    alert('Please login to add items to cart')
    router.push('/login')
  }
}

const submitReview = async () => {
  if (!reviewRating.value) {
    alert('Please select a rating')
    return
  }

  try {
    await reviewsAPI.createReview(product.value.id, reviewRating.value, reviewComment.value)
    reviewRating.value = 5
    reviewComment.value = ''

    // Reload product to get updated reviews
    const { data } = await productsAPI.getProductBySlug(route.params.slug)
    product.value = data
    alert('Review submitted successfully!')
  } catch (error) {
    alert('Failed to submit review')
  }
}
</script>
