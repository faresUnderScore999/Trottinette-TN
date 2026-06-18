<template>
  <div class="space-y-12">
    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-12 text-center">
      <h1 class="text-5xl font-bold mb-4">Welcome to Trottinette Tunisie</h1>
      <p class="text-xl mb-8">Premium Electric Scooters & Accessories</p>
      <router-link
        to="/products"
        class="inline-block bg-white text-blue-600 px-8 py-3 rounded font-bold hover:bg-gray-100 transition"
      >
        Shop Now
      </router-link>
    </div>

    <!-- Featured Categories -->
    <div>
      <h2 class="text-3xl font-bold mb-6">Shop by Category</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <router-link
          v-for="cat in categories"
          :key="cat.id"
          :to="`/products?category=${cat.slug}`"
          class="bg-white rounded-lg shadow hover:shadow-lg transition p-6 text-center cursor-pointer"
        >
          <div class="text-4xl mb-4">
            <span v-if="cat.slug === 'electric-scooters'">🛴</span>
            <span v-else-if="cat.slug === 'batteries'">🔋</span>
            <span v-else-if="cat.slug === 'spare-parts'">⚙️</span>
            <span v-else>🎁</span>
          </div>
          <h3 class="text-xl font-bold text-gray-800">{{ cat.name }}</h3>
          <p class="text-gray-600 text-sm mt-2">Explore our collection</p>
        </router-link>
      </div>
    </div>

    <!-- Featured Products -->
    <div>
      <h2 class="text-3xl font-bold mb-6">Featured Products</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="product in featuredProducts"
          :key="product.id"
          class="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden cursor-pointer"
          @click="goToProduct(product.slug)"
        >
          <img :src="product.image_url" :alt="product.name" class="w-full h-48 object-cover" />
          <div class="p-4">
            <h3 class="font-bold text-gray-800">{{ product.name }}</h3>
            <p class="text-gray-600 text-sm line-clamp-2">{{ product.description }}</p>
            <div class="flex justify-between items-center mt-4">
              <span class="text-2xl font-bold text-blue-600">{{ product.price }}DT</span>
              <button
                @click.stop="addToCart(product.id)"
                class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Why Choose Us -->
    <div class="bg-gray-100 rounded-lg p-12">
      <h2 class="text-3xl font-bold mb-8 text-center">Why Choose Trottinette Tunisie?</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="text-center">
          <div class="text-4xl mb-4">🚚</div>
          <h3 class="font-bold text-lg mb-2">Fast Delivery</h3>
          <p class="text-gray-600">Quick and reliable shipping across Tunisia</p>
        </div>
        <div class="text-center">
          <div class="text-4xl mb-4">🔒</div>
          <h3 class="font-bold text-lg mb-2">Secure Checkout</h3>
          <p class="text-gray-600">Your payment information is always safe</p>
        </div>
        <div class="text-center">
          <div class="text-4xl mb-4">💬</div>
          <h3 class="font-bold text-lg mb-2">24/7 Support</h3>
          <p class="text-gray-600">We're here to help anytime you need us</p>
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
  } catch (error) {
    alert('Please login to add items to cart' + error.message)
  }
}
</script>
