<template>
    <div class="bg-white rounded-lg shadow dark:bg-gray-800 pt-4 px-4 w-[450px]">
        <div class="flex justify-between mb-5">
            <div>
                <h5 class="leading-none text-xl font-bold text-gray-900 dark:text-white pb-2">Perfil de puntuaciones compuestas</h5>
            </div>
            <div class="flex items-center px-2.5 py-0.5 text-base font-semibold text-green-500 dark:text-green-500 text-center">
                <p v-if="!range">90%</p>
                <p v-else>95%</p>
            </div>
        </div>
        <div id="data-labels-chart"></div>
        <!-- <div class="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between mt-5">
            <div class="flex justify-between items-center pt-5">
                <button
                    id="dropdownDefaultButton"
                    data-dropdown-toggle="lastDaysdropdown"
                    data-dropdown-placement="bottom"
                    class="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 text-center inline-flex items-center dark:hover:text-white"
                    type="button">
                    Last 7 days
                    <svg class="w-2.5 m-2.5 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                    </svg>
                </button>
                <div id="lastDaysdropdown" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                    <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                        <li>
                        <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Yesterday</a>
                        </li>
                        <li>
                        <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Today</a>
                        </li>
                        <li>
                        <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Last 7 days</a>
                        </li>
                        <li>
                        <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Last 30 days</a>
                        </li>
                        <li>
                        <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Last 90 days</a>
                        </li>
                    </ul>
                </div>
                <a
                    href="#"
                    class="uppercase text-sm font-semibold inline-flex items-center rounded-lg text-blue-600 hover:text-blue-700 dark:hover:text-blue-500  hover:bg-gray-100 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 px-3 py-2">
                    Sales Report
                    <svg class="w-2.5 h-2.5 ms-1.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                    </svg>
                </a>
            </div>
        </div> -->
    </div>
</template>

<script setup>
import { onMounted, ref, watchEffect } from 'vue';
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
    }
})
const chart = ref(null);

const options = {
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
        width: [0, 0, 4],
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
        labels: {
            formatter: function (value) {
                return value;
            }
        }
    },
}

watchEffect(() => {
    if(chart.value) {
        chart.value.updateSeries([
            {
                data: props.dataGraphics.upperLimits,
            },
            {
                data: props.dataGraphics.lowerLimits,
            },
            {
                data: props.dataGraphics.values,
            },
        ])
    }
})

onMounted(() => {
    initFlowbite();

    if (document.getElementById("data-labels-chart") && typeof ApexCharts !== 'undefined') {
        chart.value = new ApexCharts(document.getElementById("data-labels-chart"), options);
        chart.value.render();
    }
})

</script>