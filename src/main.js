// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// 引用element-ui
import element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './css/index.css'
import Eltree from 'element-tree-grid'
// 引入myaxios插件
import myaxios from './assets/js/myaxios.js'
// 导入富文本编辑框
import VueQuillEditor from 'vue-quill-editor'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor)
Vue.config.productionTip = false

// 使用
Vue.use(element)
// 使用插件
Vue.use(myaxios)
/* eslint-disable no-new */
Vue.component(Eltree.name, Eltree)
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
