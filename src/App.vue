<template>
  <SideBar v-if="route.name !== 'Login'" />
  <main>
    <RouterView />
  </main>
</template>

<script setup>
import SideBar from '@/components/SideBar.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
</script>