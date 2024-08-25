<template>
    <nav class="flex items-center justify-between pt-4 mb-10 mx-20" aria-label="Table navigation">
        <span class="text-sm font-normal text-primary dark:text-gray-400">Mostrando
            <span class="font-semibold dark:text-white">
                {{ currentStep * step + 1 }} - {{ currentStep * step + step }}
            </span> de <span class="font-semibold dark:text-white">
                {{ listLength }}
            </span>
        </span>
        <ul class="inline-flex -space-x-px text-sm h-8">
            <li>
                <button :disabled="currentStep === 0" @click="$emit('previous')" class="flex items-center justify-center px-3 h-8 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                    Anterior
                </button>
            </li>
            <li v-for="(items, step) in packs">
                <button v-bind:class="{ active: currentStep === step}" @click="$emit('goStep', step)" class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                    {{ step + 1 }}
                </button>
            </li>
            <li>
                <button :disabled="currentStep === packs.length - 1" @click="$emit('next')" class="flex items-center justify-center px-3 h-8 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                    Siguiente
                </button>
            </li>
        </ul>
    </nav>
</template>

<script setup>
const props = defineProps({
    listLength: {
        rquired: true,
        type: Number
    },
    currentStep: {
        rquired: true,
        type: Number
    },
    packs: {
        required: true,
        type: Array
    },
    step: {
        required: true,
        type: Number
    }
})
const emits = defineEmits(['next', 'previous', 'goStep']);
</script>

<style scoped>
.active{
    background-color: var(--primary-color);
    color: black;
}
</style>