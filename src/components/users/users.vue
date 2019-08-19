<template>
  <el-card>
    <!-- 头部 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-row class="myrow">
      <el-col :span="6">
        <el-input placeholder="请输入内容" class="input-with-select" v-model="query">
          <el-button slot="append" icon="el-icon-search" @click.prevent="search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="3">
        <el-button type="success" plain @click.prevent="open">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <!-- {{scope.row}} -->
          <el-switch @change='schange(scope.row.id,scope.row.mg_state)' v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row.id)"></el-button>
          <el-button @click="del(scope.row.id)" type="danger" icon="el-icon-delete" size="mini"></el-button>
          <el-button @click="roles(scope.row.id)" type="success" icon="el-icon-check" size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @current-change="curChange"
      @size-change="sizeChange"
      :current-page="pagenum"
      :page-sizes="pagesizes"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 点击新增弹出框 -->
    <el-dialog title="添加用户" :visible.sync="addDlg">
      <el-form :model="dialoguser">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input autocomplete="off" v-model="dialoguser.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input autocomplete="off" type="password" v-model="dialoguser.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input autocomplete="off" v-model="dialoguser.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input autocomplete="off" v-model="dialoguser.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="hide">取 消</el-button>
        <el-button type="primary" @click="adduser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户 -->
    <el-dialog title="编辑用户" :visible.sync="editDlg">
      <!-- 双向绑定事件数据 -->
      <!-- {{edituser}} -->
      <el-form :model="edituser">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input autocomplete="off" :disabled="true" v-model="edituser.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input autocomplete="off" v-model="edituser.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input autocomplete="off" v-model="edituser.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="hide">取 消</el-button>
        <el-button type="primary" @click="editfn">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配用户 -->
    <el-dialog title="分配用户" :visible.sync="rolesDlg">
      <el-form :model="rolesuser">
        <el-form-item label="当前用户" :label-width="formLabelWidth">
          <el-input v-model="rolesuser.username" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="选择角色" :label-width="formLabelWidth">
          <el-select placeholder="请选择" v-model="rolesuser.rid">
            <el-option
              v-for="item in seldatalist"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="hide">取 消</el-button>
        <el-button @click="rolesfn" type="primary">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      // 数据源
      tableData: [],
      // 查询的数据
      query: '',
      // 当前页
      pagenum: 1,
      // 页容量
      pagesize: 5,
      // 页容量的选项
      pagesizes: [5, 10],
      // 数据的总跳数
      total: 0,
      // 控制新增框的显示和隐藏
      addDlg: false,
      // 设置表头的宽度
      formLabelWidth: '100px',
      // 双向绑定新增框的数据
      dialoguser: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 编辑用户数据
      edituser: {
        username: '',
        email: '',
        mobile: '',
        id: ''
      },
      // 编辑用户弹出框的显示跟隐藏
      editDlg: false,
      // 分配角色框隐藏

      rolesDlg: false,
      // 下拉框中的数据
      seldatalist: [],
      // 分配角色对象
      rolesuser: {
        username: '',
        id: '',
        rid: ''
      }
    }
  },
  methods: {
    // 获取数据渲染到页面上
    getDatalist () {
      this.$http({
        method: 'get',
        url: `users?query=${
          this.query
        }&pagenum=${this.pagenum}&pagesize=${this.pagesize}`

      }).then(res => {
        console.log(res)
        // 解构
        let { data, meta } = res.data
        if (meta.status === 200) {
          // 判断获取的数据长度等于0，需要将当前页-1

          if (data.users.length === 0 && this.pagenum !== 1) {
            this.pagenum--
            this.getDatalist()
            return
          }

          this.tableData = data.users
          this.total = data.total
        }
      })
    },
    // 当前页改变时重新获取新的数据渲染到改变的页码中
    curChange (currentPage) {
      // 赋值给当前页
      this.pagenum = currentPage
      // 重新获取数据
      this.getDatalist()
    },
    sizeChange (pageSize) {
      this.pagesize = pageSize
      this.getDatalist()
    },
    // 搜索数据
    search () {
      this.pagenum = 1
      this.getDatalist()
    },
    // 打开新增框
    open () {
      this.addDlg = true
    },
    // 点击取消隐藏新增框
    hide () {
      this.addDlg = false
      this.editDlg = false
      this.rolesDlg = false
    },
    // 新增数据
    adduser () {
      this.$http({
        method: 'post',
        url: 'users',

        data: this.dialoguser
      }).then(res => {
        let { meta } = res.data
        if (meta.status == 201) {
          // 提示框
          this.$message({
            message: meta.msg,
            type: 'success'
          })
          this.getDatalist()
        } else {
          this.$message.error(meta.msg)
        }
        // 点击完确定键后新增一个用户数据并且关闭新增框
        this.addDlg = false
        // 再次打开新增框的时候清空上一次输入的数据
        this.dialoguser.username = ''
        this.dialoguser.password = ''
        this.dialoguser.email = ''
        this.dialoguser.mobile = ''
      })
    },
    // 删除数据
    del (id) {
      this.$http({
        method: 'delete',
        url: `users/${id}`

      }).then(res => {
        let { meta } = res.data
        if (meta.status == 200) {
          this.$message({
            message: meta.msg,
            type: 'success'
          })
          this.getDatalist()
        } else {
          this.$message.error(meta.msg)
        }
      })
    },
    // 编辑数据渲染到弹出框
    edit (id) {
      // 发送请求
      this.$http({
        method: 'get',
        url: `users/${id}`

      }).then(res => {
        let { meta, data } = res.data
        if (meta.status === 200) {
          console.log(data)

          this.edituser.username = data.username
          this.edituser.email = data.email
          this.edituser.mobile = data.mobile
          this.edituser.id = data.id
        }
      })
      // 点击后打开编辑面板
      this.editDlg = true
    },
    // 提交修改数据渲染页面
    editfn () {
      this.$http({
        method: 'put',
        url: `users/${this.edituser.id}`,
        data: {
          email: this.edituser.email,
          mobile: this.edituser.mobile
        }

      }).then(res => {
        let { meta } = res.data
        if (meta.status == 200) {
          this.$message({
            message: meta.msg,
            type: 'success'
          })
          this.getDatalist()
        } else {
          this.$message.error(meta.msg)
        }
        this.editDlg = false
      })
    },
    // 打开角色分配框,获取到数据渲染到页面上
    roles (id) {
      // 动态获取下拉框的数据
      this.$http({
        method: 'get',
        url: 'roles'

      }).then(res => {
        console.log(res)
        let { data, meta } = res.data
        if (meta.status == 200) {
          // 得到下拉框的数据
          this.seldatalist = data
          // 获取用户信息的数据绑定到页面上
          this.$http({
            method: 'get',
            url: `users/${id}`,
            headers: {
              Authorization: window.localStorage.getItem('token')
            }
          }).then(res => {
            let {meta, data} = res.data
            if (meta.status === 200) {
              this.rolesuser.username = data.username
              this.rolesuser.id = data.id
              this.rolesuser.rid = data.rid
            }
          })
        } else {
          this.$message.error(meta.msg)
        }
      })
      this.rolesDlg = true
    },
    // 提交修改后的角色分配框的数据
    rolesfn () {
      this.$http({
        method: 'put',
        url: `users/${this.rolesuser.id}/role`,

        data: {
          rid: this.rolesuser.rid
        }
      }).then(res => {
        let {meta} = res.data
        if (meta.status === 200) {
          this.$message({
            message: meta.msg,
            type: 'success'
          })
        } else {
          this.$message.error(meta.msg)
        }
      })
      this.rolesDlg = false
    },
    // 开关状态改变时促发的事件
    schange (uId, type) {
      this.$http({
        method: 'put',
        url: `users/${uId}/state/${type}`

      }).then(res => {
        let {data, meta} = res.data
        if (meta.status == 200) {
          this.$message({
            message: meta.msg,
            type: 'success'
          })
        } else {
          this.$message.error(meta.msg)
        }
      })
    }
  },
  mounted () {
    this.getDatalist()
  }
}
</script>

<style>
.myrow {
  margin-top: 10px;
}
</style>
