<style lang="scss">
#itemLinkDialog {
    width: 420px;
    max-width: 95vw;
}

#itemLinkForm {
    display: flex;
    align-items: center;
    gap: 10px;

    input[type="text"] {
        flex: 1;
        min-width: 0;
        margin: 0;
    }

    @media only screen and (max-width: 720px) {
        flex-direction: column;
        align-items: stretch;

        input[type="text"] {
            margin-bottom: 10px;
        }
        
        .lpButton {
            width: 100%;
            margin-bottom: 10px;
        }

        .close {
            display: block;
            text-align: center;
            margin-left: 0;
            margin-bottom: 20px;
        }
    }
}
</style>

<template>
    <modal id="itemLinkDialog" :shown="shown" @hide="shown = false">
        <h2>Add a link for this item</h2>
        <form id="itemLinkForm" @submit.prevent="addLink">
            <input v-model="url" type="text" d="itemLink" placeholder="Item Link">
            <input type="submit" class="lpButton" value="Save">
            <a class="lpHref close" @click="shown = false">Cancel</a>
        </form>
    </modal>
</template>

<script>
import { defineComponent } from 'vue';

import bus from '../bus';
import modal from './modal.vue';

export default defineComponent({
  name: 'ItemLink',

  components: {
      modal,
  },

  data() {
      return {
          url: '',
          item: false,
          shown: false,
      };
  },

  beforeMount() {
      bus.$on('updateItemLink', (item) => {
          this.shown = true;
          this.item = item;
          this.url = item.url;
      });
  },

  methods: {
      addLink() {
          this.$store.commit('updateItemLink', { url: this.url, item: this.item });
          this.shown = false;
      },
  },
});
</script>
