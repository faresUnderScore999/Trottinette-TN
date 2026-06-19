import axios from 'axios'

// api.js
const API_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    console.log('Interceptor running, token:', token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    console.log('Final config:', config)
    return config
  },
  (error) => {
    console.error('Interceptor error:', error)
    return Promise.reject(error)
  },
)

// Auth endpoints
export const authAPI = {
  register: (email, password, firstName, lastName) =>
    api.post('/auth/register', { email, password, first_name: firstName, last_name: lastName }),
  login: (email, password) => api.post('/auth/login', { email, password }),
}

// Products endpoints
export const productsAPI = {
  getCategories: () => api.get('/categories'),
  getProducts: (category) => api.get('/products', { params: { category } }),
  getProductBySlug: (slug) => api.get(`/products/${slug}`),
  createProduct: (product) => api.post('/products', product),
  updateProduct: (id, product) => api.put(`/products/${id}`, product),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  generateDescription: (name, category) => api.post('/ai/generate-description', { name, category }),
}

// Cart endpoints
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (productId, quantity) => api.post('/cart', { product_id: productId, quantity }),
  updateCartItem: (itemId, quantity) => api.put(`/cart/${itemId}`, { quantity }),
  removeFromCart: (itemId) => api.delete(`/cart/${itemId}`),
}

// Orders endpoints
export const ordersAPI = {
  createOrder: (shippingData) => api.post('/orders', shippingData),
  getOrders: () => api.get('/orders'),
  getOrderDetails: (orderId) => api.get(`/orders/${orderId}`),
  updateOrderStatus: (orderId, status) => api.put(`/orders/${orderId}/status`, { status }),
  getAdminOrders: () => api.get('/admin/orders'),
  getAdminOrderDetails: (orderId) => api.get(`/admin/orders/${orderId}`),
}

// Reviews endpoints
export const reviewsAPI = {
  getReviews: (productId) => api.get(`/reviews/${productId}`),
  createReview: (productId, rating, comment) =>
    api.post('/reviews', { product_id: productId, rating, comment }),
}

// User profile endpoints
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (profileData) => api.put('/users/profile', profileData),
}

// Image upload endpoint
export const uploadAPI = {
  uploadImage: (imageData) => api.post('/upload', { image: imageData }),
}
export const searchAPI = {
  searchProducts: (query) => api.get('/search', { params: { q: query } }),
}
export default api
