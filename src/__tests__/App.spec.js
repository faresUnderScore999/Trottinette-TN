import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import App from '../App.vue'

vi.mock('../services/api.js', () => ({
  productsAPI: {
    getCategories: () => Promise.resolve({ data: [] }),
  },
  cartAPI: {
    getCart: () => Promise.resolve({ data: [] }),
  },
  authAPI: {},
  ordersAPI: {},
  reviewsAPI: {},
  userAPI: {},
  default: {},
}))

describe('App', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('mounts renders properly', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [createPinia()],
        stubs: {
          RouterLink: true,
          RouterView: true,
        }
      }
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Trottinette')
  })
})
