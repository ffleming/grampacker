<style lang="scss">
</style>

<template>
    <div id="registerContainer">
        <modal id="register" :shown="true" :blackout="true">
            <div class="lpModalHeader">
                <h2>
                    Register an account
                </h2>
                <router-link to="/signin" class="lpHref">
                    Already registered?
                </router-link>
            </div>

            <p v-if="isLocalSaving" class="lpWarning">
                <strong>Note:</strong> Your existing data on your computer <strong>will</strong> be saved to your new account.
            </p>

            <registerForm />
        </modal>

        <blackoutFooter />
        <globalAlerts />
    </div>
</template>

<script>
import { defineComponent } from 'vue';

import blackoutFooter from '../components/blackout-footer.vue';
import globalAlerts from '../components/global-alerts.vue';
import modal from '../components/modal.vue';
import registerForm from '../components/register-form.vue';

export default defineComponent({
  name: 'Register',

  components: {
      blackoutFooter,
      globalAlerts,
      modal,
      registerForm,
  },

  computed: {
      isLocalSaving() {
          return this.$store.state.saveType === 'local';
      },
  },
});
</script>
