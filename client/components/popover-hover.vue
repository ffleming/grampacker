<style lang="scss">
@import "../css/_globals";

</style>

<template>
        <slot name="target" />
        <slot name="content" />
</template>

<script>
import { defineComponent } from 'vue';

import Popover from './popover.vue';

export default defineComponent({
  name: 'PopoverHover',

  components: {
      Popover,
  },

  data() {
      return {
          shown: false,
          hideTimeout: null,
      };
  },

  methods: {
      show() {
          if (this.hideTimeout) {
              clearTimeout(this.hideTimeout);
              this.hideTimeout = null;
          }
          this.shown = true;
          this.$emit('shown');
      },
      startHideTimeout() {
          this.hideTimeout = setTimeout(this.hide, 50);
      },
      hide() {
          this.shown = false;
          this.$emit('hidden');
      },
  },
});
</script>
