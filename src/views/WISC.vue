<template>
    <div id="popup-modal" tabindex="-1" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
        <Modal
            v-bind="modalElements"
            @close-modal="modal.hide()" 
        />
    </div>
    <section class="my-10">
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
        <div v-if="showSend" class="text-end">
            <button type="button" id="save_data" @click="saveEvaluation" :class="{ 'cursor-progress': loading }" class="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-secondary rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                Guardar datos
            </button>
        </div>
    </section>
</template>

<script setup>
import { tests, primaryIndexes, secondaryIndexes } from '@/composables/wisc/info';
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
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/main';
import { formatDate } from '@/composables/formatDate';

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
const showSend = ref(false);
const loading = ref(false);
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
        required: true, type: Array
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
    testsCopy.value = [ ...tests ];
})

async function saveEvaluation() {
    loading.value = true;
    try {
        const docRef = await addDoc(collection(db, 'evaluations'), {
            name: props.evaluationName,
            patient: props.patientId,
            type: props.type,
            data: {
                primarySum: primaryData.sum,
                primaryComposes: primaryData.composes,
                secondarySum: secondaryData.sum,
                secondaryComposes: secondaryData.composes
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
    const primary = findScalars(inputTests.value, props.scales, testsCopy.value, primaryIndexes, 'primary');
    const secondary = findScalars(inputTests.value, props.scales, testsCopy.value, secondaryIndexes, 'secondary');

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

    primaryData.composes = findComposes(props.pIndexes, true);
    secondaryData.composes = findComposes(props.sIndexes);

    primaryData.graphics = setGraphics(primaryData.composes, primaryData.range, primaryIndexes);
    secondaryData.graphics = setGraphics(secondaryData.composes, secondaryData.range, secondaryIndexes);

    showSend.value = true;
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