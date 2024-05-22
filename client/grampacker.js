import '@babel/polyfill';

import { createRouter, createWebHistory } from 'vue-router'

import Vue from 'vue'

import routes from './routes';
import store from './store/store';

import bus from './bus'

const focusDirectives = require('./utils/focus.js');
const dataTypes = require('./dataTypes.js');

const Item = dataTypes.Item;
const Category = dataTypes.Category;
const List = dataTypes.List;
const Library = dataTypes.Library;

import { createApp } from 'vue';
import Dashboard from './views/dashboard.vue';

const utils = require('./utils/utils.js');
const weightUtils = require('./utils/weight.js');

window.Vue = Vue; // surfacing Vue globally for utils methods
window.bus = bus; // global event bus

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})

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
  const app = createApp();
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
