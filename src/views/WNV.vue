<template>
    <div id="popup-modal" tabindex="-1" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
        <Modal
            v-bind="modalElements"
            @close-modal="modal.hide()" 
        />
    </div>
<section class="main-view">
    <TableTests
        :tests="testsCopy"
        :indexes="index"
        :inputs="inputTests"
        :points="scalarPoints"
        :wnv="true"
        @show-points="findScalarScoring"
    />
    <div v-if="showComposes" class="flex flex-col items-center gap-10 my-10">
        <TableIndexes 
            :indexes="index"
            :composes="composePoints" 
            @update-graphics="changeRange" 
            :show-w-n-v="true"
        />
        <div class="flex justify-center gap-20">
            <CompositeScores 
                :data-graphics="graphics" :range="range"
                title="Puntuación Escala Total"
            />
        </div>
    </div>
</section>
</template>

<script setup>
import a1 from '../../data/a1_wnv.json' with { type: 'json' };
import a2 from '../../data/a2_wnv.json' with { type: 'json' };
import { tests } from '@/composables/wnv/info';
import TableTests from '@/components/TableTests.vue';
import { onBeforeMount, onMounted, reactive, ref } from 'vue';
import { findScalars } from '@/composables/getRange';
import TableIndexes from '@/components/TableIndexes.vue';
import CompositeScores from '@/components/CompositeScores.vue';
import TestsScores from '@/components/TestsScores.vue';
import Modal from '@/components/Modal.vue';
import { useModal } from '@/composables/modal';
import { initFlowbite, Modal as ModalFlow } from 'flowbite';

const index = [
    {
        code: 'CIT',
        name: 'Coeficiente intelectual total',
        group: null
    }
]
const inputTests = ref({});
const scalarPoints = ref({});
const restrictions = {
    '5-0 7-11': ['MAT', 'CLA', 'ROM', 'REC'],
    '8-0 21-11': ['MAT', 'CLA', 'MES', 'HIS']
}
const composePoints = ref({})
const showComposes = ref(false);
const range = ref(false);
const graphics = reactive({
    upperLimits: [],
    values: [],
    lowerLimits: [],
    xlabel: [],
})
const graphicsTest = reactive({
    values: [],
    xlabel: [],
})
const age = {
    years: 7,
    months: 6
}
const chrAge = ref(0);
const testsCopy = ref([]);
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
    chrAge.value = age.years + age.months / 12;

    if (chrAge.value < 8) {
        testsCopy.value = tests.filter(test => restrictions['5-0 7-11'].includes(test.code));
    } else {
        testsCopy.value = tests.filter(test => restrictions['8-0 21-11'].includes(test.code));
    }
    
})

function changeRange(value) {
    graphics.lowerLimits = [];
    graphics.upperLimits = [];
    range.value = value;
    
    const compose = composePoints.value['CIT'];
    setLimits(compose);
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

function findScalarScoring() {
    showComposes.value = false;

    const { points, sum, errors } = findScalars(inputTests.value, a1[0], testsCopy.value, index);
    scalarPoints.value = points;

    if (errors.outOfRange !== '') {
        const testError = testsCopy.value.find(test => test.code === errors.outOfRange).name;
        showModal(`La prueba ${testError} se encuentra fuera de rango`, false);
        modal.value.show();
    } else if (Object.keys(points).length < 4) {
        showModal('Hay una prueba vacía', false);
        modal.value.show();
    } else {
        composePoints.value[index[0].code] = a2[0].data[sum.CIT.toString()];
        composePoints.value['Sum'] = sum[index[0].code];
    
        graphics.values.push(composePoints.value['CIT']['CIT']);
        graphics.xlabel.push(index[0].code);
        setLimits(composePoints.value['CIT']);
    
        testsCopy.value.forEach((test) => {
            graphicsTest.values.push(scalarPoints.value[test.code]);
            graphicsTest.xlabel.push(test.code);
        })
        showComposes.value = true;
    }

}

</script>