import Vue from 'vue'
import App from './app'
import axios from 'axios'
import Vant from 'vant';
import 'vant/lib/index.css';

Vue.use(Vant);

console.log('vant', Vant)

new Vue({
  components: { App },
  template: "<App/>"
}).$mount('#app');