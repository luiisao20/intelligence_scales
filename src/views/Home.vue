<template>
    <h1>Hola mundo</h1>
<section class="md:flex md:flex-row gap-10 justify-center">
    <div class="w-full">
        <table class=" relative text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mx-auto">
            <thead class="text-xs sticky top-0 text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" class="px-6 py-3 text-center">
                        Prueba
                    </th>
                    <th scope="col" class="px-6 py-3 text-center">
                        PD
                    </th>
                    <th scope="col" colspan="4" class="px-6 py-3 text-center">
                        Puntuación escalar
                    </th>
                    <th class="text-center">
                        <button @click="findScalarScoring()" class="bg-black text-white px-2 py-2 rounded-xl hover:bg-white hover:text-black">
                            Go
                        </button>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(test, index) in tests" :key="index" class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                    <th scope="row" class="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {{ test.name }}
                    </th>
                    <td class="py-2 w-[60px] mx-6"
                    :class="{ 'bg-red-700': errors.includes(test.code) }"
                    >
                        <input @input="checkValues($event.target.value, test.code)"
                            v-model="inputTests[test.code]" 
                            type="text" :id="`test-${test.code}`" 
                            class="w-full text-center border-0 border-b border-blue-300">
                    </td>
                    <td v-for="item in indexes" class="px-1 text-white">
                        <div v-if="item.code !== 'CIT'" class="bg-slate-500 rounded-lg p-3 text-center w-12 h-12">
                            <p v-if="test.group === item.group">{{ scalarPoints[test.code] }}</p>
                        </div>
                        <div v-else class="bg-slate-300 text-black rounded-lg p-3 text-center w-12 h-12">
                            {{ scalarPoints[test.code] }}
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="flex flex-col gap-10 w-full items-center">
        <div class="">
            <table class="text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" class="px-6 py-3">
                            Escala
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Suma escalar
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="indexer in indexes" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {{ indexer.name }}
                        </th>
                        <td class="px-6 py-4 text-center">
                            {{ indexesSum[indexer.code] }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-if="showComposes" class="flex flex-col items-center gap-5">
            <table class="text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" class="px-3 py-3">
                            Escala
                        </th>
                        <th scope="col" class="px-3 py-3">
                            Puntuación compuesta
                        </th>
                        <th scope="col" class="px-3 py-3">
                            Percentil
                        </th>
                        <th scope="col" class="px-2 py-3 text-center">
                            Intervalo de confianza
                            <label class="inline-flex items-center cursor-pointer gap-2">
                                <span class="text-sm font-medium text-gray-900 dark:text-gray-300">90%</span>
                                <input @change="changeRange($event.target.checked)"
                                    type="checkbox" value="" class="sr-only peer">
                                <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-black after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"></div>
                                <span class="text-sm font-medium text-gray-900 dark:text-gray-300">95%</span>
                            </label>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in indexes" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <th scope="row" class="px-3 py-2 font-medium text-gray-900 dark:text-white whitespace-pre-wrap">
                            {{ item.name }}
                        </th>
                        <td class="px-3 py-2 text-center">
                            {{ composes[item.code][item.code] }}
                        </td>
                        <td class="px-3 py-2 text-center">
                            {{ composes[item.code].Percentil }}
                        </td>
                        <td class="px-3 py-2 text-center">
                            <p v-if="!range">{{ composes[item.code]['90%'] }}</p>
                            <p v-else>{{ composes[item.code]['95%'] }}</p>
                        </td>
                    </tr>
                </tbody>
            </table>
            <CompositeScores :data-graphics="graphics" :range="range"/>
        </div>
    </div>
</section>
</template>

<script setup>
import CompositeScores from '../components/CompositeScores.vue';
import { onBeforeMount, reactive } from 'vue';
import a1 from '../../data/a1_wais.json' with { type: 'json' };
import a2_a7 from '../../data/a2_a7_wais.json' with { type: 'json' };
import { tests, indexes } from '@/composables/wais/info';
import { ref } from 'vue';

const inputTests = ref({});
const table = ref({});
const scalarPoints = ref({});
const errors = ref([]);
const indexesSum = ref({});
const composes = ref({});
const showComposes = ref(false);
const range = ref(false);
const testsCounting = ref({});
const graphics = reactive({
    upperLimits: [],
    values: [],
    lowerLimits: [],
    xlabel: []
})
const regex = /^(\d{1,3})?$/;

onBeforeMount(() => {
    table.value = a1[1];
    indexesToZero();
})

function indexesToZero() {
    indexes.forEach((index) => {
        indexesSum.value[index.code] = 0;
        if (index.group) testsCounting.value[index.group] = 0;
    })
}

function generateIntegerArray(lowerLimit, upperLimit) {
    return Array.from({ length: upperLimit - lowerLimit + 1 }, (v, k) => k + lowerLimit);
}

function checkValues(number, test) {
    if (!regex.test(number)) errors.value.push(test);
    else if (errors.value.includes(test)) errors.value = errors.value.filter(item => item !== test);
}

function getRange(test, value) {
    if (value === '') return -1;

    for (let i = 0; i < Object.keys(table.value.data[test]).length; i++) {
        const range = Object.keys(table.value.data[test])[i];
        let arrayG = [];
        let valueModel = null;
        const inputValue = parseInt(value)

        if (range.includes('-')) {
            const lower = parseInt(range.split('-')[0]);
            const upper = parseInt(range.split('-')[1]);
            arrayG = generateIntegerArray(lower, upper);
            if (arrayG.includes(inputValue)) return range
        } else {
            valueModel = parseInt(range);
            if (valueModel === inputValue) return range
        }
    }
}

function checkRestrictions() {
    // Three mains empties, error!
    const errors = {
        threeMainsEmpty: 0,
    }
    tests.forEach(test => {
        const value = inputTests.value[test.code];

        if (value && !( value.trim() === '' || !regex.test(value))){            
            testsCounting.value[test.group] += 1;
            if (test.main) errors.threeMainsEmpty -= 1;
        } else if (! value) {
            // pass
        } else {
            testsCounting.value[test.group] -= 1;
            if (test.main) errors.threeMainsEmpty += 1;
        }
    })

    console.log(testsCounting.value);
    

    if (inputTests.value['B'] && inputTests.value['FI']) return true

    for (let i = 0; i < Object.keys(testsCounting.value).length; i++) {
        const element = Object.keys(testsCounting.value)[i];

        if (testsCounting.value[element] !== indexes.find(value => value.group === element).nums) {
            console.log('new error');

            return true
        }
    }

    if (errors.threeMainsEmpty > 2) return true;
    else return false;
}

function findScalarScoring() {
    indexesToZero();

    const errors = checkRestrictions();
    // const errors = null

    if (!errors) {
        Object.keys(inputTests.value).every(test => {
            const points = getRange(test, inputTests.value[test]);
            if (!points) console.log('error');
            else if (points === -1) console.log('empty');
            else {
                scalarPoints.value[test]= table.value.data[test][points];
        
                const item = tests.find(value => test === value.code);
                const index = indexes.find(value => item.group === value.group);
                
                indexesSum.value[index.code] += scalarPoints.value[test];
                indexesSum.value[indexes[indexes.length - 1].code] += scalarPoints.value[test];
            }
            return true
        });

        console.log(indexesSum.value);
        findComposes();
    }

}

function changeRange(value) {
    graphics.lowerLimits = [];
    graphics.upperLimits = [];
    range.value = value;
    indexes.forEach((key) => {
        const compose = composes.value[key.code];
        setLimits(compose);
    })
}

function setLimits(compose) {
    if (!range.value) {
        graphics.upperLimits.push(compose['90%'].split('-')[1]);
        graphics.lowerLimits.push(compose['90%'].split('-')[0]);
    } else {
        graphics.upperLimits.push(compose['95%'].split('-')[1]);
        graphics.lowerLimits.push(compose['95%'].split('-')[0]);
    }
}

function findComposes() {
    graphics.lowerLimits = [];
    graphics.values = [];
    graphics.upperLimits = [];

    indexes.forEach((i) => {
        const value = indexesSum.value[i.code].toString();
        
        const compose = a2_a7.find(value => value.index === i.code);
        composes.value[i.code] = compose.data[value];
        graphics.values.push(compose.data[value][i.code]);
        graphics.xlabel.push(i.code);
        setLimits(composes.value[i.code]);
    })

    showComposes.value = true;
}

</script>