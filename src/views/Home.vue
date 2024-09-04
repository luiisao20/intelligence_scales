<template>
<div id="defaultModal" tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full">
    <ModalForm :email="email" @update-patients="getPatients"/>
</div>
    <section class="main-view">
        <div class="flex justify-between items-center">
            <form class="my-5 ml-20 w-1/2">
                <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div class="relative">
                    <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                    </div>
                    <input @input="filterPatients" v-model="search" type="search" id="default-search" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-secondary focus:border-secondary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Buscar por nombres o número de cédula" />
                </div>
            </form>
            <button id="defaultModalButton" data-modal-target="defaultModal" data-modal-toggle="defaultModal" class="p-2 bg-primary rounded-lg hover:bg-white" type="button">
                Crear nuevo paciente
            </button>
        </div>
        <Skeleton v-if="loading" />
        <div v-else>
            <Pagination v-bind="paginationData" 
                @go-step="goStep" 
                @next="paginationData.currentStep++" 
                @previous="paginationData.currentStep--" 
            />
            <Patients
                :packs="paginationData.packs"
                :current-step="paginationData.currentStep"
                @sort-data="sortPatients"
            />
        </div>
    </section>
</template>

<script setup>
import { onBeforeMount, onMounted, reactive, ref } from 'vue';
import Patients from '@/components/Patients.vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { people } from '../../data/dataTest';
import { addDoc, collection, doc, getDocs, getFirestore, query, setDoc, where } from 'firebase/firestore';
import Pagination from '@/components/Pagination.vue'
import Skeleton from '@/components/Skeleton.vue'
import ModalForm from '@/components/ModalForm.vue'
import { initFlowbite } from 'flowbite';
// import a1 from '../../data/a1_wppsi.json' with { type: 'json' };

const auth = getAuth();
const db = getFirestore();
const email = ref('');
const patients = ref([]);
const paginationData = reactive({
    packs: [],
    step: 10,
    listLength: 0,
    currentStep: 0
})
const loading = ref(false);
const search = ref('');

onMounted(async() => {
    initFlowbite();
})

async function sendTables() {
    try {
        const id = 'scales_wppsi';

        await setDoc(doc(db, 'tables', id), {
            key: 'a1',
            tables: a1
        })
        console.log('susccesful');
        
    } catch (error) {
        console.log(error.message);
        
    }

}

onBeforeMount(() => {
    onAuthStateChanged(auth, async(user) => {
        if(user) {
            // sendTables();
            email.value = user.email;
            await getPatients();
        }
    })
})

function goStep(step) {
    paginationData.currentStep = step;
}

function filterPatients() {
    const patientsFiltred = patients.value.filter(patient => 
        (patient.data().lastName + patient.data().firstName).toLowerCase().includes(search.value.toLowerCase())
    )
    packPatients(patientsFiltred);
}

function sortPatients(key) {
    patients.value.sort((a, b) => {
        const patientA = a.data()[key];
        const patientB = b.data()[key];

        if (key === 'lastName') {
            if (patientA < patientB) return -1;
            else if (patientB < patientA) return 1;
        }
        return patientB - patientA
    })
    packPatients(patients.value);
}

function packPatients(array) {
    paginationData.packs = [];
    paginationData.listLength = array.length;
    for (let i = 0; i < array.length; i += paginationData.step) {
        const pack = array.slice(i, i + paginationData.step);
        paginationData.packs.push(pack)
    }
}

async function getPatients() {
    loading.value = true;    
    const q = query(collection(db, 'patients'), where('owner', '==', email.value));
    const querySnapshot = await getDocs(q);
    patients.value = [ ...querySnapshot.docs ];
    
    sortPatients('lastName');
    
    packPatients(patients.value);
    loading.value = false;

}

function sendData() {
    people.forEach(async(person) => {
        try {
            const docRef = await addDoc(collection(db, 'patients'), person);

            console.log('Document written with ID', docRef.id);
            
        } catch (error) {
            console.log(error);
            
        }
    })
}

</script>