<style lang="scss">
@import "../css/_globals";

#listContainer {
    flex: 0 0 auto;

    #lists {
        max-height: 25vh;
    }
}

.lpLibraryList {
    border-top: 1px dotted #999;
    display: flex;
    list-style: none;
    margin: 0 10px;
    overflow-y: auto;
    padding: 6px 0;
    position: relative;

    &:first-child {
        border-top: none;
        padding-top: 10px;
    }

    &:last-child {
        border-bottom: none;
    }

    &.lpActive {
        color: $yellow1;
        font-weight: bold;

        .lpRemove {
            display: none;
        }
    }

    &.gu-mirror {
        background: #606060;
        border: 1px solid #999;
        color: #fff;
    }

    .lpHandle {
        flex: 0 0 12px;
        height: 18px;
        margin-right: 5px;
    }

    &:hover .lpHandle {
        visibility: visible;
    }

    .lpListName {
        flex: 1 1 auto;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        &:hover {
            cursor: pointer;
            text-decoration: underline;
        }
    }

    .lpRemove {
        flex: 0 0 8px;
        margin-bottom: 0;
    }
}

.listContainerHeader {
    display: flex;
    justify-content: space-between;
}

#addListFlyout {
    .lpPopoverContent a {
        display: block;
        margin-bottom: 5px;

        &:last-child {
            margin-bottom: 0;
        }
    }
}
</style>

<template>
    <section id="listContainer">
        <div class="listContainerHeader">
            <h2>Lists</h2>
            <Popper id="addListFlyout" hover>
                <span><a class="lpAdd" @click="newList"><i class="lpSprite lpSpriteAdd" />Add new list</a></span>
                <template #content>
                  <div class="lpPopoverContent">
                    <a class="lpAdd" @click="newList"><i class="lpSprite lpSpriteAdd" />Add new list</a>
                    <a class="lpAdd" @click="importCSV"><i class="lpSprite lpSpriteUpload" />Import CSV</a>
                    <a class="lpCopy" @click="copyList"><i class="lpSprite lpSpriteCopy" />Copy a list</a>
                  </div>
                </template>
            </Popper>
        </div>
        <ul id="lists">
            <li v-for="list in library.lists" :key="list.id" class="lpLibraryList" :class="{lpActive: (library.defaultListId == list.id)}">
                <div class="lpHandle" title="Reorder this item" />
                <span class="lpLibraryListSwitch lpListName" @click="setDefaultList(list)">
                    {{ list.name || 'New list' }}
                </span>
                <a class="lpRemove" title="Remove this list" @click="removeList(list)"><i class="lpSprite lpSpriteRemove" /></a>
            </li>
        </ul>
    </section>
</template>

<script>
import { defineComponent } from 'vue';

import Popper from 'vue3-popper'

const dragula = require('dragula');

export default defineComponent({
  name: 'LibraryList',

  components: {
      Popper,
  },

  filters: {
      listName(list) {
          return list.name || 'New list';
      },
  },

  props: ['list'],

  computed: {
      library() {
          return this.$store.state.library;
      },
  },

  mounted() {
      this.handleListReorder();
  },

  methods: {
      setDefaultList(list) {
          this.$store.commit('setDefaultList', list);
      },
      newList() {
          this.$store.commit('newList');
      },
      copyList() {
          bus.$emit('copyList');
      },
      importCSV() {
          bus.$emit('importCSV');
      },
      handleListReorder() {
          const $lists = document.getElementById('lists');
          const drake = dragula([$lists], {
              moves($el, $source, $handle, $sibling) {
                  return $handle.classList.contains('lpHandle');
              },
          });
          drake.on('drag', ($el, $target, $source, $sibling) => {
              this.dragStartIndex = getElementIndex($el);
          });
          drake.on('drop', ($el, $target, $source, $sibling) => {
              this.$store.commit('reorderList', { before: this.dragStartIndex, after: getElementIndex($el) });
              drake.cancel(true);
          });
      },
      removeList(list) {
          const callback = function () {
              this.$store.commit('removeList', list);
          };
          const speedbumpOptions = {
              body: 'Are you sure you want to delete this list? This cannot be undone.',
          };
          bus.$emit('initSpeedbump', callback, speedbumpOptions);
      },
  },
});
</script>
