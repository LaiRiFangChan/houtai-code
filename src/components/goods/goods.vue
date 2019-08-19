<template>
  <el-card>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-row class="myrow">
      <el-col :span="6">
        <el-input placeholder="请输入内容" class="input-with-select" v-model="query">
          <el-button slot="append" icon="el-icon-search" @click.prevent="search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="3">
        <el-button type="success" plain @click.prevent="$router.push('/goods/add')">添加商品</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
     <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="400"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
      <el-table-column prop="goods_number" label="商品数量"></el-table-column>
      <el-table-column prop="add_time" label="创建时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
            <!-- {{scope.row}} -->
          <el-button type="primary" icon="el-icon-edit" size="mini" ></el-button>
          <el-button  type="danger" icon="el-icon-delete" size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
     @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page='pagenum'
      :page-sizes="pagesizes"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 添加商品 -->

  </el-card>
</template>

<script>
export default {
  data () {
    return {
      // 数据源
      tableData: [],
      // 当前页
      pagenum: 1,
      // 页容量
      pagesize: 5,
      // 页容量的选项
      pagesizes: [5, 10, 15],
      // 数据的总条数
      total: 0,
      // 查询的关键字
      query: ''
    }
  },
  methods: {
    // 获取数据渲染到页面上
    getgoods () {
      this.$http({
        url: `goods?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`,
        method: 'get'
      }).then(res => {
        console.log(res)
        let {data, meta} = res.data
        if (meta.status == 200) {
          // 给商品数据赋值渲染到页面上
          this.tableData = data.goods
          // 给总条数赋值
          this.total = data.total
        } else {
          this.$message.error(meta.msg)
        }
      })
    },
    // 当前页切换修改数据
    handleCurrentChange (pagenum) {
      this.pagenum = pagenum
      this.getgoods()
    },
    // 页容量切换数据时修改数据
    handleSizeChange (pagesize) {
      this.pagesize = pagesize
      this.getgoods()
    },
    // 搜索数据
    search () {
      this.getgoods()
    },
    // 点击添加商品跳转页面
    openadd () {

    }
  },
  mounted () {
    this.getgoods()
  }
}
</script>

<style>
.myrow{
    margin: 10px 0px;
}
</style>
