<template>
<div id="crud-modal" tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <ModalAge @close-modal="modal.hide()" :result="result" />
</div>
<div id="extralarge-modal" tabindex="-1" class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <ModalEvaluation v-if="showEvaluation" @close-modal="modalEval.hide()" v-bind="selectedEvaluation" :list="listEvaluations" />
</div>
<section class="main-view">
    <div v-if="loading.data">
        <div role="status" class="animate-pulse w-4/5 mx-auto">
            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[640px] mb-2.5 mx-auto"></div>
            <div class="h-2.5 mx-auto bg-gray-300 rounded-full dark:bg-gray-700 max-w-[540px]"></div>
            <div class="flex items-center justify-center mt-4">
                <svg class="w-8 h-8 text-gray-200 dark:text-gray-700 me-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                </svg>
                <div class="w-20 h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 me-3"></div>
                <div class="w-24 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            </div>
            <span class="sr-only">Loading...</span>
        </div>
    </div>
    <div v-else class="bg-secondary rounded-xl p-4 mx-10">
        <div class="text-white w-4/5 mx-auto mb-4 flex flex-col gap-2">
            <div class="bg-nav w-[50px] rounded-full h-[50px] flex justify-center items-center mx-auto">
                <font-awesome-icon v-if="data.gender === 'Femenino'" icon="fa-solid fa-venus" class="text-[2rem]" />
                <font-awesome-icon v-else icon="fa-solid fa-mars" class="text-[2rem]" />
            </div>
            <h1 class="text-xl text-center font-semibold">{{ data.lastName }} {{ data.firstName }}</h1>
            <h1 class="text-base text-center">Número de Cédula: {{ data.id }}</h1>
            <p class="flex items-center justify-center gap-2 text-white">
                <font-awesome-icon icon="fa-solid fa-cake-candles" class="text-xl" />
                <span>{{ data.age }}</span>
            </p>
        </div>
        <div class="flex justify-between gap-10 items-center">
            <EvaluationsTable
                :list="listEvaluations"
                :evaluations="evaluations"
                @view-evaluation="viewEvaluation"
            />
            <div class="w-1/2 p-5 bg-white rounded-xl">
                <h1 class="font-semibold text-center text-gray-700 mb-5 text-lg">Crear nueva evaluación</h1>
                <form @submit.prevent="goEvaluation" action="#">
                    <div class="flex justify-between gap-2">
                        <div class="w-1/2">
                            <label for="register_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre de la evaluación</label>
                            <input v-model="evaluation.name" type="text" name="register_name" id="register_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-secondary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Ej.: Registro 1" required>
                        </div>
                        <div class="w-1/2">
                            <label for="category" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tipo</label>
                            <select id="category" v-model="evaluation.type" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-secondary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                                <option selected disabled>Seleccionar</option>
                                <option v-for="item in listEvaluations" :value="item.key">{{ item.name }}</option>
                            </select>
                        </div> 
                    </div>
                    <h1 class="mt-2">Edad</h1>
                    <div class="flex justify-between gap-2 my-2">
                        <div class="w-1/2">
                            <label for="years" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Años</label>
                            <input type="text" v-model="result.years" name="years" id="years" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-secondary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="16" required>
                        </div>
                        <div class="w-1/2">
                            <label for="months" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Meses</label>
                            <input v-model="result.months" type="text" name="months" id="months" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-secondary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="12" required>
                        </div>
                    </div>
                    <Transition>
                        <p v-if="showError !== ''" class="mt-2 text-xl text-red-600 dark:text-red-400"><span class="font-medium">¡Oh!</span> {{ showError }}</p>
                    </Transition>
                    <div class="flex justify-between">
                        <button @click="modal.show()" type="button" id="get_age" class="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center bg-primary rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                            Calcular edad
                        </button>
                        <button id="show_tables" type="submit" :disabled="loading.tables" :class="{ 'cursor-progress': loading.tables }" class="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-secondary rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                            Crear evaluación
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <RouterView v-if="goRoute" v-bind="result" @update-data="updateView" />
</section>

</template>

