import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import _ from 'lodash'
import moment from 'moment'

import './registerServiceWorker'
// import './assets/css/app.css';



Vue.config.productionTip = false

import axios from 'axios'
Vue.prototype.$axios = axios

var api = {
  servers: {
    backend: process.env.VUE_APP_URL_API_BACKEND
  },
  fetch: async(props) => {
    var params = {}
    var headers = {}
    var method = 'post'
    if (typeof props.params != 'undefined') params = props.params
    if (typeof props.method != 'undefined') method = props.method
    if (typeof props.headers != 'undefined') headers = props.headers
      //BOC:[auto insert token]
    if (typeof store.state.account.data.token != 'undefined' && store.state.account.data.token) headers.Authorization = 'Bearer ' + store.state.account.data.token
      //EOC
    props.callbackReset();
    try {
      await axios({
          method: method,
          headers: headers,
          url: props.url,
          data: params,
        })
        .then(
          (response) => {
            if (response.data == null) {
              props.callbackError('Item not found.');
            } else if (response.data.error) {
              props.callbackError(response.data.error);
            } else {
              props.callbackSuccess(response.data);
            }
          },
          (error) => {
            if (typeof error.response != 'undefined' && typeof error.response.data != 'undefined') {
              var err;
              if (typeof error.response.data.errors != 'undefined' && error.response.data.errors) {
                //read Laravel ValidationException errors message
                var errors = error.response.data.errors;
                err = errors[Object.keys(errors)[0]];
              } else if (typeof error.response.data.message != 'undefined') {
                err = error.response.data.message;
                   //EOC
                   if(error.response.data.code == '403'){
                    window.location.replace('/error/restricted');
                   }
                if (err == 'Authorization token expired') {
                  window.location.replace('/error/expired');
                }

              } else {
                err = error;
              }
              props.callbackError(err);
            } else {
              props.callbackError(error);
            }
          }
        );
    } catch (e) {
      props.callbackError(e);
    }
  },
}

Vue.component('AError', require('./components/AError.vue').default);
Vue.component('ABreadcrumb', require('./components/ABreadcrumb.vue').default);

Vue.prototype.$api = api
//EOC
//BOC
Vue.prototype.$_ = _
//EOC
//BOC
Vue.prototype.$moment = moment
//EOC
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
