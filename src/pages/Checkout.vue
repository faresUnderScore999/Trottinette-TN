<template>
  <div class="max-w-2xl mx-auto">
    <h1 class="text-4xl font-bold mb-6">Checkout</h1>

    <div class="bg-white rounded-lg shadow p-8">
      <form @submit.prevent="submitOrder" class="space-y-6">
        <!-- Shipping Information -->
        <div>
          <h2 class="text-2xl font-bold mb-4">Shipping Information</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-bold mb-2">Address</label>
              <input
                v-model="shippingData.shipping_address"
                type="text"
                class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-bold mb-2">City</label>
              <input
                v-model="shippingData.shipping_city"
                type="text"
                class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-bold mb-2">Postal Code</label>
              <input
                v-model="shippingData.shipping_postal_code"
                type="text"
                class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-bold mb-2">Country</label>
              <input
                v-model="shippingData.shipping_country"
                type="text"
                class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
          </div>
        </div>

        <!-- Payment Method -->
        <div>
          <h2 class="text-2xl font-bold mb-4">Payment Method</h2>

          <div class="space-y-2">
            <label class="flex items-center">
              <input v-model="shippingData.payment_method" type="radio" value="card" class="mr-2" />
              <span>Credit/Debit Card</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="shippingData.payment_method"
                type="radio"
                value="bank_transfer"
                class="mr-2"
              />
              <span>Bank Transfer</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="shippingData.payment_method"
                type="radio"
                value="cash_on_delivery"
                class="mr-2"
              />
              <span>Cash on Delivery</span>
            </label>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="bg-gray-100 rounded p-4">
          <h3 class="font-bold mb-3">Order Items</h3>
          <div class="space-y-2 mb-3 pb-3 border-b">
            <div
              v-for="item in cartStore.items"
              :key="item.id"
              class="flex justify-between text-sm"
            >
              <span>{{ item.name }} x{{ item.quantity }}</span>
              <span>${{ (item.price * item.quantity).toFixed(2) }}</span>
            </div>
          </div>
          <div class="flex justify-between font-bold">
            <span>Total:</span>
            <span>${{ cartStore.totalPrice.toFixed(2) }}</span>
          </div>
        </div>

        <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {{ isLoading ? 'Processing...' : `Place Order - $${cartStore.totalPrice.toFixed(2)}` }}
        </button>

        <router-link
          to="/cart"
          class="w-full bg-gray-200 text-gray-800 py-3 rounded font-bold hover:bg-gray-300 transition block text-center"
        >
          Back to Cart
        </router-link>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/ecommerce.js'
import { useCartStore } from '../stores/ecommerce.js'
import { useOrderStore } from '../stores/ecommerce.js'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const orderStore = useOrderStore()

const isLoading = ref(false)
const error = ref('')

const shippingData = ref({
  shipping_address: '',
  shipping_city: '',
  shipping_postal_code: '',
  shipping_country: 'Tunisia',
  payment_method: 'cash_on_delivery',
})

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
  } else {
    const profile = await authStore.getProfile?.()
    if (profile) {
      shippingData.value.shipping_address = profile.address || ''
      shippingData.value.shipping_city = profile.city || ''
      shippingData.value.shipping_postal_code = profile.postal_code || ''
      shippingData.value.shipping_country = profile.country || 'Tunisia'
    }
  }
})

const submitOrder = async () => {
  if (!shippingData.value.shipping_address || !shippingData.value.shipping_city) {
    error.value = 'Please fill in all required fields'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    const order = await orderStore.createOrder(shippingData.value)
    cartStore.clearCart()
    router.push(`/order-confirmation/${order.id}`)
  } catch (err) {
    error.value = orderStore.error || 'Failed to place order'
  } finally {
    isLoading.value = false
  }
}
</script>
