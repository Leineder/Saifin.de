import { createRouter, createWebHistory } from 'vue-router'
import { applyRouteMeta } from '../seo'

import Home from '../views/Home.vue'
import Cards from '../views/Cards.vue'
import CardDetail from '../views/CardDetail.vue'
import Apply from '../views/Apply.vue'
import Thanks from '../views/Thanks.vue'
import Privacy from '../views/Privacy.vue'
import Imprint from '../views/Imprint.vue'
import Contact from '../views/Contact.vue'
import Brokers from '../views/Brokers.vue'
import BrokerDetail from '../views/BrokerDetail.vue'
import Savings from '../views/Savings.vue'
import SavingsDetail from '../views/SavingsDetail.vue'
import Guide from '../views/Guide.vue'
import GuideDetail from '../views/GuideDetail.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/kreditkarten', name: 'cards', component: Cards },
  { path: '/kreditkarten/:slug', name: 'card-detail', component: CardDetail },
  { path: '/broker', name: 'brokers', component: Brokers },
  { path: '/broker/:slug', name: 'broker-detail', component: BrokerDetail },
  { path: '/tagesgeld', name: 'savings', component: Savings },
  { path: '/tagesgeld/:slug', name: 'savings-detail', component: SavingsDetail },
  { path: '/ratgeber', name: 'guide', component: Guide },
  { path: '/ratgeber/:slug', name: 'guide-detail', component: GuideDetail },
  { path: '/antrag/:slug', name: 'apply', component: Apply },
  { path: '/danke', name: 'thanks', component: Thanks },
  { path: '/datenschutz', name: 'privacy', component: Privacy },
  { path: '/impressum', name: 'imprint', component: Imprint },
  { path: '/kontakt', name: 'contact', component: Contact },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  }
})

router.afterEach((to) => {
  try { applyRouteMeta(to) } catch (_) {}
})

export default router
