import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import apex from "./plugins/apex";

Vue.config.productionTip = false

Vue.use(apex, {
  baseUrl: "http://localhost:3000/",
})

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
