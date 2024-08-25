<template>
    <table class=" relative text-sm text-left rtl:text-right text-text dark:text-gray-400 mx-auto">
        <thead class="text-base z-10 bg-light-background sticky top-0 uppercase dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" :colspan="indexes.length + 1" class="px-6 py-1">
                    <div class="flex items-center justify-center gap-10">
                        Puntuación escalar
                        <button @click="$emit('showPoints')" class="bg-primary text-black font-normal px-2 py-2 rounded-xl hover:bg-white hover:text-black">
                            Buscar puntuaciones
                        </button>
                    </div>
                </th>
            </tr>
            <tr>
                <th scope="col" rowspan="2" class="px-6 py-3 text-center">
                    Prueba
                </th>
                <th v-for="indexer in indexes" scope="col" class="px-6 py-1 text-center bg-secondary border-l-2 border-r-2">
                    <p v-if="!indexer.restriction">{{ indexer.code }}</p>
                </th>
            </tr>
        </thead>
        <tbody v-if="!wnv">
            <tr v-for="(test, index) in tests" :key="index" class="odd:bg-white text-black odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
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
                <td v-for="item in indexes"
                    class="text-center text-base bg-secondary border-2 text-text"
                    :class="{ 'underline decoration-wavy': item.optionals.includes(test.code) }">
                    <div v-if="item.code !== 'CIT'">
                        <p v-if="test.group === item.group">{{ points[test.code] }}</p>
                    </div>
                    <div v-else>
                        {{ points[test.code] }}
                    </div>
                </td>
            </tr>
        </tbody>
        <tbody v-else>
            <tr v-for="test in tests" class="odd:bg-white text-black odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
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
                <td class="text-center text-base bg-secondary border-2 text-text">
                    {{ points[test.code] }}
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
    wnv: {
        default: false, type: Boolean
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