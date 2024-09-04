<template>
    <input @input="inputDate($event.target.value)" placeholder="mm/dd/aaaa"
        :value="date" type="text" maxlength="10" :name="`floating-${id}`" :id="`floating-${id}`"
        class="block py-2.5 px-2 w-full text-sm text-gray-500 bg-gray-50 border border-gray-300 rounded-xl dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:ring-secondary focus:border-secondary peer"
        />
</template>

<script setup>
import { ref } from 'vue';

const formatDate = ref('mm/dd/aaaa');
const formatDateNew = ref('mm/dd/aaaa');
const previous = ref(0);
const emit = defineEmits(['update:date']);
const props = defineProps({
    id: {
        required: true, type: String
    },
    date: {
        required: true, type: String
    }
})

function inputDate(value){
    formatDateNew.value = value + formatDate.value.substring(value.length);
    if ((value.length === 2 || value.length === 5) && value.length > previous.value){
        value += '/';
    }
    previous.value = value.length;
    emit('update:date', value)
}
</script>