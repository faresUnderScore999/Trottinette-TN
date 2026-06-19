import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Products from '../pages/Products.vue'
import ProductDetail from '../pages/ProductDetail.vue'
import Auth from '../pages/Auth.vue'
import Cart from '../pages/Cart.vue'
import Checkout from '../pages/Checkout.vue'
import Orders from '../pages/Orders.vue'
import Profile from '../pages/Profile.vue'
import Contact from '../pages/Contact.vue'
import Admin from '../pages/Admin.vue'
import AdminProducts from '../pages/AdminProducts.vue'
import AdminOrders from '../pages/AdminOrders.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/products',
      name: 'Products',
      component: Products,
    },
    {
      path: '/product/:slug',
      name: 'ProductDetail',
      component: ProductDetail,
    },
    {
      path: '/login',
      name: 'Login',
      component: Auth,
    },
    {
      path: '/register',
      name: 'Register',
      component: Auth,
    },
    {
      path: '/cart',
      name: 'Cart',
      component: Cart,
    },
    {
      path: '/checkout',
      name: 'Checkout',
      component: Checkout,
    },
    {
      path: '/orders',
      name: 'Orders',
      component: Orders,
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
    },
    {
      path: '/contact',
      name: 'Contact',
      component: Contact,
    },
    {
      path: '/admin',
      name: 'Admin',
      component: Admin,
    },
    {
      path: '/admin/products',
      name: 'AdminProducts',
      component: AdminProducts,
    },
    {
      path: '/admin/orders',
      name: 'AdminOrders',
      component: AdminOrders,
    },
  ],
})

export default router
