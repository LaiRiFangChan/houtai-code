export default {
  data () {
    return {
      rightslist: []
    }
  },
  methods: {
    getRights () {
      this.$http({
        method: 'get',
        url: 'rights/list'
      }).then(res => {
        let {meta, data} = res.data
        if (meta.status == 200) {
          this.rightslist = data
        } else {
          this.$message.error(meta.msg)
        }
      })
    }
  },
  mounted () {
    this.getRights()
  }
}
