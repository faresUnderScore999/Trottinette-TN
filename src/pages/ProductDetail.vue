<template>
  <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
    <div
      class="h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600"
    ></div>
    <p class="mt-4 text-sm font-medium text-slate-500">Loading product...</p>
  </div>

  <div v-else-if="product" class="space-y-10">
    <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <!-- Product Image -->
      <div
        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/40"
      >
        <img :src="product.image_url" :alt="product.name" class="h-full w-full object-cover" />
      </div>

      <!-- Product Info -->
      <div class="space-y-6">
        <div>
          <p class="mb-2 text-sm font-bold uppercase tracking-wider text-blue-600">
            {{ product.category_name }}
          </p>
          <h1 class="text-4xl font-extrabold tracking-tight text-slate-900">{{ product.name }}</h1>
        </div>

        <!-- Rating -->
        <div class="flex items-center gap-3">
          <div class="flex gap-1 text-lg">
            <span
              v-for="i in 5"
              :key="i"
              :class="i <= averageRating ? 'text-yellow-400' : 'text-slate-300'"
            >
              ★
            </span>
          </div>
          <span class="text-sm text-slate-500">({{ product.reviews?.length || 0 }} reviews)</span>
        </div>

        <!-- Price and Stock -->
        <div class="rounded-2xl border border-slate-200 bg-slate-50/60 p-6">
          <p class="text-sm font-medium text-slate-500">Price</p>
          <p class="mt-1 text-4xl font-black text-slate-900">
            {{ product.price }} <span class="text-lg font-medium text-slate-500">DT</span>
          </p>

          <div class="mt-2 flex items-center gap-2 text-sm font-bold">
            <span
              class="h-2 w-2 rounded-full"
              :class="product.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'"
            ></span>
            <span :class="product.stock > 0 ? 'text-emerald-700' : 'text-red-700'">
              {{ product.stock > 0 ? `${product.stock} in stock` : 'Out of stock' }}
            </span>
          </div>

          <div class="mt-5 flex gap-3">
            <input
              v-model.number="quantity"
              type="number"
              min="1"
              :max="product.stock"
              class="h-11 w-20 rounded-xl border border-slate-200 bg-white px-3 text-center text-sm font-semibold text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <button
              @click="addToCart"
              :disabled="product.stock === 0"
              class="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-slate-900/20 transition hover:bg-blue-600 hover:shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              Add to Cart
            </button>
          </div>
        </div>

        <!-- Description -->
        <div>
          <h2 class="text-xl font-bold text-slate-900">Description</h2>
          <p class="mt-2 text-sm leading-relaxed text-slate-600">{{ product.description }}</p>
        </div>

        <!-- Specifications -->
        <div v-if="product.specs && Object.keys(parsedSpecs).length">
          <h2 class="text-xl font-bold text-slate-900">Specifications</h2>
          <div class="mt-3 rounded-xl border border-slate-200 bg-white p-5">
            <div
              v-for="(value, key) in parsedSpecs"
              :key="key"
              class="flex justify-between border-b border-slate-50 py-2 last:border-0"
            >
              <span class="text-sm font-semibold capitalize text-slate-700">{{ key }}</span>
              <span class="text-sm text-slate-600">{{ value }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Reviews Section -->
    <div class="space-y-6">
      <h2 class="text-3xl font-extrabold tracking-tight text-slate-900">Customer Reviews</h2>

      <!-- Add Review Form -->
      <div
        v-if="authStore.isAuthenticated"
        class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/40"
      >
        <h3 class="text-lg font-bold text-slate-900">Leave a Review</h3>
        <form @submit.prevent="submitReview" class="mt-4 space-y-4">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Rating</label>
            <div class="flex gap-2">
              <button
                v-for="i in 5"
                :key="i"
                type="button"
                @click="reviewRating = i"
                class="text-3xl transition"
                :class="i <= reviewRating ? 'text-yellow-400' : 'text-slate-300'"
              >
                ★
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Comment</label>
            <textarea
              v-model="reviewComment"
              class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              rows="4"
              placeholder="Share your thoughts about this product..."
            ></textarea>
          </div>

          <button
            type="submit"
            class="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-slate-900/20 transition hover:bg-blue-600 hover:shadow-blue-600/20"
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
          class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/40"
        >
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <p class="font-bold text-slate-900">{{ review.first_name }} {{ review.last_name }}</p>
              <div class="flex gap-0.5 text-sm text-yellow-400">
                <span
                  v-for="i in 5"
                  :key="i"
                  :class="i <= review.rating ? 'text-yellow-400' : 'text-slate-300'"
                  >★</span
                >
              </div>
            </div>
            <p class="text-xs text-slate-500">
              {{ new Date(review.created_at).toLocaleDateString() }}
            </p>
          </div>
          <p class="mt-3 text-sm text-slate-600">{{ review.comment }}</p>
        </div>
      </div>

      <div
        v-else
        class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 py-12 text-center"
      >
        <svg class="h-12 w-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <p class="mt-3 text-base font-medium text-slate-600">No reviews yet</p>
        <p class="mt-1 text-sm text-slate-500">Be the first to review this product!</p>
      </div>
    </div>
  </div>

  <div v-else class="flex flex-col items-center justify-center py-20">
    <svg class="h-16 w-16 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <p class="mt-4 text-lg font-medium text-slate-600">Product not found</p>
    <router-link
      to="/products"
      class="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-slate-900/20 transition hover:bg-blue-600 hover:shadow-blue-600/20"
    >
      Back to products
    </router-link>
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
    router.push('/cart')
  } catch {
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

    const { data } = await productsAPI.getProductBySlug(route.params.slug)
    product.value = data
    alert('Review submitted successfully!')
  } catch {
    alert('Failed to submit review')
  }
}
</script>
