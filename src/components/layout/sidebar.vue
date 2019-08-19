<template>
     <el-menu :router="true" :unique-opened="true" default-active="2" class="mymenu el-menu-vertical-demo">
          <el-submenu v-for="(item,index) in menuslist" :key="index" :index="item.path">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item v-for="(item1,index1) in item.children" :key="index1" :index="'/'+item1.path">
              <i class="el-icon-menu"></i>
              <span>{{item1.authName}}</span>
            </el-menu-item>
          </el-submenu>

        </el-menu>
</template>

<script>
export default {
  data () {
    return {
      menuslist: []
    }
  },
  methods: {
    getleftmenus () {
      this.$http({
        method: 'get',
        url: 'menus'
      }).then(res => {
        let {meta, data} = res.data
        if (meta.status == 200) {
          this.menuslist = data
        } else {
          this.$message.error(meta.msg)
        }
      })
    }
  },
  mounted () {
    this.getleftmenus()
  }

}
</script>

<style>

</style>
