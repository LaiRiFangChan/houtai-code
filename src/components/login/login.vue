<template>
  <div class="login-wrap">
    <el-form :model="fromdata" label-position="top" ref="ruleForm" label-width="80px" :rules="rules" >
      <h2>用户登录</h2>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="fromdata.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="fromdata.password" @keyup.enter.native='login'></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="login-btn" type="primary" @click.prevent="login">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 双向绑定的数据
      fromdata: {
        username: '',
        password: ''
      },
      // 验证规则
      rules: {
        username: [{ required: true, message: '请输入帐号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 绑定的点击事件方法
    login () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$http({
            method: 'post',
            url: 'login',
            data: this.fromdata
          }).then(res => {
            console.log(res)
            let { data, meta } = res.data
            // 判断
            if (meta.status === 200) {
              // 将token保存
              window.localStorage.setItem('token', data.token)
              // 成功后跳转到首页
              this.$router.push('/')
              // 成功后跳出提示成功框
              this.$message({
                message: meta.msg,
                type: 'success'
              })
            } else {
              // 失败提示
              this.$message.error('密码错误')
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.login-wrap {
  background-color: #324152;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-form.el-form--label-top {
  padding: 40px;
  width: 500px;
  border-radius: 5px;
  background-color: #fff;
}
.el-form .login-btn {
  width: 100%;
}
</style>
