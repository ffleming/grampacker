<style lang="scss">
#help {
    width: 800px;
}

</style>

<template>
    <modal id="help" :shown="shown" @hide="shown = false">
        <h2>Help</h2>

        <p>Getting Started:</p>
        <ol>
            <li>Click on things to edit them. Give your list and category a name.</li>
            <li>Add new categories and items to your list.</li>
            <li>When you're done, share your list with others!</li>
        </ol>
        <hr>
        <strong>Quantity and worn values</strong>
        <p>If you have multiple quantity of an item and mark that item as worn, all of them will count towards your worn weight. This is because the app is geared towards ultralight hikers and backpackers, who do not generally have multiple of the exact same items that are split across worn and carried types. This means you can list your shoes/trekking poles with weights as individual weights and quantity of two, but if you bring three identical pairs of socks, you should separate them into worn and carried items.</p>
        <hr>
        <strong>Items in multiple lists</strong>
        <p>If you copy your list or drag an item from the gear library into a second list, those items are now <strong>linked</strong>. This means that changes to an item in one place will update that list everywhere. If you want to copy your list without links, for now you can export to CSV and re-import the list.</p>
        <hr>
    </modal>
</template>

<script>
import { defineComponent } from 'vue';

import bus from '../bus';
import modal from './modal.vue';

export default defineComponent({
  name: 'Help',

  components: {
      modal,
  },

  data() {
      return {
          shown: false,
      };
  },

  beforeMount() {
      bus.$on('showHelp', () => {
          this.shown = true;
      });
  },
});
</script>
