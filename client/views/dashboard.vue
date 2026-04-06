<style lang="scss">
@import "../css/_globals";

#header {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    height: auto;
    margin: 0 -20px 20px; /* lpList padding */
    min-height: 60px;
    position: relative;
}

#hamburger {
    cursor: pointer;
    display: inline-block;
    opacity: 0.6;
    transition: transform $transitionDurationSlow;

    &:hover {
        opacity: 1;
    }

    .lpHasSidebar & {
        transform: rotate(90deg);
    }
}

#lpListName {
    font-size: 24px;
    font-weight: 600;
    padding: 12px 15px;
    min-width: 0;

    @media only screen and (max-width: 720px) {
        border-top: 1px solid #ddd;
        flex: 1 1 100% !important;
        font-size: 18px;
        order: 10;
        padding: 10px 20px;
    }
}

.headerItem {
    flex: 0 0 auto;
    padding: 17px 16px;
    position: relative;

    @media only screen and (max-width: 720px) {
        padding: 12px 10px;

        &:first-child {
            margin-right: auto;
            padding-left: 20px;
        }
    }

    &:first-child {
        padding-left: 20px;
    }

    .lpPopover {
        &:hover .lpTarget {
            color: $blue1;
        }
    }

    .lpTarget {
        font-weight: 600;
        padding: 17px 16px 15px;

        @media only screen and (max-width: 720px) {
            padding: 0;
        }
    }

    &#lpListName {
        flex: 1 0 auto;
    }

    &.hasPopover {
        padding: 0;

        @media only screen and (max-width: 720px) {
            padding: 12px 10px;
        }
    }

    &.signInRegisterButtons {
        height: auto;
        padding: 0 16px;

        @media only screen and (max-width: 720px) {
            padding: 12px 10px;
        }
    }
}
</style>

<template>
    <div v-if="isLoaded" id="main" :class="{lpHasSidebar: library.showSidebar}">
        <sidebar />
        <div class="lpList lpTransition" @click="closeSidebarIfMobile">
            <div id="header" class="clearfix">
                <span class="headerItem">
                    <a id="hamburger" class="lpTransition" @click.stop="toggleSidebar"><i class="lpSprite lpHamburger" /></a>
                </span>
                <input id="lpListName" :value="list.name" type="text" class="lpListName lpSilent headerItem" value="New List" placeholder="List Name" autocomplete="off" name="lastpass-disable-search" @input="updateListName">
                <share />
                <listSettings />
                <accountDropdown v-if="isSignedIn" />
                <span v-else class="headerItem signInRegisterButtons">
                    <router-link to="/register" class="lpButton lpSmall">Register</router-link>
                    or
                    <router-link to="/signin" class="lpButton lpSmall">Sign In</router-link>
                </span>
                <span class="clearfix" />
            </div>

            <list />

            <div id="lpFooter">
                <div class="lpSiteBy">
                  Gram Packer {{ appVersion }} is a
                  <a class="lpHref" href="https://github.com/ffleming/grampacker/graphs/contributors" target="_blank" rel="noopener noreferrer">community</a> effort
                    <a class="lpHref" href="https://github.com/ffleming/grampacker/issues" target="_blank" rel="noopener noreferrer">Join in!</a>
                </div>
                <div class="lpContact">
                    <a class="lpHref" href="https://github.com/ffleming/grampacker/blob/master/LICENSE" target="_blank" rel="noopener noreferrer">Copyleft</a> Gram Packer 2024
                    <br>
                </div>
            </div>
        </div>

        <globalAlerts />
        <speedbump />
        <copyList />
        <importCSV />
        <itemImage />
        <itemViewImage />
        <itemLink />
        <help />
        <account />
        <accountDelete />
    </div>
</template>

<script>
import { defineComponent } from 'vue';

import globalAlerts from '../components/global-alerts.vue';
import sidebar from '../components/sidebar.vue';
import share from '../components/share.vue';
import listSettings from '../components/list-settings.vue';
import accountDropdown from '../components/account-dropdown.vue';
import forgotPassword from './forgot-password.vue';
import account from '../components/account.vue';
import accountDelete from '../components/account-delete.vue';
import help from '../components/help.vue';
import list from '../components/list.vue';

import itemImage from '../components/item-image.vue';
import itemViewImage from '../components/item-view-image.vue';
import itemLink from '../components/item-link.vue';
import importCSV from '../components/import-csv.vue';
import copyList from '../components/copy-list.vue';
import speedbump from '../components/speedbump.vue';

import packageInfo from "../../package.json"

export default defineComponent({
  name: 'Dashboard',

  components: {
      sidebar,
      share,
      listSettings,
      accountDropdown,
      forgotPassword,
      account,
      accountDelete,
      help,
      list,
      itemLink,
      copyList,
      importCSV,
      itemImage,
      itemViewImage,
      speedbump,
      globalAlerts,
  },

  mixins: [],

  data() {
    return {
      appVersion: packageInfo.version,
      isLoaded: false,
    };
  },

  computed: {
      library() {
          return this.$store.state.library;
      },
      list() {
          return this.library.getListById(this.library.defaultListId);
      },
      isSignedIn() {
          return this.$store.state.loggedIn;
      },
  },

  beforeMount() {
      if (!this.$store.state.library) {
          this.$router.push('/welcome');
      } else {
          this.isLoaded = true;
          if (window.innerWidth <= 720 && this.$store.state.library.showSidebar) {
              this.$store.commit('toggleSidebar');
          }
      }
  },

  methods: {
      toggleSidebar() {
          this.$store.commit('toggleSidebar');
      },
      closeSidebarIfMobile() {
          if (window.innerWidth <= 720 && this.$store.state.library.showSidebar) {
              this.$store.commit('toggleSidebar');
          }
      },
      updateListName(evt) {
          this.$store.commit('updateListName', { id: this.list.id, name: evt.target.value });
      },
  },
});
</script>
