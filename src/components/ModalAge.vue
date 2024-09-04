<template>
<!-- Main modal -->
    <div class="relative p-4 w-full max-w-md max-h-full">
        <!-- Modal content -->
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <!-- Modal header -->
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    Create New Product
                </h3>
                <button @click="emits('closeModal')" type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span class="sr-only">Close modal</span>
                </button>
            </div>
            <!-- Modal body -->
            <div class="p-4 md:p-5">
                <div class="grid gap-4 mb-4 grid-cols-2">
                    <div class="col-span-2 sm:col-span-1">
                        <label for="floating-birthday" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Fecha de nacimiento</label>
                        <DatePretty id="birthday" v-model:date="dates.birthday" />
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label for="floating-date-selected" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Fecha de prueba
                            <button type="button" @click="setToday" class="text-primary hover:underline hover:underline-offset-1">Hoy</button>
                        </label>
                        <DatePretty id="date-selected" v-model:date="dates.testDay"/>
                    </div>
                </div>
                <div v-if="showClose" class="flex flex-col my-4">
                    <h1><span class="font-semibold">{{ result.years }}</span> año(s), <span class="font-semibold">{{ result.months }}</span> mes(es).</h1>
                    <h1 class="text-secondary">Ya puedes cerrar esta ventana</h1>
                </div>
                <button @click="getResult" type="button" class="text-white flex items-center gap-2 bg-secondary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    <font-awesome-icon :icon="['fas', 'calculator']" class="text-lg" />
                    Calcular edad
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import DatePretty from './DatePretty.vue';

const dates = reactive({
    birthday: '',
    testDay: ''
})
const showClose = ref(false);
const emits = defineEmits(['closeModal', 'update:result']);
const props = defineProps({
    result: {
        required: true, type: Object
    }
})

function setToday() {
    const currentDate = new Date();

    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = currentDate.getFullYear();

    dates.testDay = `${month}/${day}/${year}`;
}

function getResult() {
    const start = new Date(dates.birthday);
    const end = new Date(dates.testDay);

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();

    // Adjust years and months if necessary
    if (months < 0) {
        years--;
        months += 12;
    }

    props.result.years = years;
    props.result.months = months;
    emits('update:result');
    showClose.value = true;
}
</script>