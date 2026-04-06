<style lang="scss">
#lpImageDialog {
    width: auto;

    img {
        max-width: 800px;
        width: 100%;
    }
}
</style>

<template>
    <modal id="lpImageDialog" :shown="shown" @hide="shown = false">
        <img :src="imageUrl">
    </modal>
</template>

<script>
import { defineComponent } from 'vue';

import bus from '../bus';
import modal from './modal.vue';

export default defineComponent({
  name: 'ItemViewImage',

  components: {
      modal,
  },

  data() {
      return {
          imageUrl: '',
          shown: false,
      };
  },

  mounted() {
      bus.$on('viewItemImage', (imageUrl) => {
          this.shown = true;
          this.imageUrl = imageUrl;
      });
  },
});
</script>
