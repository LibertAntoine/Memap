import Vue from 'vue'
import VueResource from 'vue-resource'
import App from './App.vue'

Vue.config.productionTip = false

Vue.use(VueResource)

Vue.http.headers.common['Authorization'] = 'Bearer test_TOKEN123';

new Vue({
  render: h => h(App),
}).$mount('#app')
