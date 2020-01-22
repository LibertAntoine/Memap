
import DocumentPage from './DocumentPage.vue';
import DocumentListPage from './DocumentListPage.vue';

import NetworkPage from './views/NetworkPage.vue';

const routes = [

  {
    path: '/',
    component:  DocumentListPage,
    name: 'root',
  }, 
  {
    path: '/Network',
    component:  NetworkPage,
    name: 'Network'
  }, 
  {
    path: '/Document',
    component:  DocumentListPage,
    name: 'DocumentList'
  }, 
  {
    path: '/Document/:id',
    component:  DocumentPage,
    name: 'Document',
  },

  {
    path: '*',
    redirect: '/',
  }];

export default routes;
