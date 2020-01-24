import Vue from 'vue'
import App from './App.vue';
import VueResource from 'vue-resource'
import VueRouter from 'vue-router' 
import UUID from 'vue-uuid';
import SuiVue from 'semantic-ui-vue'; 

import store from './store'

Vue.use(UUID);
Vue.use(VueResource);
Vue.use(SuiVue);


Vue.config.productionTip = false


import routes from './router';
const router = new VueRouter({
    mode:'history',
    routes
})

Vue.use(VueRouter)

Vue.http.headers.common['Authorization'] = 'Bearer test_TOKEN123';

new Vue({
  render: h => h(App),
  router,
	store
}).$mount('#app')
