import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import Cards from '../views/Cards.vue'
import CardDetail from '../views/CardDetail.vue'
import Apply from '../views/Apply.vue'
import Thanks from '../views/Thanks.vue'
import Privacy from '../views/Privacy.vue'
import Imprint from '../views/Imprint.vue'
import Contact from '../views/Contact.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/kreditkarten', component: Cards },
  { path: '/kreditkarten/:slug', component: CardDetail },
  { path: '/antrag/:slug', component: Apply },
  { path: '/danke', component: Thanks },
  { path: '/datenschutz', component: Privacy },
  { path: '/impressum', component: Imprint },
  { path: '/kontakt', component: Contact },
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  }
})
