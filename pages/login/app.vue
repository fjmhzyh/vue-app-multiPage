<template>
  <div class="login-page">
	<header class="mui-bar mui-bar-nav">  
	    <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>  
	    <h1 class="mui-title">标题</h1>  
	</header>
    <h1 @click="handleClick">登录页1哈哈哈哈耶耶耶弄弄弄</h1>
    
	<div>8888</div><div>8883333gghh33333333h8</div>
  <canvas id="myChart" width="400" height="260"></canvas>
  </div>
</template>

<script>
const F2 = require('@antv/f2');
      const data = [
        { genre: 'Sports', sold: 275 },
        { genre: 'Strategy', sold: 115 },
        { genre: 'Action', sold: 120 },
        { genre: 'Shooter', sold: 350 },
        { genre: 'Other', sold: 150 },
      ];

export default {
  data () {
    return {
      msg: 'Hello from index module!',
    }
  },
  methods:{
    chart(){
      let dom = document.getElementById('myChart');
      console.log('dom', dom)
      // Step 1: 创建 Chart 对象
      const chart = new F2.Chart({
        id: dom,
        pixelRatio: window.devicePixelRatio // 指定分辨率
      });

      // Step 2: 载入数据源
      chart.source(data);

      // Step 3：创建图形语法，绘制柱状图，由 genre 和 sold 两个属性决定图形位置，genre 映射至 x 轴，sold 映射至 y 轴
      chart.interval().position('genre*sold').color('genre');

      // Step 4: 渲染图表
      chart.render();
    },
    handleClick(){
      this.$dialog.alert({
        title: '标题',
        message: "弹窗内容"
      }).then(() => {
        // on close
      });
    }
  },
  created(){
    this.$nextTick(function (argument) {
      this.chart();
    })
  }
}
</script>

<style lang="scss">
  .login-page{
    display: flex;
    height: 100vh;
    color:blue; 
	font-size:26px;
	flex-direction: column;
  }
</style>