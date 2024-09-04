<template>
    <div id="popup-modal" tabindex="-1" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
        <Modal
            v-bind="modalElements"
            @close-modal="modal.hide()" 
        />
    </div>
<section class="md:flex md:flex-row gap-10 justify-center my-10">
    <div class="w-full">
        <TableTests 
            :tests="testsCopy" 
            :indexes="indexes" 
            :points="scalarPoints" 
            :inputs="inputTests"
            @show-points="findScalarScoring"
        />
    </div>
    <div class="flex flex-col gap-10 w-full items-center">
        <IndexesSum :indexes="indexes" :indexes-sum="indexesSum"/>
        <div v-if="show.composes" class="flex flex-col items-center gap-5">
            <TableIndexes :indexes="indexes" :composes="composes" @update-graphics="changeRange" />
            <CompositeScores :data-graphics="graphics" :range="show.range"/>
        </div>
    </div>
</section>
<div v-if="show.send" class="text-end">
    <button type="button" id="save_data" @click="saveEvaluation" :class="{ 'cursor-progress': loading }" class="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-secondary rounded-lg">
        Guardar datos
    </button>
</div>
</template>

<script setup>
import CompositeScores from '../components/CompositeScores.vue';
import { onBeforeMount, onMounted, reactive } from 'vue';
import { tests, indexes } from '@/composables/wais/info';
import { ref } from 'vue';
import TableTests from '@/components/TableTests.vue';
import { findScalars } from '@/composables/getRange'
import TableIndexes from '@/components/TableIndexes.vue';
import Modal from '@/components/Modal.vue';
import IndexesSum from '@/components/IndexesSum.vue';
import { selectReplacementsWAIS } from '@/composables/replacements';
import { initFlowbite, Modal as ModalFlow } from 'flowbite';
import { useModal } from '@/composables/modal';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/main';
import { formatDate } from '@/composables/formatDate';

const inputTests = ref({});
const table = ref({});
const scalarPoints = ref({});
const indexesSum = ref({});
const composes = ref({});
const show = reactive({
    composes: false,
    send: false,
    range: false
})
const loading = ref(false);
const graphics = reactive({
    upperLimits: [],
    values: [],
    lowerLimits: [],
    xlabel: []
})
const chrAge = ref(0);
const testsCopy = ref([]);
const modal = ref(null);
const { modalElements, showModal } = useModal();
const props = defineProps({
    years: {
        required: true, type: String
    },
    months: {
        required: true, type: String
    },
    scales: {
        required: true, type: Object
    },
    pIndexes: {
        required: true, type: Array
    },
    sIndexes: {
        default: [], type: Array
    },
    patientId: {
        required: true, type: String
    },
    evaluationName: {
        required: true, type: String
    },
    type: {
        required: true, type: String
    }
})
const emit = defineEmits(['updateData']);

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
    chrAge.value =parseFloat(props.years) +parseFloat(props.months) / 12;
    if (chrAge.value < 70) {
        testsCopy.value = [ ...tests ];
    } else {
        testsCopy.value = tests.filter(test => !test.restriction)
    }
    table.value = props.scales;
})

async function saveEvaluation() {
    loading.value = true;
    try {
        const docRef = await addDoc(collection(db, 'evaluations'), {
            name: props.evaluationName,
            patient: props.patientId,
            type: props.type,
            data: {
                composes: composes.value,
                sum: indexesSum.value
            },
            date: formatDate(new Date()),
            years: props.years,
            months: props.months
        })
        console.log(docRef.id);
        showModal('¡El registro se llevó a cabo con éxito!', false);
        modal.value.show();
        emit('updateData');
    } catch (error) {
        console.log(error);
        showModal(`Existió un error en la base de datos: ${error.message}`, false, { variant: 'danger' });
        modal.value.show();
    }
    loading.value = false;
}

function findScalarScoring() {
    show.composes = false;
    const { points, sum, errors } = findScalars(inputTests.value, table.value, testsCopy.value, indexes);
    
    scalarPoints.value = points;

    if (errors.outOfRange !== ''){
        const testError = testsCopy.value.find(test => test.code === errors.outOfRange).name;
        showModal(`La prueba ${testError} se encuentra fuera de rango`, false);
        modal.value.show();
        return
    }

    try {
        getSum();
        findComposes();
        show.composes = true;
        show.send = true;
    } catch (error) {
        showModal(error, false);
        modal.value.show();
    }
}

function getSum() {
    let completed = [];
    let uncompleted = [];

    indexes.forEach(index => indexesSum.value[index.code] = 0);

    tests.forEach((test) => {
        if (scalarPoints.value[test.code]) {
            completed.push(test.code);
            const index = indexes.find(value => value.group === test.group);

            if (indexes.at(-1).mains.includes(test.code)) indexesSum.value['CIT'] += scalarPoints.value[test.code];

            if (index.mains.includes(test.code)) indexesSum.value[index.code] += scalarPoints.value[test.code];
        }
        else uncompleted.push(test.code);
    })

    const indexesMains = {
        'ICV': 2,
        'IRP': 2,
        'IMT': 1,
        'IVP': 1,
        'CIT': 8
    }

    for (let i = 0; i < indexes.length; i++) {
        const element = indexes[i];
        let mains = 0;

        completed.forEach((test) => {
            if (element.mains.includes(test)) mains ++;
        })

        if (mains < indexesMains[element.code]) {
            delete indexesSum.value[element.code];
            throw `En el índice ${element.code} hay un error`;
        }
        else {
            const replacement = selectReplacementsWAIS(element.code, completed, uncompleted, scalarPoints.value);

            if (typeof replacement === 'number') indexesSum.value[element.code] += replacement;
            else throw `En el índice ${element.code} hay un error`;
        }
    }
}


function changeRange(value) {
    graphics.lowerLimits = [];
    graphics.upperLimits = [];
    show.range = value;
    
    indexes.forEach((key) => {
        const compose = composes.value[key.code];
        setLimits(compose);
    })
}

function setLimits(compose) {
    if (!show.range) {
        graphics.upperLimits.push(compose['90%'].split('-')[1]);
        graphics.lowerLimits.push(compose['90%'].split('-')[0]);
    } else {
        graphics.upperLimits.push(compose['95%'].split('-')[1]);
        graphics.lowerLimits.push(compose['95%'].split('-')[0]);
    }
}

function findComposes() {
    graphics.lowerLimits = [];
    graphics.values = [];
    graphics.upperLimits = [];

    props.pIndexes.forEach(element => {
        const sum = indexesSum.value[element.index];

        if (sum) composes.value[element.index] = element.data[sum];
    })

    indexes.forEach((index) => {
        const compose = composes.value[index.code];

        if (compose) {
            graphics.values.push(compose[index.code]);
            graphics.xlabel.push(index.code);
            setLimits(compose);
        }
    })

    show.composes = true;
}

</script>