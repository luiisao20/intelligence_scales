<template>
    <div id="popup-modal" tabindex="-1" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
        <Modal
            v-bind="modalElements"
            @close-modal="modal.hide()" 
        />
    </div>
    <section class="main-view">
        <div>
            <TableInputs
                :tests="testsCopy"
                :primary-indexes="primaryIndexes"
                :secondary-indexes="secondaryIndexes"
                :primary-points="primaryData.points"
                :secondary-points="secondaryData.points"
                :inputs="inputTests"
                @show-points="findScalarScoring"
            />
        </div>
        <div class="grid grid-cols-2 gap-10 mx-10 my-10">
            <IndexesSum
                class="place-self-center"
                :indexes="primaryIndexes" 
                :indexes-sum="primaryData.sum"
                title="Análisis primario"/> 
            <IndexesSum 
                class="place-self-center"
                :indexes="secondaryIndexes" 
                :indexes-sum="secondaryData.sum"
                title="Análisis secundario"/>   
        </div>

        <div v-if="showComposes" class="grid grid-cols-2 gap-10 mx-10 my-10">
            <TableIndexes
                :indexes="primaryIndexes"
                :composes="primaryData.composes"
                @update-graphics="changeRange"
            />

            <TableIndexes
                :indexes="secondaryIndexes"
                :composes="secondaryData.composes"
                :state="true"
                @update-graphics="changeRange"
            />

            <CompositeScores class="place-self-center"
                :data-graphics="primaryData.graphics"
                :range="primaryData.range" title="Análisis Primario - Puntuaciones compuestas"
                />
            <CompositeScores class="place-self-center"
                :data-graphics="secondaryData.graphics"
                :range="secondaryData.range" title="Análisis Secundario - Puntuaciones compuestas"
                graphics-id="two" />
        </div>
    </section>
</template>

<script setup>
import { tests, primaryIndexes, secondaryIndexes } from '@/composables/wisc/info';
import a1 from '../../data/a1_wisc.json' with { type: 'json' };
import a2_a7 from '../../data/a2_a7_wisc.json' with { type: 'json' };
import c1_c5 from '../../data/c1_c5_wisc.json' with { type: 'json' };
import TableInputs from '@/components/TableInputs.vue';
import { onBeforeMount, onMounted, reactive, ref } from 'vue';
import IndexesSum from '@/components/IndexesSum.vue';
import { findScalars } from '@/composables/getRange';
import { selectReplacementsWISC } from '@/composables/replacements';
import TableIndexes from '@/components/TableIndexes.vue';
import CompositeScores from '@/components/CompositeScores.vue';
import { initFlowbite, Modal as ModalFlow } from 'flowbite';
import { useModal } from '@/composables/modal';
import Modal from '@/components/Modal.vue';

const testsCopy = ref([]);
const primaryData = reactive({
    points: {},
    sum: {},
    composes: {},
    graphics: {},
    range: false
})
const secondaryData = reactive({
    points: {},
    sum: {},
    composes: {},
    graphics: {},
    range: false
})
const inputTests = ref({});
const showComposes = ref(false);
const modal = ref(null);
const { modalElements, showModal } = useModal();

onMounted(() => {
    const target = document.getElementById('popup-modal');
    const instanceOptions = {
        id: 'popup-modal',
        override: true
    };
    modal.value = new ModalFlow(target, instanceOptions);
    initFlowbite();
})

onBeforeMount(() => {
    testsCopy.value = [ ...tests ];
})

function findScalarScoring() {
    const primary = findScalars(inputTests.value, a1[0], testsCopy.value, primaryIndexes, 'primary');
    const secondary = findScalars(inputTests.value, a1[0], testsCopy.value, secondaryIndexes, 'secondary');

    if (primary.errors.outOfRange !== '') {
        const testError = testsCopy.value.find(test => test.code === primary.errors.outOfRange).name;
        modal.value.show();
        showModal(`La prueba ${testError} se encuentra fuera de rango`, false);
    } else if (secondary.errors.outOfRange !== '') {
        const testError = testsCopy.value.find(test => test.code === secondary.errors.outOfRange).name;
        modal.value.show();
        showModal(`La prueba ${testError} se encuentra fuera de rango`, false);
    }

    primaryData.points = primary.points;
    primaryData.sum = primary.sum;
    secondaryData.points = secondary.points;
    secondaryData.sum = secondary.sum;

    findPrimarySums();

    primaryData.composes = findComposes(a2_a7, true);
    secondaryData.composes = findComposes(c1_c5);

    primaryData.graphics = setGraphics(primaryData.composes, primaryData.range, primaryIndexes);
    secondaryData.graphics = setGraphics(secondaryData.composes, secondaryData.range, secondaryIndexes);
    showComposes.value = true;
}

function findComposes(array, primary) {
    let composes = {};

    array.forEach(element => {
        let sum = 0;

        if (primary) sum = primaryData.sum[element.index];
        else sum = secondaryData.sum[element.index];

        if (element.data[sum]) {
            const newData = { ...element.data[sum] };
            composes[element.index] = newData;
        }

    })

    return composes
}

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

function changeRange(value, state) {
    if (!state) {
        primaryData.range = value;
        primaryData.graphics = setGraphics(primaryData.composes, primaryData.range, primaryIndexes);
    }
    else {
        secondaryData.range = value;
        secondaryData.graphics = setGraphics(secondaryData.composes, secondaryData.range, secondaryIndexes);
    }
}

function findPrimarySums() {
    let completed = [];
    let uncompleted = [];

    testsCopy.value.forEach((test) => {
        const element = primaryData.points[test.code];

        if(!element) {uncompleted.push(test.code);}
        else {completed.push(test.code);}

        if (test.primary.length > 0) {
            const pIndex = primaryIndexes.find(index => index.group === test.primary[0]).code;

            if (!element) delete primaryData.sum[pIndex]
        }

        if (test.secondary.length > 0) {
            test.secondary.every((group) => {
                const sIndex = secondaryIndexes.find(index => index.group === group).code;

                if(!element) delete secondaryData.sum[sIndex];
                return true;
            })
        }
    })

    let mains = 0;
    primaryData.sum['CIT'] = 0;

    completed.forEach((test) => {
        if (primaryIndexes.at(-1).mains.includes(test)) {
            primaryData.sum['CIT'] += primaryData.points[test];
            mains ++;
        }
    })

    if (mains < 6) delete primaryData.sum['CIT'];
    else {
        const replacement = selectReplacementsWISC('CIT', completed, uncompleted, primaryData.points);

        if (typeof replacement === 'number') primaryData.sum['CIT'] += replacement;
        else delete primaryData.sum['CIT'];
    }
}


</script>