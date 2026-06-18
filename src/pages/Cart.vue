<template>
  <div class="space-y-6">
    <h1 class="text-4xl font-bold">Shopping Cart</h1>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Cart Items -->
      <div class="lg:col-span-2">
        <div v-if="cartStore.items.length === 0" class="bg-white rounded-lg shadow p-8 text-center">
          <p class="text-gray-600 text-lg mb-4">Your cart is empty</p>
          <router-link to="/products" class="text-blue-600 hover:underline"
            >Continue shopping</router-link
          >
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="item in cartStore.items"
            :key="item.id"
            class="bg-white rounded-lg shadow p-4 flex gap-4"
          >
            <img :src="item.image_url" :alt="item.name" class="w-24 h-24 object-cover rounded" />

            <div class="flex-1">
              <router-link
                :to="`/product/${item.slug}`"
                class="font-bold text-gray-800 hover:text-blue-600"
              >
                {{ item.name }}
              </router-link>
              <p class="text-gray-600 text-sm">Price: ${{ item.price }}</p>
            </div>

            <div class="flex items-center gap-2">
              <button
                @click="decreaseQuantity(item.id)"
                class="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                -
              </button>
              <input
                :value="item.quantity"
                type="number"
                min="1"
                class="w-12 text-center border rounded"
                @change="updateQuantity(item.id, $event)"
              />
              <button
                @click="increaseQuantity(item.id)"
                class="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                +
              </button>
            </div>

            <div class="text-right">
              <p class="font-bold text-lg">${{ (item.price * item.quantity).toFixed(2) }}</p>
              <button
                @click="removeFromCart(item.id)"
                class="text-red-600 hover:text-red-800 text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Cart Summary -->
      <div v-if="cartStore.items.length > 0" class="bg-white rounded-lg shadow p-6 h-fit">
        <h2 class="text-xl font-bold mb-4">Order Summary</h2>

        <div class="space-y-2 mb-4 pb-4 border-b">
          <div class="flex justify-between">
            <span>Subtotal:</span>
            <span>${{ cartStore.totalPrice.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between">
            <span>Shipping:</span>
            <span>TBD</span>
          </div>
          <div class="flex justify-between">
            <span>Tax:</span>
            <span>TBD</span>
          </div>
        </div>

        <div class="flex justify-between font-bold text-lg mb-6">
          <span>Total:</span>
          <span>${{ cartStore.totalPrice.toFixed(2) }}</span>
        </div>

        <router-link
          to="/checkout"
          class="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 transition block text-center"
        >
          Proceed to Checkout
        </router-link>

        <router-link
          to="/products"
          class="w-full bg-gray-200 text-gray-800 py-3 rounded font-bold hover:bg-gray-300 transition block text-center mt-2"
        >
          Continue Shopping
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/ecommerce.js'
import { useCartStore } from '../stores/ecommerce.js'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
  } else {
    await cartStore.fetchCart()
  }
})

const updateQuantity = async (itemId, event) => {
  const quantity = parseInt(event.target.value) || 0
  if (quantity > 0) {
    await cartStore.updateCartItem(itemId, quantity)
  }
}

const increaseQuantity = async (itemId) => {
  const item = cartStore.items.find((i) => i.id === itemId)
  if (item) {
    await cartStore.updateCartItem(itemId, item.quantity + 1)
  }
}

const decreaseQuantity = async (itemId) => {
  const item = cartStore.items.find((i) => i.id === itemId)
  if (item && item.quantity > 1) {
    await cartStore.updateCartItem(itemId, item.quantity - 1)
  }
}

const removeFromCart = async (itemId) => {
  if (confirm('Are you sure you want to remove this item?')) {
    await cartStore.removeFromCart(itemId)
  }
}
</script>
