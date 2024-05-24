<style lang="scss">
#forgotPassword {
    width: 620px;
}

</style>

<template>
    <div id="forgotPasswordContainer">
        <modal id="forgotPassword" :shown="true" :blackout="true">
        <p v-if="message" class="lpSuccess">
            {{ message }}
        </p>
        <form id="accountForm" @submit.prevent="resetPassword" >
            <div class="lpFields">
                <input type="hidden" name="token" class="token" :value="token">
                <input type="hidden" name="username" class="username" :value="username">
                <input v-model="newPassword" type="password" placeholder="New Password" name="newPassword" class="newPassword">
                <input v-model="confirmNewPassword" type="password" placeholder="Confirm New Password" name="confirmNewPassword" class="confirmNewPassword">
            </div>

            <errors :errors="errors" />

            <div class="lpButtons">
                <button class="lpButton" @click="updateAccount">
                    Submit
                    <spinner v-if="saving" />
                </button>
            </div>
        </form>
        </modal>
        <blackoutFooter />
        <globalAlerts />
    </div>
</template>

<script>
import { defineComponent } from 'vue';

import blackoutFooter from '../components/blackout-footer.vue';
import errors from '../components/errors.vue';
import modal from '../components/modal.vue';
import spinner from '../components/spinner.vue';
import globalAlerts from '../components/global-alerts.vue';

export default defineComponent({
  name: 'ResetPassword',

  components: {
    blackoutFooter,
    globalAlerts,
    errors,
    modal,
    spinner,
  },

  data() {
    return {
      errors: [],
      saving: false,
      newPassword: '',
      confirmNewPassword: '',
      token: '',
      username: '',
    };
  },

  computed: {
    message() {
      return '';
    },
  },

  mounted() {
    this.token = this.$route.query.t;
    this.username = this.$route.query.u;
  },

  methods: {
    resetPassword() {
      this.errors = [];

      if (this.newPassword && this.newPassword != this.confirmNewPassword) {
        this.errors.push({ field: 'newPassword', message: 'Your passwords don\'t match.' });
      }

      if (this.newPassword && (this.newPassword.length < 8 || this.newPassword.length > 60)) {
        this.errors.push({ field: 'newPassword', message: 'Please enter a password between 8 and 60 characters.' });
      }

      if (this.errors.length) {
        return;
      }

      const req = {
        t: this.token,
        u: this.username,
        newPassword: this.newPassword,
        confirmNewPassword: this.confirmNewPassword,
      };
      this.saving = true;

      fetchJson('/pw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify(req),
      })
        .then((response) => {
          this.saving = false;
          this.shown = false;
          this.$router.push('/signin/reset-password');
        })
        .catch((err) => {
          this.errors = err;
          this.saving = false;
        });
    },
  },
});
</script>
