<template>
    <table class=" relative text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mx-auto">
        <thead class="text-xs sticky top-0 text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" rowspan="2" class="px-6 py-3 text-center">
                    Prueba
                </th>
                <th scope="col" rowspan="2" class="px-6 py-3 text-center">
                    PD
                </th>
                <th scope="col" :colspan="indexes.length" class="px-6 py-1">
                    <div class="flex items-center justify-center gap-10">
                        Puntuación escalar
                        <button @click="$emit('showPoints')" class="bg-black text-white px-2 py-2 rounded-xl hover:bg-white hover:text-black">
                            Go
                        </button>
                    </div>
                </th>
            </tr>
            <tr>
                <th v-for="indexer in indexes" scope="col" class="px-6 py-1 text-center">
                    <p v-if="!indexer.restriction">{{ indexer.code }}</p>
                </th>
            </tr>
        </thead>
        <tbody v-if="!ageRestriction">
            <tr v-for="(test, index) in tests" :key="index" class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
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
                <td v-if="multipleGroups" v-for="item in indexes" class="text-white">
                    <div v-if="item.code !== 'CIT'" class="bg-slate-500 rounded-lg p-3 text-center w-12 h-12 mx-auto">
                        <p v-if="test.group === item.group">{{ points[test.code] }}</p>
                    </div>
                    <div v-else class="bg-slate-300 text-black rounded-lg p-3 text-center w-12 h-12 mx-auto">
                        {{ points[test.code] }}
                    </div>
                </td>
                <td v-else class="text-white flex justify-center">
                    <div class="bg-slate-300 text-black rounded-lg p-3 text-center w-12 h-12">
                        {{ points[test.code] }}
                    </div>
                </td>
            </tr>
        </tbody>
        <tbody v-else v-for="test in tests">
            <tr v-if="restrictions.includes(test.code) || !test.restriction" class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
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
                <td v-if="multipleGroups" v-for="item in indexes" class="text-white">
                    <div v-if="item.code !== 'CIT' && !item.restriction" class="bg-slate-500 rounded-lg p-3 text-center w-12 h-12 mx-auto">
                        <p v-if="test.group === item.group">{{ points[test.code] }}</p>
                    </div>
                    <div v-else class="bg-slate-300 text-black rounded-lg p-3 text-center w-12 h-12 mx-auto">
                        {{ points[test.code] }}
                    </div>
                </td>
                <td v-else class="px-1 text-white flex justify-center">
                    <div class="bg-slate-300 text-black rounded-lg p-3 text-center w-12 h-12">
                        {{ points[test.code] }}
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
    indexes: {
        required: true, type: Array
    },
    points: {
        required: true, type: Object
    },
    inputs: {
        required: true, type: Object
    },
    multipleGroups: {
        default: true, type: Boolean
    },
    ageRestriction: {
        default: false, type: Boolean
    },
    restrictions: {
        default: [], type: Array
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