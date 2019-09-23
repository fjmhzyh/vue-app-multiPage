<template>
  <div class="container">
    <ul class="left">
      <li>1</li>
      <li>2</li>
      <li>34</li>
    </ul>
    <!-- <iframe class="right" src="test/test.html" frameborder="none"></iframe> -->
  </div>
</template>

<script>
console.log('process.env', process.env)
export default {
  data () {
    return {
      msg: 'Hello from index module!',
      active:1
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
  .container{
    display: flex;
    height: 100vh;
    color:blue; 
    .left{
      width: 200px;
      border-right:1px solid #ccc;
    }
    .right{
      flex:1;
    }
  }
</style>