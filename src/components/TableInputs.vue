<template>
    <table class="relative text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mx-auto">
        <thead class="text-base sticky top-0 z-10 bg-light-background backdrop-blur-md backdrop:text-black text-text uppercase dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" :colspan="primaryIndexes.length + secondaryIndexes.length + 2" class="px-6 py-1">
                    <div class="flex items-center justify-center gap-10">
                        Puntuación escalar
                        <button @click="$emit('showPoints')" class="bg-primary text-black font-normal px-2 py-2 rounded-xl hover:bg-white hover:text-black">
                            Buscar puntuaciones
                        </button>
                    </div>
                </th>
            </tr>
            <tr>
                <th scope="col" rowspan="3" class="px-6 py-3 text-center">
                    Puntuación directa
                </th>
            </tr>
            <tr>
                <th :colspan="primaryIndexes.length" class="text-center bg-secondary/40 border">Análisis primario</th>
                <th :colspan="secondaryIndexes.length" class="text-center bg-secondary/60 border">Análisis secundario</th>
            </tr>
            <tr>
                <th v-for="indexer in primaryIndexes" scope="col" class="text-center bg-secondary/40 border">
                    <p v-if="!restrictions.indexes.includes(indexer.code)" class="px-6 py-1">
                        {{ indexer.code }}
                    </p>
                </th>
                <th v-for="indexer in secondaryIndexes" scope="col" class="text-center bg-secondary/60 border">
                    <p v-if="!restrictions.indexes.includes(indexer.code)" class="px-6 py-1">
                        {{ indexer.code }}
                    </p>
                </th>
            </tr>
        </thead>
        <tbody v-for="test in tests" class="even:bg-gray-50 odd:bg-white text-background">
            <tr v-if="!restrictions.tests.includes(test.code)" class="border-b">
                <td class="py-1 px-6">
                    <div class="relative z-0">
                        <input v-model="inputs[test.code]" @input="checkValues($event.target.value, test.code)"
                            type="text" :id="`test-${test.code}`" 
                            class="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border-1 border-black appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-secondary peer" placeholder=" " />
                        <label :for="`test-${test.code}`" class="absolute text-sm dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-secondary peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">
                            {{ test.name }}
                        </label>
                        <p v-if="errors.includes(test.code)" :id="`outlined_error_help_${test.code}`" class="mt-2 text-xs text-red-600 dark:text-red-400"><span class="font-medium">¡Oh!</span> Existe un error.</p>
                    </div>
                </td>
                <td v-for="item in primaryIndexes" class="bg-[#09484C] border-2 text-text text-base">
                    <div v-if="!restrictions.indexes.includes(item.code) && item.code !== 'CIT'" class="text-center">
                        <p v-if="test.primary.includes(item.group)">
                            {{ primaryPoints[test.code] }}
                        </p>
                    </div>
                    <td v-else-if="item.code === 'CIT'"
                        class="flex justify-center bg-[#09484C]"
                        :class="{ 'underline decoration-wavy': item[`${restrictions.age}Optionals`].includes(test.code) }"
                    >
                        <div v-if="restrictions.age !== ''" class="">
                            <p v-if="!['D', 'N'].includes(test.code) || restrictions.age === 'early'">{{ primaryPoints[test.code] }}</p>
                        </div>
                        <div v-else class="">
                            <p>{{ primaryPoints[test.code] }}</p>
                        </div>
                    </td>
                </td>
                <td v-for="item in secondaryIndexes" class="bg-[#0B5E66] text-white border-2 text-base">
                    <div v-if="!restrictions.indexes.includes(item.code)" 
                        class="bg-slate-500 rounded-lg p-3 text-center w-12 h-12 mx-auto"
                        :class="{ 'underline decoration-wavy': item[`${restrictions.age}Optionals`].includes(test.code) }"
                    >
                        <p v-if="test.secondary.includes(item.group)" >{{ secondaryPoints[test.code] }}</p>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    tests: {
        required: true, type: Array
    },
    primaryIndexes: {
        required: true, type: Array
    },
    secondaryIndexes: {
        required: true, type: Array
    },
    primaryPoints: {
        required: true, type: Object
    },
    secondaryPoints: {
        required: true, type: Object
    },
    inputs: {
        required: true, type: Object
    },
    restrictions: {
        default: {
            tests: [],
            indexes: [],
            age: ''
        }, type: Object
    }
})
const emits = defineEmits(['showPoints']);
// Pasar el errors al componente madre
const errors = ref([]);
const regex = /^(\d{1,3})?$/;

function checkValues(number, test) {
    if (!regex.test(number)) errors.value.push(test);
    else if (errors.value.includes(test)) errors.value = errors.value.filter(item => item !== test);
}

</script>