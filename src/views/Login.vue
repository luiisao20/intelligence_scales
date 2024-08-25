<template>
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div class="w-full bg-light-background rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div class="flex gap-4 p-6 text-xl justify-center text-text items-center font-semibold">
                <font-awesome-icon :icon="['fas', 'code-branch']" class="text-2xl" />
                <h1>Escalas de inteligencia</h1>
            </div>
            <div class="px-6 space-y-4 md:space-y-6 sm:pb-8">
                <h1 class="text-xl font-bold leading-tight tracking-tight text-text md:text-2xl dark:text-white">
                    Entra a tu cuenta para iniciar sesión
                </h1>
                <form @submit.prevent="signIn" class="space-y-2 md:space-y-6" action="#">
                    <div>
                        <label for="email" class="block mb-2 text-sm font-medium text-text dark:text-white">Correo electrónico</label>
                        <input @input="checkEmail" type="email" v-model="user.email" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="luis@hotmail.com">
                        <p v-if="showError" id="error_help" class="mt-2 text-xs text-red-600 dark:text-red-400"><span class="font-medium">¡Oh!</span> Existe un error.</p>
                    </div>
                    <div>
                        <label for="password" class="block mb-2 text-sm font-medium text-text dark:text-white">Contraseña</label>
                        <PasswordInput v-model:password="user.password" />
                    </div>
                    <div class="flex items-center justify-between text-text">
                        <a href="#" class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">¿Olvidaste tu contraseña?</a>
                    </div>
                    <Transition>
                        <p v-if="errorLogin !== ''" class="mt-2 text-xl text-red-600 dark:text-red-400"><span class="font-medium">¡Oh!</span> El correo o la contraseña están incorrectos</p>
                    </Transition>
                    <button type="submit" :disabled="showError" :class="{ 'cursor-progress': loading }"
                        class="w-full bg-primary font-medium rounded-lg text-sm px-5 py-2.5 text-center transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-90 hover:text-text hover:bg-secondary duration-300">Sign in</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref, Transition } from 'vue';
import PasswordInput from '@/components/PasswordInput.vue'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { router } from '@/routes';

const user = reactive({
    email: '',
    password: ''
})
const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const loading = ref(false);
const showError = ref(false);
const auth = getAuth();
const errorLogin = ref('');

function checkEmail() {
    if (!regex.test(user.email)) showError.value = true;
    else showError.value = false;
}

function signIn() {
    loading.value = true;
    errorLogin.value = '';
    signInWithEmailAndPassword(auth, user.email, user.password).then((userCredential) => {
        const user = userCredential.user;
        router.push('/home');
    }).catch((error) => {
        errorLogin.value = error.message;
    }).finally(() => {
        loading.value = false;
    })
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