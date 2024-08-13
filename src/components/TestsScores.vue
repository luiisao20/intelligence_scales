<template>
    <div class="bg-white rounded-lg shadow dark:bg-gray-800 pt-4 px-4 w-[450px]">
        <div class="flex justify-between mb-5">
            <div>
                <h5 class="leading-none text-xl font-bold text-gray-900 dark:text-white pb-2">
                    Perfil de puntuaciones
                </h5>
            </div>
            <div class="flex items-center px-2.5 py-0.5 text-base font-semibold text-green-500 dark:text-green-500 text-center">
                <p>WNV</p>
            </div>
        </div>
        <div id="data-labels-charts"></div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import ApexCharts from 'apexcharts'
import { initFlowbite } from 'flowbite';

const props = defineProps({
    dataGraphics: {
        required: true,
        type: Object
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
    series: [{
        name: "Puntuación compuesta",
        data: props.dataGraphics.values,
        color: "#7E3BF2",
    }],
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
        width: 4,
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

onMounted(() => {
    initFlowbite();

    if (document.getElementById("data-labels-chart") && typeof ApexCharts !== 'undefined') {
        chart.value = new ApexCharts(document.getElementById("data-labels-charts"), options);
        chart.value.render();
    }
})

</script>