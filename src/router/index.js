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
        meta: {
            requireAuth: true,
        },
        component: () =>
            import ('@/views/MyShare.vue')
    },
    {
      path: '/myCollection',
      name: 'MyCollection',
      meta: {
          requireAuth: true,
      },
      component: () =>
          import ('@/views/MyCollection.vue')
    },
    {
        path: '/updateUser',
        name: 'UpdateUser',
        meta: {
          requireAuth: true
        },
        component: () =>
            import ('@/views/UpdateUser.vue')
    },
    {
        path: '/feedback',
        name: 'Feedback',
        meta: {
            requireAuth: true
        },
        component: () =>
            import ('@/views/Feedback.vue')
    },
    {
        path: '/addShare',
        name: 'AddShare',
        meta: {
          requireAuth: true
        },
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

router.beforeEach((to, from, next) => {
    if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
        let isLogin = sessionStorage.getItem('isLogin');
        console.log(isLogin);
        if (isLogin && isLogin === 'true') {  // 通过vuex state获取当前的userId是否存在
            next();
        }
        else {
            next({
                path: '/login',
                query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
            })
        }
    }
    else {
        next();
    }
})

const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return routerPush.call(this, location).catch(error=> error)
}

export default router