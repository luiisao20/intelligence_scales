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
                :restrictions="restrictions"
                @show-points="findScalarScoring"
            />
        </div>
        <div class="grid grid-cols-2 gap-10 mx-10 my-10">
            <IndexesSum 
                class="place-self-center"
                :indexes="primaryIndexes" 
                :indexes-sum="primaryData.sum"
                :restrictions="restrictions.indexes"
                title="Análisis primario"/> 
            <IndexesSum 
                class="place-self-center"
                :indexes="secondaryIndexes" 
                :indexes-sum="secondaryData.sum"
                :restrictions="restrictions.indexes"
                title="Análisis secundario"/>   
        </div>
        <div v-if="showComposes" class="grid grid-cols-2 gap-10 mx-10 my-10">
            <TableIndexes 
                :indexes="primaryIndexes" 
                :composes="primaryData.composes" 
                :restrictions="restrictions.indexes"
                @update-graphics="changeRange" />
            <TableIndexes 
                :indexes="secondaryIndexes" 
                :composes="secondaryData.composes" 
                :restrictions="restrictions.indexes"
                :state="true"
                @update-graphics="changeRange" />
                
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
import { tests, primaryIndexes, secondaryIndexes } from '@/composables/wppsi/info';
import { selectReplacementsWPPSI } from '@/composables/replacements';
import TableInputs from '@/components/TableInputs.vue';
import { onBeforeMount, onMounted, reactive, ref } from 'vue';
import { findScalars } from '@/composables/getRange';
import IndexesSum from '@/components/IndexesSum.vue';
import TableIndexes from '@/components/TableIndexes.vue';
import CompositeScores from '@/components/CompositeScores.vue';
import { useModal } from '@/composables/modal';
import { initFlowbite, Modal as ModalFlow } from 'flowbite';
import Modal from '@/components/Modal.vue';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/main';
import { formatDate } from '@/composables/formatDate';

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
const restrictions = reactive ({
    tests: [],
    indexes: [],
    age: ''
})
const inputTests = ref({});
const chrAge = ref(0);
const showComposes = ref(false);
const showSend = ref(false);
const loading = ref(false);
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
    chrAge.value = parseFloat(props.years) + parseFloat(props.months) / 12;
    testsCopy.value = [ ...tests ];
    if(!props.scales) {
        console.log('here');
        
    }
    if (chrAge.value >= 4) {
        const dIndex = testsCopy.value.findIndex(test => test.code === 'D');
        testsCopy.value[dIndex].primary = [];
        testsCopy.value[dIndex].secondary = ['Adquisición de vocabulario'];

        const nIndex = testsCopy.value.findIndex(test => test.code === 'N');
        testsCopy.value[nIndex].secondary = ['Adquisición de vocabulario'];
        restrictions.age = 'last';
    } else {
        restrictions.tests = [
            'M', 'BA', 'S',
            'CON', 'CA', 'V',
            'CF', 'CO'
        ];
        restrictions.indexes = ['IRF', 'IVP', 'ICC'];
        restrictions.age = 'early';
    }
    
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

// Busca errores de los indices primarios en edades menores a 4 años
function findPrimaryErrors() {
    const testsToEval = testsCopy.value.filter(test => !test.restriction);

    let uncompleted = [];
    let completed = [];

    // Elimina la sumatoria de escalares por cada test no llenado para todos los índices
    // excepto para el CIT, además recolecta los tests llenados y no llenados
    testsToEval.forEach((test) => {
        const element = primaryData.points[test.code];
        if (test.primary.length > 0) {
            const pIndex = primaryIndexes.find(index => index.group === test.primary[0]).code;
            if (!element) {
                uncompleted.push(test.code);
                delete primaryData.sum[pIndex];
            }
        }
        if (test.code === 'N' && !element) uncompleted.push(test.code)
        if (element) completed.push(test.code);
    })

    let mains = 0;
    primaryData.sum['CIT'] = 0;

    completed.forEach((test) => {
        if (primaryIndexes.at(-1).earlyMains.includes(test)) {
            primaryData.sum['CIT'] += primaryData.points[test];
            mains ++;
        }
    })

    if (mains < 4) delete primaryData.sum['CIT'];
    else {
        const replacement = selectReplacementsWPPSI('CIT1', completed, uncompleted, primaryData.points);

        if (typeof replacement === 'number') primaryData.sum['CIT'] += replacement;
        else delete primaryData.sum['CIT'];
    }
}

// Busca errores de los indices secundarios en edades menores a 4 years
function findSecondaryErrors() {
    const testsToEval = testsCopy.value.filter(test => !test.restriction);
    const indexesToEval = secondaryIndexes.filter(index => !index.restriction);

    let uncompleted = [];
    let completed = [];

    secondaryIndexes.forEach((index) => {
        secondaryData.sum[index.code] = 0;
    })

    // Elimina sumatoria de escalares por cada test no llenado para todos los
    // índices excepto para el ICG, además recolecta los tests completados y los que no
    testsToEval.forEach((test) => {
        const element = primaryData.points[test.code];

        if (!element) uncompleted.push(test.code);
        else completed.push(test.code);
    })

    const indexesMains = {
        'IAV': 2,
        'INV': 4,
        'ICG': 3
    }

    for (let i = 0; i < indexesToEval.length; i++) {
        const index = indexesToEval[i];
        let mains = 0;

        index.earlyMains.forEach((test) => {
            if (completed.includes(test)) {
                mains ++;
                secondaryData.sum[index.code] += secondaryData.points[test];
            }
        })

        if (mains < indexesMains[index.code]) delete secondaryData.sum[index.code];
        else if (index.code === 'ICG'){
            const replacement = selectReplacementsWPPSI('ICG1', completed, uncompleted, secondaryData.points);

            if (typeof replacement === 'number') secondaryData.sum[index.code] += replacement;
            else delete secondaryData.sum[index.code];
        }
    }
}

