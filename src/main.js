import './assets/main.css'
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { firebaseConfig } from './firebase';
import { getFirestore } from "firebase/firestore";

import { createApp } from 'vue'
import App from './App.vue'
import { router } from './routes'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
/* import specific icons */
import { faUser, faBars, faRectangleList, faRightFromBracket, 
        faCodeBranch, faEye, faEyeSlash, faSort, 
        faVenus, faMars, faCakeCandles, faTrash,
        faLocationPin,
        faCalculator} from '@fortawesome/free-solid-svg-icons'
/* add icons to the library */
library.add(faUser, faBars, faRectangleList, faRightFromBracket, 
        faCodeBranch, faEye, faEyeSlash, faSort, faVenus,
        faMars, faCakeCandles, faTrash, faLocationPin,
        faCalculator)

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

createApp(App).component('font-awesome-icon', FontAwesomeIcon).use(router).mount('#app')

export { db }