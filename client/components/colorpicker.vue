<style lang="scss">
</style>

<template>
    <Popper id="lpPickerContainer">
        <span class="lpLegend" :style="{'background-color': color}" @click="shown = true" />
        <template #content>
          <div class="lpPopoverContent">
            <ColorPickerWheel :width="150" :height="150" :disabled="false" :start-color="color" @color-change="onColorChange" />
          </div>
        </template>
    </Popper>
</template>

<script>

import { defineComponent } from 'vue';
import Popper from "vue3-popper";
import ColorPickerWheel from './color-picker-wheel.vue';

export default defineComponent({
  name: 'ColorPicker',

  components: {
      ColorPickerWheel,
      Popper,
  },

  props: [
      'color',
  ],

  data() {
      return {
          shown: false,
      };
  },

  methods: {
      onColorChange(newColor) {
          this.$emit('color-change', newColor);
      },
  },
});
</script>
