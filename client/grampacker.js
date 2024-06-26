import '@babel/polyfill';

import { createRouter, createWebHistory } from 'vue-router'

import routes from './routes';
import store from './store';

import bus from './bus'

const dataTypes = require('./dataTypes.js');

const Item = dataTypes.Item;
const Category = dataTypes.Category;
const List = dataTypes.List;
const Library = dataTypes.Library;

import { createApp } from 'vue';

import uniqueId from 'lodash/uniqueId';

const utils = require('./utils/utils.js');
const weightUtils = require('./utils/weight.js');

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})

window.bus = bus; // global event bus

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
  const app = createApp({});
  app.use(store);
  app.use(router)
  app.config.compilerOptions.whitespace = 'condense'
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


  app.directive('select-on-focus', {
    mounted(el) {
      el.addEventListener('focus', (evt) => {
        el.select();
      });
    },
  });

  app.directive('focus-on-create', {
    mounted(el, binding) {
      if (binding.expression && binding.value || !binding.expression) {
        el.focus();
      }
    },
  });

  app.directive('focus-on-bus', {
    mounted(el, binding) {
      bus.$on(binding.value, () => {
        el.focus();
      });
    },
  });

  app.directive('select-on-bus', {
    mounted(el, binding) {
      bus.$on(binding.value, () => {
        el.select();
      });
    },
  });

  app.directive('empty-if-zero', {
    mounted(el) {
      el.addEventListener('focus', (evt) => {
        if (el.value === '0' || el.value === '0.00') {
          el.dataset.originalValue = el.value;
          el.value = '';
        }
      });

      el.addEventListener('blur', (evt) => {
        if (el.value === '') {
          el.value = el.dataset.originalValue || '0';
        }
      });
    },
  });

  app.directive('click-outside', {
    mounted(el, binding) {
      const handler = (evt) => {
        if (el.contains(evt.target)) {
          return;
        }
        if (binding && typeof binding.value === 'function') {
          binding.value();
        }
      };

      window.addEventListener('click', handler);

      // Store handler to clean up later
      el.dataset.clickoutside = uniqueId();
      store.commit('addDirectiveInstance', { key: el.dataset.clickoutside, value: handler });
    },
    unbind(el) {
      // clean up event handlers
      const handler = store.state.directiveInstances[el.dataset.clickoutside];
      store.commit('removeDirectiveInstance', el.dataset.clickoutside);
      window.removeEventListener('click', handler);
    },
  });

  app.mount('#lp');
};
