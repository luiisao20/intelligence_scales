<template>
    <div>
        <Pagination v-if="evaluations.length > 5" 
            v-bind="paginationData" 
            @go-step="goStep"
            @next="paginationData.currentStep++"
            @previous="paginationData.currentStep--"
            />
        <div v-for="(items, step) in paginationData.packs" class="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table v-if="step === paginationData.currentStep" class="text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" class="px-6 py-3">
                            Nombre del registro
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Tipo de evauluación
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Fecha de creación
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Acción
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in items" :key="index" class="odd:bg-primary/50 text-black odd:dark:bg-gray-900 even:bg-primary even:dark:bg-gray-800 border-b dark:border-gray-700">
                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {{ item.data().name }}
                        </th>
                        <td class="px-6 py-4">
                            {{ list.find(ind => ind.key === item.data().type).name }}
                        </td>
                        <td class="px-6 py-4">
                            {{ item.data().date }}
                        </td>
                        <td class="px-6 py-4">
                            <div class="flex justify-center items-center text-lg gap-4">
                                <button @click="emit('viewEvaluation', item);">
                                    <font-awesome-icon :icon="['fas', 'location-pin']" class="text-white" />
                                </button>
                                <button :disabled="loading" :class="{ 'cursor-progress': loading }" @click="deleteItem(item.id)">
                                    <font-awesome-icon :icon="['fas', 'trash']" class="text-red-500" />
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { onBeforeMount, reactive, ref } from 'vue';
import Pagination from './Pagination.vue';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/main';

const paginationData = reactive({
    packs: [],
    step: 5,
    listLength: 0,
    currentStep: 0
})
const props = defineProps({
    evaluations: {
        required: true,
        type: Array
    },
    list: {
        required: true,
        type: Array
    }
})
const loading = ref(false);
const dataArray = ref([]);
const emit = defineEmits(['viewEvaluation'])

onBeforeMount(() => {
    dataArray.value = [ ...props.evaluations ];
    orderData();
})

function orderData () {
    paginationData.packs = [];
    paginationData.listLength = dataArray.value.length;
    for (let i = 0; i < dataArray.value.length; i += paginationData.step) {
        const pack = dataArray.value.slice(i, i + paginationData.step);
        paginationData.packs.push(pack)
    }
    
}

function goStep(step) {
    paginationData.currentStep = step;
}

async function deleteItem(id) {
    loading.value = true;
    dataArray.value = dataArray.value.filter(item => item.id !== id);
    await deleteDoc(doc(db, 'evaluations', id));
    orderData();
    loading.value = false;
}
</script>