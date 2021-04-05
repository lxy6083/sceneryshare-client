import Vue from 'vue'
import './assets/css/base.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from './router'
import store from './store/index'
import VDistpicker from 'v-distpicker'
import VueQuillEditor from 'vue-quill-editor'
import VueVideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'


// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import './assets/icon/iconfont.css'
import BaiduMap from 'vue-baidu-map'

Vue.use(BaiduMap, {
    /* Visit http://lbsyun.baidu.com/apiconsole/key for details about app key. */
    ak: 'lPgXcHDbYoHzngwMzfprBC6zKGEUVR0h'
})

Vue.component('v-distpicker', VDistpicker);

Vue.use(ElementUI);
Vue.use(VueQuillEditor);
Vue.use(VueVideoPlayer);

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')