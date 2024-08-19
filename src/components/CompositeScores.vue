<template>
    <div class="bg-white rounded-lg shadow dark:bg-gray-800 pt-4 px-4 w-[450px]">
        <div class="flex justify-between mb-5">
            <div>
                <h5 class="leading-none text-xl font-bold text-gray-900 dark:text-white pb-2">
                    {{ title }}
                </h5>
            </div>
            <div class="flex items-center px-2.5 py-0.5 text-base font-semibold text-green-500 dark:text-green-500 text-center">
                <p v-if="!range">90%</p>
                <p v-else>95%</p>
            </div>
        </div>
        <div :id="`data-labels-chart-${graphicsId}`"></div>
    </div>
</template>

<script setup>
import { onBeforeMount, onMounted, ref, watchEffect } from 'vue';
import ApexCharts from 'apexcharts'
import { initFlowbite } from 'flowbite';

const props = defineProps({
    dataGraphics: {
        required: true,
        type: Object
    },
    range: {
        required: true,
        type: Boolean
    },
    title: {
        default: 'Perfil de puntuaciones compuestas', type: String
    },
    graphicsId: {
        default: 'one', type: String
    }
})
const chart = ref(null);
const options = ref(null);
const width = ref([]);

onBeforeMount(() => {
    console.log(props.dataGraphics.values.length);
    
    if (props.dataGraphics.values.length === 1) width.value = [0, 0, 0];
    else width.value = [0, 0, 4];

    options.value = {
        // enable and customize data labels using the following example, learn more from here: https://apexcharts.com/docs/datalabels/
        dataLabels: {
            enabled: true,
        },
        grid: {
            show: true,
            strokeDashArray: 4,
            padding: {
                left: 16,
                right: 16,
                top: -26
            },
        },
        series: [
            {
                name: "Límite superior",
                data: props.dataGraphics.upperLimits,
                color: "#1A56DBB3",
            },
            {
                name: "Límite inferior",
                data: props.dataGraphics.lowerLimits,
                color: "#1A56DBB3",
            },
            {
                name: "Puntuación compuesta",
                data: props.dataGraphics.values,
                color: "#7E3BF2",
            },
        ],
        chart: {
            height: 400,
            width: 400,
            type: "line",
            fontFamily: "Inter, sans-serif",
            toolbar: {
                show: false,
            }
        },
        tooltip: {
            enabled: false,
        },
        legend: {
            show: false,
        },
        stroke: {
            width: width.value,
            curve: 'straight',

        },
        xaxis: {
            categories: props.dataGraphics.xlabel,
            labels: {
                show: true,
            },
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
        },
        yaxis: {
            show: true,
        },
    }
})

watchEffect(() => {
    if(chart.value) {
        chart.value.updateOptions({
            series: [
                {
                    data: props.dataGraphics.upperLimits,
                },
                {
                    data: props.dataGraphics.lowerLimits,
                },
                {
                    data: props.dataGraphics.values,
                }
            ],
            xaxis: {
                categories: props.dataGraphics.xlabel,
            }
        })
    }
})

onMounted(() => {
    initFlowbite();

    if (document.getElementById(`data-labels-chart-${props.graphicsId}`) && typeof ApexCharts !== 'undefined') {
        chart.value = new ApexCharts(document.getElementById(`data-labels-chart-${props.graphicsId}`), options.value);
        chart.value.render();
    }
})

</script>