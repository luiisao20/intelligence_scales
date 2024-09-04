<template>
<!-- Main modal -->
    <div class="relative p-4 w-full max-w-2xl h-full md:h-auto">
        <!-- Modal content -->
        <div class="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
            <!-- Modal header -->
            <div class="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    Crea un nuevo registro
                </h3>
                <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="defaultModal">
                    <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                    <span class="sr-only">Close modal</span>
                </button>
            </div>
            <!-- Modal body -->
            <form @submit.prevent="sendData" action="#">
                <div class="grid gap-4 mb-4 sm:grid-cols-2">
                    <div>
                        <label for="last-name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Apellidos</label>
                        <input @input="checkValues($event.target.value, 'lastName')" required v-model="newPatient.lastName" type="text" name="last-name" id="last-name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-secondary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Bravo">
                        <p v-if="showError['lastName']" id="outlined_error_help" class="mt-2 text-xs text-red-600 dark:text-red-400"><span class="font-medium">¡Oh!</span> Existe un error.</p>
                    </div>
                    <div>
                        <label for="first-name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombres</label>
                        <input @input="checkValues($event.target.value, 'firstName')" required v-model="newPatient.firstName" type="text" name="first-name" id="first-name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-secondary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Alex">
                        <p v-if="showError['firstName']" id="outlined_error_help" class="mt-2 text-xs text-red-600 dark:text-red-400"><span class="font-medium">¡Oh!</span> Existe un error.</p>
                    </div>
                    <div>
                        <label for="identity" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Número de cédula (máximo 10 dígitos) </label>
                        <input @input="checkValues($event.target.value, 'id')" required v-model="newPatient.id" type="text" name="identity" id="identity" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-secondary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="1234567890">
                        <p v-if="showError['id']" id="outlined_error_help" class="mt-2 text-xs text-red-600 dark:text-red-400"><span class="font-medium">¡Oh!</span> Existe un error.</p>
                    </div>
                    <div>
                        <label for="age" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Edad (años)</label>
                        <input @input="checkValues($event.target.value, 'age')" required v-model="newPatient.age" type="text" name="age" id="age" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-secondary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="6">
                        <p v-if="showError['age']" id="outlined_error_help" class="mt-2 text-xs text-red-600 dark:text-red-400"><span class="font-medium">¡Oh!</span> Existe un error.</p>
                    </div>
                    <div>
                        <label for="category" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Género</label>
                        <select id="category" required v-model="newPatient.gender" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                            <option selected disabled>Seleccionar</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Femenino">Femenino</option>
                        </select>
                    </div>
                </div>
                <button :disabled="isLoading"
                    type="submit" :class="{ 'cursor-progress': isLoading }"
                    class="inline-flex items-center bg-primary font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                    <svg class="mr-1 -ml-1 w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
                    Agregar paciente
                </button>
                <Transition>
                    <p v-if="showError.send !== ''" class="mt-2 text-xl text-red-600 dark:text-red-400"><span class="font-medium">¡Oh!</span> {{ showError.send }}</p>
                </Transition>
                <Transition>
                    <p v-if="showError.success" class="mt-2 text-xl text-secondary dark:text-red-400 text-center">¡El paciente se registró con éxito!</p>
                </Transition>

            </form>
        </div>
    </div>
</template>

<script setup>
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { reactive, ref, Transition } from 'vue';

const props = defineProps(['email']);
const newPatient = reactive({
    firstName: '',
    lastName: '',
    id: '',
    age: '',
    gender: 'Seleccionar',
    owner: ''
})
const regex = {
    id: /^\d{1,10}$/,
    age: /^\d{1,3}$/,
    lastName: /^[a-zA-ZÀ-ÿ\s]{5,}$/,
    firstName: /^[a-zA-ZÀ-ÿ\s]{5,}$/
}
const showError = reactive({
    id: false,
    age: false,
    lastName: false,
    firstName: false,
    send: '',
    success: false
})
const isLoading = ref(false);
const keys = ['id', 'lastName', 'firstName', 'age'];
const db = getFirestore();
const emits = defineEmits(['updatePatients']);

function checkValues(value, key) {
    if (!regex[key].test(value)) showError[key] = true;
    else  showError[key] = false;
}

async function sendData() {
    isLoading.value = true;
    showError.send = '';
    keys.every((key) => {
        if (!regex[key].test(newPatient[key]) || newPatient[key] === '') {
            showError.send = 'Los campos pueden estar incorrectos o vacíos';
            return false;
        }
        return true
    })

    if (newPatient.gender === 'Seleccionar') {
        showError.send = 'Los campos pueden estar incorrectos o vacíos';
        return
    }
    newPatient.owner = props.email;

    try {
        const docRef = await addDoc(collection(db, 'patients'), newPatient);
        emits('updatePatients');
        showError.success = true;
    } catch (error) {
        showError.send = `Ocurrió un problema con la base de datos. ${error.message}`;
    }
    isLoading.value = false;
}

</script>

<style scoped>
.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>