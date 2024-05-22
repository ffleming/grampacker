<style lang="scss">
@import "../css/_globals";
#csvUrl {
    display: block;
    margin-top: 15px;
}

#lpOptionalFields {
    margin: 0;
    padding: 0;
}

.lpOptionalField {
    list-style-type: none;
    margin: 0;
    padding: 0;
}

#lpPriceSettings {
    input {
        display: inline-block;
        margin-left: 10px;
        width: 50px;
    }
}

#share .lpContent {
    width: 330px;
}

#settings .lpContent {
    width: 200px;
}

#share label {
    font-weight: bold;
}
.lpPopover {
    display: block;
    position: relative;

    .lpTarget {
        cursor: default;
        display: inline-block;
        margin-bottom: -10px;
        padding-bottom: 10px;
        position: relative;
    }

    .lpContent {
        background: #fff;
        box-shadow: 0 0 6px rgba(0, 0, 0, 0.25);
        color: $content;
        left: 50%;
        margin-top: 15px;
        min-width: 100%;
        opacity: 0;
        padding: 12px;
        pointer-events: none;
        position: absolute;
        top: 100%;
        transform: translateX(-50%);
        transition: all 0.15s;
        white-space: nowrap;
        z-index: $dialog;

        &::before {
            background-color: #fff;
            box-shadow: 0 0 6px rgba(0, 0, 0, 0.25);
            content: "";
            display: block;
            height: 20px;
            left: 50%;
            margin-left: -10px;
            position: absolute;
            top: -10px;
            transform: rotate(45deg);
            width: 20px;
            z-index: $dialog - 1;
        }

        &::after {
            background: #fff;
            content: "";
            display: block;
            height: 15px;
            left: 0;
            position: absolute;
            top: 0;
            width: 100%;
            z-index: $dialog + 1;
        }

        & > *:first-child {
            margin-top: 0;
        }

        & > *:last-child {
            margin-bottom: 0;
        }

        h3 {
            margin-bottom: 0;
        }

        ul, a {
            line-height: 25px;
        }

        hr {
            border-color: $border1;
            margin: 7px -0;
            padding: 0;
        }
    }

    &.lpPopoverShown {
        .lpTarget {
            z-index: $aboveDialog;
        }

        .lpContent {
            margin-top: 10px;
            opacity: 1;
            pointer-events: all;
        }
    }
}

</style>
<template>
    <span class="headerItem hasPopover">
        <Popper id="headerPopover">
            <span><span class="username">{{ username }}</span> <i class="lpSprite lpExpand" /></span>
            <template #content>
              <div class="lpContent">
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
