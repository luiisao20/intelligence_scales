<template>
    <table class="text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 bg-light-background rounded-md">
        <thead class="text-xs text-text uppercase dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th colspan="2" class="text-center text-base">{{ title }}</th>
            </tr>
            <tr>
                <th scope="col" class="px-6 py-3">
                    Escala
                </th>
                <th scope="col" class="px-6 py-3 text-center">
                    Suma escalar
                </th>
            </tr>
        </thead>
        <tbody v-for="indexer in indexes" class="odd:bg-secondary even:bg-secondary/70 text-text">
            <tr v-if="!restrictions.includes(indexer.code)" class="dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" class="px-6 py-4 font-medium whitespace-normal dark:text-white">
                    {{ indexer.name }}
                </th>
                <td class="px-6 py-4 text-center">
                    <p v-if="(indexesSum[indexer.code])">{{ indexesSum[indexer.code] }}</p>
                    <p v-else>--</p>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script setup>
const props = defineProps({
    indexes: {
        required: true, type: Array
    },
    indexesSum: {
        required: true, type: Object
    },
    title: {
        default: '', type: String
    },
    restrictions: {
        default: [], type: Array
    }
})
</script>