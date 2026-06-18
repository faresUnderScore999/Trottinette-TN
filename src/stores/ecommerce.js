import { defineStore } from 'pinia'
import { authAPI, cartAPI, ordersAPI, userAPI } from '../services/api.js'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isLoading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.is_admin || false,
  },

  actions: {
    async register(email, password, firstName, lastName) {
      this.isLoading = true
      this.error = null
      try {
        const { data } = await authAPI.register(email, password, firstName, lastName)
        this.user = data.user
        this.token = data.token
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        return data
      } catch (err) {
        this.error = err.response?.data?.error || 'Registration failed'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async login(email, password) {
      this.isLoading = true
      this.error = null
      try {
        const { data } = await authAPI.login(email, password)
        this.user = data.user
        this.token = data.token
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        return data
      } catch (err) {
        this.error = err.response?.data?.error || 'Login failed'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },

    loadFromStorage() {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')
      if (token && user) {
        this.token = token
        this.user = JSON.parse(user)
      }
    },

    async updateProfile(profileData) {
      this.isLoading = true
      this.error = null
      try {
        const { data } = await userAPI.updateProfile(profileData)
        this.user = { ...this.user, ...data }
        localStorage.setItem('user', JSON.stringify(this.user))
        return data
      } catch (err) {
        this.error = err.response?.data?.error || 'Profile update failed'
        throw err
      } finally {
        this.isLoading = false
      }
    },
    async getProfile() {
      try {
        const { data } = await userAPI.getProfile()
        return data
      } catch (err) {
        this.error = err.response?.data?.error || 'Failed to fetch profile'
        throw err
      }
    },
  },
})

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    isLoading: false,
    error: null,
  }),

  getters: {
    totalItems: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: (state) => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    cartCount: (state) => state.items.length,
  },

  actions: {
    async fetchCart() {
      this.isLoading = true
      this.error = null
      try {
        const { data } = await cartAPI.getCart()
        this.items = data
      } catch (err) {
        this.error = err.response?.data?.error || 'Failed to fetch cart'
      } finally {
        this.isLoading = false
      }
    },

    async addToCart(productId, quantity = 1) {
      this.isLoading = true
      this.error = null
      try {
        const { data } = await cartAPI.addToCart(productId, quantity)
        const existingItem = this.items.find((item) => item.product_id === productId)
        if (existingItem) {
          existingItem.quantity += quantity
        } else {
          this.items.push(data)
        }
        return data
      } catch (err) {
        this.error = err.response?.data?.error || 'Failed to add to cart'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async updateCartItem(itemId, quantity) {
      this.isLoading = true
      this.error = null
      try {
        if (quantity <= 0) {
          await cartAPI.removeFromCart(itemId)
          this.items = this.items.filter((item) => item.id !== itemId)
        } else {
          await cartAPI.updateCartItem(itemId, quantity)
          const item = this.items.find((i) => i.id === itemId)
          if (item) {
            item.quantity = quantity
          }
        }
      } catch (err) {
        this.error = err.response?.data?.error || 'Failed to update cart item'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async removeFromCart(itemId) {
      this.isLoading = true
      this.error = null
      try {
        await cartAPI.removeFromCart(itemId)
        this.items = this.items.filter((item) => item.id !== itemId)
      } catch (err) {
        this.error = err.response?.data?.error || 'Failed to remove from cart'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    clearCart() {
      this.items = []
    },
  },
})

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [],
    currentOrder: null,
    isLoading: false,
    error: null,
  }),

  actions: {
    async createOrder(shippingData) {
      this.isLoading = true
      this.error = null
      try {
        const { data } = await ordersAPI.createOrder(shippingData)
        this.orders.unshift(data)
        this.currentOrder = data
        return data
      } catch (err) {
        this.error = err.response?.data?.error || 'Failed to create order'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async fetchOrders() {
      this.isLoading = true
      this.error = null
      try {
        const { data } = await ordersAPI.getOrders()
        this.orders = data
      } catch (err) {
        this.error = err.response?.data?.error || 'Failed to fetch orders'
      } finally {
        this.isLoading = false
      }
    },

    async fetchOrderDetails(orderId) {
      this.isLoading = true
      this.error = null
      try {
        const { data } = await ordersAPI.getOrderDetails(orderId)
        this.currentOrder = data
        return data
      } catch (err) {
        this.error = err.response?.data?.error || 'Failed to fetch order details'
        throw err
      } finally {
        this.isLoading = false
      }
    },
  },
})
