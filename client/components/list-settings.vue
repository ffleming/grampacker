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
    <span id="settings" v-if="isSignedIn" class="headerItem hasPopover">
        <Popper>
        <span class="lpTarget"><i class="lpSprite lpSettings" />Settings</span>
            <template #content>
              <div class="lpContent">
                  <ul id="lpOptionalFields">
                      <li v-for="optionalField in optionalFieldsLookup" :key="optionalField.name" class="lpOptionalField">
                          <label>
                              <input v-model="optionalField.value" type="checkbox" @change="toggleOptionalField($event, optionalField.name)">
                              {{ optionalField.displayName }}
                          </label>
                      </li>
                  </ul>
                  <div v-if="library.optionalFields['price']" id="lpPriceSettings">
                      <hr>
                      <label>
                          Currency:
                          <input id="currencySymbol" type="text" maxlength="4" :value="library.currencySymbol" @input="updateCurrencySymbol($event)">
                      </label>
                  </div>
              </div>
            </template>
        </Popper>
    </span>
</template>

<script>
import { defineComponent } from 'vue';

import Popper from "vue3-popper";

export default defineComponent({
  name: 'ListSettings',

  components: {
      Popper,
  },

  data() {
      return {
          optionalFieldsLookup: [{
              name: 'images',
              displayName: 'Item images',
              cssClass: 'lpShowImages',
              value: false,
          }, {
              name: 'price',
              displayName: 'Item prices',
              cssClass: 'lpShowPrices',
              value: false,
          }, {
              name: 'worn',
              displayName: 'Worn items',
              cssClass: 'lpShowWorn',
              value: false,
          }, {
              name: 'consumable',
              displayName: 'Consumable items',
              cssClass: 'lpShowConsumable',
              value: false,
          }, {
              name: 'listDescription',
              displayName: 'List descriptions',
              cssClass: 'lpShowListDescription',
              value: false,
          }],
      };
  },

  computed: {
      library() {
          return this.$store.state.library;
      },
      isSignedIn() {
          return this.$store.state.loggedIn;
      },
  },

  beforeMount() {
      this.updateOptionalFieldValues();
  },

  mounted() {
      bus.$on('optionalFieldChanged', () => {
          this.updateOptionalFieldValues();
      });
  },

  methods: {
      toggleOptionalField(evt, optionalField) {
          this.$store.commit('toggleOptionalField', optionalField);
      },
      updateCurrencySymbol(evt) {
          this.$store.commit('updateCurrencySymbol', evt.target.value);
      },
      updateOptionalFieldValues() {
          let i;
          let fieldLookup;

          for (i = 0; i < this.optionalFieldsLookup.length; i++) {
              fieldLookup = this.optionalFieldsLookup[i];
              fieldLookup.value = this.library.optionalFields[fieldLookup.name];
          }
      },
  },
});
</script>
