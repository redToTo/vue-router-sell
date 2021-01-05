import Vue from 'vue'
import './cube-ui'
import App from './App.vue'
import VueRouter from 'vue-router'
import 'common/stylus/index.styl'
import goods from './components/goods/good.vue'
import ratings from './components/ratings/ratings.vue'
import seller from './components/seller/seller.vue'

Vue.config.productionTip = false
Vue.use(VueRouter)
const routes = [
  { path: '/good', component: goods },
  { path: '/ratings', component: ratings },
  { path: '/seller', component: seller },
  { path: '*', redirect: '/good' }
]
const router = new VueRouter({
  
  routes // (缩写) 相当于 routes: routes
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
