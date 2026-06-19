<template>
  <div class="min-h-screen bg-slate-50/50 py-12">
    <div class="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
      <div class="mb-10 text-center">
        <h1 class="text-3xl font-extrabold tracking-tight text-slate-900">Checkout</h1>
        <p class="mt-2 text-sm text-slate-500">Complete your order</p>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/40">
        <form @submit.prevent="submitOrder" class="p-6 sm:p-8 space-y-8">
          <!-- Shipping Information -->
          <div>
            <h2 class="text-lg font-bold text-slate-900">Shipping Information</h2>
            <div class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div class="sm:col-span-2">
                <label class="block text-sm font-semibold text-slate-700 mb-1.5">Address</label>
                <input
                  v-model="shippingData.shipping_address"
                  type="text"
                  class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1.5">City</label>
                <input
                  v-model="shippingData.shipping_city"
                  type="text"
                  class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1.5">Postal Code</label>
                <input
                  v-model="shippingData.shipping_postal_code"
                  type="text"
                  class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1.5">Country</label>
                <input
                  v-model="shippingData.shipping_country"
                  type="text"
                  class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1.5"
                  >Phone Number *</label
                >
                <input
                  v-model="shippingData.phone"
                  type="tel"
                  class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="+216 XX XXX XXX"
                  required
                />
                <p v-if="phoneError" class="mt-1 text-xs text-red-600">{{ phoneError }}</p>
              </div>
            </div>
          </div>

          <!-- Payment Method -->
          <div>
            <h2 class="text-lg font-bold text-slate-900">Payment Method</h2>
            <div class="mt-5 space-y-3">
              <label
                class="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-400"
              >
                <input
                  v-model="shippingData.payment_method"
                  type="radio"
                  value="card"
                  class="h-4 w-4 text-blue-600"
                />
                <span class="text-sm font-semibold text-slate-700">Credit/Debit Card</span>
              </label>
              <label
                class="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-400"
              >
                <input
                  v-model="shippingData.payment_method"
                  type="radio"
                  value="bank_transfer"
                  class="h-4 w-4 text-blue-600"
                />
                <span class="text-sm font-semibold text-slate-700">Bank Transfer</span>
              </label>
              <label
                class="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-400"
              >
                <input
                  v-model="shippingData.payment_method"
                  type="radio"
                  value="cash_on_delivery"
                  class="h-4 w-4 text-blue-600"
                />
                <span class="text-sm font-semibold text-slate-700">Cash on Delivery</span>
              </label>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="rounded-xl border border-slate-200 bg-slate-50/60 p-6">
            <h3 class="text-base font-bold text-slate-900">Order Summary</h3>
            <div class="mt-4 space-y-3">
              <div
                v-for="item in cartStore.items"
                :key="item.id"
                class="flex justify-between text-sm"
              >
                <span class="text-slate-600">{{ item.name }} x{{ item.quantity }}</span>
                <span class="font-semibold text-slate-900"
                  >{{ (item.price * item.quantity).toFixed(2) }} DT</span
                >
              </div>
            </div>
            <div class="mt-4 flex justify-between border-t border-slate-200 pt-4">
              <span class="font-bold text-slate-900">Total</span>
              <span class="font-bold text-lg text-slate-900"
                >{{ cartStore.totalPrice.toFixed(2) }} DT</span
              >
            </div>
          </div>

          <div v-if="error" class="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {{ error }}
          </div>

          <div class="flex flex-col gap-3">
            <button
              type="submit"
              :disabled="isLoading"
              class="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-slate-900/20 transition hover:bg-blue-600 hover:shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                v-if="!isLoading"
                class="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <div
                v-else
                class="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
              ></div>
              {{
                isLoading ? 'Processing...' : `Place Order - ${cartStore.totalPrice.toFixed(2)} DT`
              }}
            </button>

            <router-link
              to="/cart"
              class="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
              Back to Cart
            </router-link>
          </div>
        </form>
      </div>
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
  phone: '',
})

const phoneError = ref('')

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
      shippingData.value.phone = profile.phone || ''
    }
  }
})

const isValidPhone = (phone) => {
  // Accepts international format: +216XXXXXXXXX or 0XXXXXXXXX
  const cleaned = phone.replace(/\s/g, '')
  return /^(\+216|0)[0-9]{8}$/.test(cleaned)
}

const submitOrder = async () => {
  phoneError.value = ''
  error.value = ''

  if (!shippingData.value.shipping_address || !shippingData.value.shipping_city) {
    error.value = 'Please fill in all required fields'
    return
  }

  if (!shippingData.value.phone || !isValidPhone(shippingData.value.phone)) {
    phoneError.value = 'Please enter a valid phone number (e.g., +216 XX XXX XXX or 0XX XXX XXX)'
    return
  }

  isLoading.value = true

  try {
    await orderStore.createOrder(shippingData.value)
    cartStore.clearCart()
    router.push(`/orders`)
  } catch {
    error.value = orderStore.error || 'Failed to place order'
  } finally {
    isLoading.value = false
  }
}
</script>
