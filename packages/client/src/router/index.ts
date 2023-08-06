import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/HomePage.vue'
import SearchPage from '../views/SearchPage.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/search', component: SearchPage },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
