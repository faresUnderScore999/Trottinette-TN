<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-3xl font-extrabold tracking-tight text-slate-900">Shopping Cart</h1>
      <p class="mt-1 text-sm text-slate-500">{{ cartStore.items.length }} items in your cart</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Cart Items -->
      <div class="lg:col-span-2">
        <div
          v-if="cartStore.items.length === 0"
          class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 py-16 text-center"
        >
          <svg
            class="h-16 w-16 text-slate-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <p class="mt-4 text-lg font-medium text-slate-600">Your cart is empty</p>
          <p class="mt-1 text-sm text-slate-500">Looks like you haven't added anything yet</p>
          <router-link
            to="/products"
            class="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-slate-900/20 transition hover:bg-blue-600 hover:shadow-blue-600/20"
          >
            Continue Shopping
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </router-link>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="item in cartStore.items"
            :key="item.id"
            class="flex flex-col sm:flex-row gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/40 transition hover:shadow-md sm:items-center"
          >
            <div
              class="relative h-32 w-full sm:h-24 sm:w-24 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100"
            >
              <img :src="item.image_url" :alt="item.name" class="h-full w-full object-cover" />
            </div>

            <div class="flex flex-1 flex-col justify-between">
              <div>
                <router-link
                  :to="`/product/${item.slug}`"
                  class="font-bold text-slate-900 transition hover:text-blue-600"
                >
                  {{ item.name }}
                </router-link>
                <p class="mt-1 text-sm text-slate-500">Price: {{ item.price }} DT</p>
              </div>

              <div class="mt-3 flex items-center justify-between sm:mt-0">
                <div class="flex items-center gap-2">
                  <button
                    @click="decreaseQuantity(item.id)"
                    class="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95"
                  >
                    -
                  </button>
                  <input
                    :value="item.quantity"
                    type="number"
                    min="1"
                    class="h-8 w-12 rounded-lg border border-slate-200 text-center text-sm font-semibold text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    @change="updateQuantity(item.id, $event)"
                  />
                  <button
                    @click="increaseQuantity(item.id)"
                    class="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95"
                  >
                    +
                  </button>
                </div>

                <div class="text-right">
                  <p class="font-bold text-lg text-slate-900">
                    {{ (item.price * item.quantity).toFixed(2) }} DT
                  </p>
                  <button
                    @click="removeFromCart(item.id)"
                    class="text-sm font-semibold text-red-600 transition hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cart Summary -->
      <div v-if="cartStore.items.length > 0" class="lg:col-span-1">
        <div
          class="sticky top-24 rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/40 p-6"
        >
          <h2 class="text-lg font-bold text-slate-900">Order Summary</h2>

          <div class="mt-4 space-y-3">
            <div class="flex justify-between text-sm">
              <span class="text-slate-500">Subtotal</span>
              <span class="font-semibold text-slate-900"
                >{{ cartStore.totalPrice.toFixed(2) }} DT</span
              >
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-slate-500">Shipping</span>
              <span class="font-semibold text-slate-900">TBD</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-slate-500">Tax</span>
              <span class="font-semibold text-slate-900">TBD</span>
            </div>
          </div>

          <div class="mt-4 flex justify-between border-t border-slate-100 pt-4">
            <span class="font-bold text-slate-900">Total</span>
            <span class="font-bold text-lg text-slate-900"
              >{{ cartStore.totalPrice.toFixed(2) }} DT</span
            >
          </div>

          <router-link
            to="/checkout"
            class="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-slate-900/20 transition hover:bg-blue-600 hover:shadow-blue-600/20"
          >
            Proceed to Checkout
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
            class="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
          >
            Continue Shopping
          </router-link>
        </div>
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
