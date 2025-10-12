import { createRouter, createWebHistory } from 'vue-router'
import { applyRouteMeta } from '../seo'

const Home = () => import('../views/Home.vue')
const Cards = () => import('../views/Cards.vue')
const CardDetail = () => import('../views/CardDetail.vue')
const Apply = () => import('../views/Apply.vue')
const Thanks = () => import('../views/Thanks.vue')
const Privacy = () => import('../views/Privacy.vue')
const Imprint = () => import('../views/Imprint.vue')
const Contact = () => import('../views/Contact.vue')
const Brokers = () => import('../views/Brokers.vue')
const BrokerDetail = () => import('../views/BrokerDetail.vue')
const Savings = () => import('../views/Savings.vue')
const SavingsDetail = () => import('../views/SavingsDetail.vue')
const Guide = () => import('../views/Guide.vue')
const GuideDetail = () => import('../views/GuideDetail.vue')

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
