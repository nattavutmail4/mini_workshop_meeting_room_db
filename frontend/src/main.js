import Vue from 'vue'
import VeeValidate from 'vee-validate';
import App from './App.vue'
import store from './store'
import router from './router'
// import Layout from "./components/Layout"

import * as jquery from 'jquery'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap'
import './assets/styles1.css'
import 'font-awesome/css/font-awesome.min.css'
import Swal from 'sweetalert2';
import axios from 'axios';
import VueMoment from 'vue-moment';
import moment from 'moment';

// 
// Filters


Vue.config.productionTip = false
Vue.prototype.jquery = jquery  //การตั้งค่าแบบนี้จะทำให้เราสามารถเรียกใช้ jquery ได้ทุก component
Vue.prototype.$swal= Swal;
Vue.prototype.axios = axios

//ตั้งค่า formate วันที่ให้เป็น global จะได้สามารถเรียกใช้ได้ทุกหน้า
Vue.prototype.$formatDate = function (date) {
  return this.$moment(date).format('YYYY-MM-DD , h:mm:ss A')
};
Vue.use(VeeValidate);
// Setting mommnet
Vue.use(VueMoment, { moment });

// Vue.component('Layout',Layout) //ตั้งเป็น global ให้สามารถนำไปใช้ได้ทุกหน้า
new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
