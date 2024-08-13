<template>
    <TableTests
        :tests="tests"
        :indexes="index"
        :multiple-groups="false"
        :inputs="inputTests"
        :points="scalarPoints"
        :age-restriction="true"
        :restrictions="restrictions['5-0 7-11']"
        @show-points="findScalarScoring"
    />
    <div v-if="showComposes" class="flex flex-col items-center">
        <div class="mx-10">
            <TableIndexes 
                :indexes="index"
                :composes="composePoints" 
                @update-graphics="changeRange" 
                :show-w-n-v="true"
            />
        </div>
        <div class="flex justify-center gap-20">
            <CompositeScores 
                :data-graphics="graphics" :range="range"
                title="Puntuación Escala Total"
            />
            <TestsScores 
                :data-graphics="graphicsTest" 
            />
        </div>
    </div>
</template>

<script setup>
import a1 from '../../data/a1_wnv.json' with { type: 'json' };
import a2 from '../../data/a2_wnv.json' with { type: 'json' };
import { tests } from '@/composables/wnv/info';
import TableTests from '@/components/TableTests.vue';
import { reactive, ref } from 'vue';
import { findScalars } from '@/composables/getRange';
import TableIndexes from '@/components/TableIndexes.vue';
import CompositeScores from '@/components/CompositeScores.vue';
import TestsScores from '@/components/TestsScores.vue';

const index = [
    {
        code: 'CIT',
        name: 'Coeficiente intelectual total',
        group: null
    }
]
const inputTests = ref({});
const scalarPoints = ref({});
const restrictions = {
    '5-0 7-11': ['ROM', 'REC'],
    '8-0 21-11': ['MES', 'HIS']
}
const composePoints = ref({})
const showComposes = ref(false);
const range = ref(false);
const graphics = reactive({
    upperLimits: [],
    values: [],
    lowerLimits: [],
    xlabel: [],
})
const graphicsTest = reactive({
    values: [],
    xlabel: [],
})

function changeRange(value) {
    graphics.lowerLimits = [];
    graphics.upperLimits = [];
    range.value = value;
    
    const compose = composePoints.value['CIT'];
    setLimits(compose);
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

function checkRestrictions() {

    if (Object.keys(inputTests.value) < 4) return true;

    for (let i = 0; i < Object.keys(inputTests.value).length; i++) {
        const element = Object.keys(inputTests.value)[i];

        if (inputTests.value[element].trim() === '') return true
    }
    return false
}

function findScalarScoring() {
    console.log(inputTests.value);

    const error = checkRestrictions();
    
    if (!error) {
        const { points, sum, errors } = findScalars(inputTests.value, a1[0], tests, index);
        scalarPoints.value = points;   
    
        composePoints.value[index[0].code] = a2[0].data[sum.CIT.toString()];
        composePoints.value['Sum'] = sum[index[0].code];
    
        graphics.values.push(composePoints.value['CIT']['CIT']);
        graphics.xlabel.push(index[0].code);
        setLimits(composePoints.value['CIT']);
    
        tests.forEach((test) => {
            if (restrictions['5-0 7-11'].includes(test.code) || ! test.restriction) {
                graphicsTest.values.push(scalarPoints.value[test.code]);
                graphicsTest.xlabel.push(test.code);
            }
        })
        showComposes.value = true;
    }
}

</script>