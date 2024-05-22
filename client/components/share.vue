<style lang="scss">
@import "../css/_globals";
#csvUrl {
    display: block;
    margin-top: 15px;
}

#lpOptionalFields {
    margin: 0;
    padding: 0;
}

.lpOptionalField {
    list-style-type: none;
    margin: 0;
    padding: 0;
}

#lpPriceSettings {
    input {
        display: inline-block;
        margin-left: 10px;
        width: 50px;
    }
}

#share .lpContent {
    width: 330px;
}

#settings .lpContent {
    width: 200px;
}

#share label {
    font-weight: bold;
}
.lpPopover {
    display: block;
    position: relative;

    .lpTarget {
        cursor: default;
        display: inline-block;
        margin-bottom: -10px;
        padding-bottom: 10px;
        position: relative;
    }

    .lpContent {
        background: #fff;
        box-shadow: 0 0 6px rgba(0, 0, 0, 0.25);
        color: $content;
        left: 50%;
        margin-top: 15px;
        min-width: 100%;
        opacity: 0;
        padding: 12px;
        pointer-events: none;
        position: absolute;
        top: 100%;
        transform: translateX(-50%);
        transition: all 0.15s;
        white-space: nowrap;
        z-index: $dialog;

        &::before {
            background-color: #fff;
            box-shadow: 0 0 6px rgba(0, 0, 0, 0.25);
            content: "";
            display: block;
            height: 20px;
            left: 50%;
            margin-left: -10px;
            position: absolute;
            top: -10px;
            transform: rotate(45deg);
            width: 20px;
            z-index: $dialog - 1;
        }

        &::after {
            background: #fff;
            content: "";
            display: block;
            height: 15px;
            left: 0;
            position: absolute;
            top: 0;
            width: 100%;
            z-index: $dialog + 1;
        }

        & > *:first-child {
            margin-top: 0;
        }

        & > *:last-child {
            margin-bottom: 0;
        }

        h3 {
            margin-bottom: 0;
        }

        ul, a {
            line-height: 25px;
        }

        hr {
            border-color: $border1;
            margin: 7px -0;
            padding: 0;
        }
    }

    &.lpPopoverShown {
        .lpTarget {
            z-index: $aboveDialog;
        }

        .lpContent {
            margin-top: 10px;
            opacity: 1;
            pointer-events: all;
        }
    }
}

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
