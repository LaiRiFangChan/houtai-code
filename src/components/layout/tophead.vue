<template>
  <el-row class="myrow">
    <el-col :span="4">Hello Word</el-col>
    <el-col :span="16">
      <h2>电商后台管理系统</h2>
    </el-col>
    <el-col :span="4">
      <a href="#" @click.prevent="logout">退出</a>
    </el-col>
  </el-row>
</template>

<script>
export default {
  methods: {
    // 点击退出清除token，弹出退出成功框
    logout () {
      // if (confirm('您确定要退出吗？')) {
      //   // 清除token
      //   window.localStorage.removeItem('token')
      //   this.$router.push('/login')
      //   // 提示框
      //   this.$message({
      //     message: '退出成功',
      //     type: 'success'
      //   })
      // }
      this.$confirm('您确定退出吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        window.localStorage.removeItem('token')
        this.$router.push('login')
        this.$message({
          type: 'success',
          message: '退出成功'
        })
      })
    }
  }
}
</script>

<style>
</style>
