<style lang="scss">
.lpQtySubtotal {
    padding-right: 25px; /* Accommodates delete column */
}

.lpPriceSubtotal { /* unused? */
    padding-right: 4px;
}

.lpWeightBreakdownGrid {
    display: grid;
    grid-template-columns: max-content 1fr auto;
    align-items: baseline;
    row-gap: 2px;
    width: 100%;
    line-height: 1.2;
}

.lpWeightBreakdownGrid .lpBreakdownLabel {
    text-align: right;
    padding-right: 4px;
    color: #777;
    font-size: 11px;
    font-weight: normal;
    white-space: nowrap;
}

.lpWeightBreakdownGrid .lpBreakdownValue,
.lpWeightBreakdownGrid .lpBreakdownUnit {
    color: #777;
    font-size: 11px;
    font-weight: normal;
}

.lpWeightBreakdownGrid .lpDisplaySubtotal {
    text-align: right;
}

.lpWeightBreakdownGrid .lpSubtotalUnit {
    text-align: left;
}

.lpQtyBreakdownGrid {
    display: grid;
    grid-template-columns: 1fr;
    align-items: baseline;
    row-gap: 2px;
    width: 100%;
    line-height: 1.2;
}

.lpQtyBreakdownGrid .lpBreakdownValue {
    color: #777;
    font-size: 11px;
    font-weight: normal;
}
</style>

<template>
    <li :id="category.id" class="lpCategory">
        <ul class="lpItems lpDataTable">
            <li class="lpHeader lpItemsHeader">
                <span class="lpHandleCell">
                    <div class="lpHandle lpCategoryHandle" title="Reorder this category" />
                </span>
                <input v-focus-on-create="category._isNew" type="text" :value="category.name" placeholder="Category Name" class="lpCategoryName lpSilent" @input="updateCategoryName">
                <span v-if="library.optionalFields['price']" class="lpPriceCell">Price</span>
                <span class="lpWeightCell">Weight</span>
                <span class="lpQtyCell"><span class="lpDesktopText">Quantity</span><span class="lpMobileText">Qty</span></span>
                <span class="lpRemoveCell"><a class="lpRemove lpRemoveCategory" title="Remove this category" @click="removeCategory(category)"><i class="lpSprite lpSpriteRemove" /></a></span>
            </li>
            <item v-for="itemContainer in itemContainers" :key="itemContainer.item.id" :item-container="itemContainer" :category="category" />
            <li class="lpFooter lpItemsFooter">
                <span class="lpAddItemCell">
                    <a class="lpAdd lpAddItem" @click="newItem"><i class="lpSprite lpSpriteAdd" />Add new item</a>
                </span>
                <span v-if="library.optionalFields['price']" class="lpPriceCell lpNumber lpSubtotal">
                   {{ $filters.displayPrice(category.subtotalPrice, library.currencySymbol) }}
                </span>
                <span class="lpWeightCell lpNumber lpSubtotal">
                    <div class="lpWeightBreakdownGrid">
                        <span class="lpBreakdownLabel">total:</span>
                        <span class="lpDisplaySubtotal">{{ $filters.displayWeight(category.subtotalWeight, library.totalUnit) }}</span>
                        <span class="lpSubtotalUnit">{{ library.totalUnit }}</span>
                        
                        <template v-if="library.optionalFields['consumable'] && category.subtotalConsumableWeight > 0">
                            <span class="lpBreakdownLabel">consumable:</span>
                            <span class="lpDisplaySubtotal lpBreakdownValue">{{ $filters.displayWeight(category.subtotalConsumableWeight, library.totalUnit) }}</span>
                            <span class="lpSubtotalUnit lpBreakdownUnit">{{ library.totalUnit }}</span>
                        </template>

                        <template v-if="library.optionalFields['worn'] && category.subtotalWornWeight > 0">
                            <span class="lpBreakdownLabel">worn:</span>
                            <span class="lpDisplaySubtotal lpBreakdownValue">{{ $filters.displayWeight(category.subtotalWornWeight, library.totalUnit) }}</span>
                            <span class="lpSubtotalUnit lpBreakdownUnit">{{ library.totalUnit }}</span>
                        </template>

                        <template v-if="library.optionalFields['worn'] && category.subtotalWornWeight > 0 && subtotalPackWeight > 0">
                            <span class="lpBreakdownLabel">pack:</span>
                            <span class="lpDisplaySubtotal lpBreakdownValue">{{ $filters.displayWeight(subtotalPackWeight, library.totalUnit) }}</span>
                            <span class="lpSubtotalUnit lpBreakdownUnit">{{ library.totalUnit }}</span>
                        </template>
                        
                        <template v-if="((library.optionalFields['worn'] && category.subtotalWornWeight > 0) || (library.optionalFields['consumable'] && category.subtotalConsumableWeight > 0)) && subtotalBaseWeight > 0">
                            <span class="lpBreakdownLabel">base:</span>
                            <span class="lpDisplaySubtotal lpBreakdownValue">{{ $filters.displayWeight(subtotalBaseWeight, library.totalUnit) }}</span>
                            <span class="lpSubtotalUnit lpBreakdownUnit">{{ library.totalUnit }}</span>
                        </template>
                    </div>
                </span>
                <span class="lpQtyCell lpSubtotal">
                    <div class="lpQtyBreakdownGrid">
                        <span class="lpQtySubtotal">{{ category.subtotalQty }}</span>
                        
                        <template v-if="library.optionalFields['consumable'] && category.subtotalConsumableWeight > 0">
                            <span class="lpQtySubtotal lpBreakdownValue">{{ category.subtotalConsumableQty }}</span>
                        </template>

                        <template v-if="library.optionalFields['worn'] && category.subtotalWornWeight > 0">
                            <span class="lpQtySubtotal lpBreakdownValue">{{ category.subtotalWornQty }}</span>
                        </template>

                        <template v-if="library.optionalFields['worn'] && category.subtotalWornWeight > 0 && subtotalPackWeight > 0">
                            <span class="lpQtySubtotal lpBreakdownValue">{{ subtotalPackQty }}</span>
                        </template>
                        
                        <template v-if="((library.optionalFields['worn'] && category.subtotalWornWeight > 0) || (library.optionalFields['consumable'] && category.subtotalConsumableWeight > 0)) && subtotalBaseWeight > 0">
                            <span class="lpQtySubtotal lpBreakdownValue">{{ subtotalBaseQty }}</span>
                        </template>
                    </div>
                </span>
                <span class="lpRemoveCell" />
            </li>
        </ul>
    </li>
