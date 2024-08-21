<template>
    <table class=" relative text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mx-auto">
        <thead class="text-xs sticky top-0 text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" :colspan="primaryIndexes.length + secondaryIndexes.length + 2" class="px-6 py-1">
                    <div class="flex items-center justify-center gap-10">
                        Puntuación escalar
                        <button @click="$emit('showPoints')" class="bg-black text-white px-2 py-2 rounded-xl hover:bg-white hover:text-black">
                            Go
                        </button>
                    </div>
                </th>
            </tr>
            <tr>
                <th scope="col" rowspan="3" class="px-6 py-3 text-center">
                    Prueba
                </th>
                <th scope="col" rowspan="3" class="px-6 py-3 text-center">
                    PD
                </th>
            </tr>
            <tr>
                <th :colspan="primaryIndexes.length" class="text-center">Análisis primario</th>
                <th :colspan="secondaryIndexes.length" class="text-center">Análisis secundario</th>
            </tr>
            <tr>
                <th v-for="indexer in primaryIndexes" scope="col" class="text-center">
                    <p v-if="!restrictions.indexes.includes(indexer.code)" class="px-6 py-1">
                        {{ indexer.code }}
                    </p>
                </th>
                <th v-for="indexer in secondaryIndexes" scope="col" class="text-center">
                    <p v-if="!restrictions.indexes.includes(indexer.code)" class="px-6 py-1">
                        {{ indexer.code }}
                    </p>
                </th>
            </tr>
        </thead>
        <tbody v-for="test in tests">
            <tr v-if="!restrictions.tests.includes(test.code)" class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                <th scope="row" class="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {{ test.name }}
                </th>
                <td class="py-2 w-[60px] mx-6"
                    :class="{ 'bg-red-700': errors.includes(test.code) }"
                >
                    <input @input="checkValues($event.target.value, test.code)"
                        v-model="inputs[test.code]" 
                        type="text" :id="`test-${test.code}`" 
                        class="w-full text-center border-0 border-b border-blue-300">
                </td>
                <td v-for="item in primaryIndexes" class="text-white">
                    <div v-if="!restrictions.indexes.includes(item.code) && item.code !== 'CIT'" class="bg-slate-500 rounded-lg p-3 text-center w-12 h-12 mx-auto">
                        <p v-if="test.primary.includes(item.group)">
                            {{ primaryPoints[test.code] }}
                        </p>
                    </div>
                    <td v-else-if="item.code === 'CIT'" 
                        class="text-white flex justify-center"
                        :class="{ 'underline decoration-black underline-offset-2': item[`${restrictions.age}Optionals`].includes(test.code) }"
                    >
                        <div v-if="restrictions.age !== ''" class="bg-slate-300 text-black rounded-lg p-3 text-center w-12 h-12">
                            <p v-if="!['D', 'N'].includes(test.code) || restrictions.age === 'early'">{{ primaryPoints[test.code] }}</p>
                        </div>
                        <div v-else class="bg-slate-300 text-black rounded-lg p-3 text-center w-12 h-12">
                            <p>{{ primaryPoints[test.code] }}</p>
                        </div>
                    </td>
                </td>
                <td v-for="item in secondaryIndexes" class="text-white">
                    <div v-if="!restrictions.indexes.includes(item.code)" 
                        class="bg-slate-500 rounded-lg p-3 text-center w-12 h-12 mx-auto"
                        :class="{ 'underline underline-offset-2': item[`${restrictions.age}Optionals`].includes(test.code) }"
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