<style lang="scss">
</style>

<template>
    <form class="lpRegister lpFields" @submit.prevent="submit">
        <div class="lpFields">
            <input v-model="username" v-focus-on-create type="text" placeholder="Username" name="username">
            <input v-model="email" type="email" placeholder="Email" name="email">
            <input v-model="password" type="password" placeholder="Password" name="password">
            <input v-model="passwordConfirm" type="password" placeholder="Confirm password" name="passwordConfirm">
        </div>
        <errors :errors="errors" />
        <div class="lpButtons">
            <button class="lpButton">
                Register
                <spinner v-if="saving" />
            </button>
            <a class="lpHref lpGetStarted" @click="loadLocal">Skip registration</a>
        </div>
    </form>
</template>

<script>
import { defineComponent } from 'vue';

import errors from './errors.vue';
import spinner from './spinner.vue';

const dataTypes = require('../dataTypes.js');

const Library = dataTypes.Library;

export default defineComponent({
  name: 'RegisterForm',

  components: {
      errors,
      spinner,
  },

  data() {
      return {
          username: '',
          email: '',
          password: '',
          passwordConfirm: '',
          saving: false,
          errors: [],
      };
  },

  computed: {
      isLocalSaving() {
          return this.$store.state.saveType === 'local';
      },
  },

  methods: {
      loadLocal() {
          if (this.isLocalSaving) {
              this.$router.push('/');
              return;
          }
          const library = new Library();
          this.$store.commit('loadLibraryData', JSON.stringify(library.save()));
          this.$store.commit('setSaveType', 'local');
          this.$store.commit('setLoggedIn', false);
          this.$router.push('/');
      },
      submit() {
          this.errors = [];

          if (!this.username) {
              this.errors.push({ field: 'username', message: 'Please enter a username.' });
          }

          if (this.username && (this.username.length < 3 || this.username.length > 32)) {
              this.errors.push({ field: 'username', message: 'Please enter a username between 3 and 32 characters.' });
          }

          if (!this.email) {
              this.errors.push({ field: 'email', message: 'Please enter an email.' });
          }

          if (!this.password) {
              this.errors.push({ field: 'password', message: 'Please enter a password.' });
          }

          if (!this.passwordConfirm) {
              this.errors.push({ field: 'passwordConfirm', message: 'Please enter a password confirmation.' });
          }

          if (this.password && this.passwordConfirm && this.password !== this.passwordConfirm) {
              this.errors.push({ field: 'password', message: 'Your passwords don\'t match.' });
          }

          if (this.password && (this.password.length < 5 || this.password.length > 60)) {
              this.errors.push({ field: 'password', message: 'Please enter a password between 5 and 60 characters.' });
          }

          if (this.errors.length) {
              return;
          }

          const registerData = { username: this.username, email: this.email, password: this.password };

          if (localStorage.library) {
              registerData.library = localStorage.library;
          }

          this.saving = true;
          return fetchJson('/register', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              credentials: 'same-origin',
              body: JSON.stringify(registerData),
          })
              .then((response) => {
                  this.$store.commit('setSyncToken', response.syncToken);
                  this.$store.commit('loadLibraryData', response.library);
                  this.$store.commit('setSaveType', 'remote');
                  this.$store.commit('setLoggedIn', response.username);

                  if (registerData.library) {
                      localStorage.registeredLibrary = localStorage.library;
                      delete localStorage.library;
                  }
                  this.saving = false;
                  this.$router.push('/');
              })
              .catch((err) => {
                  this.saving = false;
                  this.errors = err;
              });
      },
  },
});
</script>
