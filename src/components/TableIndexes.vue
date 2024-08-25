<template>
    <table class="relative text-sm text-left rtl:text-right text-text dark:text-gray-400 bg-light-background">
        <thead class="text-xs sticky top-0 backdrop-blur-sm uppercase dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" class="px-3 py-3">
                    Escala
                </th>
                <th v-if="showWNV" scope="col" class="px-3 py-3">
                    Suma escalar
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
                        <span class="text-sm font-medium text-text dark:text-gray-300">90%</span>
                        <input @change="changeRange($event.target.checked)"
                            type="checkbox" value="" class="sr-only peer">
                        <div class="relative w-11 h-6 bg-primary/40 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-primary after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"></div>
                        <span class="text-sm font-medium dark:text-gray-300">95%</span>
                    </label>
                </th>
            </tr>
        </thead>
        <tbody v-for="(item, index) in indexes" class="odd:bg-secondary even:bg-secondary/70">
            <tr v-if="!restrictions.includes(item.code) && composes[item.code]" class="dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" class="px-3 py-2 font-medium dark:text-white whitespace-pre-wrap">
                    {{ item.name }}
                </th>
                <td v-if="showWNV" class="px-3 py-2 text-center">
                    {{ composes.Sum }}
                </td>
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
            <tr v-else-if="composes[item.code]" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" class="px-3 py-2 font-medium text-gray-900 dark:text-white whitespace-pre-wrap">
                    {{ item.name }}
                </th>
                <td v-if="showWNV" class="px-3 py-2 text-center">
                    {{ composes.Sum }}
                </td>
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
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    indexes: {
        required: true, type: Array
    },
    composes: {
        required: true, type: Object
    },
    showWNV: {
        default: false, type: Boolean
    },
    state: {
        default: false, type: Boolean
    },
    restrictions: {
        default: [], type: Array
    }
})
const range = ref(false);
const emit = defineEmits(['updateGraphics']);

function changeRange(value) {
    range.value = value;
    emit('updateGraphics', value, props.state);
}
</script>