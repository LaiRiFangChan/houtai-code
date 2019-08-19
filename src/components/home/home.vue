<template>
  <el-container>
    <el-header>
      <!-- 头部封装为组件 -->
      <tophead/>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <!-- 侧边栏 -->
        <sidebar/>
      </el-aside>
      <el-main>
        <!-- 渲染内容的容器 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// 引入头部和侧边栏组件
import tophead from '@/components/layout/tophead'
import sidebar from '../layout/sidebar.vue'
export default {
  components: {
    tophead: tophead,
    sidebar: sidebar
  }
  // 判断是否登录
  // mounted() {
  //   // 获取token
  //   let token = window.localStorage.getItem("token");
  //   // 判断是否存在
  //   if (!token) {
  //     // 如果token不存在则返回登录页面并且提示
  //     this.$router.push("/login")
  //   }
  // }
}
</script>

<style>
.el-container {
  height: 100%;
}
.el-header {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
  color: #fff;
}
.el-aside {
  background-color: #d3dce6;
  color: #333;
  line-height: 200px;
  height: 100%;
}
.mymenu {
  height: 100%;
}
.el-main {
  background-color: #e9eef3;
  color: #333;
  /* text-align: center; */
  /* line-height: 160px; */
  height: 100%;
}
.myrow h2 {
  line-height: 50%;
}
.myrow a {
  text-decoration: none;
  float: right;
}
</style>
