<template>
    {{ evaluationId }}\
    Hola mundo
</template>

<script setup>

const props = defineProps({
    evaluationId: {
        required: true,
        type: String
    }
})
</script>