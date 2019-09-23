import Vue from 'vue'
import App from './app.vue'
import axios from 'axios'
import Vant from 'vant';
import 'vant/lib/index.css';

import VCharts from 'v-charts'

Vue.use(VCharts)

Vue.use(Vant);

new Vue({
  components: { App },
  template: "<App/>"
}).$mount('#app');