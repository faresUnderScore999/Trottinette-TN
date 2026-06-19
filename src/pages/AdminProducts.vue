<template>
  <div class="space-y-8">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight text-slate-900">📦 Product Management</h1>
        <p class="mt-1 text-sm text-slate-500">Manage your store's inventory and products</p>
      </div>
    </div>

    <!-- Add/Edit Form -->
    <div
      class="rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/40 overflow-hidden"
    >
      <div class="border-b border-slate-100 bg-slate-50/60 px-6 py-4">
        <h2 class="text-lg font-bold text-slate-900">
          {{ editingId ? 'Edit Product' : 'Create New Product' }}
        </h2>
      </div>

      <form @submit.prevent="saveProduct" class="p-6 space-y-5">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <!-- Category -->
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Category *</label>
            <select
              v-model="form.category_id"
              class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
            >
              <option value="">Select Category</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>

          <!-- Name -->
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Product Name *</label>
            <input
              v-model="form.name"
              type="text"
              class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
              placeholder="e.g., Xiaomi Mi Pro 2"
            />
          </div>

          <!-- Price -->
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Price (DT) *</label>
            <input
              v-model.number="form.price"
              type="number"
              step="0.01"
              class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
              placeholder="599.99"
            />
          </div>

          <!-- Stock -->
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5"
              >Stock Quantity *</label
            >
            <input
              v-model.number="form.stock"
              type="number"
              class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
              placeholder="10"
            />
          </div>
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
          <textarea
            v-model="form.description"
            class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            rows="3"
            placeholder="Product description..."
          ></textarea>
        </div>

        <!-- Specifications -->
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1.5"
            >Specifications (JSON)</label
          >
          <textarea
            v-model="form.specs"
            class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-mono text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            rows="3"
            placeholder='{"range": "45km", "speed": "25km/h", "motor": "300W"}'
          ></textarea>
        </div>

        <!-- Image Upload / URL -->
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1.5">Product Image</label>

          <!-- URL input -->
          <div class="mb-3">
            <input
              v-model="form.image_url"
              type="url"
              class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <!-- Upload button -->
          <div
            class="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center transition hover:border-blue-400 hover:bg-blue-50/30"
          >
            <input
              type="file"
              @change="handleImageUpload"
              accept="image/*"
              class="hidden"
              ref="imageInput"
            />
            <button
              type="button"
              @click="$refs.imageInput.click()"
              class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              Upload Image
            </button>
            <span class="mx-2 text-sm text-slate-400">or</span>
            <button
              type="button"
              @click="clearImage"
              class="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
            >
              Remove
            </button>
            <div
              v-if="uploading"
              class="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-blue-600"
            >
              <svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Uploading...
            </div>
          </div>

          <!-- Image preview -->
          <div v-if="form.image_url" class="mt-4">
            <p class="text-sm font-medium text-slate-600 mb-2">Preview:</p>
            <img
              :src="form.image_url"
              alt="Product image preview"
              class="max-h-48 rounded-xl border border-slate-200 object-cover shadow-sm"
              @error="handleImageError"
            />
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-wrap items-center gap-3 pt-6 border-t border-slate-100">
          <button
            type="submit"
            :disabled="isLoading"
            class="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-slate-900/20 transition hover:bg-blue-600 hover:shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
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
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <div
              v-else
              class="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
            ></div>
            {{ isLoading ? 'Saving...' : editingId ? 'Update Product' : 'Create Product' }}
          </button>
          <button
            type="button"
            @click="resetForm"
            class="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
          >
            Cancel
          </button>
          <div
            v-if="error"
            class="ml-auto rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600"
          >
            {{ error }}
          </div>
        </div>
      </form>
    </div>

    <!-- Products List -->
    <div
      class="rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/40 overflow-hidden"
    >
      <div class="border-b border-slate-100 bg-slate-50/60 px-6 py-4">
        <h2 class="text-lg font-bold text-slate-900">Products ({{ products.length }})</h2>
      </div>

      <div
        v-if="products.length === 0"
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
        <p class="mt-1 text-sm text-slate-500">Create your first product using the form above</p>
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
                Category
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
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="product in products"
              :key="product.id"
              class="transition hover:bg-slate-50/50"
            >
              <td class="px-6 py-4 text-sm font-medium text-slate-900">{{ product.name }}</td>
              <td class="px-6 py-4 text-sm text-slate-600">{{ product.category_name }}</td>
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
              <td class="px-6 py-4 text-sm">
                <div class="flex gap-2">
                  <button
                    @click="editProduct(product)"
                    class="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700"
                  >
                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit
                  </button>
                  <button
                    @click="deleteProduct(product.id)"
                    class="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-red-700"
                  >
                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete
                  </button>
                </div>
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
import { productsAPI, uploadAPI } from '../services/api'
import { useAuthStore } from '../stores/ecommerce'