</template>

<script>
import { defineComponent } from 'vue';

import bus from '../bus';
import item from './item.vue';

const utilsMixin = require('../mixins/utils-mixin.js');

export default defineComponent({
  name: 'Category',

  components: {
      item,
  },

  mixins: [utilsMixin],
  props: ['category'],

  computed: {
      library() {
          return this.$store.state.library;
      },
      itemContainers() {
          return this.category.categoryItems.map(categoryItem => ({ categoryItem, item: this.library.getItemById(categoryItem.itemId) }));
      },
      subtotalPackWeight() {
          return this.category.subtotalWeight - this.category.subtotalWornWeight;
      },
      subtotalBaseWeight() {
          return this.category.subtotalWeight - (this.category.subtotalWornWeight + this.category.subtotalConsumableWeight);
      },
      subtotalPackQty() {
          return this.category.subtotalQty - this.category.subtotalWornQty;
      },
      subtotalBaseQty() {
          return this.category.subtotalQty - (this.category.subtotalWornQty + this.category.subtotalConsumableQty);
      }
  },

  methods: {
      newItem() {
          this.$store.commit('newItem', { category: this.category, _isNew: true });
      },
      updateCategoryName(evt) {
          this.$store.commit('updateCategoryName', { id: this.category.id, name: evt.target.value });
      },
      removeCategory(category) {
          const callback = function () {
              this.$store.commit('removeCategory', category);
          };
          const speedbumpOptions = {
              body: 'Are you sure you want to delete this category? This cannot be undone.',
          };
          bus.$emit('initSpeedbump', callback, speedbumpOptions);
      }
  },
});
</script>
