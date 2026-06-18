<template>
  <div class="container mx-auto px-4 py-8 max-w-6xl">
    <h1 class="text-4xl font-bold mb-2">🛠️ Admin Dashboard</h1>
    <p class="text-gray-600 mb-8">Welcome back, {{ authStore.user?.first_name }}!</p>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm">Total Products</p>
            <p class="text-3xl font-bold">{{ stats.products }}</p>
          </div>
          <div class="text-4xl">📦</div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm">Total Orders</p>
            <p class="text-3xl font-bold">{{ stats.orders }}</p>
          </div>
          <div class="text-4xl">🛒</div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm">Total Users</p>
            <p class="text-3xl font-bold">{{ stats.users }}</p>
          </div>
          <div class="text-4xl">👥</div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm">Low Stock Items</p>
            <p class="text-3xl font-bold text-orange-600">{{ stats.lowStock }}</p>
          </div>
          <div class="text-4xl">⚠️</div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <router-link
        to="/admin/products"
        class="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6 hover:shadow-xl transition cursor-pointer"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-bold mb-2">Product Management</h3>
            <p class="text-blue-100">Create, edit, and manage products</p>
          </div>
          <div class="text-4xl">📦</div>
        </div>
      </router-link>

      <router-link
        to="/admin/categories"
        class="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-lg p-6 hover:shadow-xl transition cursor-pointer"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-bold mb-2">Category Management</h3>
            <p class="text-green-100">Organize your products (coming soon)</p>
          </div>
          <div class="text-4xl">📂</div>
        </div>
      </router-link>

      <div
        class="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow-lg p-6 cursor-not-allowed opacity-60"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-bold mb-2">Orders Management</h3>
            <p class="text-purple-100">View and manage customer orders</p>
          </div>
          <div class="text-4xl">📋</div>
        </div>
      </div>

      <div
        class="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg shadow-lg p-6 cursor-not-allowed opacity-60"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-bold mb-2">Analytics</h3>
            <p class="text-yellow-100">View sales and revenue reports</p>
          </div>
          <div class="text-4xl">📊</div>
        </div>
      </div>
    </div>

    <!-- Recent Products -->
    <div class="bg-white rounded-lg shadow-lg p-6">
      <h2 class="text-2xl font-bold mb-4">📈 Recent Products</h2>
      <div v-if="recentProducts.length === 0" class="text-gray-500 text-center py-8">
        No products yet
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-100 border-b">
            <tr>
              <th class="px-6 py-3 text-left text-sm font-semibold">Name</th>
              <th class="px-6 py-3 text-left text-sm font-semibold">Price</th>
              <th class="px-6 py-3 text-left text-sm font-semibold">Stock</th>
              <th class="px-6 py-3 text-left text-sm font-semibold">Created</th>
              <th class="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="product in recentProducts"
              :key="product.id"
              class="border-b hover:bg-gray-50"
            >
              <td class="px-6 py-4 text-sm font-medium">{{ product.name }}</td>
              <td class="px-6 py-4 text-sm">${{ product.price }}</td>
              <td class="px-6 py-4 text-sm">
                <span :class="product.stock > 0 ? 'text-green-600' : 'text-red-600'">
                  {{ product.stock }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ formatDate(product.created_at) }}</td>
              <td class="px-6 py-4 text-sm">
                <router-link to="/admin/products" class="text-blue-600 hover:underline"
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
import { productsAPI } from '../services/api'
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
    const productsRes = await productsAPI.getProducts()
    const products = productsRes.data
    recentProducts.value = products.slice(0, 5)
    stats.value.products = products.length
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
