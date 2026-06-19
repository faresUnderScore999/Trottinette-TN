<template>
  <div class="space-y-10">
    <div>
      <h1 class="text-4xl font-black tracking-tight text-slate-900">🛠️ Admin Dashboard</h1>
      <p class="mt-1 text-lg text-slate-500">Welcome back, {{ authStore.user?.first_name }}!</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/40">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-slate-500">Total Products</p>
            <p class="mt-2 text-4xl font-black text-slate-900">{{ stats.products }}</p>
          </div>
          <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
            📦
          </div>
        </div>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/40">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-slate-500">Total Orders</p>
            <p class="mt-2 text-4xl font-black text-slate-900">{{ stats.orders }}</p>
          </div>
          <div
            class="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-2xl"
          >
            🛒
          </div>
        </div>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/40">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-slate-500">Total Users</p>
            <p class="mt-2 text-4xl font-black text-slate-900">{{ stats.users }}</p>
          </div>
          <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-2xl">
            👥
          </div>
        </div>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/40">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-slate-500">Low Stock Items</p>
            <p class="mt-2 text-4xl font-black text-orange-600">{{ stats.lowStock }}</p>
          </div>
          <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-2xl">
            ⚠️
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <router-link
        to="/admin/products"
        class="group relative overflow-hidden rounded-2xl border border-slate-900 bg-slate-900 p-6 shadow-lg shadow-slate-900/20 transition hover:scale-[1.01]"
      >
        <div class="relative flex items-center justify-between">
          <div>
            <h3 class="text-xl font-bold text-white">Product Management</h3>
            <p class="mt-1 text-sm text-slate-300">Create, edit, and manage products</p>
          </div>
          <div class="text-4xl">📦</div>
        </div>
      </router-link>

      <router-link
        to="/admin/orders"
        class="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/40 transition hover:scale-[1.01]"
      >
        <div class="relative flex items-center justify-between">
          <div>
            <h3 class="text-xl font-bold text-slate-900">Orders Management</h3>
            <p class="mt-1 text-sm text-slate-500">Track and manage customer orders</p>
          </div>
          <div class="text-4xl">📋</div>
        </div>
      </router-link>

      <div
        class="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/40 opacity-70"
      >
        <div class="relative flex items-center justify-between">
          <div>
            <h3 class="text-xl font-bold text-slate-900">Category Management</h3>
            <p class="mt-1 text-sm text-slate-500">Organize your products (coming soon)</p>
          </div>
          <div class="text-4xl">📂</div>
        </div>
      </div>

      <div
        class="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/40 opacity-70"
      >
        <div class="relative flex items-center justify-between">
          <div>
            <h3 class="text-xl font-bold text-slate-900">Analytics</h3>
            <p class="mt-1 text-sm text-slate-500">View sales and revenue reports (coming soon)</p>
          </div>
          <div class="text-4xl">📊</div>
        </div>
      </div>
    </div>

    <!-- Recent Products -->
    <div
      class="rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/40 overflow-hidden"
    >
      <div class="border-b border-slate-100 bg-slate-50/60 px-6 py-4">
        <h2 class="text-xl font-bold text-slate-900">📈 Recent Products</h2>
      </div>

      <div
        v-if="recentProducts.length === 0"
        class="flex flex-col items-center justify-center px-6 py-16 text-center"
      >
        <svg class="h-16 w-16 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <p class="mt-4 text-base font-medium text-slate-600">No products yet</p>
        <p class="mt-1 text-sm text-slate-500">Create your first product to get started</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-50/80 border-b border-slate-100">
            <tr>
              <th
                class="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500"
              >
                Name
              </th>
              <th
                class="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500"
              >
                Price
              </th>
              <th
                class="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500"
              >
                Stock
              </th>
              <th
                class="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500"
              >
                Created
              </th>
              <th
                class="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="product in recentProducts"
              :key="product.id"
              class="transition hover:bg-slate-50/50"
            >
              <td class="px-6 py-4 text-sm font-medium text-slate-900">{{ product.name }}</td>
              <td class="px-6 py-4 text-sm font-semibold text-slate-900">{{ product.price }} DT</td>
              <td class="px-6 py-4 text-sm">
                <span
                  class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold"
                  :class="
                    product.stock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                  "
                >
                  <span
                    class="h-1.5 w-1.5 rounded-full"
                    :class="product.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'"
                  ></span>
                  {{ product.stock }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-slate-500">{{ formatDate(product.created_at) }}</td>
              <td class="px-6 py-4 text-sm">
                <router-link
                  to="/admin/products"
                  class="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                  >Edit</router-link
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { productsAPI, ordersAPI } from '../services/api'
import { useAuthStore } from '../stores/ecommerce'

const router = useRouter()
const authStore = useAuthStore()

const stats = ref({
  products: 0,
  orders: 0,
  users: 0,
  lowStock: 0,
})

const recentProducts = ref([])

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

const loadStats = async () => {
  try {
    const [productsRes, ordersRes] = await Promise.all([
      productsAPI.getProducts(),
      ordersAPI.getOrders(),
    ])
    const products = productsRes.data
    const orders = ordersRes.data
    recentProducts.value = products.slice(0, 5)
    stats.value.products = products.length
    stats.value.orders = orders.length
    stats.value.lowStock = products.filter((p) => p.stock < 5).length
  } catch (err) {
    console.error('Failed to load stats:', err)
  }
}

onMounted(() => {
  if (!authStore.isAdmin) {
    alert('Access denied. Admin only.')
    router.push('/')
    return
  }
  loadStats()
})
</script>
