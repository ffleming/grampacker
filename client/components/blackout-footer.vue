<style lang="scss">
</style>

<template>
    <div id="lpWelcomeFooter">
        <div class="lpSiteBy">
          Gram Packer {{appVersion}} is a
          <a class="lpHref" href="https://github.com/ffleming/grampacker/graphs/contributors" target="_blank" rel="noopener noreferrer">community</a> effort.
          <a class="lpHref" href="https://github.com/ffleming/grampacker/issues" target="_blank" rel="noopener noreferrer">Join in!</a>
        </div>
        <div class="lpContact">
            <a class="lpHref" href="https://github.com/ffleming/grampacker/blob/master/LICENSE" target="_blank" rel="noopener noreferrer">Copyleft</a> Gram Packer 2024
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import packageInfo from "../../package.json"

export default defineComponent({
  name: 'BlackoutFooter',
  data() {
    return {
      appVersion: packageInfo.version,
    };
  },
});
</script>
