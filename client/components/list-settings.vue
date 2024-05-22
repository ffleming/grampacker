<style lang="scss">
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
