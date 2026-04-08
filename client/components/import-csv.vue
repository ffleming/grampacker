<style lang="scss">
#importValidate {
    height: 500px;
    overflow-y: scroll;
    width: 900px;
    max-width: 95vw;

    .lpButton {
        margin-bottom: 30px;
    }
}

</style>

<template>
    <div id="importCSV">
        <modal id="importValidate" :shown="shown" @hide="shown = false">
            <h2>Confirm your import</h2>
            <div id="importData">
                <ul class="lpTable lpDataTable">
                    <li class="lpRow lpHeader">
                        <span class="lpCell">Item Name</span>
                        <span class="lpCell">Category</span>
                        <span class="lpCell">Description</span>
                        <span class="lpCell">Quantity</span>
                        <span class="lpCell">Weight</span>
                        <span class="lpCell">Unit</span>
                        <span class="lpCell">URL</span>
                        <span class="lpCell">Price</span>
                        <span class="lpCell">Worn</span>
                        <span class="lpCell">Consumable</span>
                        <span class="lpCell">Photo URL</span>
                    </li>
                    <li v-for="row in importData.data" class="lpRow">
                        <span class="lpCell">{{ row.name }}</span>
                        <span class="lpCell">{{ row.category }}</span>
                        <span class="lpCell">{{ row.description }}</span>
                        <span class="lpCell">{{ row.qty }}</span>
                        <span class="lpCell">{{ row.weight }}</span>
                        <span class="lpCell">{{ row.unit }}</span>
                        <span class="lpCell">{{ row.url }}</span>
                        <span class="lpCell">{{ row.price }}</span>
                        <span class="lpCell">{{ row.worn }}</span>
                        <span class="lpCell">{{ row.consumable }}</span>
                        <span class="lpCell">{{ row.photo }}</span>
                    </li>
                </ul>
            </div>
            <a id="importConfirm" class="lpButton" @click="importList">Import List</a>
            <a class="lpButton close" @click="shown = false">Cancel Import</a>
        </modal>
        <form id="csvUpload">
            <input id="csv" type="file" name="csv">
        </form>
    </div>
</template>

<script>
import { defineComponent } from 'vue';

import bus from '../bus';
import modal from './modal.vue';

export default defineComponent({
    name: 'ImportCsv',

    components: {
        modal,
    },

    data() {
        return {
            csvInput: false,
            listId: false,
            importData: {},
            fullUnitToUnit: {
                ounce: 'oz', ounces: 'oz', oz: 'oz', pound: 'lb', pounds: 'lb', lb: 'lb', lbs: 'lb', gram: 'g', grams: 'g', g: 'g', kilogram: 'kg', kilograms: 'kg', kg: 'kg', kgs: 'kg',
            },
            shown: false,
        };
    },

    computed: {
        library() {
            return this.$store.state.library;
        },
    },

    mounted() {
        this.csvInput = document.getElementById('csv');
        this.csvInput.onchange = this.importCSV;

        bus.$on('importCSV', () => {
            this.csvInput.click();
        });
    },

    methods: {
        importCSV(evt) {
            const file = evt.target.files[0];
            if (!file) return;

            const name = file.name;
            const size = file.size;
            const type = file.type;

            if (name.length < 1) {
                return;
            }
            if (size > 1000000) {
                alert('File is too big');
                return;
            }
            if (name.substring(name.length - 4).toLowerCase() != '.csv') {
                alert('Please select a CSV.');
                return;
            }
            const reader = new FileReader();

            reader.onload = ((theFile) => {
                this.validateImport(theFile.target.result, file.name.substring(0, file.name.length - 4).replace(/\_/g, ' '));
            });

            reader.readAsText(file);
        },
        CSVToArray(strData) {
            const strDelimiter = ',';
            const arrData = [[]];
            let arrMatches = null;

            const objPattern = new RegExp(
                (
                    `(\\${strDelimiter}|\\r?\\n|\\r|^)`
                  + '(?:"([^"]*(?:""[^"]*)*)"|'
                  + `([^"\\${strDelimiter}\\r\\n]*))`
                ), 'gi',
            );

            while (arrMatches = objPattern.exec(strData)) {
                const strMatchedDelimiter = arrMatches[1];
                if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
                    arrData.push([]);
                }

                if (arrMatches[2]) {
                    var strMatchedValue = arrMatches[2].replace(new RegExp('""', 'g'), '"');
                } else {
                    var strMatchedValue = arrMatches[3];
                }

                arrData[arrData.length - 1].push(strMatchedValue);
            }

            return arrData;
        },
        validateImport(input, name) {
            const csv = this.CSVToArray(input);
            this.importData = { data: [], name };

            for (const i in csv) {
                const row = csv[i];
                if (row.length < 6) continue;
                if (row[0].toLowerCase() == 'item name') continue;
                if (isNaN(parseInt(row[3]))) continue;
                if (isNaN(parseInt(row[4]))) continue;
                if (typeof this.fullUnitToUnit[row[5]] === 'undefined') continue;

                this.importData.data.push({
                    name: row[0],
                    category: row[1],
                    description: row[2],
                    qty: parseFloat(row[3]),
                    weight: parseFloat(row[4]),
                    unit: this.fullUnitToUnit[row[5]],
                    url: row[6],
                    price: parseFloat(row[7]) || 0,
                    worn: row[8],
                    consumable: row[9],
                    photo: row[10] || '',
                });
            }

            if (!this.importData.data.length) {
                alert('Unable to load spreadsheet - please verify the format.');
            } else {
                this.shown = true;
            }
        },
        importList() {
            this.$store.commit('importCSV', this.importData);
            this.shown = false;
        },

    },
});
</script>
