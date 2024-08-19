<template>
    <h1>Hola mundo</h1>
<section class="md:flex md:flex-row gap-10 justify-center">
    <div class="w-full">
        <TableTests 
            :tests="tests" 
            :indexes="indexes" 
            :points="scalarPoints" 
            :inputs="inputTests"
            @show-points="findScalarScoring"
        />
    </div>
    <div class="flex flex-col gap-10 w-full items-center">
        <div class="">
            <IndexesSum :indexes="indexes" :indexes-sum="indexesSum"/>
        </div>
        <div v-if="showComposes" class="flex flex-col items-center gap-5">
            <TableIndexes :indexes="indexes" :composes="composes" @update-graphics="changeRange" />
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
import TableTests from '@/components/TableTests.vue';
import { findScalars } from '@/composables/getRange'
import TableIndexes from '@/components/TableIndexes.vue';
import IndexesSum from '@/components/IndexesSum.vue';

const inputTests = ref({});
const table = ref({});
const scalarPoints = ref({});
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

onBeforeMount(() => {
    table.value = a1[1];
    indexesToZero();
})

function indexesToZero() {
    indexes.forEach((index) => {
        if (index.group) testsCounting.value[index.group] = 0;
    })
}

function checkRestrictions() {
    // Three mains empties, error!
    const regex = /^(\d{1,3})?$/;
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

    if (inputTests.value['B'] && inputTests.value['FI']) return true

    for (let i = 0; i < Object.keys(testsCounting.value).length; i++) {
        const element = Object.keys(testsCounting.value)[i];

        if (testsCounting.value[element] !== indexes.find(value => value.group === element).nums) return true
    }

    if (errors.threeMainsEmpty > 2) return true;
    else return false;
}

function findScalarScoring() {
    indexesToZero();

    const errors = checkRestrictions();
    // const errors = null

    if (!errors) {
        const { points, sum, error } = findScalars(inputTests.value, table.value, tests, indexes);

        console.log(error);
        

        scalarPoints.value = points;
        indexesSum.value = sum;

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