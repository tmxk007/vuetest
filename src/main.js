import Vue from 'vue'
import App from './App'
import router from './router'

import './assets/js/extends'
import './assets/js/jslinq'

import './components/index'

window.$Linq = JSLINQ;
window.Promise = Promise;

Vue.config.productionTip = true;
Vue.config.debug = true;
Vue.prototype.$ELEMENT = { size: 'small' }

new Vue({
  el: '#app',
  render: h => h(App)
})
