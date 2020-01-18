import Vue from 'vue'
import App from './App.vue';
import VueResource from 'vue-resource'
import VueRouter from 'vue-router' 
import Document from './components/Document.vue';
import tinyMCE from './components/TinyMCE.vue';
import DocumentList from './components/DocumentList.vue';
import DocumentItem from './components/DocumentItem.vue';
import SuiVue from 'semantic-ui-vue'; 

Vue.use(VueResource)
Vue.use(SuiVue);


Vue.config.productionTip = false
Vue.component('Document', Document);
Vue.component('DocumentList', DocumentList);
Vue.component('DocumentItem', DocumentItem);
Vue.component('tinymce', tinyMCE);


import routes from './router';
const router = new VueRouter({
    mode:'history',
    routes: routes
})
Vue.use(VueRouter)

Vue.http.headers.common['Authorization'] = 'Bearer test_TOKEN123';

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
