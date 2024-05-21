import '@babel/polyfill';

import Vue from 'vue';
import VueRouter from 'vue-router';

import routes from './routes';
import store from './store/store';

const focusDirectives = require('./utils/focus.js');
const dataTypes = require('./dataTypes.js');

const Item = dataTypes.Item;
const Category = dataTypes.Category;
const List = dataTypes.List;
const Library = dataTypes.Library;

import { createApp } from 'vue';
import Dashboard from './views/dashboard.vue';

Vue.use(VueRouter);

const utils = require('./utils/utils.js');
const weightUtils = require('./utils/weight.js');

window.Vue = Vue; // surfacing Vue globally for utils methods
window.bus = new Vue(); // global event bus
window.router = new VueRouter({
    mode: 'history',
    routes,
});

bus.$on('unauthorized', (error) => {
    window.location = '/signin';
});

store.dispatch('init')
    .then(() => {
        initGramPacker();
    })
    .catch((error) => {
        if (!store.state.library) {
            router.push('/welcome');
        }
        initGramPacker();
    });

var initGramPacker = function () {
    console.log("In initGramPacker")
  /*
    window.GramPacker = new Vue({
        router,
        store,
        data() {
          return {
            path: '',
            fatal: '',
          }
        },
        watch: {
            $route(to, from) {
                this.path = to.path;
            },
        },
        mounted() {
            this.path = router.currentRoute.path;
        },
    }).$mount('#lp');
    */

  const app = createApp(Dashboard);
  app.use(store);
  app.use(router)
  app.config.globalProperties.$filters = {
    displayWeight(mg, unit) {
      return weightUtils.MgToWeight(mg, unit) || 0;
    },
    displayPrice(price, symbol) {
      let amount = '0.00';
      if (typeof price === 'number') {
        amount = price.toFixed(2);
      }
      return symbol + amount;
    }
  }


  console.log("mounting")
  app.mount('#lp');
  console.log("mounted")

};
