
const routes = [
  {
    path: '/popup',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/PopupPage.vue') }
    ]
  },
  {
    path: '/options',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/OptionsPage.vue') }
    ]
  },

  // { path: '/options', component: () => import('pages/OptionsPage.vue') },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
