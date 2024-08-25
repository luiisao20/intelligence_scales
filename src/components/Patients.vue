<template>
<div v-for="(items, step) in packs" class="relative overflow-x-auto shadow-md sm:rounded-lg w-3/4 mx-auto">
    <table v-if="currentStep === step" class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" class="px-6 py-3 cursor-pointer" @click="$emit('sortData', 'lastName')">
                    Nombre
                    <font-awesome-icon :icon="['fas', 'sort']" />
                </th>
                <th scope="col" class="px-6 py-3 cursor-pointer" @click="$emit('sortData', 'age')">
                    Edad
                    <font-awesome-icon :icon="['fas', 'sort']" />
                </th>
                <th scope="col" class="px-6 py-3">
                    Género
                </th>
                <th scope="col" class="px-6 py-3">
                    Cédula
                </th>
                <th scope="col" class="px-6 py-3">
                    Acción
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(patient, index) in items" :key="index" class="odd:bg-secondary text-text odd:dark:bg-gray-900 even:bg-secondary/70 even:dark:bg-gray-800 border-b dark:border-gray-700">
                <th scope="row" class="px-6 py-4 font-medium whitespace-nowrap dark:text-white">
                    {{ patient.data().lastName }} {{ patient.data().firstName }}
                </th>
                <td class="px-6 py-4">
                    {{ patient.data().age }}
                </td>
                <td class="px-6 py-4">
                    {{ patient.data().gender }}
                </td>
                <td class="px-6 py-4">
                    {{ patient.data().id }}
                </td>
                <td class="px-6 py-4">
                    <a href="#" class="font-medium text-primary dark:text-blue-500 hover:underline">Edit</a>
                </td>
            </tr>
        </tbody>
    </table>
</div>
</template>

<script setup>

const props = defineProps({
    packs: {
        required: true, type: Array
    },
    currentStep: {
        required: true, type: Number
    },
})
const emits = defineEmits(['sortData']);

</script>