<script setup>
import { onBeforeMount, ref, reactive, onMounted, Transition } from 'vue';
import { getDoc, doc, getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import ModalAge from '@/components/ModalAge.vue';
import { initFlowbite, Modal } from 'flowbite';
import { getScales } from '@/composables/getTables';
import { router } from '../routes';
import EvaluationsTable from '@/components/EvaluationsTable.vue'
import ModalEvaluation from '@/components/ModalEvaluation.vue'
import { orderByDate } from '@/composables/formatDate';

const props = defineProps(['id']);
const db = getFirestore();
const data = ref({});
const loading = reactive({
    data: false,
    delete: false,
    tables: false,
    saving: false,
});
const evaluations = ref([]);
const evaluation = reactive({
    name: '',
    type: 'Seleccionar',
    date: '',
    info: {}
})
const modal = ref(null);
const modalEval = ref(null);
const result = reactive({
    years: '',
    months: '',
    scales: {},
    pIndexes: [],
    sIndexes: [],
    patientId: '',
    evaluationName: '',
    type: ''
})
const regex = /^\d{1,3}$/;
const showError = ref('');
const goRoute = ref(false);
const listEvaluations = [
    {
        key: 'wais_c',
        name: 'WAIS (Chilena)'
    },
    {
        key: 'wais_e',
        name: 'WAIS (Española)'
    },
    {
        key: 'wais_m',
        name: 'WAIS (Mexicana)'
    },
    {
        key: 'wisc',
        name: 'WISC'
    },
    {
        key: 'wnv',
        name: 'WNV'
    },
    {
        key: 'wppsi',
        name: 'WPPSI'
    },
]
const selectedEvaluation = reactive({
    data: {},
    date: '',
    id: '',
    patient: '',
    type: '',
    years: '',
    months: ''
})
const showEvaluation = ref(false);

onBeforeMount(async() => {
    loading.data = true;
    const docSnap = await getDoc(doc(db, 'patients', props.id));
    await getEvaluations();
    data.value = docSnap.data();
    result.patientId = props.id;
    loading.data = false;
})

onMounted(() => {
    const target = document.getElementById('crud-modal');
    const instanceOptions = {
        id: 'crud-modal',
        override: true
    };
    modal.value = new Modal(target, instanceOptions);
    const targetEval = document.getElementById('extralarge-modal');
    const instanceOptionsEval = {
        id: 'extralarge-modal',
        override: true
    };
    modalEval.value = new Modal(targetEval, instanceOptionsEval);
    initFlowbite();
})

function viewEvaluation(evaluationData) {
    selectedEvaluation.data = evaluationData.data().data;
    selectedEvaluation.date = evaluationData.data().date;
    selectedEvaluation.id = evaluationData.data().name;
    selectedEvaluation.months = evaluationData.data().months;
    selectedEvaluation.years = evaluationData.data().years;
    selectedEvaluation.type = evaluationData.data().type;
    selectedEvaluation.patient = evaluationData.data().patient;

    modalEval.value.show();
    showEvaluation.value = true;
}

async function updateView() {
    loading.data = true;
    await getEvaluations();
    loading.data = false;
}

async function getEvaluations () {
    const q = query(collection(db, 'evaluations'), where('patient', '==', props.id));
    const querySnapshot = await getDocs(q);

    evaluations.value = orderByDate([ ...querySnapshot.docs ]);
}

async function goEvaluation() {
    
    goRoute.value = false;

    if (evaluations.value.findIndex(item => item.data().name === evaluation.name) !== -1){
        showError.value = 'Ya existe una evaluación con ese nombre, escoge otro';
        return
    }

    if (!regex.test(result.years) || !regex.test(result.months) || parseInt(result.months) > 12) {
        showError.value = 'Existe un error en el formulario';
        return
    }

    if (evaluation.name.toString().trim() === '' || evaluation.type === 'Seleccionar' ||
        result.years === '' || result.months === '') {
        showError.value = 'Existe un error en el formulario';
        return
    }

    loading.tables = true;
    try {
        const response = await getScales(result, evaluation.type);
        result.scales = response.table;
        result.pIndexes = response.indexes.primary;

        if(['wisc', 'wppsi'].includes(evaluation.type)) {
            result.sIndexes = response.indexes.secondary;
        }

        result.evaluationName = evaluation.name;
        result.type = evaluation.type;
        router.push(`/${props.id}/${evaluation.type.split('_')[0]}`);
        showError.value = '';
        goRoute.value = true;
    } catch (error) {
        console.log(error);
        showError.value = error;
    }
    loading.tables = false;
}

</script>

<style scoped>
.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>