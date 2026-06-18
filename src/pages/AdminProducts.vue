<template>
  <div class="container mx-auto px-4 py-8 max-w-6xl">
    <h1 class="text-3xl font-bold mb-8">📦 Product Management</h1>

    <!-- Add/Edit Form -->
    <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 class="text-2xl font-semibold mb-6">
        {{ editingId ? 'Edit Product' : 'Create New Product' }}
      </h2>

      <form @submit.prevent="saveProduct" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <!-- Category -->
          <div>
            <label class="block text-sm font-medium mb-2">Category *</label>
            <select v-model="form.category_id" class="w-full border rounded px-3 py-2" required>
              <option value="">Select Category</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>

          <!-- Name -->
          <div>
            <label class="block text-sm font-medium mb-2">Product Name *</label>
            <input
              v-model="form.name"
              type="text"
              class="w-full border rounded px-3 py-2"
              required
              placeholder="e.g., Xiaomi Mi Pro 2"
            />
          </div>

          <!-- Price -->
          <div>
            <label class="block text-sm font-medium mb-2">Price ($) *</label>
            <input
              v-model.number="form.price"
              type="number"
              step="0.01"
              class="w-full border rounded px-3 py-2"
              required
              placeholder="599.99"
            />
          </div>

          <!-- Stock -->
          <div>
            <label class="block text-sm font-medium mb-2">Stock Quantity *</label>
            <input
              v-model.number="form.stock"
              type="number"
              class="w-full border rounded px-3 py-2"
              required
              placeholder="10"
            />
          </div>
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium mb-2">Description</label>
          <textarea
            v-model="form.description"
            class="w-full border rounded px-3 py-2 h-24"
            placeholder="Product description..."
          ></textarea>
        </div>

        <!-- Specifications -->
        <div>
          <label class="block text-sm font-medium mb-2">Specifications (JSON)</label>
          <textarea
            v-model="form.specs"
            class="w-full border rounded px-3 py-2 h-20 font-mono text-sm"
            placeholder='{"range": "45km", "speed": "25km/h", "motor": "300W"}'
          ></textarea>
        </div>

        <!-- Image Upload / URL -->
        <div>
          <label class="block text-sm font-medium mb-2">Product Image</label>

          <!-- URL input -->
          <div class="mb-3">
            <input
              v-model="form.image_url"
              type="url"
              class="w-full border rounded px-3 py-2"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <!-- Upload button -->
          <div class="border-2 border-dashed rounded-lg p-6 text-center">
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
              class="text-blue-600 hover:underline"
            >
              Click to upload image
            </button>
            <span class="text-gray-400 mx-2">or</span>
            <button type="button" @click="clearImage" class="text-red-600 hover:underline">
              Remove image
            </button>
            <div v-if="uploading" class="mt-4 text-blue-600">Uploading...</div>
          </div>

          <!-- Image preview -->
          <div v-if="form.image_url" class="mt-4">
            <p class="text-sm text-gray-600 mb-2">Preview:</p>
            <img
              :src="form.image_url"
              alt="Product image preview"
              class="max-h-48 rounded border"
              @error="handleImageError"
            />
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-4 pt-6 border-t">
          <button
            type="submit"
            :disabled="isLoading"
            class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {{ isLoading ? 'Saving...' : editingId ? 'Update Product' : 'Create Product' }}
          </button>
          <button
            type="button"
            @click="resetForm"
            class="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
          <div v-if="error" class="ml-auto text-red-600">{{ error }}</div>
        </div>
      </form>
    </div>

    <!-- Products List -->
    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
      <div class="px-6 py-4 border-b">
        <h2 class="text-2xl font-semibold">Products ({{ products.length }})</h2>
      </div>

      <div v-if="products.length === 0" class="px-6 py-8 text-center text-gray-500">
        No products yet. Create one above!
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-100 border-b">
            <tr>
              <th class="px-6 py-3 text-left text-sm font-semibold">Name</th>
              <th class="px-6 py-3 text-left text-sm font-semibold">Category</th>
              <th class="px-6 py-3 text-left text-sm font-semibold">Price</th>
              <th class="px-6 py-3 text-left text-sm font-semibold">Stock</th>
              <th class="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.id" class="border-b hover:bg-gray-50">
              <td class="px-6 py-4 text-sm">{{ product.name }}</td>
              <td class="px-6 py-4 text-sm">{{ product.category_name }}</td>
              <td class="px-6 py-4 text-sm font-semibold">${{ product.price }}</td>
              <td class="px-6 py-4 text-sm">
                <span :class="product.stock > 0 ? 'text-green-600' : 'text-red-600'">
                  {{ product.stock }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm space-x-2">
                <button
                  @click="editProduct(product)"
                  class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-xs"
                >
                  Edit
                </button>
                <button
                  @click="deleteProduct(product.id)"
                  class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs"
                >
                  Delete
                </button>
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

// Fetch products and categories
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

// Handle image upload
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
        form.value.image_url = result.data.url // ✅ fixed: use result.data.url
        uploading.value = false
      } catch (err) {
        error.value = err.response?.data?.error || 'Failed to upload image'
        uploading.value = false
      }
    }
    reader.readAsDataURL(file)
  } catch (err) {
    error.value = 'Failed to process image'
    uploading.value = false
  }
}

// Clear image URL
const clearImage = () => {
  form.value.image_url = ''
  // Also clear the file input so the same file can be re-selected
  if (imageInput.value) {
    imageInput.value.value = ''
  }
}

// Handle image loading error in preview
const handleImageError = (e) => {
  e.target.style.display = 'none'
  // Optionally show a fallback
}

// Edit product
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

// Reset form
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

// Save product (create or update)
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

// Delete product
const deleteProduct = async (id) => {
  if (!confirm('Are you sure you want to delete this product?')) return

  try {
    await productsAPI.deleteProduct(id)
    await fetchData()
  } catch (err) {
    error.value = err.response?.data?.error || 'Failed to delete product'
    console.error(err)
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