function findPrimErrors() {
    let uncompleted = [];
    let completed = [];

    const testsToEval = testsCopy.value.filter(test => test.code !== 'N' && test.code !== 'D');

    testsToEval.forEach((test) => {
        const element = primaryData.points[test.code];

        if (!element) uncompleted.push(test.code);
        else {
            completed.push(test.code);
        }

        if (test.primary.length > 0){
            const pIndex = primaryIndexes.find(index => index.group === test.primary[0]).code;
            if (!element) delete primaryData.sum[pIndex];
        }
    })

    let mains = 0;
    primaryData.sum['CIT'] = 0;

    completed.forEach((test) => {
        if (primaryIndexes.at(-1).lastMains.includes(test)) {
            primaryData.sum['CIT'] += primaryData.points[test];
            mains ++;
        }
    })

    if (mains < 5) delete primaryData.sum['CIT'];
    else {
        const replacement = selectReplacementsWPPSI('CIT', completed, uncompleted, primaryData.points);

        if (typeof replacement === 'number') primaryData.sum['CIT'] += replacement;
        else delete primaryData.sum['CIT'];
    }

}

function findSecErrors() {
    let uncompleted = {};
    let completed = {};

    const indexesToEval = secondaryIndexes.filter(index => index.code !== 'IAV');

    secondaryIndexes.forEach((index) => {
        uncompleted[index.code] = [];
        completed[index.code] = [];
        secondaryData.sum[index.code] = 0;
    })

    if (inputTests.value['D'] && inputTests.value['N']) secondaryData.sum['IAV'] = secondaryData.points['D'] + secondaryData.points['N'];

    testsCopy.value.forEach((test) => {
        const element = primaryData.points[test.code];

        if (!['D', 'N'].includes(test.code)) {
            test.secondary.forEach((group) => {
                const sIndex = secondaryIndexes.find(index => index.group === group).code;
                if (!element) uncompleted[sIndex].push(test.code);
                else completed[sIndex].push(test.code)
            })
        }
    })

    const indexesMains = {
        'INV': 4,
        'ICG': 3,
        'ICC': 3
    }

    for (let i = 0; i < indexesToEval.length; i++) {
        const index = indexesToEval[i];
        let mains = 0;
        index.lastMains.forEach((test) => {
            if (completed[index.code].includes(test)) {
                mains ++;
                secondaryData.sum[index.code] += secondaryData.points[test];
            }
        })

        if (mains < indexesMains[index.code]) delete secondaryData.sum[index.code];
        else {
            const replacement = selectReplacementsWPPSI(index.code, completed[index.code], uncompleted[index.code], secondaryData.points);

            if (typeof replacement === 'number') secondaryData.sum[index.code] += replacement;
            else delete secondaryData.sum[index.code];
        }
    }

}

function findScalarScoring() {
    showComposes.value = false;
    const primary = findScalars(inputTests.value, props.scales, testsCopy.value, primaryIndexes, 'primary');
    const secondary = findScalars(inputTests.value, props.scales, testsCopy.value, secondaryIndexes, 'secondary');

    primaryData.points = primary.points;
    primaryData.sum = primary.sum;
    secondaryData.points = secondary.points;
    // secondaryData.sum = secondary.sum;

    if (primary.errors.outOfRange !== '') {
        const testError = testsCopy.value.find(test => test.code === primary.errors.outOfRange).name;
        modal.value.show();
        showModal(`La prueba ${testError} se encuentra fuera de rango`, false);
    } else if (secondary.errors.outOfRange !== '') {
        const testError = testsCopy.value.find(test => test.code === secondary.errors.outOfRange).name;
        modal.value.show();
        showModal(`La prueba ${testError} se encuentra fuera de rango`, false);
    }

    if (chrAge.value >= 4) {
        findPrimErrors();
        findSecErrors();
    } else {
        findPrimaryErrors();
        findSecondaryErrors();
    }

    primaryData.composes = findComposes(props.pIndexes, true);
    secondaryData.composes = findComposes(props.sIndexes);

    primaryData.graphics = setGraphics(primaryData.composes, primaryData.range, primaryIndexes);
    secondaryData.graphics = setGraphics(secondaryData.composes, secondaryData.range, secondaryIndexes);

    showSend.value = true;

    showComposes.value = true;
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

function findComposes(array, primary) {
    chrAge.value = parseFloat(props.years) + parseFloat(props.months) / 12;
    let composes = {};

    array.forEach(element => {
        const index = element.index.split(' ')[0];
        const lowerAge = parseFloat(element.index.split(' ')[1].split('-')[0]) + parseFloat(element.index.split(' ')[1].split('-')[1]) / 12;
        const upperAge = parseFloat(element.index.split(' ')[2].split('-')[0]) + parseFloat(element.index.split(' ')[2].split('-')[1]) / 12;
        let sum = 0;

        if (primary) sum = primaryData.sum[index];
        else sum = secondaryData.sum[index];

        if (lowerAge < chrAge.value && chrAge.value <= upperAge && element.data[sum]) {
            const newData = { ...element.data[sum] };
            newData[index] = newData[element.index];
            delete newData[element.index]
            composes[index] = newData;
        }
    });

    return composes
}

</script>