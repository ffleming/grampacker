<style lang="scss">
</style>

<template>
    <Popper id="lpPickerContainer">
        <span class="lpLegend" :style="{'background-color': color}" @click="shown = true" />
        <template #content>
          <div class="lpPopoverContent">
            <VueColorPicker :width="150" :height="150" :disabled="false" :start-color="color" @color-change="onColorChange" />
          </div>
        </template>
    </Popper>
</template>

<script>

import { defineComponent } from 'vue';
import Popper from "vue3-popper";
import VueColorPicker from 'vue-color-picker-wheel';

export default defineComponent({
  name: 'ColorPicker',

  components: {
      VueColorPicker,
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
