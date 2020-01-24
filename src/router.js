
import DocumentPage from './DocumentPage.vue';
import DocumentListPage from './DocumentListPage.vue';

import NetworkPage from './views/NetworkPage.vue';
import TestPage from './views/TestPage.vue';

const routes = [

  {
    path: '/',
    component:  DocumentListPage,
    name: 'root',
  }, 
  {
    path: '/Network/:uuidNeuron',
    component:  NetworkPage,
    name: 'NetworkPage'
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
    path: '/Test',
    component:  TestPage,
    name: 'TestPage',
  },

  {
    path: '*',
    redirect: '/',
  }];

export default routes;
