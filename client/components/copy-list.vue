<style lang="scss">
@import "../css/_globals";

</style>

<template>
    <modal id="copyListDialog" :shown="shown" @hide="shown = false">
        <h2>Choose the list to copy</h2>
        <select id="listToCopy" v-model="listId">
            <option v-for="list in library.lists" :value="list.id">
                {{ list.name }}
            </option>
        </select>
        <br><br>
        <p class="lpWarning">
            <b>Note:</b> Copying a list will link the items between your lists. Updating an item in one list will alter that item in all other lists that item is in.
        </p>
        <a id="copyConfirm" class="lpButton" @click="copyList">Copy List</a>
        <a class="lpButton close" @click="shown = false">Cancel</a>
    </modal>
</template>

<script>
import { defineComponent } from 'vue';

import modal from './modal.vue';

export default defineComponent({
  name: 'CopyList',

  components: {
      modal,
  },

  data() {
      return {
          listId: false,
          shown: false,
      };
  },

  computed: {
      library() {
          return this.$store.state.library;
      },
  },

  beforeMount() {
      bus.$on('copyList', () => {
          this.shown = true;
      });
  },

  methods: {
      copyList() {
          if (!this.listId) {
              return; // TODO: errors
          }
          this.$store.commit('copyList', this.listId);
          this.shown = false;
      },
  },
});
</script>