const authStore = useAuthStore()

const products = ref([])
const categories = ref([])
const isLoading = ref(false)
const uploading = ref(false)
const error = ref('')
const editingId = ref(null)
const imageInput = ref(null)

const form = ref({
  category_id: '',
  name: '',
  description: '',
  price: '',
  stock: '',
  image_url: '',
  specs: '{}',
})

const fetchData = async () => {
  try {
    const [prodsRes, catsRes] = await Promise.all([
      productsAPI.getProducts(),
      productsAPI.getCategories(),
    ])
    products.value = prodsRes.data
    categories.value = catsRes.data
  } catch (err) {
    error.value = 'Failed to load data'
    console.error(err)
  }
}

const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  uploading.value = true
  try {
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const base64 = e.target.result
        const result = await uploadAPI.uploadImage(base64)
        form.value.image_url = result.data.url
        uploading.value = false
      } catch (err) {
        error.value = err.response?.data?.error || 'Failed to upload image'
        uploading.value = false
      }
    }
    reader.readAsDataURL(file)
  } catch (err) {
    console.error(err)
    error.value = 'Failed to process image'
    uploading.value = false
  }
}

const clearImage = () => {
  form.value.image_url = ''
  if (imageInput.value) {
    imageInput.value.value = ''
  }
}

const handleImageError = (e) => {
  e.target.style.display = 'none'
}

const editProduct = (product) => {
  editingId.value = product.id
  form.value = {
    category_id: product.category_id,
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    image_url: product.image_url || '',
    specs: typeof product.specs === 'string' ? product.specs : JSON.stringify(product.specs),
  }
  window.scrollTo(0, 0)
}

const resetForm = () => {
  editingId.value = null
  form.value = {
    category_id: '',
    name: '',
    description: '',
    price: '',
    stock: '',
    image_url: '',
    specs: '{}',
  }
  error.value = ''
  if (imageInput.value) {
    imageInput.value.value = ''
  }
}

const saveProduct = async () => {
  error.value = ''
  if (!form.value.name || !form.value.price || !form.value.category_id || !form.value.stock) {
    error.value = 'Please fill in all required fields'
    return
  }

  isLoading.value = true
  try {
    let specs
    try {
      specs = JSON.parse(form.value.specs)
    } catch {
      specs = {}
    }

    const productData = {
      category_id: parseInt(form.value.category_id),
      name: form.value.name,
      description: form.value.description,
      price: parseFloat(form.value.price),
      stock: parseInt(form.value.stock),
      image_url: form.value.image_url,
      specs: specs,
    }

    if (editingId.value) {
      await productsAPI.updateProduct(editingId.value, productData)
    } else {
      await productsAPI.createProduct(productData)
    }

    await fetchData()
    resetForm()
  } catch (err) {
    error.value = err.response?.data?.error || 'Failed to save product'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

const deleteProduct = async (id) => {
  if (!confirm('Are you sure you want to delete this product?')) return

  try {
    await productsAPI.deleteProduct(id)
    await fetchData()
  } catch (err) {
    error.value = err.response?.data?.error || 'Failed to delete product'
  }
}

onMounted(() => {
  if (!authStore.isAdmin) {
    alert('Access denied. Admin only.')
    return
  }
  fetchData()
})
</script>
