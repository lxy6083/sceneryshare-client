import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: 'home'
    },
    {
        path: '/login',
        name: 'Login',
        component: () =>
            import ('@/views/Login.vue')
    },
    {
        path: '/home',
        name: 'Home',
        component: () =>
            import ('@/views/Home.vue')
    },
    {
        path: '/recoverPwd',
        name: 'RecoverPwd',
        component: () =>
            import ('@/views/RecoverPwd.vue')
    },
    {
        path: '/register',
        name: 'Register',
        component: () =>
            import ('@/views/Register.vue')
    },
    {
        path: '/share',
        name: 'Share',
        component: () =>
            import ('@/views/Share.vue')
    },
    {
        path: '/myShare',
        name: 'MyShare',
        component: () =>
            import ('@/views/MyShare.vue')
    },
    {
      path: '/myCollection',
      name: 'MyCollection',
      component: () =>
          import ('@/views/MyCollection.vue')
    },
    {
        path: '/updateUser',
        name: 'UpdateUser',
        component: () =>
            import ('@/views/UpdateUser.vue')
    },
    {
        path: '/feedback',
        name: 'Feedback',
        component: () =>
            import ('@/views/Feedback.vue')
    },
    {
        path: '/addShare',
        name: 'AddShare',
        component: () =>
            import ('@/views/AddShare.vue')
    },
    {
        path: '/shareDetail',
        name: 'ShareDetail',
        component: () =>
            import ('@/views/ShareDetail.vue')
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router