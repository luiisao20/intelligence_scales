<template>
    <div class="relative w-full max-w-7xl max-h-full">
        <!-- Modal content -->
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <!-- Modal header -->
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <div class="flex gap-10">
                    <h3 class="text-xl font-medium text-gray-900 dark:text-white">
                        {{ id }}
                    </h3>
                    <h3 v-if="type !== ''" class="text-xl font-medium text-gray-900 dark:text-white">
                        {{ list.find(ind => ind.key === type).name }}
                    </h3>
                    <h3 class="text-xl font-medium text-gray-900 dark:text-white">
                        {{ years }} años, {{ months }} meses
                    </h3>
                    <h3 class="text-xl font-medium text-gray-900 dark:text-white">
                        {{ date }}
                    </h3>
                </div>
                <button @click="emit('closeModal')" type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="extralarge-modal">
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span class="sr-only">Close modal</span>
                </button>
            </div>
            <!-- Modal body -->
            <div v-if="type === 'wnv'" class="flex items-center p-4 justify-center gap-5">
                <TableIndexes 
                    :indexes="index"
                    :composes="data"
                    @update-graphics="changeRange" 
                    :show-w-n-v="true"
                />
                <CompositeScores
                    :data-graphics="graphics" :range="range"
                    title="Puntuación Escala Total"
                />
            </div>
            <div v-else-if="['wais_c', 'wais_m', 'wais_e'].includes(type)" class="flex flex-col items-center p-4 justify-center gap-5">
                <IndexesSum :indexes="indexesWais" :indexes-sum="data.sum"/>
                <TableIndexes :indexes="indexesWais" :composes="data.composes" @update-graphics="changeRange" />
                <CompositeScores
                    :data-graphics="graphics" :range="range"
                    title="Puntuación Escala Total"
                />
            </div>
            <div v-else-if="['wisc', 'wppsi'].includes(type)" class="grid grid-cols-2 gap-10 p-10">
                <IndexesSum
                    class="place-self-center"
                    :indexes="primary.indexes" 
                    :indexes-sum="data.primarySum"
                    title="Análisis primario"/> 

                <IndexesSum 
                    class="place-self-center"
                    :indexes="secondary.indexes" 
                    :indexes-sum="data.secondarySum"
                    title="Análisis secundario"/>

                <TableIndexes
                    :indexes="primary.indexes"
                    :composes="data.primaryComposes"
                    @update-graphics="changePRange"
                />

                <TableIndexes
                    :indexes="secondary.indexes"
                    :composes="data.secondaryComposes"
                    :state="true"
                    @update-graphics="changePRange"
                />

                <CompositeScores class="place-self-center"
                    :data-graphics="primary.graphics"
                    :range="primary.range" title="Análisis Primario - Puntuaciones compuestas"
                    />
                <CompositeScores class="place-self-center"
                    :data-graphics="secondary.graphics"
                    :range="secondary.range" title="Análisis Secundario - Puntuaciones compuestas"
                    graphics-id="two" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { onBeforeMount, reactive, ref, watchEffect } from 'vue';
import TableIndexes from './TableIndexes.vue';
import CompositeScores from './CompositeScores.vue';
import { indexes as indexesWais } from '@/composables/wais/info';
import IndexesSum from './IndexesSum.vue';
import { primaryIndexes as pIndexesWisc, secondaryIndexes as sIndexesWisc } from '@/composables/wisc/info';
import { primaryIndexes as pIndexesWPPSI, secondaryIndexes as sIndexesWPPSI } from '@/composables/wppsi/info';

const props = defineProps({
    data: {
        required: true,
        type: Object
    },
    date: {
        required: true,
        type: String
    },
    id: {
        required: true,
        type: String
    },
    patient: {
        required: true,
        type: String
    },
    type: {
        required: true,
        type: String
    },
    years: {
        required: true,
        type: String
    },
    months: {
        required: true,
        type: String
    },
    list: {
        required: true,
        type: Array
    }
})
const emit = defineEmits(['closeModal']);
const graphics = reactive({
    upperLimits: [],
    values: [],
    lowerLimits: [],
    xlabel: [],
})
const index = [
    {
        code: 'CIT',
        name: 'Escala total',
        group: null
    }
]
const range = ref(false);
const primary = reactive({
    graphics: {},
    range: false,
    indexes: []
})
const secondary = reactive({
    graphics: {},
    range: false,
    indexes: []
})

function setGraphics(data, range, indexes) {
    let graphics = {
        upperLimits: [],
        values: [],
        lowerLimits: [],
        xlabel: []
    }

    indexes.forEach((index) => {
        const compose = data[index.code];
        
        if (compose) {
            graphics.values.push(compose[index.code]);
            graphics.xlabel.push(index.code);
    
            if (!range) {
                graphics.upperLimits.push(compose['90%'].split('-')[1]);
                graphics.lowerLimits.push(compose['90%'].split('-')[0]);
            } else {
                graphics.upperLimits.push(compose['95%'].split('-')[1]);
                graphics.lowerLimits.push(compose['95%'].split('-')[0]);
            }
        }
    })
    return graphics
}

function changeRange(value) {
    graphics.lowerLimits = [];
    graphics.upperLimits = [];
    range.value = value;
    
    if (props.type === 'wnv') {
        setLimits(props.data['CIT']);
    } else if (['wais_c', 'wais_m', 'wais_e'].includes(props.type)) {
        indexesWais.forEach((key) => {
            const compose = props.data.composes[key.code];
            setLimits(compose);
        })
    }
}

function changePRange(value, state) {
    if (!state) {
        primary.range = value;
        primary.graphics = setGraphics(props.data.primaryComposes, primary.range, primary.indexes);
    }
    else {
        secondary.range = value;
        secondary.graphics = setGraphics(props.data.secondaryComposes, secondary.range, secondary.indexes);
    }
}

function setLimits(compose) {
    if (!range.value) {
        graphics.upperLimits.push(compose['90%'].split('-')[1]);
        graphics.lowerLimits.push(compose['90%'].split('-')[0]);
    } else {
        graphics.upperLimits.push(compose['95%'].split('-')[1]);
        graphics.lowerLimits.push(compose['95%'].split('-')[0]);
    }
}

watchEffect(() => {
    graphics.lowerLimits = [];
    graphics.values = [];
    graphics.upperLimits = [];

    if (props.type === 'wisc') {
        primary.indexes = pIndexesWisc;
        secondary.indexes = sIndexesWisc;
    } else if (props.type === 'wppsi') {
        primary.indexes = pIndexesWPPSI;
        secondary.indexes = sIndexesWPPSI;
    }

    if (props.type === 'wnv') {
        graphics.values.push(props.data['CIT']['CIT']);
        graphics.xlabel.push(index[0].code);
        setLimits(props.data['CIT']);
    } else if (['wais_c', 'wais_m', 'wais_e'].includes(props.type)) {
        indexesWais.forEach((index) => {
            const compose = props.data.composes[index.code];

            if (compose) {
                graphics.values.push(compose[index.code]);
                graphics.xlabel.push(index.code);
                setLimits(compose);
            }
        })
    } else if (['wisc', 'wppsi'].includes(props.type)) {
        primary.graphics = setGraphics(props.data.primaryComposes, primary.range, primary.indexes);
        secondary.graphics = setGraphics(props.data.secondaryComposes, secondary.range, secondary.indexes);
    }
})

</script>