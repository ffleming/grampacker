<style lang="scss">
</style>

<template>
  <span id="share" v-if="isSignedIn" class="headerItem hasPopover">
      <Popper>
        <span class="lpTarget"><i class="lpSprite lpLink" /> Share</span>
        <template #content>
          <div class="lpContent">
            <div class="lpField">
              <label for="shareUrl">Share your list</label>
              <input id="shareUrl" v-select-on-bus="'show-share-box'"  v-select-on-focus type="text" :value="shareUrl">
            </div>
            <div class="lpField">
              <label for="embedUrl">Embed your list</label>
              <textarea id="embedUrl" v-select-on-focus>&lt;script src="{{ this.baseUrl }}/e/{{ this.externalId }}"&gt;&lt;/script&gt;&lt;div id="{{ this.externalId }}"&gt;&lt;/div&gt;</textarea>
            </div>
            <a id="csvUrl" :href="csvUrl" target="_blank" class="lpHref"><i class="lpSprite lpSpriteDownload" />Export to CSV</a>
          </div>
        </template>
      </Popper>
  </span>
</template>

<script>
import { defineComponent } from 'vue';

import Popper from "vue3-popper";

export default defineComponent({
  name: 'Share',

  components: {
      Popper,
  },

  computed: {
      library() {
          return this.$store.state.library;
      },
      list() {
          return this.library.getListById(this.library.defaultListId);
      },
      isSignedIn() {
          return this.$store.state.loggedIn;
      },
      externalId() {
          return this.list.externalId || '';
      },
      baseUrl() {
          const location = window.location;
          return location.origin ? location.origin : `${location.protocol}//${location.hostname}`;
      },
      shareUrl() {
          return `${this.baseUrl}/r/${this.externalId}`;
      },
      csvUrl() {
          return `${this.baseUrl}/csv/${this.externalId}`;
      },
  },

  methods: {
      focusShare(evt) {
          if (!this.list.externalId) {
              return fetchJson('/externalId', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  credentials: 'same-origin',
              })
                  .then((response) => {
                      this.$store.commit('setExternalId', { externalId: response.externalId, list: this.list });
                      setTimeout(() => {
                          bus.$emit('show-share-box');
                      }, 0);
                  })
                  .catch((response) => {
                      alert('An error occurred while attempting to get an ID for your list. Please try again later.'); // TODO
                  });
          }
          bus.$emit('show-share-box');
      },
  },
});
/*

<template>
  <span id="share" v-if="isSignedIn" class="headerItem">
      <Popper>
        <span>Share</span>
        <template #content>
          <div>
            <div class="lpField">
              <label for="shareUrl">Share your list</label>
              <input id="shareUrl" v-select-on-bus="'show-share-box'"  v-select-on-focus type="text" :value="shareUrl">
            </div>
            <div class="lpField">
              <label for="embedUrl">Embed your list</label>
              <textarea id="embedUrl" v-select-on-focus>&lt;script src="{{ this.baseUrl }}/e/{{ this.externalId }}"&gt;&lt;/script&gt;&lt;div id="{{ this.externalId }}"&gt;&lt;/div&gt;</textarea>
            </div>
            <a id="csvUrl" :href="csvUrl" target="_blank" class="lpHref"><i class="lpSprite lpSpriteDownload" />Export to CSV</a>
          </div>
        </template>
      </Popper>
  </span>
</template>
*/
</script>
