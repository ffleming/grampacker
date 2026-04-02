<style lang="scss">
@import "../css/_globals";

$sidebarWidth: 280px;
$sidebarOverflow: 1000px;
$sidebarPadding: 20px;

#sidebar {
    background: #555;
    box-shadow: -7px 0 7px rgba(0, 0, 0, 0.2) inset;
    color: #fff;
    height: 100%;
    margin-left: -$sidebarOverflow;
    opacity: 0;
    padding-left: $sidebarOverflow + $sidebarPadding;
    padding-right: $sidebarPadding;
    position: fixed;
    transition: opacity $transitionDurationSlow ease-in-out 0s;
    width: $sidebarWidth + $sidebarOverflow + $sidebarPadding*2;
    z-index: $sidebar;

    @media only screen and (max-width: 720px) {
        z-index: $aboveSidebar + 10;
        pointer-events: none;
    }

    .lpHasSidebar & {
        opacity: 1;

        @media only screen and (max-width: 720px) {
            pointer-events: auto;
        }
    }

    h1 {
        @include fullBleedLeft();

        height: 60px;
        margin: 0 -20px 20px 0;
        padding: 20px 0 20px;
        position: relative;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        span {
            color: #aaa;
        }
    }

    .lpCloseSidebar {
        cursor: pointer;
        display: none;
        font-size: 32px;
        line-height: 24px;
        padding: 0 15px 0 5px;
        margin-left: -5px;
        
        @media only screen and (max-width: 720px) {
            display: block;
        }
    }

    section {
        margin-bottom: 40px;
        position: relative;
    }

    h2 {
        font-size: 16px;
        margin: 0 0 10px;
    }

    ul {
        background: #606060;
        margin: 0;
        overflow-x: hidden;
        padding: 0;
    }

    .lpHref {
        color: $blue2;
    }
}

#scrollable {
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
    top: 0;

    > h1 {
        flex: 0 0 auto;
    }
}

</style>

<template>
    <div id="sidebar">
        <div id="scrollable">
            <h1><a class="lpCloseSidebar" @click="toggleSidebar">&times;</a> Gram Packer</h1>

            <libraryLists />
            <libraryItems />
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';

import libraryItems from './library-items.vue';
import libraryLists from './library-lists.vue';

export default defineComponent({
  name: 'Sidebar',

  components: {
      libraryItems,
      libraryLists,
  },
  
  methods: {
      toggleSidebar() {
          this.$store.commit('toggleSidebar');
      }
  }
});
</script>
