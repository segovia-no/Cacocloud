import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/HomePage.vue'
import ExplorePage from '../views/ExplorePage.vue'
import SearchPage from '../views/SearchPage.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/explore', component: ExplorePage },
  { path: '/search', component: SearchPage },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
