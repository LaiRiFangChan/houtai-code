<template>
  <el-card>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 提示框alert -->
    <el-alert class="myalert" title="添加商品信息" type="info" center show-icon></el-alert>
    <!-- 步骤跳
    finish-status="success"完成时的状态
   :active="active" 已经完成的步骤
    align-center 步骤条剧中-->
    <el-steps class="mysteps" :active="active" align-center finish-status="success">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <!-- tab选项
     tabPosition="left" 左对齐
     v-model="activenave" 打开默认选中的tab
    @tab-click="handleClick" tab的点击事件进行步骤条联动-->
    <el-tabs tabPosition="left" v-model="activenave" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="first">
        <!-- form表单 -->
        <el-form label-position="top" label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="addObj.goods_name" ></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="addObj.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="addObj.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="addObj.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <!-- 级联框 -->
            {{ cateCas }}
            <el-cascader v-model="cateCas" :options="cateList" :props="propsObj"></el-cascader>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品参数" name="two">
        <div v-for="(item,index) in goodMany" :key="index">
          <div class="mybox">{{item.attr_name}}</div>
          <div>
            <el-checkbox
              v-for="(item1,index1) in item.attr_vals.split(',')"
              :key="index1"
              border
              v-model="checked"
            >{{item1}}</el-checkbox>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="商品属性" name="three">
        <el-form label-position="top" label-width="80px">
          <el-form-item v-for="(item,index) in goodOnly" :key="index" :label="item.attr_name">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="four">
        <!-- 上传图片
        action：地址-->
        <el-upload
          action="http://localhost:8888/api/private/v1/upload"
          :headers="upheader"
          :on-success="imgSuccess"
          :on-remove="imgremove"
          list-type="picture"
          :on-preview="imgpreview"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
        {{ fileList }}
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="five">
        <el-button type="primary" @click="addGoods">添加商品</el-button>
        <!-- 富文本编辑框 -->
        <quill-editor
          v-model="addObj.goods_introduce"
          ref="myQuillEditor"
        ></quill-editor>
      </el-tab-pane>
    </el-tabs>
    <!-- 点击预览图片 -->
    <el-dialog title="图片预览" :visible.sync="imgDialog">
      <img ref="myres" style="width: 100%;height: 100%" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="imgDialog = false">取 消</el-button>
        <el-button type="primary" @click="imgDialog = false">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      // 步骤跳的步骤
      active: 0,
      // 默认选中的tab名称
      activenave: 'first',
      // 商品分类级联框的双向绑定数据
      cateCas: [],
      // 级联框的数据源
      cateList: [],
      // 级联框的配置项
      propsObj: { expandTrigger: 'hover', label: 'cat_name', value: 'cat_id' },
      // 商品参数的状态
      checked: true,
      // 商品参数
      goodMany: [],
      // 商品属性
      goodOnly: [],
      // 设置上传图片的请求头
      upheader: {
        Authorization: window.localStorage.getItem('token')
      },
      // 保存上传图片的所有信息
      fileList: [],
      // 图片预览面板的显示和隐藏
      imgDialog: false,
      // 新增 商品的对象
      addObj: {
        goods_name: '',
        goods_cat: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '我是默认值'
      }

    }
  },
  methods: {
    // 点击联动步骤条,需要打印出来的下标
    handleClick (event) {
      this.active = +event.index
      // 判断点击的是否是商品分类
      if (event.index === '1') {
        this.getCateParams('many')
      }
      if (event.index === '2') {
        this.getCateParams('only')
      }
    },
    // 获取商品分类的数据
    getcateList () {
      this.$http({
        method: 'get',
        url: 'categories'
      }).then(res => {
        console.log(res)
        let { data, meta } = res.data
        if (meta.status == 200) {
          this.cateList = data
        } else {
          this.$message.error(meta.msg)
        }
      })
    },
    // 将请求商品参数跟商品属性的接口封装为一个方法
    getCateParams (sel) {
      // 判断分类是否被选中，长度是否为0
      if (this.cateCas.length !== 0) {
        // 不等于0则发送请求到服务器请求数据
        this.$http({
          url: `categories/${
            this.cateCas[this.cateCas.length - 1]
          }/attributes?sel=${sel}`,
          method: 'get'
        }).then(res => {
          let { data, meta } = res.data
          if (meta.status == 200) {
            if (sel == 'many') {
              this.goodMany = data
            } else {
              this.goodOnly = data
            }
          } else {
            this.$message.error(meta.msg)
          }
        })
      } else {
        this.$message.error('请选择分类')
      }
    },
    // 图片上传成功时执行的代码
    imgSuccess (response, file, fileList) {
      // response:响应回来的数据
      // tem_path:图片保存的地址
      //  url: 图片的在线地址
      // file 上传图片的信息
      // fileLsit 上传的所有图片的信息
      this.fileList.push(response.data.tmp_path)
    },
    // 图片移除时执行的方法，先加一个elements图片移除事件
    imgremove (file, fileList) {
      // 再写这个方法得到图片的数据
      let img = file.response.data.tem_path
      // 从数组中将图片移除
      this.fileList.forEach((item, index) => {
        // 判断
        if (item === img) {
          this.fileList.push(index, 1)
        }
      })
    },
    // 图片预览
    imgpreview (file) {
      // console.log(file);
      this.imgDialog = true
      // 由于加载时会出现bug，所以用netxTick方法来获取，nextTick方法会将代码延迟到下次dom更新之后执行
      this.$nextTick(() => {
        // 获取图片的地址
        var img = file.response.data.url
        // 动态渲染
        this.$refs.myres.src = img
      })
    },
    // 提交商品内容数据
    addGoods () {
      // 获取分类
      this.addObj.goods_cat = this.cateCas.join(',')
      // 获取新增商品的数据
      this.$http({
        method: 'post',
        url: 'goods',
        data: this.addObj
      }).then(res => {
        let {meta, data} = res.data
        if (meta.status == 201) {
          this.$message.success(meta.msg)
          // 添加成功跳转回服务器
          this.$router.push('/goods')
        } else {
          this.$message.error(meta.msg)
        }
      })
    }
  },
  mounted () {
    this.getcateList()
  }
}
</script>

<style>
.myalert {
  margin: 10px 0px;
}
.mysteps {
  margin-bottom: 10px;
}
.el-step__title {
  font-size: 12px;
}
label.el-checkbox.is-bordered.is-checked {
  margin-right: 0px;
}
.mybox {
  margin: 20px 0px;
}
.ql-editor{
  height: 400px;
}
</style>
