import { doc, getDoc } from "firebase/firestore";
import { db } from "@/main";

export async function getScales(age, scale) {
    const docRef = doc(db, 'tables', `scales_${scale}`);
    const docSnap = await getDoc(docRef);
    const chrAge = parseFloat(age.years) + parseFloat(age.months) / 12;

    if (docSnap.exists()) {
        for (let i = 0; i < docSnap.data().tables.length; i++) {
            const table = docSnap.data().tables[i];

            const lowerAge = parseFloat(table.range.split(' ')[0].split('-')[0]) + parseFloat(table.range.split(' ')[0].split('-')[1]) / 12;
            const upperAge = parseFloat(table.range.split(' ')[1].split('-')[0]) + parseFloat(table.range.split(' ')[1].split('-')[1]) / 12;

            if (chrAge <= upperAge && chrAge >= lowerAge) {
                let indexes = {
                    primary: [],
                    secondary: []
                }
                if (['wnv', 'wais_e', 'wais_m', 'wais_c'].includes(scale)) {
                    const indexRef = doc(db, 'tables', `indexes_${scale}`);
                    const indexSnap = await getDoc(indexRef);
                    indexes.primary = [ ...indexSnap.data().tables ];
                } else {
                    const pIndexRef = doc(db, 'tables', `p_indexes_${scale}`);
                    const pIndexSnap = await getDoc(pIndexRef);
                    indexes.primary = [ ...pIndexSnap.data().tables ];

                    const sIndexRef = doc(db, 'tables', `s_indexes_${scale}`);
                    const sIndexSnap = await getDoc(sIndexRef);
                    indexes.secondary = [ ...sIndexSnap.data().tables ];
                }
                return { table, indexes };
            }
        }
    }
    const upperAge = docSnap.data().tables.at(-1).range.split(' ')[1].split('-')[0];
    const lowerAge = docSnap.data().tables[0].range.split(' ')[0].split('-')[0];
    throw `El rango de edades para la prueba ${scale.toUpperCase()} es entre los ${lowerAge} y ${upperAge} años.`;
}