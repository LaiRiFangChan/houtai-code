<template>
  <el-card>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button plain class="but">添加角色</el-button>
    <!-- 表格 -->
    <el-table :data="roleslist" border style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- {{scope.row}} -->
          <!-- 遍历一级权限 -->
          <el-row v-for="(item1,index1) in scope.row.children" :key="index1">
            <el-col :span="4">
              <!-- 一级权限 -->
              <el-tag
                @close="delroles(scope.row.id,item1.id,scope.row)"
                class="tag1"
                closable
              >{{item1.authName}}{{item1.id}}</el-tag>
            </el-col>
            <el-col :span="20">
              <!-- 遍历二级权限 -->
              <el-row v-for="(item2,index2) in item1.children" :key="index2">
                <el-col :span="4">
                  <!-- 二级权限 -->
                  <el-tag
                    @close="delroles(scope.row.id,item2.id,scope.row)"
                    class="tag2"
                    closable
                    type="success"
                  >{{item2.authName}}{{item2.id}}</el-tag>
                </el-col>
                <el-col :span="20">
                  <!-- 三级权限 -->
                  <el-tag
                    @close="delroles(scope.row.id,item3.id,scope.row)"
                    class="tag3"
                    closable
                    type="danger"
                    v-for="(item3,index3) in item2.children"
                    :key="index3"
                  >{{item3.authName}}{{item3.id}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="roleName" name="角色名称" width="180"></el-table-column>
      <el-table-column prop="roleDesc" name="角色描述"></el-table-column>
      <el-table-column name="操作">
        <el-row slot-scope="scope">
          <!-- {{scope.row}} -->
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
          <el-button
            @click="oppencheck(scope.row.children,scope.row.id)"
            type="success"
            icon="el-icon-check"
            size="mini"
          ></el-button>
        </el-row>
      </el-table-column>
    </el-table>
    <!-- 分配权限框 -->
    <el-dialog title="分配权限" :visible.sync="roledialog">
      <!-- 树形控件 -->
      <!-- data: 数据源 -->
      <!-- props: 当前 tree 的配置项  -->
      <!-- node-key：给当前树状结构设置唯一标签 -->
      <!-- default-checked-keys: 不能单独使用，配置 node-Key 使用 -->
      <!-- default-expand-all: 是否默认展开所有节点 -->
      <el-tree
        ref="mytree"
        :data="treedata"
        node-key="id"
        :default-checked-keys="defaultChecked"
        show-checkbox
        :props="propsObj"
        :default-expand-all="true"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roledialog = false">取 消</el-button>
        <el-button type="primary" @click="setRightfn">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      // 数据源
      roleslist: [],
      // 权限对话框的显示和隐藏
      roledialog: false,
      // 分配框数据源
      treedata: [],
      // 设置tree的配置项
      propsObj: {
        label: 'authName',
        children: 'children'
      },
      // 树形控件打开默认选中的项,他是一个数组，需要配合node-key唯一标识使用
      defaultChecked: [],
      // 要修改权限用户的id
      roleId: 0
    }
  },
  methods: {
    // 得到所有的角色
    getroleslist () {
      this.$http({
        method: 'get',
        url: 'roles'
      }).then(res => {
        console.log(res)

        let { meta, data } = res.data
        if (meta.status == 200) {
          this.roleslist = data
        } else {
          this.$message.error(meta.msg)
        }
      })
    },
    // 删除权限
    delroles (roleid, rightid, scoperow) {
      // console.log(roleid,rightid);
      this.$http({
        method: 'delete',
        url: `roles/${roleid}/rights/${rightid}`
      }).then(res => {
        let { data, meta } = res.data
        if (meta.status == 200) {
          this.$message.success(meta.msg)
          scoperow.children = data
        } else {
          this.$message.error(meta.msg)
        }
      })
    },
    // 点击钩子打开权限分配面板
    oppencheck (datalist, roleId) {
      // 保存要修改权限用户的id
      this.roleId = roleId
      // 清除所有标记好的默认权限
      this.defaultChecked = []
      // 获取权限数据
      this.$http({
        method: 'get',
        // 地址是rights，参数是tree树形控件
        url: 'rights/tree'
      }).then(res => {
        // console.log(res);
        let { data, meta } = res.data
        if (meta.status == 200) {
          // 保存所有的权限
          this.treedata = data
          // 设置默认选中的元素
          // 遍历一级权限
          datalist.forEach(item1 => {
            // 遍历二级权限
            item1.children.forEach(item2 => {
              // 三级遍历
              item2.children.forEach(item3 => {
                // 添加到树形控件默认选中的项中
                this.defaultChecked.push(item3.id)
              })
            })
          })
        } else {
          this.$message.error(meta.msg)
        }
      })
      // 点击打开面板
      this.roledialog = true
    },
    // 提交权限数据
    setRightfn () {
      // 得到全选
      let allIds = this.$refs.mytree.getCheckedKeys()
      // 得到半选
      let halfIds = this.$refs.mytree.getHalfCheckedKeys()
      // 接收
      let rids = [...allIds, ...halfIds]
      this.$http({
        method: 'post',
        url: `roles/${this.roleId}/rights`,
        data: {
          rids: rids.join(',')
        }
      }).then(res => {
        let {data, meta} = res.data
        if (meta.status == 200) {
          this.getroleslist()
          this.$message.success(meta.msg)
        } else {
          this.$message.error(meta.msg)
        }
      })
      // 关闭面板
      this.roledialog = false
    }

  },
  mounted () {
    this.getroleslist()
  }
}
</script>

<style>
.but {
  margin: 10px 0;
}
.tag1,
.tag2,
.tag3 {
  margin-top: 10px;
}

.tag3 {
  margin-right: 10px;
}
</style>
