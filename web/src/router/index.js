import { createRouter, createWebHistory } from 'vue-router'

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
import Guide from '../views/Guide.vue'
import GuideDetail from '../views/GuideDetail.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/kreditkarten', component: Cards },
  { path: '/kreditkarten/:slug', component: CardDetail },
  { path: '/broker', component: Brokers },
  { path: '/broker/:slug', component: BrokerDetail },
  { path: '/tagesgeld', component: Savings },
  { path: '/ratgeber', component: Guide },
  { path: '/ratgeber/:slug', component: GuideDetail },
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
