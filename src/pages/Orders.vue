<template>
  <div class="min-h-screen bg-slate-50/50 py-12">
    <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-3xl font-extrabold tracking-tight text-slate-900">📦 My Orders</h1>
        <p class="mt-1 text-sm text-slate-500">Track and view your order history</p>
      </div>

      <div
        v-if="orders.length === 0"
        class="rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/40 p-12 text-center"
      >
        <svg
          class="mx-auto h-16 w-16 text-slate-300"
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
        <p class="mt-4 text-base font-medium text-slate-600">No orders yet</p>
        <p class="mt-1 text-sm text-slate-500">Start shopping to see your orders here</p>
        <router-link
          to="/products"
          class="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-slate-900/20 transition hover:bg-blue-600"
        >
          Browse Products
        </router-link>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="order in orders"
          :key="order.id"
          class="rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/40 overflow-hidden"
        >
          <div
            class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5 border-b border-slate-100 bg-slate-50/40"
          >
            <div class="flex items-center gap-4">
              <div>
                <p class="text-sm font-semibold text-slate-900">Order #{{ order.id }}</p>
                <p class="text-xs text-slate-500 mt-0.5">{{ formatDate(order.created_at) }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span
                class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
                :class="statusClass(order.status)"
              >
                <span class="h-1.5 w-1.5 rounded-full" :class="statusDot(order.status)"></span>
                {{ formatStatus(order.status) }}
              </span>
              <button
                @click="viewOrder(order)"
                class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                View Details
              </button>
            </div>
          </div>
          <div class="p-5">
            <div class="space-y-3">
              <div
                v-for="item in order.displayItems"
                :key="item.id"
                class="flex items-center justify-between text-sm"
              >
                <div class="flex items-center gap-3">
                  <img
                    :src="item.image_url || 'https://via.placeholder.com/40?text=No+Image'"
                    :alt="item.name || item.product_name"
                    class="h-10 w-10 rounded-lg object-cover"
                  />
                  <div>
                    <p class="font-semibold text-slate-900">{{ item.name || item.product_name }}</p>
                    <p class="text-xs text-slate-500">Qty: {{ item.quantity }}</p>
                  </div>
                </div>
                <p class="font-semibold text-slate-900">
                  {{ ((item.price || item.unit_price || 0) * item.quantity).toFixed(2) }} DT
                </p>
              </div>
            </div>
            <div class="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
              <p class="text-xs text-slate-500">
                Payment: {{ formatPayment(order.payment_method) }}
              </p>
              <p class="text-base font-black text-slate-900">{{ order.displayTotal }} DT</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Details Modal -->
    <div
      v-if="selectedOrder"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="selectedOrder = null"
    >
      <div
        class="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl"
      >
        <div
          class="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-slate-50/60 px-6 py-4"
        >
          <h3 class="text-lg font-bold text-slate-900">Order #{{ selectedOrder.id }}</h3>
          <button
            @click="selectedOrder = null"
            class="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div class="p-6 space-y-6">
          <!-- Shipping Address -->
          <div>
            <h4 class="text-sm font-bold text-slate-900 mb-2">Shipping Address</h4>
            <div
              class="rounded-xl border border-slate-200 bg-slate-50/60 p-4 text-sm text-slate-600 space-y-1"
            >
              <p>{{ selectedOrder.shipping_address || 'N/A' }}</p>
              <p>
                {{ selectedOrder.shipping_city || ''
                }}{{
                  selectedOrder.shipping_postal_code
                    ? ', ' + selectedOrder.shipping_postal_code
                    : ''
                }}
              </p>
              <p>{{ selectedOrder.shipping_country || 'N/A' }}</p>
            </div>
          </div>

          <!-- Order Items -->
          <div>
            <h4 class="text-sm font-bold text-slate-900 mb-2">Order Items</h4>
            <div v-if="selectedOrder.displayItems.length" class="space-y-3">
              <div
                v-for="item in selectedOrder.displayItems"
                :key="item.id"
                class="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3"
              >
                <img
                  :src="item.image_url || 'https://via.placeholder.com/40?text=No+Image'"
                  :alt="item.name || item.product_name"
                  class="h-12 w-12 rounded-lg object-cover"
                />
                <div class="flex-1">
                  <p class="text-sm font-semibold text-slate-900">
                    {{ item.name || item.product_name }}
                  </p>
                  <p class="text-xs text-slate-500">Qty: {{ item.quantity }}</p>
                </div>
                <p class="text-sm font-semibold text-slate-900">
                  {{ ((item.price || item.unit_price || 0) * item.quantity).toFixed(2) }} DT
                </p>
              </div>
            </div>
            <div v-else class="text-sm text-slate-500">No items found</div>
          </div>

          <!-- Payment & Total -->
          <div class="flex items-center justify-between border-t border-slate-200 pt-4">
            <div>
              <p class="text-sm text-slate-500">Payment Method</p>
              <p class="text-sm font-semibold text-slate-900">
                {{ formatPayment(selectedOrder.payment_method) }}
              </p>
            </div>
            <div class="text-right">
              <p class="text-sm text-slate-500">Total</p>
              <p class="text-lg font-black text-slate-900">{{ selectedOrder.displayTotal }} DT</p>
            </div>
          </div>
        </div>
        <div class="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
          <button
            @click="selectedOrder = null"
            class="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/ecommerce.js'
import { ordersAPI } from '../services/api.js'

const authStore = useAuthStore()
const orders = ref([])
const selectedOrder = ref(null)

const normalizeOrder = (order) => ({
  ...order,
  displayTotal: (Number(order.total_price) || Number(order.total) || 0).toFixed(2),
  displayItems: order.order_items || order.items || order.products || [],
})

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    alert('Access denied')
    return
  }
  await loadOrders()
})

const loadOrders = async () => {
  try {
    const { data } = await ordersAPI.getOrders()
    orders.value = data.map(normalizeOrder)
  } catch (err) {
    console.error('Failed to load orders:', err)
  }
}

const viewOrder = async (order) => {
  try {
    const { data } = await ordersAPI.getOrderDetails(order.id)
    selectedOrder.value = normalizeOrder(data)
  } catch {
    alert('Failed to load order details')
  }
}

// ----- Formatting helpers -----
const formatStatus = (status) =>
  status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'

const statusClass = (status) => {
  switch (status) {
    case 'delivered':
      return 'bg-emerald-50 text-emerald-700'
    case 'shipped':
      return 'bg-blue-50 text-blue-700'
    case 'processing':
      return 'bg-amber-50 text-amber-700'
    case 'cancelled':
      return 'bg-red-50 text-red-700'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}

const statusDot = (status) => {
  switch (status) {
    case 'delivered':
      return 'bg-emerald-500'
    case 'shipped':
      return 'bg-blue-500'
    case 'processing':
      return 'bg-amber-500'
    case 'cancelled':
      return 'bg-red-500'
    default:
      return 'bg-slate-400'
  }
}

const formatPayment = (method) => {
  switch (method) {
    case 'card':
      return 'Credit/Debit Card'
    case 'bank_transfer':
      return 'Bank Transfer'
    case 'cash_on_delivery':
      return 'Cash on Delivery'
    default:
      return method || 'N/A'
  }
}

const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : 'N/A')
</script>
