
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
    name: 'NetworkPage',
		meta: {
			title: 'Network',
			icon: 'sitemap'
		}
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
		meta: {
			title: 'Document',
			icon: 'file alternate'
		}
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
