import Vue from 'vue'
import Router from 'vue-router'
// 引入登录路由
import login from '../components/login/login.vue'
// 首页路由
import home from '../components/home/home.vue'
// 内容路由
import user from '../components/users/users.vue'
// 权限列表路由
import rights from '../components/rights/rights.vue'
// 角色列表组件
import roles from '../components/roles/roles.vue'
// 商品分类路由组件
import categories from '../components/categories/categories.vue'
// 商品列表路由组件
import goods from '../components/goods/goods.vue'
// 添加商品路由
import add from '../components/add/add.vue'
import { Message } from 'element-ui'
//百度地图路由组件
import orders from '../components/orders/orders.vue'
//图形化组件
import reports from '../components/reports/reports.vue'

Vue.use(Router)
// 创建一个路由对象
let router = new Router({
  // 重定项
  routes: [{ path: '/', redirect: '/home'
  },
  { path: '/login', name: 'login', component: login
  },
  { path: '/home',
    component: home,
    children: [
    // 内容路由
      { path: '/users', component: user},
      // 权限列表路由
      {path: '/rights', component: rights},
      // 角色列表路由
      {path: '/roles', component: roles},
      // 商品分类路由
      {path: '/categories', component: categories},
      // 商品列表路由
      {path: '/goods', component: goods},
      // 添加商品路由
      {path: '/goods/add', component: add},
      //百度地图路由
      {path: '/orders', component: orders},
      //图形化路由
      {path:'/reports',component:reports}




    ]
  }

  ]
})
// 验证是否登录
router.beforeEach(function (to, from, next) {
  // 判断目标路径是否是login，如果是，直接向后执行
  if (to.name !== 'login') {
    // 获取token
    let token = window.localStorage.getItem('token')
    // 判断是否存在token
    if (!token) {
      // 如果不在，则跳转到login重新登录
      router.push('/login')
      Message.error('请先登录')
    } else {
      next()
    }
    // 否则继续执行
  } else {
    next()
  }
})

export default router
