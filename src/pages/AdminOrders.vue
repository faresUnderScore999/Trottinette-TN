<template>
  <div class="space-y-8">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight text-slate-900">📋 Orders Management</h1>
        <p class="mt-1 text-sm text-slate-500">Track and manage customer orders</p>
      </div>
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search orders..."
          class="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:w-64"
        />
        <svg
          class="absolute left-3 top-2.5 h-4 w-4 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>

    <div
      class="rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/40 overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-50/80 border-b border-slate-100">
            <tr>
              <th
                class="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500"
              >
                Order ID
              </th>
              <th
                class="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500"
              >
                Customer
              </th>
              <th
                class="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500"
              >
                Items
              </th>
              <th
                class="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500"
              >
                Total
              </th>
              <th
                class="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500"
              >
                Status
              </th>
              <th
                class="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500"
              >
                Date
              </th>
              <th
                class="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-if="filteredOrders.length === 0">
              <td colspan="7" class="px-6 py-12 text-center text-sm text-slate-500">
                No orders found
              </td>
            </tr>
            <tr
              v-for="order in filteredOrders"
              :key="order.id"
              class="transition hover:bg-slate-50/50"
            >
              <td class="px-6 py-4 text-sm font-semibold text-slate-900">#{{ order.id }}</td>
              <td class="px-6 py-4 text-sm text-slate-600">{{ order.displayCustomerName }}</td>
              <td class="px-6 py-4 text-sm text-slate-600">{{ order.items_count || 0 }}</td>
              <td class="px-6 py-4 text-sm font-semibold text-slate-900">
                {{ order.displayTotal }} DT
              </td>
              <td class="px-6 py-4 text-sm">
                <span
                  class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold"
                  :class="statusClass(order.status)"
                >
                  <span class="h-1.5 w-1.5 rounded-full" :class="statusDot(order.status)"></span>
                  {{ formatStatus(order.status) }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-slate-500">{{ formatDate(order.created_at) }}</td>
              <td class="px-6 py-4 text-sm">
                <div class="flex gap-2">
                  <button
                    @click="openStatusModal(order)"
                    class="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700"
                  >
                    Update Status
                  </button>
                  <button
                    @click="viewOrder(order)"
                    class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                  >
                    View
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
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
          <!-- Customer Info -->
          <div>
            <h4 class="text-sm font-bold text-slate-900 mb-2">Customer Information</h4>
            <div
              class="rounded-xl border border-slate-200 bg-slate-50/60 p-4 text-sm text-slate-600 space-y-1"
            >
              <p>
                <span class="font-semibold text-slate-700">Name:</span>
                {{ selectedOrder.displayCustomerName }}
              </p>
              <p>
                <span class="font-semibold text-slate-700">Email:</span>
                {{ selectedOrder.displayCustomerEmail }}
              </p>
              <p>
                <span class="font-semibold text-slate-700">Phone:</span>
                {{ selectedOrder.displayCustomerPhone }}
              </p>
            </div>
          </div>

          <!-- Shipping Info -->
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

          <div>
            <h4 class="text-sm font-bold text-slate-900 mb-2">Order Items</h4>
            <div v-if="selectedOrder.displayItems.length" class="space-y-3">
              <div
                v-for="item in selectedOrder.displayItems"
                :key="item.id"
                class="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-3"
              >
                <img
                  :src="item.image_url || 'https://via.placeholder.com/60?text=No+Image'"
                  :alt="item.name || item.product_name"
                  class="h-16 w-16 rounded-lg object-cover"
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

        <div
          class="sticky bottom-0 flex justify-end gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-4"
        >
          <button
            @click="selectedOrder = null"
            class="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Close
          </button>
          <button
            @click="openStatusModal(selectedOrder)"
            class="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-slate-900/20 transition hover:bg-blue-600"
          >
            Update Status
          </button>
        </div>
      </div>
    </div>

    <!-- Status Update Modal -->
    <div
      v-if="statusModalOrder"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="statusModalOrder = null"
    >
      <div class="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-xl">
        <div class="border-b border-slate-100 px-6 py-4">
          <h3 class="text-lg font-bold text-slate-900">Update Order Status</h3>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Status</label>
            <select
              v-model="newStatus"
              class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        <div class="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button
            @click="statusModalOrder = null"
            class="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            @click="updateStatus"
            :disabled="isUpdating"
            class="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-slate-900/20 transition hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isUpdating ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/ecommerce.js'
import { ordersAPI } from '../services/api.js'

const authStore = useAuthStore()

const isLoading = ref(true)
const orders = ref([])
const searchQuery = ref('')
const selectedOrder = ref(null)
const statusModalOrder = ref(null)
const newStatus = ref('')
const isUpdating = ref(false)
const loadingDetails = ref(false)

// Normalize order data from admin endpoint
const normalizeOrder = (order) => ({
  ...order,
  displayCustomerName:
    `${order.first_name || ''} ${order.last_name || ''}`.trim() || `Customer #${order.user_id}`,
  displayCustomerEmail: order.email || 'N/A',
  displayCustomerPhone: order.phone || 'N/A',
  displayTotal: (Number(order.total_price) || 0).toFixed(2),
  displayItems: order.items || order.order_items || [],
  // Ensure items_count is a number
  items_count: Number(order.items_count) || 0,
})

// Load orders from admin endpoint
const loadOrders = async () => {
  isLoading.value = true
  try {
    const { data } = await ordersAPI.getAdminOrders()
    console.log('Admin orders data:', data)
    orders.value = data.map(normalizeOrder)
    console.log('orders.value set:', orders.value)
  } catch (err) {
    console.error('Failed to load admin orders:', err)
  } finally {
    isLoading.value = false
  }
}

// Filter orders by search query
const filteredOrders = computed(() => {
  if (!searchQuery.value.trim()) return orders.value
  const q = searchQuery.value.toLowerCase()
  return orders.value.filter(
    (o) =>
      String(o.id).includes(q) ||
      (o.displayCustomerName || '').toLowerCase().includes(q) ||
      (o.status || '').toLowerCase().includes(q),
  )
})

// Format status display
const formatStatus = (status) =>
  status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'

// Status styles
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

// Format payment method
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

// Format date
const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : 'N/A')

// View order details
const viewOrder = async (order) => {
  loadingDetails.value = true
  try {
    const { data } = await ordersAPI.getAdminOrderDetails(order.id)
    selectedOrder.value = normalizeOrder(data)
  } catch {
    alert('Failed to load order details')
  } finally {
    loadingDetails.value = false
  }
}

// Open status modal
const openStatusModal = (order) => {
  statusModalOrder.value = order
  newStatus.value = order.status
}

// Update order status
const updateStatus = async () => {
  if (!statusModalOrder.value) return
  isUpdating.value = true
  try {
    await ordersAPI.updateOrderStatus(statusModalOrder.value.id, { status: newStatus.value })
    // Update local list
    const order = orders.value.find((o) => o.id === statusModalOrder.value.id)
    if (order) order.status = newStatus.value
    if (selectedOrder.value && selectedOrder.value.id === statusModalOrder.value.id) {
      selectedOrder.value.status = newStatus.value
    }
    statusModalOrder.value = null
  } catch {
    alert('Failed to update status')
  } finally {
    isUpdating.value = false
  }
}

// On mount – check admin and load orders
onMounted(async () => {
  if (!authStore.isAdmin) {
    alert('Access denied. Admin only.')
    return
  }
  await loadOrders()
})
</script>
