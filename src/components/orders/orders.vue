<template>
  <div id="mybox"></div>
</template>

<script>
//导入BMap
import BMap from 'BMap'
export default {
  mounted() {
    var map = new BMap.Map("mybox");
    var point = new BMap.Point(116.404, 39.915);
    map.centerAndZoom(point, 15);
    window.setTimeout(function() {
      map.panTo(new BMap.Point(116.409, 39.918));
    }, 2000);
  }
};
// import BMap from 'BMap'

// export default {
//     // 初始化百度地图
//     mounted() {
//         // 创建一个地图实例
//         var map = new BMap.Map("mybox")
//         // 创建一个中心点坐标（经纬度：天安门）
//         var point = new BMap.Point(116.404, 39.915)
//         // 地图的初始化
//         map.centerAndZoom(point, 15)
//     }
// }
</script>

<style>
#mybox {
  width: 100%;
  height: 500px;
}
</style>
