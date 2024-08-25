<template>
    <div class="flex">
        <input @input="$emit('update:password', $event.target.value)" :value="password"
            :type="type" :name="type" :id="type" placeholder="••••••••" 
            class="bg-gray-50 border-l border-t border-b rounded-l-lg border-gray-300 text-gray-900 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        <button type="button" @click="if(type === 'password') type = 'text'; else type = 'password'"
            class="px-2 rounded-r-lg bg-gray-50 border-r border-t border-b">
            <font-awesome-icon v-if="type === 'password'" :icon="['fas', 'eye']"/>
            <font-awesome-icon v-else :icon="['fas', 'eye-slash']" />
        </button>

    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps( {
    name: {
        default: 'password',
        type: String
    },
    password: {
        required: true,
        type: String
    }
})
const emit = defineEmits(['update:password']);
const type = ref('password');
</script>