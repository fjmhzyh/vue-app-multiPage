<template>
  <div class="home-page">
    <div class="chart-block">
      <div class="chart-item"><ve-ring :data="chartData" :extend="extend" :judge-width="true"></ve-ring></div>
      <div class="chart-item"><ve-ring :data="chartData" :extend="extend" :judge-width="true"></ve-ring></div>
      <div class="chart-item"><ve-ring :data="chartData" :extend="extend" :judge-width="true"></ve-ring></div>
    </div>
    
  </div>
</template>

<script>
export default {
  data () {
    this.extend = {
      legend:{
        y: '80%'
      },
      color: ['#2E8FF4','#f00','#ccc',],
      series: {
        label: { 
          show: true, 
          position: "center",
          formatter:function(val){   //让series 中的文字进行换行
            if(val.name=='告警'){
              return `告警站点总数\n\n${val.value}`;
            }else{
              return ''
            }
            
          }
        }
      }
    }
    return {
      chartData: {
        columns: ['item', 'count'],
        rows: [
          { 'item': '正常', 'count': 95 },
          { 'item': '告警', 'count': 5 },
        ]
      }
    }
  },
  methods:{
    handleClick(){
      this.$dialog.alert({
        title: '标题',
        message: "弹窗内容"
      }).then(() => {
        // on close
      });
    }
  }
}
</script>

<style lang="scss">
  .home-page{
    display: flex;
    height: 100vh;
    color:blue; 
    flex-direction: column;
    // .chart-block{
    //   .chart-item{
    //     display: inline-block;
    //     width: 30%;
    //     margin-right: 1%;
    //   }
    // }
  }
</style>