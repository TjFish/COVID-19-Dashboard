/* eslint-disable global-require */
/* eslint-disable no-underscore-dangle */
import Vue from 'vue';
import { Icon } from 'leaflet';
import VueRouter from 'vue-router';
import App from './App.vue';
import Home from './Home.vue';
import Chart from './components/Chart.vue';
import WHO from './components/WHO.vue';
import Ranking from './components/Ranking.vue';
import './registerServiceWorker';
import vuetify from './plugins/vuetify';
import './plugins/vue2-filters';
import './plugins/vue2-perfect-scrollbar';
import 'leaflet/dist/leaflet.css';
import store from './store';
import Helpers from './helpers';

// this part resolve an issue where the markers would not appear
delete Icon.Default.prototype._getIconUrl;

Vue.config.productionTip = false;

Vue.filter('URLify', Helpers.URLify);
Vue.filter('fromNow', Helpers.fromNow);
Vue.use(VueRouter);
// 创建路由对象并配置路由规则
const router = new VueRouter({
  routes: [
    // 一个个对象
    { path: '/', name: Home, component: Home },
    { path: '/Chart', name: Chart, component: Chart },
    { path: '/WHO', name: WHO, component: WHO },
    { path: '/Ranking', name: Ranking, component: Ranking }
  ]
});
new Vue({
  vuetify,
  store,
  router,
  render: h => h(App)
}).$mount('#app');
