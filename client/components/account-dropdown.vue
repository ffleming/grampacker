<style lang="scss">
</style>

<template>
    <span class="headerItem hasPopover">
        <Popper hover>
            <span class="lpTarget">Logged in as <span class="username">{{ username }}</span> <i class="lpSprite lpExpand" /></span>
            <template #content>
              <div class="lpPopoverContent">
                <a class="lpHref accountSettings" @click="showAccount">Account Settings</a><br>
                <a class="lpHref" @click="showHelp">Help</a><br>
                <a class="lpHref signout" @click="signout">Sign Out</a>
              </div>
           </template>
        </Popper>
    </span>
</template>

<script>
import { defineComponent } from 'vue';

import Popper from "vue3-popper";

export default defineComponent({
  name: 'AccountDropdown',

  components: {
      Popper,
  },

  computed: {
      library() {
          return this.$store.state.library;
      },
      username() {
          return this.$store.state.loggedIn;
      },
  },

  methods: {
      showAccount() {
          bus.$emit('showAccount');
      },
      showHelp() {
          bus.$emit('showHelp');
      },
      signout() {
          this.$store.commit('signout');
          this.$router.push('/signin');
      },
  },
});
</script>
