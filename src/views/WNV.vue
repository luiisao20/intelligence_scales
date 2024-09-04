<template>
    <div id="popup-modal" tabindex="-1" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
        <Modal
            v-bind="modalElements"
            @close-modal="modal.hide()" 
        />
    </div>
<section class="my-10">
    <TableTests
        :tests="testsCopy"
        :indexes="index"
        :inputs="inputTests"
        :points="scalarPoints"
        :wnv="true"
        @show-points="findScalarScoring"
    />
    <div v-if="show.composes" class="flex flex-col items-center gap-10 my-10">
        <TableIndexes 
            :indexes="index"
            :composes="composePoints" 
            @update-graphics="changeRange" 
            :show-w-n-v="true"
        />
        <div class="flex justify-center gap-20">
            <CompositeScores 
                :data-graphics="graphics" :range="show.range"
                title="Puntuación Escala Total"
            />
        </div>
    </div>
    <div v-if="show.send" class="text-end">
        <button type="button" id="save_data" @click="saveEvaluation" :class="{ 'cursor-progress': loading }" class="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-secondary rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
            Guardar datos
        </button>
    </div>
</section>
</template>

<script setup>
import { tests } from '@/composables/wnv/info';
import TableTests from '@/components/TableTests.vue';
import { onBeforeMount, onMounted, reactive, ref } from 'vue';
import { findScalars } from '@/composables/getRange';
import TableIndexes from '@/components/TableIndexes.vue';
import CompositeScores from '@/components/CompositeScores.vue';
import Modal from '@/components/Modal.vue';
import { useModal } from '@/composables/modal';
import { initFlowbite, Modal as ModalFlow } from 'flowbite';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/main';
import { formatDate } from '@/composables/formatDate';

const index = [
    {
        code: 'CIT',
        name: 'Escala total',
        group: null
    }
]
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
const inputTests = ref({});
const scalarPoints = ref({});
const restrictions = {
    '5-0 7-11': ['MAT', 'CLA', 'ROM', 'REC'],
    '8-0 21-11': ['MAT', 'CLA', 'MES', 'HIS']
}
const composePoints = ref({});
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
    xlabel: [],
})
const chrAge = ref(0);
const testsCopy = ref([]);
const modal = ref(null);
const { modalElements, showModal } = useModal();
const emit = defineEmits(['updateData']);

async function saveEvaluation() {
    loading.value = true;
    try {
        const docRef = await addDoc(collection(db, 'evaluations'), {
            name: props.evaluationName,
            patient: props.patientId,
            type: 'wnv',
            data: composePoints.value,
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
    chrAge.value = parseFloat(props.years) + parseFloat(props.months) / 12;

    if (chrAge.value < 8) {
        testsCopy.value = tests.filter(test => restrictions['5-0 7-11'].includes(test.code));
    } else {
        testsCopy.value = tests.filter(test => restrictions['8-0 21-11'].includes(test.code));
    }
    
})

function changeRange(value) {
    graphics.lowerLimits = [];
    graphics.upperLimits = [];
    show.range = value;
    
    const compose = composePoints.value['CIT'];
    setLimits(compose);
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

function findScalarScoring() {
    show.composes = false;

    graphics.lowerLimits = [];
    graphics.upperLimits = [];
    graphics.values = [];

    const { points, sum, errors } = findScalars(inputTests.value, props.scales, testsCopy.value, index);
    scalarPoints.value = points;

    if (errors.outOfRange !== '') {
        const testError = testsCopy.value.find(test => test.code === errors.outOfRange).name;
        showModal(`La prueba ${testError} se encuentra fuera de rango`, false);
        modal.value.show();
    } else if (Object.keys(points).length < 4) {
        showModal('Hay una prueba vacía', false);
        modal.value.show();
    } else {
        composePoints.value[index[0].code] = props.pIndexes[0].data[sum.CIT.toString()];
        composePoints.value['Sum'] = sum[index[0].code];
    
        graphics.values.push(composePoints.value['CIT']['CIT']);
        graphics.xlabel.push(index[0].code);
        setLimits(composePoints.value['CIT']);

        show.composes = true;
        show.send = true;
    }

}

</script>