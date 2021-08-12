import Vue from 'vue'
import App from './App.vue'
import router from './router'

// store.js 로딩
import { store } from './store/store'

Vue.config.productionTip = false

new Vue({
  router,
  store: store,
  render: h => h(App)
}).$mount('#app')
