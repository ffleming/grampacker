<style lang="scss">
@import "../css/_globals";

</style>

<template>
    <div v-click-outside="hide" :class="{'lpPopover': true, 'lpPopoverShown': shown}">
        <div class="lpTarget">
            <slot name="target" />
        </div>
        <div class="lpContent">
            <slot name="content" />
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Popover',

  props: {
      id: {
          type: String,
          required: false,
      },
      shown: {
          type: Boolean,
          required: true,
      },
  },

  beforeMount() {
      this.bindEscape();
  },

  beforeUnmount() {
      this.unbindEscape();
  },

  methods: {
      hide() {
          this.$emit('hide');
      },
      bindEscape() {
          window.addEventListener('keyup', this.closeOnEscape);
      },
      unbindEscape() {
          window.removeEventListener('keyup', this.closeOnEscape);
      },
      closeOnEscape(evt) {
          if (this.shown && evt.keyCode === 27) {
              this.hide();
          }
      },
  },
});
</script>
