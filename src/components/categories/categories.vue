<template>
  <el-card>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 按钮 -->
    <el-button plain class="butn" @click="openadd">添加分类</el-button>
    <!-- 表格  插件tree-->
    <el-table v-loading="loading" :data="pagecatelist" border style="width: 100%">
      <!-- treeKey:唯一标识
         parentKey：父元素的唯一标识
         levelKey：元素的级别
      prop：名字-->
      <el-table-tree-column
        file-icon="icon icon-file"
        folder-icon="icon icon-folder"
        treeKey="cat_id"
        parentKey="cat_pid"
        levelKey="cat_level"
        prop="cat_name"
        label="分类名称"
        width="180"
      ></el-table-tree-column>
      <el-table-column prop="cat_level" label="级别" width="180">
        <template
          slot-scope="scope"
        >{{scope.row.cat_level==0 ? '一级': scope.row.cat_level==1?'二级':'三级'}}</template>
      </el-table-column>
      <el-table-column label="是否有效">
        <template slot-scope="scope">{{scope.row.cat_deleted ? '无效':'有效' }}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template >
          <!-- {{scope.row}} -->
          <el-button type="primary" icon="el-icon-edit" plain size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" plain size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页
    当前页改变时执行的方法
    @current-change="curChange"
    当页容量改变时执行的方法
     @size-change="sizeChange"
     当前页
     :current-page='pagenum'
    -->
    <el-pagination
      @size-change="sizeChange"
      :current-page="pagenum"
      @current-change="currentChange"
      :page-sizes="pagesiezs"
      :page-size="pagenum"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 新增对话框 -->
    <el-dialog title="添加商品分类" :visible.sync="adddialog">
      <el-form>
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input v-model="cateName"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <!-- 级联框 -->
          <!-- {{Jlvalue}} -->
          <el-cascader clearable v-model="Jlvalue" :options="Jloptions" :props="propsObj"></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="adddialog=false">取 消</el-button>
        <el-button type="primary" @click="addcatefn">确 定</el-button>
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
      // 当前页
      pagenum: 1,
      // 页容量,当前页面见到的数据条数
      pagesize: 5,
      // 分页数据源
      pagecatelist: [],
      // 总条数
      total: 0,
      // 页容量集合
      pagesiezs: [5, 10, 15],
      // 加载动画
      loading: true,
      // 新增框显示和隐藏
      adddialog: false,
      // 设置表头的宽度
      formLabelWidth: '80px',
      // 双向绑定级联框
      Jlvalue: [],
      // 级联框数据源,他返回的数据是一个对象
      Jloptions: [],
      // 级联框的配置项，
      propsObj: {
        // 触发的事件
        expandTrigger: 'click',
        label: 'cat_name',
        value: 'cat_id',
        // 设置任意选中
        checkStrictly: true
      },
      // 新增分类的名称
      cateName: ''
    }
  },
  methods: {
    // 获取数据渲染到页面上
    getcategories () {
      this.$http({
        method: 'get',
        url: 'categories'
      }).then(res => {
        let { meta, data } = res.data
        if (meta.status == 200) {
          // 保存数据源
          this.tableData = data
          // 得到总条数
          this.total = data.length
          // 获取分页数据
          this.getPagecatelist()
          // 数据加载动画
          setTimeout(() => {
            this.loading = false
          }, 1000)
        }
      })
    },
    // 从数据源中截取当前页的数据
    getPagecatelist () {
      // 定义开始的
      let begin = this.pagesize * (this.pagenum - 1)
      // 定义结束
      let end = this.pagesize * this.pagenum
      // 截取slice
      this.pagecatelist = this.tableData.slice(begin, end)
    },
    // 当前页改变时执行的方法
    currentChange (currentnum) {
      // 给当前页赋值
      this.pagenum = currentnum
      this.getPagecatelist()
    },
    // 当页容量改变时执行的方法
    sizeChange (pagesize) {
      this.pagesize = pagesize
      this.getPagecatelist()
    },
    // 点击打开新增商品分类
    openadd () {
      this.adddialog = true
      this.getJloptions()
      this.cateName = ''
    },
    // 自定义一个方法获得级联框中的数据
    getJloptions () {
      this.$http({
        url: 'categories?type=2',
        method: 'get'
      }).then(res => {
        let {meta, data} = res.data
        if (meta.status == 200) {
          this.Jloptions = data
        } else {
          this.$message.error(meta.msg)
        }
      })
    },
    // 提交新增框的数据渲染到页面
    addcatefn () {
      // 判断是否有给分类选择父分类，如果有选择  则取最后一项为父元素的 id
      // 如果没有，则为0
      var pid = this.Jlvalue.length === 0 ? 0 : this.Jlvalue[this.Jlvalue.length - 1]
      this.$http({
        method: 'post',
        url: 'categories',
        data: {
          cat_pid: pid,
          cat_name: this.cateName,
          cat_level: this.Jlvalue.length
        }
      }).then(res => {
        // console.log(res);
        let {data, meta} = res.data
        if (meta.status == 201) {
          this.$message.success(meta.msg)
          // 刷新数据
          this.getcategories()
        } else {
          this.$message.error(meta.msg)
        }
      })
      this.adddialog = false
    }

  },
  mounted () {
    this.getcategories()
  }
}
</script>

<style>
.butn {
  margin: 10px 0;
}
</style>
